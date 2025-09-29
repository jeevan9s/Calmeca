"use client";

import { motion } from "framer-motion";

interface MiniCourseCardProps {
  name: string;
  code: string;
}

export default function MiniCourseCard({ name, code }: MiniCourseCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className="bg-zinc-800/60 rounded-xl p-3 cursor-pointer flex flex-col items-start w-36"
    >
      <p className="text-xs text-neutral-400 truncate">{name}</p>
      <p className="text-lg font-bold text-white truncate mt-1">{code}</p>
    </motion.div>
  );
}
