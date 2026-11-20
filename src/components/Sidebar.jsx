import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Wrench,
  GraduationCap,
  BookOpen,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Terminal,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen
}) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navLinksMain = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'AI Tools', path: '/tools', icon: Wrench },
    { name: 'Tutorials', path: '/tutorials', icon: BookOpen },
    { name: 'Courses', path: '/courses', icon: GraduationCap }
  ];

  const navLinksPersonal = [
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Settings', path: '/settings', icon: Settings }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-brand-dark/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col justify-between bg-brand-dark border-r border-[#1A4532] text-white transition-all duration-300 ease-in-out
          ${collapsed ? 'w-20' : 'w-64'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Top: Logo & Collapse Button */}
        <div>
          <div className="flex items-center justify-between h-16 px-4 border-b border-[#1A4532]">
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-secondary to-[#123D2A] border border-brand-accent/40 flex items-center justify-center flex-shrink-0 shadow-glow">
                <Terminal className="w-5 h-5 text-brand-accent" />
              </div>
              {!collapsed && (
                <div className="flex flex-col">
                  <div className="flex items-center space-x-1.5">
                    <span className="font-extrabold tracking-tight text-lg text-white">
                      CODE<span className="text-brand-accent">FORGE</span>
                    </span>
                    <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-brand-accent/20 text-brand-accent rounded">
                      MVP
                    </span>
                  </div>
                  <span className="text-[10px] text-brand-accent/70 font-mono tracking-wider">
                    AI CODING PLATFORM
                  </span>
                </div>
              )}
            </div>

            {/* Collapse toggle (desktop only) */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex w-7 h-7 rounded-lg bg-[#102E20] hover:bg-[#1A4532] text-brand-light items-center justify-center transition-colors"
              title={collapsed ? 'Perluas sidebar' : 'Ciutkan sidebar'}
            >
              {collapsed ? (
                <ChevronRight className="w-4 h-4 text-brand-accent" />
              ) : (
                <ChevronLeft className="w-4 h-4 text-brand-accent" />
              )}
            </button>
          </div>

          {/* Navigation Links */}
          <div className="py-6 px-3 space-y-6 overflow-y-auto max-h-[calc(100vh-180px)]">
            {/* MAIN GROUP */}
            <div>
              {!collapsed && (
                <p className="px-3 mb-2 text-[10px] font-bold tracking-widest text-brand-accent/60 uppercase">
                  Main
                </p>
              )}
              <nav className="space-y-1">
                {navLinksMain.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center px-3 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                          isActive
                            ? 'bg-brand-secondary text-white font-semibold shadow-subtle border-l-4 border-brand-accent'
                            : 'text-brand-light/70 hover:bg-[#102E20] hover:text-white'
                        }`
                      }
                      title={collapsed ? item.name : undefined}
                    >
                      <Icon
                        className={`w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110 ${
                          collapsed ? 'mx-auto' : 'mr-3'
                        }`}
                      />
                      {!collapsed && <span>{item.name}</span>}
                    </NavLink>
                  );
                })}
              </nav>
            </div>

            {/* PERSONAL GROUP */}
            <div>
              {!collapsed && (
                <p className="px-3 mb-2 text-[10px] font-bold tracking-widest text-brand-accent/60 uppercase">
                  Personal
                </p>
              )}
              <nav className="space-y-1">
                {navLinksPersonal.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center px-3 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                          isActive
                            ? 'bg-brand-secondary text-white font-semibold shadow-subtle border-l-4 border-brand-accent'
                            : 'text-brand-light/70 hover:bg-[#102E20] hover:text-white'
                        }`
                      }
                      title={collapsed ? item.name : undefined}
                    >
                      <Icon
                        className={`w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110 ${
                          collapsed ? 'mx-auto' : 'mr-3'
                        }`}
                      />
                      {!collapsed && <span>{item.name}</span>}
                    </NavLink>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>

        {/* Bottom Section: User Profile & Logout */}
        <div className="p-3 border-t border-[#1A4532] bg-[#081B13]">
          {!collapsed ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 overflow-hidden">
                <img
                  src={
                    user?.profile_picture ||
                    `https://api.dicebear.com/7.x/identicon/svg?seed=${user?.username || 'user'}`
                  }
                  alt={user?.username || 'Avatar'}
                  className="w-9 h-9 rounded-full bg-brand-secondary border border-brand-accent/30 object-cover flex-shrink-0"
                />
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-white truncate">
                    {user?.full_name || 'Pengguna'}
                  </p>
                  <p className="text-[11px] text-brand-accent/80 truncate">
                    @{user?.username || 'user'}
                  </p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="p-2 text-brand-light/70 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-colors"
                title="Keluar dari akun"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-2">
              <img
                src={
                  user?.profile_picture ||
                  `https://api.dicebear.com/7.x/identicon/svg?seed=${user?.username || 'user'}`
                }
                alt={user?.username || 'Avatar'}
                className="w-9 h-9 rounded-full bg-brand-secondary border border-brand-accent/30 object-cover"
                title={user?.full_name || 'User'}
              />
              <button
                onClick={handleLogout}
                className="p-2 text-brand-light/70 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
