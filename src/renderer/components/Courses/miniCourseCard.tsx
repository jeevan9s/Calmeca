"use client";

import { motion } from "framer-motion";

interface MiniCourseCardProps {
  name: string;
  code: string;
  color: string;
}

export default function MiniCourseCard({ name, code, color }: MiniCourseCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className="bg-zinc-800/60 rounded-xl p-3 cursor-pointer flex flex-col items-start w-36"
    >
      <div
        className="w-4 h-4 rounded-full mb-10"
        style={{ backgroundColor: color }}
      />
      <p className="text-xs text-neutral-400 truncate font-dm uppercase">{name}</p>
      <p className="text-lg font-bold text-white truncate mt-1 font-nun">{code}</p>
    </motion.div>
  );
}
