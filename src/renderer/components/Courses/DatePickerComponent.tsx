import { useState, useEffect } from "react";
import { Calendar as CalendarIcon, ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/button";
import { Calendar } from "@/components/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/select";
import { Label } from "@/components/label";
import { format, setHours, setMinutes } from "date-fns";
import {motion} from "framer-motion"
import { Clock } from "react-feather";

interface DateTimePickerProps {
  selected: Date | null;
  startTime?: Date;
  endTime?: Date;
  onChange: (date: Date, startTime?: Date, endTime?: Date) => void;
  label: string;
  allDay?: boolean;
}

export default function DateTimePicker({
  selected,
  startTime,
  endTime,
  onChange,
  label,
  allDay = false,
}: DateTimePickerProps) {
  const [date, setDate] = useState(selected || new Date());
  const [start, setStart] = useState(startTime || new Date());
  const [end, setEnd] = useState(
    endTime || new Date(new Date().getTime() + 60 * 60 * 1000)
  );
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (selected) setDate(selected);
    if (startTime) setStart(startTime);
    if (endTime) setEnd(endTime);
  }, [selected, startTime, endTime]);

  const mergeDateWithTime = (d: Date, t: Date) => {
    const merged = new Date(d);
    merged.setHours(t.getHours(), t.getMinutes(), 0, 0);
    return merged;
  };

  const handleDateSelect = (d: Date) => {
    const newDate = new Date(d);
    const mergedStart = mergeDateWithTime(newDate, start);
    const mergedEnd = mergeDateWithTime(newDate, end);
    setDate(newDate);
    onChange(newDate, mergedStart, mergedEnd);
    setOpen(false);
  };

  const handleStartChange = (value: string) => {
    const [h, m] = value.split(":").map(Number);
    const newStart = mergeDateWithTime(date, setHours(setMinutes(date, m), h));
    setStart(newStart);
    onChange(date, newStart, end);
  };

  const handleEndChange = (value: string) => {
    const [h, m] = value.split(":").map(Number);
    const newEnd = mergeDateWithTime(date, setHours(setMinutes(date, m), h));
    setEnd(newEnd);
    onChange(date, start, newEnd);
  };

  const timeOptions = Array.from({ length: 96 }, (_, i) => {
    const hours = Math.floor(i / 4);
    const minutes = (i % 4) * 15;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  });

  return (
<div className="flex gap-5 items-end w-full sm:w-auto">
  <div className="flex flex-col">
    <Label className="text-sm text-gray-400 font-mp mb-1 font-thin">{label}</Label>
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 bg-zinc-800 rounded-xl text-white font-dm
                     h-10 transition-transform duration-200 ease-in-out hover:scale-105 hover:shadow-lg hover:bg-zinc-700 
                     hover:text-white focus:ring-2 focus:ring-zinc-500 focus:ring-opacity-50 active:scale-95 px-2"
        >
          {date instanceof Date && !isNaN(date.getTime()) ? format(date, "EEE, MMM dd") : "select date"}
          <ChevronDownIcon size={16} className="transition-transform duration-200 group-hover:rotate-180" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0 bg-neutral-900 rounded-xl text-white border-none outline-none 
                   transform transition-transform duration-200 ease-in-out scale-95 hover:scale-100"
      >
        <Calendar
          mode="single"
          selected={date instanceof Date ? date : undefined}
          onSelect={handleDateSelect}
          className="bg-neutral-900 text-white font-dm text-sm rounded-xl shadow-none outline-none border-none"
          classNames={{
            day: "relative rounded-xl m-1 transition-transform duration-200 ease-in-out hover:bg-zinc-700 hover:scale-105 hover:shadow-sm",
            day_selected: "bg-zinc-600 text-white hover:bg-zinc-500 scale-105",
            day_today: "border bg-white text-black border-zinc-500 hover:border-zinc-400",
            day_disabled: "text-gray-500 opacity-50 cursor-not-allowed",
          }}
        />
      </PopoverContent>
    </Popover>
  </div>

  {!allDay && (
    <div className="flex flex-col gap-2">
      <Label className="text-sm text-gray-400 font-thin font-dm -mb-1 font-mp">select time</Label>
      <div className="flex gap-2 items-center">
        <input
          type="time"
          step="60"
          value={start instanceof Date && !isNaN(start.getTime()) ? format(start, "HH:mm") : ""}
          onChange={(e) => {
            const [h, m] = e.target.value.split(":").map(Number);
            const newStart = mergeDateWithTime(date, setHours(setMinutes(date, m), h));
            const newEnd = end instanceof Date && end <= newStart ? new Date(newStart.getTime() + 60 * 60 * 1000) : end;
            setStart(newStart);
            setEnd(newEnd as Date);
            onChange(date, newStart, newEnd as Date);
          }}
          className="bg-zinc-800 text-white rounded-[0.65em] font-dm text-sm px-3 py-2 w-20 h-10 transition-all duration-200 focus:ring-2 focus:ring-zinc-500 focus:outline-none appearance-none [&::-webkit-calendar-picker-indicator]:hidden"
        />
        <span className="text-white">–</span>
        <input
          type="time"
          step="60"
          value={end instanceof Date && !isNaN(end.getTime()) ? format(end, "HH:mm") : ""}
          onChange={(e) => {
            const [h, m] = e.target.value.split(":").map(Number);
            const newEnd = mergeDateWithTime(date, setHours(setMinutes(date, m), h));
            setEnd(newEnd);
            onChange(date, start, newEnd);
          }}
          className="bg-zinc-800 text-white rounded-[0.65em] font-dm text-sm px-3 py-2 w-20 h-10 transition-all duration-200 focus:ring-2 focus:ring-zinc-500 focus:outline-none appearance-none [&::-webkit-calendar-picker-indicator]:hidden"
        />
      </div>
    </div>
  )}
</div>



  );
}
