import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from '../components/LoadingState';

export default function DashboardLayout() {
  const { isAuthenticated, loading } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-bg dark:bg-dark-bg flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <LoadingSpinner size="lg" />
          <p className="text-xs font-semibold text-brand-text-secondary dark:text-dark-muted font-mono tracking-wider">
            MEMUAT CODEFORGE...
          </p>
        </div>
      </div>
    );
  }

  // Route protection: redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-brand-bg dark:bg-dark-bg transition-colors">
      {/* Sidebar */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Content Area */}
      <div
        className={`flex flex-col min-h-screen transition-all duration-300 ${
          collapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        <Navbar onMenuClick={() => setMobileOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>

        <footer className="py-4 px-6 border-t border-brand-border dark:border-dark-border text-center text-xs text-brand-text-secondary dark:text-dark-muted">
          <p>© {new Date().getFullYear()} CODEFORGE – AI-Powered Coding Tools Platform. Built with React & Anthropic API.</p>
        </footer>
      </div>
    </div>
  );
}
