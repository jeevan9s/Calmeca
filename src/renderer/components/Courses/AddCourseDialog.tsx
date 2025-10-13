"use client";

import { useState, Fragment, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Paperclip, Plus, Minus } from "react-feather";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@radix-ui/react-tooltip";
import { Course, CourseType } from "@/services/db";
import { addCourse, updateCourse } from "@/services/core services/courseService";
import { generateId } from "@/services/integrations-utils/utilityServicies";
import CourseFormFields from "./CourseFormFields";
import DateTimePicker from "./DatePickerComponent";
import ColorPickerField from "./ColourPickerField";
import { addCalendarEvent } from "@/lib/helpers/calendarHelpers";

interface AddCourseDialogProps {
  isOpen: boolean;
  onAddCourse?: (course: Course) => void;
  onUpdateCourse?: (course: Course) => void;
  onClose: () => void;
  existingCourse?: Course | null;
}

export default function AddCourseDialog({
  isOpen,
  onAddCourse,
  onUpdateCourse,
  onClose,
  existingCourse,
}: AddCourseDialogProps) {
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [professor, setProfessor] = useState("");
  const [profEmail, setProfEmail] = useState("");
  const [selectedType, setSelectedType] = useState<CourseType>("lecture-tutorial");
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [midterms, setMidterms] = useState<{ start: Date; end: Date }[]>([]);
  const [finalExam, setFinalExam] = useState<{ start: Date; end: Date } | null>(null);
  const [color, setColor] = useState("#8B0000");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [description, setDescription] = useState(existingCourse?.description || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const isEditing = !!existingCourse;

useEffect(() => {
  if (existingCourse) {
    setTitle(existingCourse.title);
    setCode(existingCourse.code);
    setProfessor(existingCourse.professor || "");
    setProfEmail(existingCourse.profEmail || "");
    setSelectedType(existingCourse.type);
    setEndDate(existingCourse.endsOn ? new Date(existingCourse.endsOn) : null);

    setMidterms(
      existingCourse.midterms?.map((mt) => {
        let start: Date;
        let end: Date;

        if (mt.start instanceof Date) {
          start = new Date(mt.start);
          end = new Date(mt.end);
        } else {
          start = new Date(mt.start);
          end = new Date(mt.end || start.getTime() + 60 * 60 * 1000);
        }

        return { start, end };
      }) || []
    );

    // Handle final exam - only convert if necessary
    if (existingCourse.finalExamDate) {
      const start =
        existingCourse.finalExamDate instanceof Date
          ? new Date(existingCourse.finalExamDate)
          : new Date(existingCourse.finalExamDate);

      const end = finalExam?.end || new Date(start.getTime() + 2 * 60 * 60 * 1000);

      setFinalExam({ start, end });
    } else {
      setFinalExam(null);
    }

    setColor(existingCourse.color || "#8B0000");
    setDescription(existingCourse.description || "");
  } else {
    setTitle("");
    setCode("");
    setProfessor("");
    setProfEmail("");
    setSelectedType("lecture-tutorial");
    setEndDate(null);
    setMidterms([{ start: new Date(), end: new Date(new Date().getTime() + 60 * 60 * 1000) }]);
    setFinalExam(null);
    setColor("#8B0000");
    setPdfFile(null);
    setDescription("");
  }
}, [existingCourse, isOpen]);


  const handlePdfUpload = async (file: File) => {
    setPdfFile(file);
    setIsPdfLoading(true);
    try {
      if (window.electronAPI) {
        const result = await window.electronAPI.extractCourseFromPDF(file.path);
        if (result.success) {
          const data = result.course;
          if (data.title) setTitle(data.title);
          if (data.code) setCode(data.code);
          if (data.professor) setProfessor(data.professor);
          if (data.profEmail) setProfEmail(data.profEmail);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsPdfLoading(false);
      setPdfFile(null);
      const input = document.querySelector<HTMLInputElement>('input[type="file"]');
      if (input) input.value = "";
    }
  };

  const handleSubmit = async () => {
    if (!title || !code || !professor || !endDate) return;
    setIsSubmitting(true);

    try {
      console.log("Before conversion - Midterms:", midterms);
      console.log("Before conversion - Final Exam:", finalExam);
      console.log("Before conversion - Course end:", endDate);

      const courseData = {
        title,
        code,
        professor,
        profEmail,
        type: selectedType,
        endsOn: endDate,
        description,
        color,
        midterms,
        finalExamDate: finalExam?.start || null,
      };

      console.log("Course data being sent:", courseData);

      let course: Course;

      if (isEditing && existingCourse) {
        await updateCourse(existingCourse.id, courseData);
        course = { ...existingCourse, ...courseData, updatedOn: new Date() };
        onUpdateCourse?.(course);
      } else {
        course = await addCourse({
          ...courseData,
          id: generateId(),
          createdOn: new Date(),
          updatedOn: new Date(),
          homepage: { deadlines: [], tasks: [], resources: [], notes: "", announcements: [] },
        });
        onAddCourse?.(course);
      }

      const events: { summary: string; start: Date; end: Date; type: "deadline" | "exam"; allDay?: boolean; description?: string }[] = [];

      events.push({
        summary: `${title} - Course End`,
        start: new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()),
        end: new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate() + 1),
        type: "deadline",
        allDay: true,
        description,
      });

      midterms.forEach((mt, i) => {
        console.log(`Midterm ${i + 1} sending:`, mt);
        events.push({
          summary: `${title} - Midterm ${i + 1}`,
          start: mt.start,
          end: mt.end,
          type: "exam",
          allDay: false,
          description,
        });
      });

      if (finalExam) {
        console.log("Final exam sending:", finalExam);
        events.push({
          summary: `${title} - Final Exam`,
          start: finalExam.start,
          end: finalExam.end,
          type: "exam",
          allDay: false,
          description,
        });
      }

      for (const evt of events) {
        console.log("Adding to calendar:", evt);
        await addCalendarEvent(evt.summary, evt.start, evt.end, evt.type, evt.allDay ?? false, evt.description);
      }

      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addMidterm = () => {
    if (midterms.length >= 2) return;
    setMidterms([
      ...midterms,
      { start: new Date(), end: new Date(new Date().getTime() + 60 * 60 * 1000) },
    ]);
  };

  const removeMidterm = (index: number) => setMidterms(midterms.filter((_, i) => i !== index));

  return (
    <TooltipProvider>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={onClose}>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-end p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-x-full"
                enterTo="opacity-100 translate-x-0"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-x-0"
                leaveTo="opacity-0 translate-x-full"
              >
                <Dialog.Panel className="w-full max-w-md transform rounded-xl bg-neutral-900/90 p-6 text-left shadow-xl transition-all">
                  <div className="flex items-center justify-between">
                    <Dialog.Title className="text-lg text-white font-nun font-semibold">
                      {isEditing ? "Edit Course" : "Add Course"}
                    </Dialog.Title>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <label className="flex h-6 w-6 items-center justify-center rounded-md text-white hover:bg-gray-600/30 cursor-pointer">
                          <input
                            type="file"
                            accept=".pdf"
                            className="hidden"
                            onChange={(e) => e.target.files && handlePdfUpload(e.target.files[0])}
                          />
                          {isPdfLoading ? (
                            <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                          ) : (
                            <Paperclip size={16} />
                          )}
                        </label>
                      </TooltipTrigger>
                      <TooltipContent side="left" className="bg-zinc-800 text-white/90 rounded-md text-xs font-dm p-2 mr-1 font-thin">
                        upload syllabus (beta NLP extraction)
                      </TooltipContent>
                    </Tooltip>
                  </div>

                  <div className="mt-4 space-y-4">
                    <CourseFormFields
                      title={title}
                      setTitle={setTitle}
                      code={code}
                      setCode={setCode}
                      professor={professor}
                      setProfessor={setProfessor}
                      profEmail={profEmail}
                      setProfEmail={setProfEmail}
                      selectedType={selectedType}
                      setSelectedType={setSelectedType}
                      description={description}
                      setDescription={setDescription}
                    />

                    <div className="flex flex-col gap-2">
                      {midterms.map((mt, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <DateTimePicker
                            label={`midterm ${i + 1} date`}
                            selected={mt.start}
                            onChange={(date) => {
                              if (!date) return;
                              const newMidterms = [...midterms];
                              newMidterms[i] = { start: date, end: new Date(date.getTime() + 60 * 60 * 1000) };
                              setMidterms(newMidterms);
                            }}
                            allDay={false}
                          />

                          <div className="flex gap-1">
                            {i === midterms.length - 1 && midterms.length < 2 && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button
                                      type="button"
                                      onClick={addMidterm}
                                      className="h-6 w-6 mt-3 flex items-center justify-center rounded-[0.5em] ml-3 text-white text-sm transition-transform duration-200 hover:bg-zinc-600 hover:scale-105"
                                    >
                                      <Plus size={18} strokeWidth={3} />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent
                                    side="left"
                                    className="bg-zinc-800 text-white font-dm rounded-md text-xs p-1 font-thin"
                                  >
                                    add optional midterm
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                            {i > 0 && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button
                                      type="button"
                                      onClick={() => removeMidterm(i)}
                                      className="h-6 w-6 mt-3 flex items-center justify-center rounded-[0.5em] ml-3 text-white text-sm transition-transform duration-200 hover:bg-red-600 hover:scale-105"
                                    >
                                      <Minus size={18} />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent
                                    side="left"
                                    className="bg-zinc-800 text-white font-dm rounded-md text-xs p-1 font-thin"
                                  >
                                    remove midterm
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <DateTimePicker
                      label="final exam date"
                      selected={finalExam?.start || null}
                      onChange={(date) => {
                        if (!date) return;
                        setFinalExam({ start: date, end: new Date(date.getTime() + 2 * 60 * 60 * 1000) });
                      }}
                      allDay={false}
                    />

                    <div className="flex flex-col gap-4 mt-4">
                      <div className="flex gap-4 items-end">
                        <DateTimePicker
                          label="course end date"
                          selected={endDate}
                          onChange={setEndDate}
                          allDay
                        />
                        <ColorPickerField
                          color={color}
                          setColor={setColor}
                          label="select course colour"
                        />
                      </div>

                      <div className="flex justify-end mt-4">
                        <button
                          type="button"
                          onClick={handleSubmit}
                          disabled={isSubmitting || isPdfLoading}
                          className="px-4 py-1 bg-white hover:bg-gray-100 disabled:bg-gray-300 disabled:cursor-not-allowed text-zinc-800 rounded-[0.50rem] font-dm text-sm transition-all duration-200 hover:scale-105 hover:shadow-md"
                        >
                          {isSubmitting ? (isEditing ? "updating..." : "adding...") : (isEditing ? "update course" : "add course")}
                        </button>
                      </div>
                    </div>

                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </TooltipProvider>
  );
}
