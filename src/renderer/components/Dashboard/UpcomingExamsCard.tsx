"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/card";
import { motion } from "framer-motion";
import { ScrollArea } from "@/components/scroll-area";

export default function UpcomingExamsCard() {


  return (
    <motion.div whileHover={{ scale: 1.01, y: -2 }} transition={{ duration: 0.2 }} className="rounded-lg flex-1">
      <Card className="h-44 sm:h-48 bg-zinc-400/10 w-full rounded-lg">
        <CardHeader>
          <CardTitle className="font-nun">upcoming exams</CardTitle>
          <CardDescription className="font-dm text-white/50">next in your schedule</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 overflow-auto">
          <ScrollArea className="h-full pr-2">
            
          </ScrollArea>
        </CardContent>
      </Card>
    </motion.div>
  );
}
