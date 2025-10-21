"use client";

import { Fragment, useState, useEffect, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Input } from "@/components/input";
import { Label } from "@/components/label";
import { Checkbox } from "@/components/checkbox";
import DateTimePicker from "./DatePickerComponent";
import { createTask, updateTask } from "@/services/core services/taskService";
import { addCalendarEvent } from "@/lib/helpers/calendarHelpers";
import { AnimatePresence, motion } from "framer-motion";

type CourseType =
  | "default"
  | "problem set"
  | "homework"
  | "lab"
  | "project task"
  | "report"
  | "quiz"
  | "tutorial exercise"
  | "custom";

interface AddTaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskAdded: () => void;
  courseId: string;
  taskToEdit?: any;
}

const courseTypeOptions: CourseType[] = [
  "problem set",
  "homework",
  "lab",
  "project task",
  "report",
  "quiz",
  "tutorial exercise",
  "custom",
];

const courseTypeLabels: Record<CourseType, string> = {
  default: "",
  "problem set": "problem set",
  homework: "homework",
  lab: "lab",
  "project task": "project task",
  report: "report",
  quiz: "quiz",
  "tutorial exercise": "tutorial exercise",
  custom: "custom",
};

export default function AddTaskDialog({
  isOpen,
  onClose,
  onTaskAdded,
  courseId,
  taskToEdit,
}: AddTaskDialogProps) {

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [deadline, setDeadline] = useState<Date | null>(null);
  const [allDay, setAllDay] = useState(false);
  const [recurring, setRecurring] = useState(false);
  const [recurrence, setRecurrence] = useState<string>("none");
  const [selectedType, setSelectedType] = useState<CourseType>("default");
  const [customType, setCustomType] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const loadedTaskId = useRef<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    if (taskToEdit?.id) {
      if (loadedTaskId.current === taskToEdit.id) return;
      setTitle(taskToEdit.title || "");
      setSummary(taskToEdit.summary || "");
      setDeadline(taskToEdit.deadline ? new Date(taskToEdit.deadline) : null);
      setAllDay(taskToEdit.allDay || false);
      setRecurring(taskToEdit.recurring || false);
      setRecurrence(taskToEdit.recurrence || "none");
      setSelectedType(taskToEdit.type as CourseType || "default");
      setCustomType(
        taskToEdit.type && !courseTypeOptions.includes(taskToEdit.type as CourseType)
          ? taskToEdit.type
          : ""
      );
      loadedTaskId.current = taskToEdit.id;
    } else {
      setTitle("");
      setSummary("");
      setDeadline(null);
      setAllDay(false);
      setRecurring(false);
      setRecurrence("none");
      setSelectedType("default");
      setCustomType("");
      loadedTaskId.current = null;
    }
  }, [isOpen, taskToEdit?.id]);

  useEffect(() => {
    if (!isOpen) {
      const timeoutId = setTimeout(() => {
        setTitle("");
        setSummary("");
        setDeadline(null);
        setAllDay(false);
        setRecurring(false);
        setRecurrence("none");
        setSelectedType("default");
        setCustomType("");
        loadedTaskId.current = null;
      }, 300);
      return () => clearTimeout(timeoutId);
    }
  }, [isOpen]);

  const isButtonDisabled = isSubmitting || !title.trim() || !deadline;

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!title.trim() || !deadline) return;

    setIsSubmitting(true);

    try {
      if (taskToEdit) {
        await updateTask(taskToEdit.id, {
          title: title.trim(),
          description: summary.trim(),
          deadline,

          type: selectedType === "custom" ? (customType.trim() as CourseType) || "custom" : selectedType,
        });
        await addCalendarEvent(
          title.trim(),
          deadline,
          deadline,
          "deadline",
          allDay,
          recurrence
        );
      } else {
        await createTask({
          courseId,
          title: title.trim(),
          description: summary.trim(),
          deadline,
          type: selectedType === "custom" ? (customType.trim() as CourseType) || "custom" : selectedType,
        });
        await addCalendarEvent(
          title.trim(),
          deadline,
          deadline,
          "deadline",
          allDay,
          recurrence
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setTitle("");
      setSummary("");
      setDeadline(null);
      setAllDay(false);
      setRecurring(false);
      setRecurrence("none");
      setSelectedType("default");
      setCustomType("");
      setIsSubmitting(false);
      onTaskAdded();
      onClose();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleTypeChange = (type: CourseType) => {
    setSelectedType(type);
    if (type === "homework" || type === "quiz" || type === "tutorial exercise") {
      setRecurring(true);
    } else if (type !== "custom") {
      setRecurring(false);
    }
  };

 

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform rounded-xl bg-neutral-900 p-6 text-left shadow-xl transition-all">
                <Dialog.Title className="text-lg text-white font-nun font-semibold">
                  {taskToEdit ? "edit an existing task" : "add a new task"}
                </Dialog.Title>
                <form onSubmit={handleSubmit} onKeyPress={handleKeyPress}>
                  <div className="mt-4 space-y-4">
                    <div className="grid gap-1">
                      <Label className="text-sm text-gray-400 font-mp mb-1 font-thin">
                        task name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="enter task title"
                        className="w-full flex items-center font-thin text-sm gap-2 bg-zinc-800 rounded-xl text-white font-dm h-10 border-none outline-none transition-transform duration-200 ease-in-out focus:ring-2 focus:ring-zinc-500 focus:ring-opacity-50 active:scale-95 px-2"
                      />
                    </div>
                    <div className="grid gap-1">
                      <Label className="text-sm text-gray-400 font-mp mb-1 font-thin">
                        summary
                      </Label>
                      <Input
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                        placeholder="optional summary"
                        className="w-full flex items-center font-thin text-sm gap-2 bg-zinc-800 rounded-xl text-white font-dm h-10 border-none outline-none transition-transform duration-200 ease-in-out focus:ring-2 focus:ring-zinc-500 focus:ring-opacity-50 active:scale-95 px-2"
                      />
                    </div>
                    <div className="grid gap-1">
                      <DateTimePicker
                        selected={deadline}
                        onChange={setDeadline}
                        allDay={allDay}
                        label="select date"
                      />
                    </div>
                    <div>
                      <Label className="text-sm text-gray-400 mb-2 block font-mp font-thin">
                        course type
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {courseTypeOptions.map((option) => (
                          <label key={option} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="courseType"
                              value={option}
                              checked={selectedType === option}
                              onChange={() => handleTypeChange(option)}
                              className="w-4 h-4 text-white bg-zinc-800 border-gray-600 focus:ring-white focus:ring-2"
                            />
                            <span className="text-sm text-gray-300 font-dm">{courseTypeLabels[option]}</span>
                          </label>
                        ))}
                        {selectedType === "custom" && (
                          <Input
                            value={customType}
                            onChange={(e) => setCustomType(e.target.value)}
                            placeholder="custom type"
                            className="w-full flex items-center font-thin text-sm gap-2 bg-zinc-800 rounded-xl text-white font-dm h-10 border-none outline-none mt-2 px-2"
                          />
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 mt-8">
                      <Label className="text-sm text-gray-400 font-thin block font-dm">event type</Label>
                      <div className="flex items-center gap-4 mt-3">
                        <Checkbox
                          checked={allDay}
                          onCheckedChange={(checked) => setAllDay(!!checked)}
                          className="border-white text-white focus:ring-white"
                        />
                        <Label className="text-white/80 font-dm">all day</Label>
                        <Checkbox
                          checked={recurring}
                          onCheckedChange={(checked) => setRecurring(!!checked)}
                          className="border-white text-white focus:ring-white"
                        />
                        <Label className="text-white/80 font-dm">recurring</Label>
                      </div>
                      <AnimatePresence initial={false}>
                        {recurring && (
                          <motion.div
                            key="recurring-options"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.25, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <div className="flex items-center gap-2 mt-2 ml-2">
                              <Label className="text-white/70 font-dm mr-2">repeat:</Label>
                              <select
                                className="bg-zinc-800 text-white rounded px-2 py-1 text-sm focus:ring-2 focus:ring-zinc-500 focus:outline-none"
                                value={recurrence}
                                onChange={(e) => setRecurrence(e.target.value)}
                              >
                                <option value="none">select frequency</option>
                                <option value="daily">daily</option>
                                <option value="weekly">weekly</option>
                                <option value="monthly">monthly</option>
                                <option value="custom">custom</option>
                              </select>
                              <AnimatePresence initial={false}>
                                {recurrence === "custom" && (
                                  <motion.div
                                    key="custom-input"
                                    initial={{ opacity: 0, width: 0 }}
                                    animate={{ opacity: 1, width: "auto" }}
                                    exit={{ opacity: 0, width: 0 }}
                                    transition={{ duration: 0.25 }}
                                    className="overflow-hidden"
                                  >
                                    <Input
                                      type="number"
                                      min={1}
                                      placeholder="interval (days)"
                                      className="w-24 ml-2 bg-zinc-800 text-white rounded px-2 py-1 text-sm focus:ring-2 focus:ring-zinc-500 focus:outline-none"
                                    />
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                  <div className="flex justify-end mt-6">
                    <button
                      type="submit"
                      disabled={isButtonDisabled}
                      className="px-4 py-1 bg-white hover:bg-gray-100 disabled:bg-gray-300 disabled:cursor-not-allowed text-zinc-800 rounded-[0.50rem] font-dm text-sm transition-all duration-200 hover:scale-105 hover:shadow-md"
                    >
                      {isSubmitting ? "saving..." : taskToEdit ? "update task" : "add task"}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
