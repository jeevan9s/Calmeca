"use client";

import { useState, useEffect } from "react";
import { Course, Task } from "@/services/db";
import { Plus, Clipboard, Calendar, Trash2, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/button";
import Layout from "../Layout";
import {
  getTasks,
  createTask,
  toggleTaskCompletion,
  deleteTask,
} from "@/services/core services/taskService";
import { format } from "date-fns";

interface CourseHomepageProps {
  course: Course;
  onUpdateCourse?: (updatedCourse: Course) => void;
}

export default function CourseHomepage({
  course,
  onUpdateCourse,
}: CourseHomepageProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [deadline, setDeadline] = useState("");

  const fetchTasks = async () => {
    const courseTasks = await getTasks({ courseId: course.id });
    setTasks(courseTasks);
  };

  useEffect(() => {
    fetchTasks();
  }, [course.id]);

  const addTask = async () => {
    if (!newTask.trim() || !deadline) return;

    const created = await createTask({
      courseId: course.id,
      title: newTask,
      type: "homework",
      deadline: new Date(deadline),
    });

    setTasks((prev) => [...prev, created]);
    setNewTask("");
    setDeadline("");
    onUpdateCourse?.({ ...course, updatedOn: new Date() });
  };

  const toggleComplete = async (taskId: string) => {
    await toggleTaskCompletion(taskId);
    fetchTasks();
  };

  const removeTask = async (taskId: string) => {
    await deleteTask(taskId);
    fetchTasks();
  };

  return (
    <Layout>
      <div className="min-h-screen w-full bg-zinc-950/90 text-white px-6 py-8 space-y-8">
        {/* Course Header */}
        <div
          style={{ borderLeft: `4px solid ${course.color}` }}
          className="pl-4 space-y-2"
        >
          <h1 className="font-nun font-bold text-4xl">{course.title}</h1>
          <p className="text-gray-400 text-sm">
            {course.code} • Professor {course.professor}
          </p>
          {course.description && (
            <p className="mt-1 text-gray-300 text-sm leading-relaxed">
              {course.description}
            </p>
          )}
        </div>

        {/* Tasks Section */}
        <div className="bg-zinc-800/70 rounded-xl p-6 shadow-md space-y-4 border border-zinc-700/40">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Clipboard size={18} /> Tasks
            </h2>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Task name"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                className="px-3 py-2 text-sm rounded bg-zinc-900 border border-zinc-700 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
              />
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="px-3 py-2 text-sm rounded bg-zinc-900 border border-zinc-700 text-gray-400 focus:outline-none focus:ring-1 focus:ring-zinc-500"
              />
              <Button
                onClick={addTask}
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium bg-zinc-700 hover:bg-zinc-600 transition rounded"
              >
                <Plus size={14} />
                Add
              </Button>
            </div>
          </div>

          {/* Task List */}
          <div className="space-y-2 mt-4">
            <AnimatePresence>
              {tasks.length === 0 && (
                <p className="text-sm text-gray-500 italic">
                  No tasks yet. Add one above.
                </p>
              )}
              {tasks.map((task) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className={`p-3 rounded-md flex justify-between items-center border transition-colors ${
                    task.completed
                      ? "bg-zinc-700/70 border-zinc-600 line-through text-gray-400"
                      : "bg-zinc-800 border-zinc-700"
                  }`}
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleComplete(task.id)}
                        className="accent-zinc-400"
                      />
                      <span>{task.title}</span>
                    </div>
                    {task.deadline && (
                      <div className="flex items-center gap-1 text-xs text-gray-400 ml-6">
                        <Calendar size={12} />
                        <span>
                          Due {format(task.deadline, "MMM d, yyyy")}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleComplete(task.id)}
                      className="text-gray-400 hover:text-green-400 transition"
                    >
                      <CheckCircle2 size={16} />
                    </button>
                    <button
                      onClick={() => removeTask(task.id)}
                      className="text-gray-400 hover:text-red-400 transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Layout>
  );
}
