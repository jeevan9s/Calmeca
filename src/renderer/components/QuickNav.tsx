"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";
import { motion } from "framer-motion";

export default function DailySummaryCard() {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className="flex-1"
    >
      <Card className="bg-zinc-800/80 border-zinc-700/50 rounded-xl shadow-md w-full min-h-[100px] p-4">
        <CardHeader className="pb-1">
          <CardTitle className="text-lg font-semibold text-white">Today's Summary</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-between gap-4 pt-1">
          <div className="flex flex-col items-center">
            <p className="text-2xl font-bold text-white">3</p>
            <p className="text-xs text-zinc-400 uppercase">Classes</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-2xl font-bold text-white">2</p>
            <p className="text-xs text-zinc-400 uppercase">Deadlines</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-2xl font-bold text-white">1</p>
            <p className="text-xs text-zinc-400 uppercase">Events</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}