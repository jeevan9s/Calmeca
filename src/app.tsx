import { Routes, Route } from 'react-router-dom';
import Landing from './renderer/pages/landing/page';
import Dashboard from './renderer/pages/dashboard/page';
import CourseOverviewPage from './renderer/pages/course_overview/page';
import CourseHomepageWrapper from './renderer/components/Courses/CourseHomepageWrapper';
import "@/renderer/styles/App.css";

export default function App() {
  return (
    <div className="w-full h-full">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<CourseOverviewPage />} />
        <Route path="/courses/:courseId" element={<CourseHomepageWrapper />} />
      </Routes>
    </div>
  );
}
