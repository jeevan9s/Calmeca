"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/card";
import { motion } from "framer-motion";

export default function QuickStatsCard() {
  return (
    <motion.div whileHover={{ scale: 1.02, y: -2 }} transition={{ duration: 0.2 }} className="rounded-lg flex-1">
      <Card className="h-44 sm:h-48 bg-zinc-400/10 w-full rounded-lg">
        <CardHeader>
          <CardTitle>quick stats</CardTitle>
          <CardDescription>Overview of your progress</CardDescription>
        </CardHeader>
        <CardContent></CardContent>
      </Card>
    </motion.div>
  );
}
