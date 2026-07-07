import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import {
  Gauge, GraduationCap, Article, Chat, UsersThree, ProjectorScreen, Calendar,
  Briefcase, House, Gear, UserList, SignOut, List, X,
} from "@phosphor-icons/react";

const NAV = [
  { to: "dashboard", label: "Dashboard", Icon: Gauge },
  { to: "leads", label: "Leads", Icon: UserList },
  { to: "courses", label: "Courses", Icon: GraduationCap },
  { to: "blogs", label: "Blogs", Icon: Article },
  { to: "testimonials", label: "Testimonials", Icon: Chat },
  { to: "team", label: "Team", Icon: UsersThree },
  { to: "projects", label: "Projects", Icon: ProjectorScreen },
  { to: "events", label: "Events", Icon: Calendar },
  { to: "internships", label: "Internships", Icon: Briefcase },
  { to: "homepage", label: "Homepage", Icon: House },
  { to: "settings", label: "Settings", Icon: Gear },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const loc = useLocation();
  const current = NAV.find((n) => loc.pathname.includes(n.to));

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex">
      {/* Sidebar */}
      <aside className={`fixed lg:static z-40 inset-y-0 left-0 w-[250px] bg-[#0b0b0d] border-r border-[#1f1f22] flex flex-col transition-transform ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="px-5 py-5 flex items-center gap-2 border-b border-[#1f1f22]">
          <div className="w-8 h-8 rounded-lg bg-brand-gradient flex items-center justify-center text-white font-heading font-bold">B</div>
          <div>
            <div className="font-heading font-bold text-sm">Brevitus</div>
            <div className="text-[10px] uppercase tracking-widest text-zinc-500">Admin</div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-1 admin-scrollbar" data-testid="admin-nav">
          {NAV.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              data-testid={`nav-${to}`}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-zinc-400 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-[#1f1f22]">
          <div className="px-3 pb-2 text-xs text-zinc-500">Signed in as</div>
          <div className="px-3 pb-3 text-sm font-medium">{user?.username || "admin"}</div>
          <button
            onClick={logout}
            data-testid="logout-btn"
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-300 hover:bg-red-500/10"
          >
            <SignOut size={16} /> Log out
          </button>
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-0">
        <header className="sticky top-0 z-30 bg-[#09090b]/90 backdrop-blur border-b border-[#1f1f22]">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => setOpen((v) => !v)} className="lg:hidden p-2 -ml-2" data-testid="admin-menu-btn">
                {open ? <X size={20} /> : <List size={20} />}
              </button>
              <div>
                <div className="text-xs uppercase tracking-widest text-zinc-500">Brevitus Admin</div>
                <div className="font-heading text-xl">{current?.label || "Admin"}</div>
              </div>
            </div>
            <a href="/" target="_blank" rel="noopener noreferrer" data-testid="view-site" className="text-xs text-zinc-400 hover:text-white">
              View site ↗
            </a>
          </div>
        </header>

        <main className="p-6 flex-1 admin-scrollbar overflow-x-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
