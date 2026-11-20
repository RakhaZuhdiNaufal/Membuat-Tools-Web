import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Calendar,
  Lock,
  Save,
  CheckCircle,
  AlertCircle,
  Zap,
  GraduationCap,
  Sparkles,
  Camera,
  AtSign
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { LoadingSpinner } from '../components/LoadingState';

export default function Profile() {
  const { user, updateProfile, changePassword } = useAuth();

  // Profile fields state
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [username, setUsername] = useState(user?.username || '');
  const [profilePicture, setProfilePicture] = useState(user?.profile_picture || '');

  // Password fields state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Status feedback state
  const [profileStatus, setProfileStatus] = useState(null); // { type: 'success' | 'error', message: '' }
  const [passwordStatus, setPasswordStatus] = useState(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  // User stats
  const [stats, setStats] = useState({
    total_ai_requests: 0,
    courses_completed: 0,
    learning_progress: 0
  });

  useEffect(() => {
    if (user) {
      setFullName(user.full_name || '');
      setUsername(user.username || '');
      setProfilePicture(
        user.profile_picture ||
          `https://api.dicebear.com/7.x/identicon/svg?seed=${user.username || 'user'}`
      );

      // Load stats
      api.getDashboardStats(user.id).then((res) => {
        if (res.status === 'success' && res.stats) {
          setStats(res.stats);
        }
      });
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileStatus(null);
    setSavingProfile(true);

    const result = await updateProfile({
      full_name: fullName,
      username,
      profile_picture: profilePicture
    });

    setSavingProfile(false);
    if (result.success) {
      setProfileStatus({ type: 'success', message: 'Profil Anda berhasil diperbarui!' });
    } else {
      setProfileStatus({ type: 'error', message: result.message || 'Gagal memperbarui profil.' });
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordStatus(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordStatus({ type: 'error', message: 'Semua kolom password wajib diisi.' });
      return;
    }

    if (newPassword.length < 6) {
      setPasswordStatus({ type: 'error', message: 'Password baru minimal 6 karakter.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordStatus({ type: 'error', message: 'Konfirmasi password baru tidak cocok.' });
      return;
    }

    setSavingPassword(true);
    const result = await changePassword(currentPassword, newPassword);
    setSavingPassword(false);

    if (result.success) {
      setPasswordStatus({ type: 'success', message: 'Password berhasil diubah.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setPasswordStatus({ type: 'error', message: result.message || 'Gagal mengubah password.' });
    }
  };

  const handleRegenerateAvatar = () => {
    const randomSeed = Math.random().toString(36).substring(7);
    setProfilePicture(`https://api.dicebear.com/7.x/identicon/svg?seed=${randomSeed}`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-brand-dark to-brand-primary rounded-3xl p-6 sm:p-8 text-white shadow-card">
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <div className="relative group">
            <img
              src={profilePicture}
              alt={username}
              className="w-24 h-24 rounded-3xl border-2 border-brand-accent shadow-elevated object-cover bg-brand-dark"
            />
            <button
              onClick={handleRegenerateAvatar}
              className="absolute -bottom-2 -right-2 p-2 bg-brand-accent text-brand-dark hover:bg-emerald-400 rounded-xl shadow-md transition-transform hover:scale-105"
              title="Ganti avatar acak"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-black tracking-tight">{user?.full_name || 'Pengguna'}</h1>
            <p className="text-xs text-brand-accent font-mono mt-0.5">@{user?.username || 'user'}</p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-3 text-xs text-brand-light/80">
              <span className="flex items-center space-x-1">
                <Mail className="w-3.5 h-3.5 text-brand-accent" />
                <span>{user?.email}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-brand-accent" />
                <span>
                  Bergabung sejak{' '}
                  {user?.created_at
                    ? new Date(user.created_at).toLocaleDateString('id-ID', {
                        month: 'long',
                        year: 'numeric'
                      })
                    : '2026'}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* User Statistics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-dark-surface p-5 rounded-2xl border border-brand-border dark:border-dark-border shadow-subtle flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-brand-light dark:bg-dark-card flex items-center justify-center text-brand-primary dark:text-brand-accent">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-brand-text-secondary dark:text-dark-muted font-semibold uppercase tracking-wider block">
              Total AI Requests
            </span>
            <span className="text-2xl font-black text-brand-text-primary dark:text-dark-text">
              {stats.total_ai_requests}
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-surface p-5 rounded-2xl border border-brand-border dark:border-dark-border shadow-subtle flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-brand-light dark:bg-dark-card flex items-center justify-center text-brand-primary dark:text-brand-accent">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-brand-text-secondary dark:text-dark-muted font-semibold uppercase tracking-wider block">
              Courses Completed
            </span>
            <span className="text-2xl font-black text-brand-text-primary dark:text-dark-text">
              {stats.courses_completed}
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-surface p-5 rounded-2xl border border-brand-border dark:border-dark-border shadow-subtle flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-brand-light dark:bg-dark-card flex items-center justify-center text-brand-primary dark:text-brand-accent">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-brand-text-secondary dark:text-dark-muted font-semibold uppercase tracking-wider block">
              Learning Progress
            </span>
            <span className="text-2xl font-black text-brand-text-primary dark:text-dark-text">
              {stats.learning_progress}%
            </span>
          </div>
        </div>
      </div>

      {/* Profile & Security Forms */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form 1: Edit Profile */}
        <div className="bg-white dark:bg-dark-surface p-6 sm:p-8 rounded-3xl border border-brand-border dark:border-dark-border shadow-subtle">
          <h2 className="text-base font-bold text-brand-text-primary dark:text-dark-text mb-4 flex items-center space-x-2">
            <User className="w-4 h-4 text-brand-secondary dark:text-brand-accent" />
            <span>Edit Profile</span>
          </h2>

          {profileStatus && (
            <div
              className={`mb-4 p-3 rounded-xl text-xs flex items-center space-x-2 ${
                profileStatus.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                  : 'bg-red-50 text-red-800 dark:bg-red-950/30 dark:text-red-300 border border-red-200 dark:border-red-800'
              }`}
            >
              {profileStatus.type === 'success' ? (
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
              )}
              <span>{profileStatus.message}</span>
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-brand-text-primary dark:text-dark-text mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-brand-bg/50 dark:bg-dark-card border border-brand-border dark:border-dark-border rounded-xl text-brand-text-primary dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-brand-accent"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-text-primary dark:text-dark-text mb-1.5">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                className="w-full px-3.5 py-2.5 text-xs bg-brand-bg/50 dark:bg-dark-card border border-brand-border dark:border-dark-border rounded-xl text-brand-text-primary dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-brand-accent"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-text-primary dark:text-dark-text mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-3.5 py-2.5 text-xs bg-gray-100 dark:bg-dark-card/50 border border-brand-border dark:border-dark-border rounded-xl text-gray-500 cursor-not-allowed"
              />
              <p className="text-[11px] text-brand-text-secondary dark:text-dark-muted mt-1">
                Email digunakan sebagai identifier akun dan tidak dapat diubah langsung.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={savingProfile}
                className="px-5 py-2.5 bg-brand-primary hover:bg-brand-secondary text-white text-xs font-bold rounded-xl shadow-sm transition-all active:scale-95 disabled:opacity-50 flex items-center space-x-2"
              >
                {savingProfile ? (
                  <LoadingSpinner size="sm" className="text-white" />
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Profile Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Form 2: Change Password */}
        <div className="bg-white dark:bg-dark-surface p-6 sm:p-8 rounded-3xl border border-brand-border dark:border-dark-border shadow-subtle">
          <h2 className="text-base font-bold text-brand-text-primary dark:text-dark-text mb-4 flex items-center space-x-2">
            <Lock className="w-4 h-4 text-brand-secondary dark:text-brand-accent" />
            <span>Change Password</span>
          </h2>

          {passwordStatus && (
            <div
              className={`mb-4 p-3 rounded-xl text-xs flex items-center space-x-2 ${
                passwordStatus.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                  : 'bg-red-50 text-red-800 dark:bg-red-950/30 dark:text-red-300 border border-red-200 dark:border-red-800'
              }`}
            >
              {passwordStatus.type === 'success' ? (
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
              )}
              <span>{passwordStatus.message}</span>
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-brand-text-primary dark:text-dark-text mb-1.5">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 text-xs bg-brand-bg/50 dark:bg-dark-card border border-brand-border dark:border-dark-border rounded-xl text-brand-text-primary dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-brand-accent"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-text-primary dark:text-dark-text mb-1.5">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="w-full px-3.5 py-2.5 text-xs bg-brand-bg/50 dark:bg-dark-card border border-brand-border dark:border-dark-border rounded-xl text-brand-text-primary dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-brand-accent"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-text-primary dark:text-dark-text mb-1.5">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi password baru"
                className="w-full px-3.5 py-2.5 text-xs bg-brand-bg/50 dark:bg-dark-card border border-brand-border dark:border-dark-border rounded-xl text-brand-text-primary dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-brand-accent"
                required
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={savingPassword}
                className="px-5 py-2.5 bg-brand-primary hover:bg-brand-secondary text-white text-xs font-bold rounded-xl shadow-sm transition-all active:scale-95 disabled:opacity-50 flex items-center space-x-2"
              >
                {savingPassword ? (
                  <LoadingSpinner size="sm" className="text-white" />
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>Update Password</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
