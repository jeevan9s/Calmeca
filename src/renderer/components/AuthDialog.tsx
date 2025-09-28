"use client";
import { useState, useEffect } from "react";
import { motion, easeInOut } from "framer-motion";
import { ChevronRight } from "react-feather";

type AuthDialogProps = {
  isAuthDialogOpen: boolean;
  setIsAuthDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function AuthDialog({ isAuthDialogOpen, setIsAuthDialogOpen }: AuthDialogProps) {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; picture: string } | null>(null);

  // Check if already logged in on mount
  useEffect(() => {
    const fetchLoggedInUser = async () => {
      try {
        const currentUser = await (window as any).electronAPI.getLoggedInUser();
        if (currentUser) setUser(currentUser);
      } catch (err) {
        console.error("Failed to fetch logged-in user:", err);
      }
    };
    fetchLoggedInUser();
  }, []);

  useEffect(() => {
    function onResize() {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await (window as any).electronAPI.startGoogleLogin();
      setUser(res.user);
      setLoading(false);
      setIsAuthDialogOpen(false);
    } catch (err) {
      console.error("Login failed:", err);
      setLoading(false);
    }
  };

  // Responsive sizing
  let width = "12rem";
  let height = "8rem";
  if (windowWidth >= 1024) width = "21.5rem";
  if (windowWidth >= 1440) width = "25rem";
  if (windowHeight <= 600) height = "8rem";

  return (
    <motion.div
      id="auth-dialog"
      initial={{ opacity: 0, scale: 0.95, y: -12 }}
      animate={{ opacity: 1, scale: 1, y: 0, width, height }}
      exit={{ opacity: 0, scale: 0.95, y: -12 }}
      transition={{ duration: 0.3, ease: easeInOut }}
      className="fixed top-12 right-4 z-50 rounded-2xl bg-[#18181b] shadow-lg flex flex-col items-center justify-center p-4"
      style={{ width, height }}
    >
      <div className="flex justify-end w-full">
        <button
          className="w-5 h-5 mr-2 mt-2 rounded-lg hover:bg-white/10 flex items-center justify-center"
          onClick={() => setIsAuthDialogOpen(false)}
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {user ? (
        <div className="flex flex-col items-center gap-2">
          <img src={user.picture} alt="profile" className="w-12 h-12 rounded-full" />
          <p className="text-white font-medium">{user.name}</p>
          <p className="text-neutral-400 text-sm">{user.email}</p>
        </div>
      ) : (
        <button
          onClick={handleLogin}
          className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold transition-colors"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign in with Google"}
        </button>
      )}
    </motion.div>
  );
}
