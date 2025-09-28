
"use client";

import { useState, useEffect } from "react";
import { Course } from "@/services/db";
import CourseCard from "@/renderer/components/Courses/CourseCard";
import AddCourseDialog from "@/renderer/components/Courses/AddCourseDialog";
import { Plus } from "react-feather";
import Layout from "@/renderer/components/Layout";
import { getAllCourses, deleteCourse } from "@/services/core services/courseService";

export default function CourseOverviewPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const allCourses = await getAllCourses();
        setCourses(allCourses);
      } catch (error) {
        console.error("Error loading courses:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCourses();
  }, []);

  const handleAddCourse = (newCourse: Course) => {
    setCourses(prev => [...prev, newCourse]);
    setIsDialogOpen(false);
  };

  const handleUpdateCourse = (updatedCourse: Course) => {
    setCourses(prev => 
      prev.map(course => 
        course.id === updatedCourse.id ? updatedCourse : course
      )
    );
    setEditingCourse(null);
    setIsDialogOpen(false);
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setIsDialogOpen(true);
  };

  const handleDeleteCourse = async (courseId: string) => {
    try {
      await deleteCourse(courseId);
      setCourses(prev => prev.filter(course => course.id !== courseId));
    } catch (error) {
      console.error("Error deleting course:", error);
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

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-zinc-950/90 text-white">
        <Layout>
          <div className="ml-3 flex flex-col gap-y-1 mb-3">
            <h1 className="font-nun font-bold text-2xl sm:text-3xl lg:text-4xl">course overview</h1>
            <h2 className="font-dm text-neutral-400 text-sm">view, edit, & add courses</h2>
          </div>
          <div className="ml-3 flex items-center justify-center h-64">
            <p className="text-neutral-400">loading courses...</p>
          </div>
        </Layout>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-zinc-950/90 text-white">
      <Layout>
        <div className="ml-3 flex flex-col gap-y-1 mb-3">
          <h1 className="font-nun font-bold text-2xl sm:text-3xl lg:text-4xl">courses overview</h1>
          <h2 className="font-dm text-neutral-400 text-sm">view, edit, & add courses</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-min ml-3">
          <div 
            className="flex flex-col items-center justify-center border-2 border-dashed border-neutral-600 rounded-xl p-3  w-80 cursor-pointer hover:border-white transition"
            onClick={handleAddCourseClick}
          >
            <Plus size={24} />
            <p className="mt-2 text-sm text-neutral-400">add a course</p>
          </div>

          {courses.map((course) => (
            <CourseCard 
              key={course.id} 
              course={course} 
              onEdit={handleEditCourse}
              onDelete={handleDeleteCourse}
            />
          ))}
        </div>

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
