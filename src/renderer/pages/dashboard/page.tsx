import { Card } from "@/components/card";
import Layout from "@/renderer/components/Layout";
import { Dialog, DialogTrigger } from "@/components/dialog";
import { Button } from "@/components/button";
import { Plus, Bell, MoreHorizontal } from "react-feather";
import { useState } from "react";

// Sample events
const hours = [
  "8:00 am",
  "9:00 am",
  "9:30 am",
  "10:00 am",
  "11:00 am",
  "12:00 pm",
  "1:00 pm",
  "2:00 pm",
  "3:00 pm",
];

const sampleEvents: Record<string, string[]> = {
  "8:00 am": ["Dental Cleaning - Edward Johnson"],
  "9:30 am": ["Status Update - John Doe"],
  "10:00 am": ["Calendar Updates - Edward Johnson"],
  "11:00 am": ["Send Detailed Status Update - Mike Taylor"],
  "12:00 pm": ["Meeting with AR Shakir - AR Shakir"],
  "2:00 pm": ["Call New Leads - Mike, John, Chris"],
};

export default function Dashboard() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const formattedDate = currentDate.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).toUpperCase();

  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const getDayFlag = (date: Date) => {
    if (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    ) {
      return "Today";
    }
    if (
      date.getDate() === tomorrow.getDate() &&
      date.getMonth() === tomorrow.getMonth() &&
      date.getFullYear() === tomorrow.getFullYear()
    ) {
      return "Tomorrow";
    }
    return null;
  };

  const dayFlag = getDayFlag(currentDate);

  const changeDay = (offset: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + offset);
    setCurrentDate(newDate);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Layout>
        {/* Header */}
        <div className="flex flex-col ml-3 mb-4">
          <h1 className="font-dm font-bold text-4xl">Overview</h1>
          <div className="flex items-center space-x-2">
            <h2 className="font-mp text-neutral-400 text-sm">{formattedDate}</h2>
            {dayFlag && (
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-green-500 text-black">
                {dayFlag}
              </span>
            )}
          </div>
        </div>

        <div className="flex">
          {/* Left content (optional) */}
          <div className="flex-1 flex flex-col p-6"></div>

          {/* Agenda Card */}
          <Card className="w-80 bg-neutral-900 rounded-2xl ml-10 p-6 flex flex-col max-h-[85vh]">
            {/* Header with day toggle */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <button
                  className="p-1 hover:bg-neutral-800 rounded"
                  onClick={() => changeDay(-1)}
                >
                  ‹
                </button>
                <span className="text-white font-medium">Agenda</span>
                <button
                  className="p-1 hover:bg-neutral-800 rounded"
                  onClick={() => changeDay(1)}
                >
                  ›
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-neutral-400" />
                <MoreHorizontal className="w-5 h-5 text-neutral-400" />
              </div>
            </div>

            {/* Timeline */}
            <div className="flex-1 overflow-y-auto space-y-6">
              {hours.map((hour) => (
                <div key={hour} className="relative">
                  <div className="flex items-center">
                    <div className="w-16 text-neutral-400 text-sm font-medium">{hour}</div>
                    <div
                      className={`flex-1 ml-4 rounded ${
                        hour === "9:30 am" ? "bg-green-500 h-1" : "border-t border-neutral-700"
                      }`}
                    ></div>
                  </div>
                  <div className="ml-20 mt-2 space-y-2">
                    {sampleEvents[hour]?.map((event, idx) => (
                      <Card
                        key={idx}
                        className="bg-neutral-800 text-white text-sm rounded-md p-2 shadow-sm"
                      >
                        {hour} • {event}
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Floating Add Button */}
        <Dialog>
          <DialogTrigger asChild>
            <Button className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-[#0c0c0c] text-white shadow-lg hover:bg-neutral-400 hover:text-black hover:shadow-xl transition-all duration-200 flex items-center justify-center">
              <Plus className="w-6 h-6" />
            </Button>
          </DialogTrigger>
        </Dialog>
      </Layout>
    </div>
  );
}
