import { createRequire } from "module";
const require = createRequire(import.meta.url);
const PdfParse = require("pdf-parse");

import path from "path";
import fs from "fs";
import { Course } from "../db";

const courseCodeRegex = /\b([A-Z]{2,4}\s?\d{3,4})\b/i;
const emailRegex = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;

const toTitleCase = (str: string) => {
  return str
    .toLowerCase()
    .replace(/\b\w+\b/g, (word) =>
      /^(i|ii|iii|iv|v|vi|vii|viii|ix|x)$/i.test(word)
        ? word.toUpperCase()
        : word.charAt(0).toUpperCase() + word.slice(1)
    );
};

export const readPDF = async (filePath: string): Promise<string> => {
  const absolutePath = path.isAbsolute(filePath)
    ? filePath
    : path.join(__dirname, "..", filePath);
  if (!fs.existsSync(absolutePath)) throw new Error(`File does not exist: ${absolutePath}`);
  const buffer = await fs.promises.readFile(absolutePath);
  const data = await PdfParse(buffer);
  return data.text;
};

export const extractCourseFromText = (text: string): Course => {
  const lines = text.split("\n").map(l => l.trim()).filter(Boolean);

  const courseCodeMatch = text.match(courseCodeRegex);
  const code = courseCodeMatch ? courseCodeMatch[0].toUpperCase() : "";

  const nameLine = lines.find(line => line.toLowerCase().includes(code.toLowerCase()));
  let name = nameLine
    ? nameLine.replace(new RegExp(code, "i"), "").replace(/–|-/, "").trim()
    : "";
  name = toTitleCase(name);

  const emails = text.match(emailRegex) || [];
  const courseEmail = emails.find(e => /course|apsc/i.test(e));
  const profEmail = emails.find(e => e !== courseEmail);

  const profSection = lines.filter(l =>
    /instructor|professor/i.test(l) ||
    /^[A-Z][a-z]+ [A-Z][a-z]+/.test(l)
  );
  const professor = profSection.join(", ");

  const now = new Date();

  return {
    id: code || now.getTime().toString(),
    title: name,
    code,
    profEmail,
    createdOn: now,
    archived: false,
    updatedOn: now
  };
};
