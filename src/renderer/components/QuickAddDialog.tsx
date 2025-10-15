
import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/dialog";
import AddTaskDialog from "./Courses/addTaskDialog";
import AddExamDialog from "./Courses/AddExamDialog";
import AddCourseDialog from "./Courses/AddCourseDialog";

export interface QuickAddDialogProps {
  courseId?: string;
  open?: boolean;
  onClose?: () => void;
}

export default function QuickAddDialog({ courseId, open, onClose }: QuickAddDialogProps) {
  const [showTask, setShowTask] = useState(false);
  const [showExam, setShowExam] = useState(false);
  const [showCourse, setShowCourse] = useState(false);

  // For AddExamDialog/AddCourseDialog props
  const [midterms, setMidterms] = useState<{ start: Date | null; end: Date | null }[]>([{ start: null, end: null }]);
  const [finalExam, setFinalExam] = useState<{ start: Date | null; end: Date | null } | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // Reset sub-dialogs when closed
  React.useEffect(() => {
    if (!open) {
      setShowTask(false);
      setShowExam(false);
      setShowCourse(false);
    }
  }, [open]);

  const handleClose = () => {
    setShowTask(false);
    setShowExam(false);
    setShowCourse(false);
    onClose?.();
  };

  return (
    <Dialog open={open} onOpenChange={v => { if (!v) handleClose(); }}>
      {!showTask && !showExam && !showCourse && (
        <DialogContent className="bg-zinc-900 rounded-xl p-6 min-w-[320px] shadow-xl">
          <h2 className="font-bold text-lg mb-4">Quick Add</h2>
          <div className="flex flex-col gap-3">
            <button className="bg-zinc-800 text-white rounded px-4 py-2" onClick={() => setShowTask(true)}>
              Add Task
            </button>
            <button className="bg-zinc-800 text-white rounded px-4 py-2" onClick={() => setShowExam(true)}>
              Add Exam
            </button>
            {!courseId && (
              <button className="bg-zinc-800 text-white rounded px-4 py-2" onClick={() => setShowCourse(true)}>
                Add Course
              </button>
            )}
            <button className="mt-2 text-sm text-gray-400 hover:text-white" onClick={handleClose}>Cancel</button>
          </div>
        </DialogContent>
      )}

      {/* Add Task Dialog */}
      {showTask && (
        <AddTaskDialog
          isOpen={showTask}
          onClose={handleClose}
          onTaskAdded={handleClose}
          courseId={courseId || ""}
        />
      )}

      {/* Add Exam Dialog (course-specific only) */}
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

      {/* Add Course Dialog (dashboard only) */}
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
    </Dialog>
  );
}
