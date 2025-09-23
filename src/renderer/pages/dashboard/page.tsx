"use client";

import { Card } from "@/components/card";
import Layout from "@/renderer/components/Layout";
import { Dialog, DialogTrigger } from "@/components/dialog";
import { Plus } from "react-feather";
import { motion } from "framer-motion";




export default function Dashboard() {
  const todayDate = new Date();
  const formattedHeaderDate = todayDate.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).toUpperCase();

  return (
    <div className="min-h-screen bg-black/50 text-white">
      <Layout>
        <div className="flex flex-col ml-3 mb-4">
          <h1 className="font-dm font-bold text-4xl">overview</h1>
          <h2 className="font-mp text-neutral-400 text-sm">{formattedHeaderDate}</h2>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-white/30 text-white shadow-lg hover:bg-neutral-400 hover:text-black transition-all flex items-center justify-center">
              <Plus className="w-6 h-6 text-black" />
            </motion.button>
          </DialogTrigger>
        </Dialog>
      </Layout>
    </div>
  );
}
