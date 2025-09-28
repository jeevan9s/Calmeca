"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/card";
import { motion } from "framer-motion";

export default function NotificationsCard() {
  return (
    <motion.div variants={{}} whileHover={{ scale: 1.02, y: -2 }} transition={{ duration: 0.2 }} className="rounded-lg flex-1">
      <Card className="h-44 sm:h-48 bg-zinc-400/10 w-full rounded-lg">
        <CardHeader>
          <CardTitle>notifications</CardTitle>
          <CardDescription>Recent updates</CardDescription>
        </CardHeader>
        <CardContent></CardContent>
      </Card>
    </motion.div>
  );
}
