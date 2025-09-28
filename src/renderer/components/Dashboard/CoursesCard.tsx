"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/card";
import { Button } from "@/components/button";
import { motion } from "framer-motion";
import { ExternalLink } from "react-feather";

export default function CoursesCard() {
  return (
    <motion.div whileHover={{ scale: 1.01, y: -2 }} transition={{ duration: 0.2 }}>
      <Card className="bg-zinc-400/10 h-80 sm:h-84 flex flex-col rounded-lg">
        <CardHeader>
          <CardTitle>courses</CardTitle>
          <CardDescription>current enrollment</CardDescription>
        </CardHeader>
        <CardContent className="flex-1"></CardContent>
        <CardFooter className="flex justify-end gap-2 pb-2 pr-2">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button className="font-thin font-dm hover:underline rounded-md">
              course overview <ExternalLink />
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
