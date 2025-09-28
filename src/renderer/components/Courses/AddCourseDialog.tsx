import { useState, Fragment, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Calendar, Palette } from "lucide-react";
import { Paperclip } from "react-feather";
import { format } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@radix-ui/react-tooltip";
import { Button } from "@/components/button";
import { Course, CourseType, courseTypeLabels } from "@/services/db";
import {
  addCourse,
  updateCourse,
} from "@/services/core services/courseService";
import { generateId } from "@/services/integrations-utils/utilityServicies";

const colorPalette = [
  "#8B0000", // Dark Red
  "#2F4F4F", // Dark Slate Gray
  "#191970", // Midnight Blue
  "#006400", // Dark Green
  "#8B4513", // Saddle Brown
  "#4B0082", // Indigo
  "#2E8B57", // Sea Green
  "#B8860B", // Dark Goldenrod
  "#800080", // Purple
  "#1E90FF", // Dodger Blue
  "#CD853F", // Peru
  "#228B22", // Forest Green
];

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
  const [officeHours, setOfficeHours] = useState("");
  const [description, setDescription] = useState("");
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [midtermDate, setMidtermDate] = useState<Date | null>(null);
  const [finalExamDate, setFinalExamDate] = useState<Date | null>(null);
  const [color, setColor] = useState("#8B0000");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showMidtermPicker, setShowMidtermPicker] = useState(false);
  const [showFinalExamPicker, setShowFinalExamPicker] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const courseTypeOptions: CourseType[] = [
    "lecture-tutorial",
    "project-studio",
    "lab",
  ];
  const [selectedType, setSelectedType] =
    useState<CourseType>("lecture-tutorial");

  const isEditing = !!existingCourse;

  useEffect(() => {
    if (existingCourse) {
      setTitle(existingCourse.title);
      setCode(existingCourse.code);
      setProfessor(existingCourse.professor || "");
      setDescription(existingCourse.description || "");
      setEndDate(existingCourse.endsOn);
      setColor(existingCourse.color || "#8B0000");
      setSelectedType(existingCourse.type);
    } else {
      setTitle("");
      setCode("");
      setProfessor("");
      setOfficeHours("");
      setDescription("");
      setEndDate(null);
      setMidtermDate(null);
      setFinalExamDate(null);
      setColor("#8B0000");
      setPdfFile(null);
      setSelectedType("lecture-tutorial");
    }
  }, [existingCourse, isOpen]);

  const handleSubmit = async () => {
    if (!title || !code || !professor || !endDate) return;

    setIsSubmitting(true);
    try {
      if (isEditing && existingCourse) {
        await updateCourse(existingCourse.id, {
          title,
          code,
          professor,
          midtermDate,
          finalExamDate,
          description,
          endsOn: endDate,
          color,
          type: selectedType,
        });

        const updatedCourse: Course = {
          ...existingCourse,
          title,
          code,
          professor,
          midtermDate,
          finalExamDate,
          description,
          endsOn: endDate,
          color,
          type: selectedType,
          updatedOn: new Date(),
        };

        onUpdateCourse?.(updatedCourse);
      } else {
        const newCourse: Course = await addCourse({
          id: generateId(),
          title,
          code,
          professor,
          description,
          endsOn: endDate,
          color,
          type: selectedType,
          createdOn: new Date(),
          updatedOn: new Date(),
          homepage: {
            deadlines: [],
            tasks: [],
            resources: [],
            notes: "",
            announcements: [],
          },
        });

        onAddCourse?.(newCourse);
      }

      onClose();
    } catch (error) {
      console.error(
        `Error ${isEditing ? "updating" : "adding"} course:`,
        error
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const DatePickerComponent = ({
    selected,
    onChange,
    placeholder,
    showPicker,
    setShowPicker,
  }: {
    selected: Date | null;
    onChange: (date: Date) => void;
    placeholder: string;
    showPicker: boolean;
    setShowPicker: (show: boolean) => void;
  }) => (
    <div className="relative w-full sm:w-auto">
      <button
        type="button"
        onClick={() => setShowPicker(!showPicker)}
        className="flex items-center gap-2 px-3 py-2 bg-zinc-800 text-white font-dm rounded-[.25em] hover:bg-zinc-700 transition-colors w-full sm:w-auto"
      >
        <Calendar size={16} />
        {selected ? (
          <span className="text-sm">{format(selected, "MM/dd/yyyy")}</span>
        ) : (
          <span className="text-sm text-gray-400">{placeholder}</span>
        )}
      </button>

      {showPicker && (
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowPicker(false)}
        >
          <div
            className="bg-zinc-800 rounded-[.25em] p-4 border border-zinc-700 shadow-lg max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <style jsx global>{`
              .react-datepicker {
                background-color: #27272a !important;
                border: 1px solid #3f3f46 !important;
                border-radius: 0.25em !important;
                font-family: "DM Sans", sans-serif !important;
              }
              .react-datepicker__header {
                background-color: #1f1f23 !important;
                border-bottom: 1px solid #3f3f46 !important;
                border-radius: 0.25em 0.25em 0 0 !important;
              }
              .react-datepicker__current-month {
                color: white !important;
                font-weight: 600 !important;
                font-size: 0.875rem !important;
              }
              .react-datepicker__day-name {
                color: #a1a1aa !important;
                font-weight: 500 !important;
                font-size: 0.75rem !important;
              }
              .react-datepicker__day {
                color: #e4e4e7 !important;
                background-color: transparent !important;
                border-radius: 0.25em !important;
                transition: all 0.2s !important;
              }
              .react-datepicker__day:hover {
                background-color: #3f3f46 !important;
                color: white !important;
              }
              .react-datepicker__day--selected {
                background-color: white !important;
                color: #27272a !important;
                font-weight: 600 !important;
              }
              .react-datepicker__day--today {
                background-color: #3f3f46 !important;
                color: white !important;
                font-weight: 600 !important;
              }
              .react-datepicker__day--outside-month {
                color: #71717a !important;
              }
              .react-datepicker__navigation {
                background-color: transparent !important;
              }
              .react-datepicker__navigation-icon::before {
                border-color: #a1a1aa !important;
              }
              .react-datepicker__navigation:hover
                .react-datepicker__navigation-icon::before {
                border-color: white !important;
              }
              .react-datepicker__month-container {
                background-color: #27272a !important;
              }
            `}</style>
            <DatePicker
              selected={selected}
              onChange={(date: Date) => {
                onChange(date);
                setShowPicker(false);
              }}
              inline
              calendarClassName="bg-zinc-800 text-white"
            />
          </div>
        </div>
      )}
    </div>
  );

  return (
    <TooltipProvider>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/80" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl transform overflow-hidden rounded-[2em] bg-neutral-900/90 p-4 sm:p-6 text-left align-middle shadow-xl transition-all">
                  <div className="flex items-center justify-between">
                    <Dialog.Title className="text-base sm:text-lg text-white font-nun font-semibold">
                      {isEditing ? "edit course" : "course information"}
                    </Dialog.Title>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <label className="flex h-6 w-6 items-center justify-center rounded-[.25em] text-white hover:bg-gray-600/30 cursor-pointer">
                          <input
                            type="file"
                            accept=".pdf"
                            className="hidden"
                            onChange={(e) =>
                              setPdfFile(
                                e.target.files ? e.target.files[0] : null
                              )
                            }
                          />
                          <Paperclip size={16} />
                        </label>
                      </TooltipTrigger>
                      <TooltipContent
                        side="left"
                        className="bg-zinc-800 text-white/90 rounded-[0.3em] text-xs line-clamp-2 break-words font-dm p-2 mr-1 font-thin"
                      >
                        syllabi entity extraction (beta)
                      </TooltipContent>
                    </Tooltip>
                  </div>

                  <div className="mt-4 space-y-3 sm:space-y-4">
                    <div>
                      <label className="text-sm font-mp text-gray-400">
                        course name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Calculus 1"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full mt-1 p-2 bg-zinc-800 text-white font-dm rounded-[.25em] placeholder:text-gray-500"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-mp text-gray-400">
                        course code <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="APSC 171"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="w-full mt-1 p-2 bg-zinc-800 text-white font-dm rounded-[.25em] placeholder:text-gray-500"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-gray-400">
                        professor name
                      </label>
                      <input
                        type="text"
                        placeholder="........"
                        value={professor}
                        onChange={(e) => setProfessor(e.target.value)}
                        className="w-full mt-1 p-2 bg-zinc-800 text-white font-dm rounded-[.25em] placeholder:text-gray-500"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-gray-400">
                        office hours
                      </label>
                      <input
                        type="text"
                        placeholder="Mon, 2-4pm"
                        value={officeHours}
                        onChange={(e) => setOfficeHours(e.target.value)}
                        className="w-full mt-1 p-2 bg-zinc-800 text-white font-dm rounded-[.25em] placeholder:text-gray-500"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">
                        course type
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {courseTypeOptions.map((option) => (
                          <label
                            key={option}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <input
                              type="radio"
                              name="courseType"
                              value={option}
                              checked={selectedType === option}
                              onChange={(e) =>
                                setSelectedType(e.target.value as CourseType)
                              }
                              className="w-4 h-4 text-white bg-zinc-800 border-gray-600 focus:ring-white focus:ring-2"
                            />
                            <span className="text-sm text-gray-300 font-dm">
                              {courseTypeLabels[option]}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm text-gray-400">
                        description
                      </label>
                      <textarea
                        placeholder="introduction to foundational topics in calculus"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full mt-1 p-2 bg-zinc-800 text-white font-dm rounded-[.25em] placeholder:text-gray-500 min-h-[80px]"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                        <DatePickerComponent
                          selected={endDate}
                          onChange={setEndDate}
                          placeholder="select end date"
                          showPicker={showDatePicker}
                          setShowPicker={setShowDatePicker}
                        />

                        <DatePickerComponent
                          selected={midtermDate}
                          onChange={setMidtermDate}
                          placeholder="select midterm date"
                          showPicker={showMidtermPicker}
                          setShowPicker={setShowMidtermPicker}
                        />

                        <DatePickerComponent
                          selected={finalExamDate}
                          onChange={setFinalExamDate}
                          placeholder="select final exam date"
                          showPicker={showFinalExamPicker}
                          setShowPicker={setShowFinalExamPicker}
                        />
                      </div>

                      <div className="flex justify-start">
                        <div className="relative w-full sm:w-auto">
                          <button
                            type="button"
                            onClick={() => setShowColorPicker(!showColorPicker)}
                            className="flex items-center gap-2 px-3 py-2 bg-zinc-800 text-white font-dm rounded-[.25em] hover:bg-zinc-700 transition-colors w-full sm:w-auto"
                          >
                            <Palette size={16} />
                            <span
                              className="w-4 h-4 rounded-sm border border-gray-600"
                              style={{ backgroundColor: color }}
                            />
                          </button>

                          {showColorPicker && (
                            <div
                              className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 p-4"
                              onClick={() => setShowColorPicker(false)}
                            >
                              <div
                                className="bg-zinc-800 rounded-[.25em] p-4 border border-zinc-700 shadow-lg max-w-sm w-full"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <div className="space-y-4">
                                  <h3 className="text-white font-dm text-sm mb-3">
                                    choose a color
                                  </h3>
                                  <div className="grid grid-cols-4 gap-3">
                                    {colorPalette.map((paletteColor) => (
                                      <button
                                        key={paletteColor}
                                        onClick={() => {
                                          setColor(paletteColor);
                                          setShowColorPicker(false);
                                        }}
                                        className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
                                          color === paletteColor
                                            ? "border-white ring-2 ring-white/50"
                                            : "border-gray-600"
                                        }`}
                                        style={{
                                          backgroundColor: paletteColor,
                                        }}
                                      />
                                    ))}
                                  </div>
                                  <div className="pt-2 border-t border-zinc-700">
                                    <label className="text-white text-xs font-dm block mb-2">
                                      custom color
                                    </label>
                                    <input
                                      type="color"
                                      value={color}
                                      onChange={(e) => setColor(e.target.value)}
                                      className="w-full h-8 bg-transparent border border-gray-600 rounded cursor-pointer"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end mt-4">
                      <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="px-4 py-1 bg-white hover:bg-gray-100 disabled:bg-gray-300 disabled:cursor-not-allowed text-zinc-800 rounded-[.25em] font-dm text-sm transition-all duration-200 hover:scale-105 hover:shadow-md"
                      >
                        {isSubmitting
                          ? isEditing
                            ? "updating..."
                            : "adding..."
                          : isEditing
                          ? "update course"
                          : "add course"}
                      </button>
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
