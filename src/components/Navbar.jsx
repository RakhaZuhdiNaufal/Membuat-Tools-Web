import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
  Menu,
  Sun,
  Moon,
  Bell,
  Cloud,
  CheckCircle2,
  HardDrive,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Search
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getAnthropicKey } from '../services/api';

export default function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const hasApiKey = !!getAnthropicKey();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.startsWith('/dashboard')) return 'Dashboard Overview';
    if (path.startsWith('/tools/chat-prompt')) return 'AI Prompt Chat';
    if (path.startsWith('/tools/code-preview')) return 'React Component & Live Preview';
    if (path.startsWith('/tools/react-native')) return 'React Native Mobile Studio';
    if (path.startsWith('/tools/php-studio')) return 'React to PHP REST API Studio';
    if (path.startsWith('/tools/image-generator')) return 'AI Image Generator';
    if (path.startsWith('/tools/video-generator')) return 'AI Video Studio';
    if (path.startsWith('/tools')) return 'AI Generative Tools Hub';
    if (path.startsWith('/tutorials')) return 'Learning & Tutorials';
    if (path.startsWith('/courses')) return 'Interactive Courses';
    if (path.startsWith('/profile')) return 'User Profile';
    if (path.startsWith('/settings')) return 'Preferences & Settings';
    return 'CODEFORGE';
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 dark:bg-dark-surface/90 backdrop-blur-md border-b border-brand-border dark:border-dark-border px-4 sm:px-6 flex items-center justify-between transition-colors">
      {/* Left: Mobile trigger & Page Title */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 text-brand-text-secondary hover:text-brand-text-primary dark:text-dark-muted dark:hover:text-dark-text rounded-xl hover:bg-brand-light dark:hover:bg-dark-card transition-colors"
          title="Buka menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-bold text-brand-text-primary dark:text-dark-text tracking-tight">
            {getPageTitle()}
          </h1>
        </div>
      </div>

      {/* Right: Actions, Backend status, Theme, Notifications, User */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Backend Connection Indicator */}
        <Link
          to="/settings"
          className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors bg-brand-light/60 dark:bg-dark-card border-brand-border dark:border-dark-border text-brand-secondary dark:text-brand-accent hover:border-brand-accent"
          title={
            hasApiKey
              ? 'Terhubung langsung dengan Anthropic Claude API'
              : 'Mode Local Engine Aktif (Klik untuk masukkan API Key Anthropic)'
          }
        >
          {hasApiKey ? (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <Cloud className="w-3.5 h-3.5 text-emerald-600 dark:text-brand-accent" />
              <span>Claude API Direct</span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              <HardDrive className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Local Engine (Offline)</span>
            </>
          )}
        </Link>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-brand-text-secondary dark:text-dark-muted hover:text-brand-primary dark:hover:text-brand-accent hover:bg-brand-light dark:hover:bg-dark-card transition-colors"
          title={`Ubah ke ${theme === 'light' ? 'Dark Mode' : 'Light Mode'}`}
        >
          {theme === 'light' ? (
            <Moon className="w-4 h-4 text-brand-secondary" />
          ) : (
            <Sun className="w-4 h-4 text-brand-accent" />
          )}
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 rounded-xl text-brand-text-secondary dark:text-dark-muted hover:text-brand-primary dark:hover:text-brand-accent hover:bg-brand-light dark:hover:bg-dark-card transition-colors relative"
            title="Notifikasi"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-accent ring-2 ring-white dark:ring-dark-surface"></span>
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white dark:bg-dark-surface rounded-2xl shadow-elevated border border-brand-border dark:border-dark-border py-2 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-4 py-2 border-b border-brand-border dark:border-dark-border flex items-center justify-between">
                <span className="text-xs font-bold text-brand-text-primary dark:text-dark-text">
                  Notifikasi
                </span>
                <span className="text-[10px] text-brand-accent font-medium">1 Baru</span>
              </div>
              <div className="p-3 text-xs space-y-2">
                <div className="p-2.5 rounded-xl bg-brand-light/50 dark:bg-dark-card/50 border border-brand-border/50 dark:border-dark-border/50">
                  <p className="font-semibold text-brand-primary dark:text-brand-accent">
                    Selamat datang di CODEFORGE!
                  </p>
                  <p className="text-[11px] text-brand-text-secondary dark:text-dark-muted mt-0.5">
                    Mulai gunakan AI Coding Tools atau asah keahlian di menu Interactive Courses.
                  </p>
                  <span className="text-[9px] text-brand-text-secondary/60 dark:text-dark-muted/60 block mt-1">
                    Baru saja
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-brand-light dark:hover:bg-dark-card transition-colors"
          >
            <img
              src={
                user?.profile_picture ||
                `https://api.dicebear.com/7.x/identicon/svg?seed=${user?.username || 'user'}`
              }
              alt={user?.username || 'Avatar'}
              className="w-8 h-8 rounded-full bg-brand-light border border-brand-accent/40 object-cover"
            />
            <span className="text-xs font-semibold text-brand-text-primary dark:text-dark-text hidden md:inline">
              {user?.username || 'Akun'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-brand-text-secondary dark:text-dark-muted hidden md:inline" />
          </button>

          {dropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-52 bg-white dark:bg-dark-surface rounded-2xl shadow-elevated border border-brand-border dark:border-dark-border py-2 z-50 animate-in fade-in slide-in-from-top-2"
              onClick={() => setDropdownOpen(false)}
            >
              <div className="px-4 py-2 border-b border-brand-border dark:border-dark-border">
                <p className="text-xs font-bold text-brand-text-primary dark:text-dark-text truncate">
                  {user?.full_name || 'Pengguna'}
                </p>
                <p className="text-[11px] text-brand-text-secondary dark:text-dark-muted truncate">
                  {user?.email}
                </p>
              </div>

              <div className="py-1 text-xs">
                <Link
                  to="/profile"
                  className="flex items-center px-4 py-2 text-brand-text-primary dark:text-dark-text hover:bg-brand-light dark:hover:bg-dark-card transition-colors"
                >
                  <User className="w-4 h-4 mr-2.5 text-brand-secondary dark:text-brand-accent" />
                  <span>Profil Pengguna</span>
                </Link>
                <Link
                  to="/settings"
                  className="flex items-center px-4 py-2 text-brand-text-primary dark:text-dark-text hover:bg-brand-light dark:hover:bg-dark-card transition-colors"
                >
                  <Settings className="w-4 h-4 mr-2.5 text-brand-secondary dark:text-brand-accent" />
                  <span>Pengaturan</span>
                </Link>
              </div>

              <div className="pt-1 border-t border-brand-border dark:border-dark-border">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-2.5" />
                  <span>Keluar</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
