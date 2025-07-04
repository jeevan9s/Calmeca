import { Routes, Route } from 'react-router-dom';
import Landing from './renderer/pages/landing/page';
import Dashboard from './renderer/pages/dashboard/page';
import GoogleTest from './renderer/pages/test/page';
import "@/renderer/styles/App.css"


export default function App() {
  return (
    <div className="w-full h-full">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<GoogleTest />} />
      </Routes>
    </div>
  );
}
