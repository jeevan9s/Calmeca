"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/card";
import { motion } from "framer-motion";


export default function DeadlinesCard() {
  return (
    <motion.div whileHover={{ scale: 1.01, y: -1 }} transition={{ duration: 0.2 }} className="rounded-lg w-full">
      <Card className="h-96 sm:h-[22.5rem] bg-[#0f0f10ff] w-full rounded-lg">
        <CardHeader>
          <CardTitle>deadlines</CardTitle>
          <CardDescription>upcoming tasks</CardDescription>
        </CardHeader>
        <CardContent></CardContent>
      </Card>
    </motion.div>
  );
}
