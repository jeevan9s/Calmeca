"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/card";
import { motion } from "framer-motion";

interface DeadlinesCardProps {
  size: "small" | "large";
}

export default function DeadlinesCard({ size }: DeadlinesCardProps) {
  const height = size === "small" ? "h-32 sm:h-28" : "h-96 sm:h-[22.5rem]";
  return (
    <motion.div whileHover={{ scale: 1.01, y: -1 }} transition={{ duration: 0.2 }} className="rounded-lg w-full">
      <Card className={`${height} bg-[#0f0f10ff] w-full rounded-lg`}>
        <CardHeader>
          <CardTitle>deadlines</CardTitle>
          <CardDescription>Upcoming assignments</CardDescription>
        </CardHeader>
        <CardContent></CardContent>
      </Card>
    </motion.div>
  );
}
