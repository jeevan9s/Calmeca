"use client";

import { Course, courseTypeLabels } from "@/services/db";
import { format } from "date-fns";
import { Calendar, Edit2, Trash2, MoreVertical, X, Clock, GraduationCap } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink } from "react-feather";
import { useNavigate } from "react-router-dom";

interface CourseCardProps {
  course: Course;
  onEdit: (course: Course) => void;
  onDelete: (courseId: string) => void;
}

export default function CourseCard({ course, onEdit, onDelete }: CourseCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  const handleEdit = () => {
    onEdit(course);
    setShowMenu(false);
  };

  const handleDelete = () => {
    setShowDeleteDialog(true);
    setShowMenu(false);
  };

  const confirmDelete = () => {
    onDelete(course.id);
    setShowDeleteDialog(false);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        whileHover={{ y: -4, scale: 1.02, transition: { duration: 0.2, ease: "easeOut" } }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="relative bg-zinc-800 rounded-xl p-4 h-[14em] w-80 cursor-pointer transition-colors"
        style={{ borderLeft: `4px solid ${course.color}` }}
        onClick={(e) => {
          if (!(e.target as HTMLElement).closest("button")) {
            navigate(`/courses/${course.id}`);
          }
        }}
      >
        <div className="absolute top-3 right-3 flex items-center gap-2" ref={menuRef}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(`/courses/${course.id}`)}
            className="p-2 hover:bg-zinc-600/40 rounded-xl transition-colors"
          >
            <ExternalLink size={16} className="text-white" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-zinc-600/40 rounded-xl transition-colors"
          >
            <MoreVertical size={16} className="text-white" />
          </motion.button>
          <AnimatePresence>
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.15 }}
                className="absolute top-12 right-0 bg-zinc-700 rounded-xl shadow-lg border border-zinc-600 z-50 min-w-[120px]"
              >
                <motion.button
                  whileHover={{ backgroundColor: "#52525b" }}
                  onClick={handleEdit}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white rounded-t-md w-full text-left"
                >
                  <Edit2 size={14} />
                  edit
                </motion.button>
                <motion.button
                  whileHover={{ backgroundColor: "#52525b" }}
                  onClick={handleDelete}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 rounded-b-md w-full text-left"
                >
                  <Trash2 size={14} />
                  delete
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="h-full flex flex-col">
          <div className="flex-1">
            <motion.h3 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="font-dm font-semibold text-white text-lg mb-1 line-clamp-2">
              {course.title}
            </motion.h3>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="text-gray-400 text-sm font-dm mb-2">
              {course.code}
            </motion.p>
            {course.type && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex items-center gap-1 mb-2">
                <GraduationCap size={12} className="text-gray-500" />
                <span className="text-gray-500 text-xs font-dm">{courseTypeLabels[course.type]}</span>
              </motion.div>
            )}
            {course.professor && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} className="text-gray-500 text-xs font-dm mb-2">
                Professor {course.professor}
              </motion.p>
            )}
            {course.description && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-gray-400 text-xs font-dm line-clamp-2 mb-2">
                {course.description}
              </motion.p>
            )}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="space-y-1 mb-2">
              <div className="flex items-center gap-2 text-gray-500 text-xs font-dm">
                <Calendar size={10} />
                <span>ends {format(course.endsOn, "MMM dd")}</span>
              </div>
              {course.midtermDate && (
                <div className="flex items-center gap-2 text-gray-500 text-xs font-dm">
                  <Clock size={10} />
                  <span>midterm {format(course.midtermDate, "MMM dd")}</span>
                </div>
              )}
              {course.finalExamDate && (
                <div className="flex items-center gap-2 text-gray-500 text-xs font-dm">
                  <Clock size={10} />
                  <span>final {format(course.finalExamDate, "MMM dd")}</span>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showDeleteDialog && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80">
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} transition={{ duration: 0.2 }} className="bg-zinc-800 rounded-[.25em] p-6 border border-zinc-700 shadow-lg max-w-md w-full mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-dm font-semibold text-white">delete course</h3>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowDeleteDialog(false)} className="p-1 rounded-md hover:bg-zinc-700 transition-colors">
                  <X size={16} className="text-gray-400" />
                </motion.button>
              </div>
              <p className="text-sm text-gray-400 mb-6">
                are you sure you want to delete <span className="text-white font-semibold">{course.title}</span>? this action cannot be undone.
              </p>
              <div className="flex justify-end gap-2">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowDeleteDialog(false)} className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white font-dm rounded-[.25em] transition-colors">
                  cancel
                </motion.button>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={confirmDelete} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-dm rounded-[.25em] transition-colors">
                  delete
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
