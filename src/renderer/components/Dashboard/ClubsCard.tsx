"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/card";
import { motion } from "framer-motion";
import { ScrollArea } from "@/components/scroll-area";

export default function ClubsCard() {
  return (
    <motion.div
      whileHover={{ scale: 1.01, y: -2 }}
      transition={{ duration: 0.2 }}
      className="rounded-lg flex-1"
    >
      <Card className="h-44 sm:h-48 bg-zinc-400/10 w-full rounded-lg">
        <CardHeader>
          <CardTitle className="font-nun">design teams & clubs</CardTitle>
          <CardDescription className="text-white/50 font-dm">upcoming meetings</CardDescription>
        </CardHeader>

        <CardContent className="flex-1 overflow-hidden">
          <ScrollArea className="h-full pr-2">
            <div className="flex flex-col gap-2">
      
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </motion.div>
  );
}
