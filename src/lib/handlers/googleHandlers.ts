import { ipcMain, BrowserWindow } from "electron";
import path from "path";
import { google } from "googleapis";
import { clearSavedTokens, authenticateWithGoogle, getTokenPath } from "@/services/integrations-utils/google/googleAuth";
import fs from "fs";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let win: BrowserWindow | null = null;

export function registerGoogleHandlers(mainWindow: BrowserWindow) {
  win = mainWindow;

  ipcMain.handle("start-google-login", async () => {
    return new Promise(async (resolve, reject) => {
      try {
        const { authUrl, verifier } = await authenticateWithGoogle();

        let authWindow: BrowserWindow | null = new BrowserWindow({
          width: 500,
          height: 600,
          parent: win ?? undefined,
          modal: true,
          show: false,
          autoHideMenuBar: true,
          icon: path.join(__dirname, "..", "assets", "taskbar.png"),
          webPreferences: {
            preload: path.join(__dirname, "..", "src", "preload.js"),
            contextIsolation: true,
            nodeIntegration: false,
          },
        });

        authWindow.loadURL(authUrl);
        authWindow.once("ready-to-show", () => {
          if (authWindow) authWindow.show();
        });

        authWindow.on("closed", () => {
          authWindow = null;
          reject(new Error("login window closed"));
        });

        const clientId = process.env.G_CLIENT_ID;
        const clientSecret = process.env.G_CLIENT_SECRET;
        const redirectUri = process.env.G_REDIRECT_URI;

        if (!clientId || !clientSecret || !redirectUri) {
          reject(new Error("missing OAuth configuration"));
          authWindow?.close();
          return;
        }

        const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);

        authWindow.webContents.on("will-redirect", async (event, url) => {
          if (!url.startsWith(redirectUri)) return;

          event.preventDefault();
          const parsedUrl = new URL(url);
          const code = parsedUrl.searchParams.get("code");
          const error = parsedUrl.searchParams.get("error");

          if (error) {
            reject(new Error(`OAuth error: ${error}`));
            authWindow?.close();
            return;
          }

          if (!code) {
            reject(new Error("no code found in redirect URL"));
            authWindow?.close();
            return;
          }

          try {
            const { tokens } = await oauth2Client.getToken({
              code,
              codeVerifier: verifier,
              redirect_uri: redirectUri,
            });
            oauth2Client.setCredentials(tokens);

            const tokenPath = getTokenPath();
            fs.writeFileSync(tokenPath, JSON.stringify(tokens));

            const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
            const { data } = await oauth2.userinfo.get();

            if (win) {
              win.webContents.send("google-login-success", {
                user: {
                  name: data.name,
                  email: data.email,
                  picture: data.picture,
                },
              });
            }

            if (authWindow) {
              authWindow.loadFile(path.join(__dirname, "..", "assets", "oauth-redirect.html"));
            }

            setTimeout(() => {
              authWindow?.close();
              authWindow = null;
              resolve({
                success: true,
                tokens,
                user: {
                  name: data.name,
                  email: data.email,
                  picture: data.picture,
                },
              });
            });
          } catch (tokenError) {
            console.error("Token exchange failed:", tokenError);
            reject(tokenError);
            authWindow?.close();
            authWindow = null;
          }
        });
      } catch (error) {
        console.error("Failed to start Google login:", error);
        reject(error);
      }
    });
  });

  ipcMain.handle("google-logout", async () => {
    try {
      clearSavedTokens();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || "Unknown error" };
    }
  });

  ipcMain.handle("get-logged-in-user", async () => {
    try {
      const tokenPath = getTokenPath();
      if (!fs.existsSync(tokenPath)) return null;

      const tokens = JSON.parse(fs.readFileSync(tokenPath, "utf-8"));
      const clientId = process.env.G_CLIENT_ID;
      const clientSecret = process.env.G_CLIENT_SECRET;
      const redirectUri = process.env.G_REDIRECT_URI;

      if (!clientId || !clientSecret || !redirectUri) return null;

      const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
      oauth2Client.setCredentials(tokens);

      const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
      const { data } = await oauth2.userinfo.get();

      return {
        name: data.name,
        email: data.email,
        picture: data.picture,
      };
    } catch (err) {
      console.error("Failed to get logged-in user:", err);
      return null;
    }
  });

  ipcMain.handle("list-calendars", async () => {
    const tokenPath = getTokenPath();
    if (!fs.existsSync(tokenPath)) throw new Error("Not logged in");

    const tokens = JSON.parse(fs.readFileSync(tokenPath, "utf-8"));
    const clientId = process.env.G_CLIENT_ID;
    const clientSecret = process.env.G_CLIENT_SECRET;
    const redirectUri = process.env.G_REDIRECT_URI;

    const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
    oauth2Client.setCredentials(tokens);

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });
    const res = await calendar.calendarList.list();

    const calendars = res.data.items.map((c) => ({
      summary: c.summary,
      id: c.id,
    }));

    console.table(calendars);
    return calendars;
  });

  ipcMain.handle("fetch-google-calendar-events", async () => {
    const tokenPath = getTokenPath();
    if (!fs.existsSync(tokenPath)) throw new Error("Not logged in");

    const tokens = JSON.parse(fs.readFileSync(tokenPath, "utf-8"));
    const clientId = process.env.G_CLIENT_ID;
    const clientSecret = process.env.G_CLIENT_SECRET;
    const redirectUri = process.env.G_REDIRECT_URI;

    const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
    oauth2Client.setCredentials(tokens);

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    const secondaryCalendarId = "trq441hkqhh1g0kcdbe7mdpj77sbmi1o@import.calendar.google.com";

    const fetchEvents = async (calendarId) => {
      const res = await calendar.events.list({
        calendarId,
        timeMin: new Date().toISOString(),
        maxResults: 20,
        singleEvents: true,
        orderBy: "startTime",
      });

      return (res.data.items || []).filter(
        (item) => item.start?.dateTime && item.end?.dateTime
      ).map((item) => ({
        id: item.id,
        summary: item.summary || "(No Title)",
        start: item.start.dateTime,
        end: item.end.dateTime,
      }));
    };

    const [primaryEvents, secondaryEvents] = await Promise.all([
      fetchEvents("primary"),
      fetchEvents(secondaryCalendarId),
    ]);

    const allEvents = [...primaryEvents, ...secondaryEvents].sort(
      (a, b) => new Date(a.start) - new Date(b.start)
    );

    return allEvents;
  });

  ipcMain.handle("add-google-calendar-event", async (_event, { summary, start }) => {
    const tokenPath = getTokenPath();
    if (!fs.existsSync(tokenPath)) throw new Error("Not logged in");

    const tokens = JSON.parse(fs.readFileSync(tokenPath, "utf-8"));
    const clientId = process.env.G_CLIENT_ID;
    const clientSecret = process.env.G_CLIENT_SECRET;
    const redirectUri = process.env.G_REDIRECT_URI;

    const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
    oauth2Client.setCredentials(tokens);

    const startDate = new Date(start);
    if (isNaN(startDate.getTime())) throw new Error("Invalid start date");
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

    const event = {
      summary,
      start: { dateTime: startDate.toISOString() },
      end: { dateTime: endDate.toISOString() },
    };

    await google.calendar({ version: "v3", auth: oauth2Client }).events.insert({
      calendarId: "primary",
      requestBody: event,
    });

    return { success: true };
  });
}
