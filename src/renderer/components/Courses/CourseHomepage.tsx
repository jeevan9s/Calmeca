"use client";

import { useState, useEffect } from "react";
import { Course, Task } from "@/services/db";
import { Plus, Clipboard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/button";
import Layout from "../Layout";
import { getTasks, createTask, toggleTaskCompletion, deleteTask } from "@/services/core services/taskService";

interface CourseHomepageProps {
  course: Course;
  onUpdateCourse?: (updatedCourse: Course) => void;
}

export default function CourseHomepage({ course, onUpdateCourse }: CourseHomepageProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");

  const fetchTasks = async () => {
    const courseTasks = await getTasks({ courseId: course.id });
    setTasks(courseTasks);
  };

  useEffect(() => {
    fetchTasks();
  }, [course.id]);

  const addTask = async () => {
    if (!newTask.trim()) return;

    const created = await createTask({ 
      courseId: course.id, 
      title: newTask, 
      type: "homework",
      deadline: new Date()
    });

    setTasks((prev) => [...prev, created]);
    setNewTask("");
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
    <div className="min-h-screen w-full bg-zinc-950/90 text-white p-6 space-y-6">
      <Layout>
      <div style={{ borderLeft: `4px solid ${course.color}` }} className="pl-4">
        <h1 className="font-nun font-bold text-3xl">{course.title}</h1>
        <p className="text-gray-400 text-sm">{course.code} | Professor: {course.professor}</p>
        <p className="mt-2 text-gray-300">{course.description}</p>
      </div>

      <div className="bg-zinc-800 rounded-xl p-4 space-y-3">
        <h2 className="text-lg font-semibold flex items-center gap-2"><Clipboard size={16} /> Tasks</h2>
        <div className="space-y-2">
          <AnimatePresence>
            {tasks.map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="bg-zinc-700 p-2 rounded flex justify-between items-center text-gray-200 text-sm"
              >
                <div>
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleComplete(task.id)}
                    className="mr-2"
                  />
                  {task.title}
                </div>
                <Button onClick={() => removeTask(task.id)}>Delete</Button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <div className="flex gap-2 mt-2">
          <input
            type="text"
            placeholder="New task"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="flex-1 p-2 rounded bg-zinc-900 text-white text-sm"
          />
          <Button onClick={addTask}><Plus size={14} /></Button>
        </div>
      </div>
      </Layout>
    </div>
  );
}
