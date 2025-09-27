"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/card";
import { Button } from "@/components/button";
import Layout from "@/renderer/components/Layout";
import { Dialog, DialogTrigger } from "@/components/dialog";
import { ExternalLink, Plus } from "react-feather";
import { motion } from "framer-motion";
import { ScrollArea } from "@/components/scroll-area"; // Shadcn scroll area

export default function Dashboard() {
  const todayDate = new Date();
  const formattedHeaderDate = todayDate
    .toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .toUpperCase();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6, staggerChildren: 0.1, delayChildren: 0.2 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  };

  return (
    <div className="min-h-screen bg-zinc-950/90 text-white w-full overflow-hidden">
      <Layout>
        {/* Shadcn ScrollArea wraps the scrollable content */}
        <ScrollArea className="h-screen p-4">
          <motion.div
            className="flex flex-col xl:flex-row gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Left Column */}
            <motion.div className="flex flex-col flex-1 gap-5" variants={cardVariants}>
              <motion.div className="mt-2" variants={headerVariants}>
                <motion.h2
                  className="font-dm text-neutral-400 text-sm"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                >
                  {formattedHeaderDate}
                </motion.h2>
                <motion.h1
                  className="font-nun font-bold text-2xl sm:text-3xl lg:text-4xl"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                >
                  dashboard
                </motion.h1>
              </motion.div>

              <motion.div className="flex flex-col gap-5" variants={cardVariants}>
                <motion.div whileHover={{ scale: 1.01, y: -2 }} transition={{ duration: 0.2 }}>
                  <Card className="bg-[#0f0f10ff] h-80 sm:h-96 flex flex-col rounded-lg">
                    <CardHeader>
                      <CardTitle>today's events</CardTitle>
                      <CardDescription>
                        Enter your email below to login to your account
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1"></CardContent>
                    <CardFooter className="flex justify-end gap-2 pb-2 pr-2">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button className="font-thin font-dm hover:underline rounded-md">
                          open in calendar <ExternalLink />
                        </Button>
                      </motion.div>
                    </CardFooter>
                  </Card>
                </motion.div>

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
              </motion.div>
            </motion.div>

            {/* Right Column */}
            <motion.div className="flex flex-col flex-1 gap-5" variants={cardVariants}>
              <div className="flex flex-col sm:flex-row gap-5">
                <motion.div variants={cardVariants} whileHover={{ scale: 1.02, y: -2 }} transition={{ duration: 0.2 }} className="rounded-lg flex-1">
                  <Card className="h-44 sm:h-48 bg-zinc-400/10 w-full rounded-lg">
                    <CardHeader>
                      <CardTitle>quick stats</CardTitle>
                      <CardDescription>Overview of your progress</CardDescription>
                    </CardHeader>
                    <CardContent></CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={cardVariants} whileHover={{ scale: 1.02, y: -2 }} transition={{ duration: 0.2 }} className="rounded-lg flex-1">
                  <Card className="h-44 sm:h-48 bg-zinc-400/10 w-full rounded-lg">
                    <CardHeader>
                      <CardTitle>notifications</CardTitle>
                      <CardDescription>Recent updates</CardDescription>
                    </CardHeader>
                    <CardContent></CardContent>
                  </Card>
                </motion.div>
              </div>

              <motion.div variants={cardVariants} whileHover={{ scale: 1.01, y: -1 }} transition={{ duration: 0.2 }} className="rounded-lg w-full">
                <Card className="h-32 sm:h-28 bg-[#0f0f10ff] w-full rounded-lg">
                  <CardHeader>
                    <CardTitle>deadlines</CardTitle>
                    <CardDescription>Upcoming assignments</CardDescription>
                  </CardHeader>
                  <CardContent></CardContent>
                </Card>
              </motion.div>

              <motion.div variants={cardVariants} whileHover={{ scale: 1.01, y: -1 }} transition={{ duration: 0.2 }} className="rounded-lg w-full">
                <Card className="h-96 sm:h-[22.5rem] bg-[#0f0f10ff] w-full rounded-lg">
                  <CardHeader>
                    <CardTitle>deadlines</CardTitle>
                    <CardDescription>Upcoming assignments</CardDescription>
                  </CardHeader>
                  <CardContent></CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </motion.div>
        </ScrollArea>

        {/* Floating Action Button */}
        <Dialog>
          <DialogTrigger asChild>
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.3 }}
              whileHover={{
                scale: 1.1,
                rotate: 5,
                boxShadow: "0 10px 25px rgba(255, 255, 255, 0.2)",
              }}
              whileTap={{ scale: 0.9 }}
              className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-white/80 text-black shadow-lg hover:bg-white hover:text-black flex items-center justify-center transition-all"
            >
              <motion.div animate={{ rotate: 0 }} whileHover={{ rotate: 90 }} transition={{ duration: 0.2 }}>
                <Plus className="w-6 h-6 text-black" />
              </motion.div>
            </motion.button>
          </DialogTrigger>
        </Dialog>
      </Layout>
    </div>
  );
}
