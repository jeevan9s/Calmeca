"use client";

import { useState, useEffect } from "react";
import { Course } from "@/services/db";
import CourseCard from "@/renderer/components/Courses/CourseCard";
import AddCourseDialog from "@/renderer/components/Courses/AddCourseDialog";
import { Plus, List, Grid, BookOpen } from "react-feather";
import Layout from "@/renderer/components/Layout";
import { getAllCourses, deleteCourse } from "@/services/core services/courseService";
import { Input } from "@/components/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/select";
import { toast } from "sonner";

export default function CourseOverviewPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const allCourses = await getAllCourses();
        setCourses(allCourses);
      } catch {
        toast.error("Error loading courses");
      } finally {
        setIsLoading(false);
      }
    };
    loadCourses();
  }, []);

  const handleAddCourse = (newCourse: Course) => {
    setCourses(prev => [...prev, newCourse]);
    setIsDialogOpen(false);
    toast.success(`${newCourse.title} was added successfully`);
  };

  const handleUpdateCourse = (updatedCourse: Course) => {
    setCourses(prev => prev.map(c => (c.id === updatedCourse.id ? updatedCourse : c)));
    setEditingCourse(null);
    setIsDialogOpen(false);
    toast.success(`${updatedCourse.title} was updated`);
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setIsDialogOpen(true);
  };

  const handleDeleteCourse = async (courseId: string) => {
    try {
      await deleteCourse(courseId);
      setCourses(prev => prev.filter(c => c.id !== courseId));
      toast.success("Course deleted");
    } catch {
      toast.error("Error deleting course");
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingCourse(null);
  };

  const handleAddCourseClick = () => {
    setEditingCourse(null);
    setIsDialogOpen(true);
  };

  const filteredCourses = courses
    .filter(c => c.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === "alpha") return a.title.localeCompare(b.title);
      if (sort === "newest") return new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime();
      if (sort === "oldest") return new Date(a.createdOn).getTime() - new Date(b.createdOn).getTime();
      return 0;
    });

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-zinc-950/90 text-white">
        <Layout>
          <div className="px-4 flex flex-col gap-y-1 mb-3">
            <h1 className="font-nun font-bold text-2xl sm:text-3xl lg:text-4xl">course overview</h1>
            <h2 className="font-dm text-neutral-400 text-sm">view, edit, & add courses</h2>
          </div>
          <div className="flex items-center justify-center h-64">
            <p className="text-neutral-400">loading courses...</p>
          </div>
        </Layout>
      </div>
    );
  }

  const btnClass =
    "flex items-center gap-2 bg-zinc-800 rounded-xl text-white font-dm h-10 transition-transform duration-200 ease-in-out hover:scale-105 hover:shadow-lg hover:bg-zinc-700 hover:text-white focus:ring-2 focus:ring-zinc-500 focus:ring-opacity-50 active:scale-95 px-2";

  return (
    <div className="min-h-screen w-full bg-zinc-950/90 text-white">
      <Layout>
        <div className="px-4 flex flex-col gap-y-1 mb-3">
          <h1 className="font-nun font-bold text-2xl sm:text-3xl lg:text-4xl">courses overview</h1>
          <h2 className="font-dm text-neutral-400 text-sm">view, edit, & add courses</h2>
        </div>

        <div className="px-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
            <Input
              placeholder="search courses..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className= "w-full sm:w-64 flex items-center gap-2 bg-zinc-800 rounded-xl text-white font-dm h-10 border-none outline-none transition-transform duration-200 ease-in-out focus:ring-2 focus:ring-zinc-500 focus:ring-opacity-50 active:scale-95 px-2"
            />
            <Select onValueChange={setSort}>
              <SelectTrigger className={btnClass + " w-32"}>
                <SelectValue placeholder="sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="alpha">alphabetical</SelectItem>
                <SelectItem value="newest">newest</SelectItem>
                <SelectItem value="oldest">oldest</SelectItem>
              </SelectContent>
            </Select>
          </div>

<div className="flex flex-row items-center gap-4">
  <button onClick={handleAddCourseClick} className={btnClass + " mr-6 px-5"}>
    <Plus size={16} /> add course
  </button>

  <div className="flex items-center gap-2">
    <button onClick={() => setViewMode("grid")} className={btnClass}>
      <Grid size={18} />
    </button>
    <button onClick={() => setViewMode("list")} className={btnClass}>
      <List size={18} />
    </button>
  </div>
</div>

        </div>

        {filteredCourses.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-20 text-neutral-400">
            <BookOpen className="w-10 h-10 mb-2 opacity-70" />
            <p className="text-sm">no courses found</p>
          </div>
        ) : viewMode === "grid" ? (
<div className="px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-min">
  {filteredCourses.map(course => (
    <div key={course.id} className="mt-4 ml-4">
      <CourseCard
        course={course}
        onEdit={handleEditCourse}
        onDelete={handleDeleteCourse}
        onArchive={() => {
          toast.info("Archive feature not implemented yet");
        }}
      />
    </div>
  ))}
</div>

        ) : (
          <div className="px-4 flex flex-col divide-y divide-zinc-800 rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900/60">
            {filteredCourses.map(course => (
              <div key={course.id} className="flex items-center justify-between px-4 py-3 hover:bg-zinc-800/70 transition">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <p className="font-medium">{course.title}</p>
                  <p className="text-neutral-400 text-sm">{course.code}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEditCourse(course)} className={btnClass + " text-sm"}>
                    edit
                  </button>
                  <button onClick={() => handleDeleteCourse(course.id)} className={btnClass + " text-sm text-red-400 hover:text-red-300"}>
                    delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <AddCourseDialog
          isOpen={isDialogOpen}
          onAddCourse={handleAddCourse}
          onUpdateCourse={handleUpdateCourse}
          onClose={handleCloseDialog}
          existingCourse={editingCourse}
        />
      </Layout>
    </div>
  );
}
