import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "sonner";
import { AuthProvider, useAuth } from "@/lib/auth";
import PublicLayout from "@/components/PublicLayout";
import AdminLayout from "@/components/AdminLayout";
import { Analytics } from "@vercel/analytics/react";

import Home from "@/pages/Home";
import Courses from "@/pages/Courses";
import CourseDetail from "@/pages/CourseDetail";
import Blogs from "@/pages/Blogs";
import BlogDetail from "@/pages/BlogDetail";
import About from "@/pages/About";
import Team from "@/pages/Team";
import Founder from "@/pages/Founder";
import Contact from "@/pages/Contact";
import Admission from "@/pages/Admission";
import SuccessStories from "@/pages/SuccessStories";
import Events from "@/pages/Events";
import Internships from "@/pages/Internships";
import NotFound from "@/pages/NotFound";

import AdminLogin from "@/pages/admin/Login";
import Dashboard from "@/pages/admin/Dashboard";
import CoursesAdmin from "@/pages/admin/CoursesAdmin";
import BlogsAdmin from "@/pages/admin/BlogsAdmin";
import TestimonialsAdmin from "@/pages/admin/TestimonialsAdmin";
import TeamAdmin from "@/pages/admin/TeamAdmin";
import ProjectsAdmin from "@/pages/admin/ProjectsAdmin";
import EventsAdmin from "@/pages/admin/EventsAdmin";
import InternshipsAdmin from "@/pages/admin/InternshipsAdmin";
import HomepageAdmin from "@/pages/admin/HomepageAdmin";
import SettingsAdmin from "@/pages/admin/SettingsAdmin";
import LeadsAdmin from "@/pages/admin/LeadsAdmin";

function Protected({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-400">Loading…</div>;
  if (!user) return <Navigate to="/admin/login" replace />;
  return children;
}

export default function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <BrowserRouter>
          <Toaster position="top-right" richColors />
          <Routes>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/courses/:slug" element={<CourseDetail />} />
              <Route path="/blog" element={<Blogs />} />
              <Route path="/blog/:slug" element={<BlogDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/team" element={<Team />} />
              <Route path="/founder" element={<Founder />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/admission" element={<Admission />} />
              <Route path="/success-stories" element={<SuccessStories />} />
              <Route path="/events" element={<Events />} />
              <Route path="/internships" element={<Internships />} />
            </Route>

            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<Protected><AdminLayout /></Protected>}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="courses" element={<CoursesAdmin />} />
              <Route path="blogs" element={<BlogsAdmin />} />
              <Route path="testimonials" element={<TestimonialsAdmin />} />
              <Route path="team" element={<TeamAdmin />} />
              <Route path="projects" element={<ProjectsAdmin />} />
              <Route path="events" element={<EventsAdmin />} />
              <Route path="internships" element={<InternshipsAdmin />} />
              <Route path="homepage" element={<HomepageAdmin />} />
              <Route path="settings" element={<SettingsAdmin />} />
              <Route path="leads" element={<LeadsAdmin />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
          <Analytics />
        </BrowserRouter>
      </AuthProvider>
    </HelmetProvider>
  );
}

