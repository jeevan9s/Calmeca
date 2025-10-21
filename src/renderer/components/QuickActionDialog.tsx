
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent } from "@/components/dialog";
import { Calendar, BookOpen, Plus, Clock } from "react-feather";
import AddTaskDialog from "./Courses/addTaskDialog";
import AddExamDialog from "./Courses/AddExamDialog";
import AddCourseDialog from "./Courses/AddCourseDialog";
import AddCalendarEventDialog from "./Courses/AddCalendarEventDialog";

export interface QuickAddDialogProps {
  courseId?: string;
  open?: boolean;
  onClose?: () => void;
}

export default function QuickActionDialog({ courseId, open, onClose }: QuickAddDialogProps) {
  const navigate = useNavigate();
  const [showTask, setShowTask] = useState(false);
  const [showExam, setShowExam] = useState(false);
  const [showCourse, setShowCourse] = useState(false);
  const [showCalendarEvent, setShowCalendarEvent] = useState(false);
  const [midterms, setMidterms] = useState<{ start: Date | null; end: Date | null }[]>([{ start: null, end: null }]);
  const [finalExam, setFinalExam] = useState<{ start: Date | null; end: Date | null } | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  React.useEffect(() => {
    if (!open) {
      setShowTask(false);
      setShowExam(false);
      setShowCourse(false);
      setShowCalendarEvent(false);
    }
  }, [open]);

  const handleClose = () => {
    setShowTask(false);
    setShowExam(false);
    setShowCourse(false);
    setShowCalendarEvent(false);
    onClose?.();
  };

  const handleNavigateToDashboard = () => {
    navigate('/');
    handleClose();
  };

  const btnClass = "flex items-center font-thin gap-2 bg-zinc-800 rounded-xl text-white font-dm  h-10 transition-transform duration-200 ease-in-out hover:scale-105 hover:shadow-lg hover:bg-zinc-700  hover:text-white focus:ring-2 focus:ring-zinc-500 focus:ring-opacity-50 active:scale-95 px-2"

  return (
    <Dialog open={open} onOpenChange={v => { if (!v) handleClose(); }}>
      {!showTask && !showExam && !showCourse && !showCalendarEvent && (
        <DialogContent className="bg-zinc-900 rounded-xl p-6 min-w-[380px] border-none outline-none shadow-xl">
          <h2 className="text-lg mb-4 font-nun font-semibold text-white">quick action</h2>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <button className={`${btnClass} justify-center`} onClick={() => setShowTask(true)}>
              <Plus className="w-4 h-4" />
              add task
            </button>
            <button className={`${btnClass} justify-center`} onClick={() => setShowExam(true)}>
              <Clock className="w-4 h-4" />
              add exam
            </button>
            <button className={`${btnClass} justify-center`} onClick={() => setShowCalendarEvent(true)}>
              <Calendar className="w-4 h-4" />
              add event
            </button>
            <button className={`${btnClass} justify-center`} onClick={handleNavigateToDashboard}>
              <BookOpen className="w-4 h-4" />
              dashboard
            </button>
          </div>
          {!courseId && (
            <button className={`${btnClass} w-full justify-center mb-3`} onClick={() => setShowCourse(true)}>
              <Plus className="w-4 h-4" />
              add course
            </button>
          )}
          <button className="w-full text-center text-sm text-gray-400 hover:text-white transition-colors" onClick={handleClose}>
            Cancel
          </button>
        </DialogContent>
      )}

      {showTask && (
        <AddTaskDialog
          isOpen={showTask}
          onClose={handleClose}
          onTaskAdded={handleClose}
          courseId={courseId || ""}
        />
      )}

      {showExam && courseId && (
        <AddExamDialog
          isOpen={showExam}
          onClose={handleClose}
          existingCourse={{
            id: courseId,
            title: "",
            code: "",
            professor: "",
            createdOn: new Date(),
            updatedOn: new Date(),
            endsOn: new Date(),
          }}
          midterms={midterms}
          setMidterms={setMidterms}
          finalExam={finalExam}
          setFinalExam={setFinalExam}
          endDate={endDate}
          setEndDate={setEndDate}
        />
      )}

      {showCourse && !courseId && (
        <AddCourseDialog
          isOpen={showCourse}
          onClose={handleClose}
          midterms={midterms}
          setMidterms={setMidterms}
          finalExam={finalExam}
          setFinalExam={setFinalExam}
          endDate={endDate}
          setEndDate={setEndDate}
        />
      )}

      {showCalendarEvent && (
        <AddCalendarEventDialog
          isOpen={showCalendarEvent}
          onClose={handleClose}
          onEventAdded={handleClose}
        />
      )}
    </Dialog>
  );
}
