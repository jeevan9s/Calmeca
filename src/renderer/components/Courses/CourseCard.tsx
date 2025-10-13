"use client";

import { Course, courseTypeLabels } from "@/services/db";
import { format, differenceInDays } from "date-fns";
import { Calendar, GraduationCap, Edit2, Trash2, Archive } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

interface CourseCardProps {
  course: Course;
  onEdit: (course: Course) => void;
  onDelete: (courseId: string) => void;
  onArchive: (courseId: string) => void;
}

export default function CourseCard({ course, onEdit, onDelete, onArchive }: CourseCardProps) {
  const [showPopup, setShowPopup] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);
  const navigate = useNavigate();
  const popupRef = useRef<HTMLDivElement>(null);

  const handleEdit = () => {
    onEdit(course);
    setShowPopup(false);
  };

  const handleDelete = () => {
    setShowDeleteDialog(true);
    setShowPopup(false);
  };

  const confirmDelete = () => {
    onDelete(course.id);
    setShowDeleteDialog(false);
  };

  const handleArchive = () => {
    setShowArchiveDialog(true);
    setShowPopup(false);
  };

  const confirmArchive = () => {
    onArchive(course.id);
    setShowArchiveDialog(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setShowPopup(false);
      }
    };
    if (showPopup) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showPopup]);

  const getCourseProgress = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 8, 3);
    const end = course.endsOn;
    const totalDays = differenceInDays(end, start);
    const elapsedDays = differenceInDays(now, start);
    return Math.min(Math.max((elapsedDays / totalDays) * 100, 0), 100);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        whileHover={{ y: -4, scale: 1.02 }}
        className="relative bg-zinc-800 rounded-xl p-4 h-[14em] w-72 cursor-pointer transition-colors"
        style={{ borderLeft: `4px solid ${course.color}` }}
        onClick={() => navigate(`/courses/${course.id}`)}
      >
        <div className="absolute top-3 right-3 flex items-center gap-2">
          <div className="relative" ref={popupRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowPopup((prev) => !prev);
              }}
              className="p-2 hover:bg-zinc-600/40 rounded-xl transition-colors"
            >
              <Edit2 size={16} className="text-white" />
            </button>

            <AnimatePresence>
              {showPopup && (
                <motion.div
                  key="popup"
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="fixed top-24 right-4 w-36 bg-zinc-700 rounded-xl border border-zinc-600 shadow-lg overflow-hidden z-50"
                >
                  <button
                    onClick={(e) => { e.stopPropagation(); handleEdit(); }}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-zinc-600 hover:text-white w-full text-left transition-colors"
                  >
                    <Edit2 size={14} /> edit
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleArchive(); }}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-yellow-400 hover:bg-zinc-600 hover:text-yellow-300 w-full text-left transition-colors"
                  >
                    <Archive size={14} /> archive
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(); }}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-zinc-600 hover:text-red-300 w-full text-left transition-colors"
                  >
                    <Trash2 size={14} /> delete
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="h-full flex flex-col">
          <div className="flex-1">
            <h3 className="font-dm font-semibold text-white text-lg mb-1 line-clamp-2">{course.title}</h3>
            <p className="text-gray-400 text-sm font-dm mb-2">{course.code}</p>
            {course.type && (
              <div className="flex items-center gap-1 mb-2">
                <GraduationCap size={12} className="text-gray-500" />
                <span className="text-gray-500 text-xs font-dm">{courseTypeLabels[course.type]}</span>
              </div>
            )}
            {course.professor && (
              <p className="text-gray-500 text-xs font-dm mb-2">Professor {course.professor}</p>
            )}
            <div className="space-y-1 mb-2">
              <div className="flex items-center gap-2 text-gray-500 text-xs font-dm">
                <Calendar size={10} />
                <span>ends {format(course.endsOn, "MMM dd")}</span>
              </div>
            </div>
            <div className="mt-5">
              <div className="bg-zinc-700 h-1 rounded-full w-full">
                <div
                  className="bg-white h-1 rounded-full"
                  style={{ width: `${getCourseProgress()}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showDeleteDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80"
            onClick={() => setShowDeleteDialog(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.2 }}
              className="bg-zinc-800 rounded-[.25em] p-6 border border-zinc-700 shadow-lg max-w-sm w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-dm font-semibold text-white">delete course</h3>
              </div>
              <p className="text-sm text-gray-400 mb-6">
                are you sure you want to delete <span className="text-white font-semibold">{course.title}</span>? this action cannot be undone.
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowDeleteDialog(false)}
                  className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white font-dm rounded-[.25em] transition-colors"
                >
                  cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-dm rounded-[.25em] transition-colors"
                >
                  delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showArchiveDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/70"
            onClick={() => setShowArchiveDialog(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.2 }}
              className="bg-zinc-800 rounded-[.25em] p-4 border border-zinc-700 shadow-lg max-w-xs w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-dm font-semibold text-white">archive course</h3>
              </div>
              <p className="text-sm text-gray-400 mb-4">
                are you sure you want to archive <span className="text-white font-semibold">{course.title}</span>?
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowArchiveDialog(false)}
                  className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white font-dm rounded-[.25em] transition-colors"
                >
                  cancel
                </button>
                <button
                  onClick={confirmArchive}
                  className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-dm rounded-[.25em] transition-colors"
                >
                  archive
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
