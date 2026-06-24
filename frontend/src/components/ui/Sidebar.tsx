'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Tent,
  Trophy,
  ShieldAlert,
  BarChart3,
  Settings,
  UserCircle,
  UsersRound,
  GitCompare,
  Menu,
  X,
  LogOut,
  ChevronLeft,
} from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import ThemeToggle from '@/components/ui/ThemeToggle';
import NotificationDropdown from '@/components/ui/NotificationDropdown';
import { useAuthStore } from '@/store/authStore';
import type { Role } from '@/types';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

interface SidebarProps {
  role: Role;
}

const navItemsByRole: Record<Role, NavItem[]> = {
  ADMIN: [
    { label: 'Overview', href: '/admin', icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: 'Students', href: '/admin/students', icon: <Users className="w-5 h-5" /> },
    { label: 'Camps', href: '/admin/camps', icon: <Tent className="w-5 h-5" /> },
    { label: 'Contests', href: '/admin/contests', icon: <Trophy className="w-5 h-5" /> },
    { label: 'Plagiarism', href: '/admin/plagiarism', icon: <ShieldAlert className="w-5 h-5" /> },
    { label: 'Reports', href: '/admin/reports', icon: <BarChart3 className="w-5 h-5" /> },
    { label: 'Settings', href: '/admin/settings', icon: <Settings className="w-5 h-5" /> },
  ],
  MENTOR: [
    { label: 'Overview', href: '/mentor', icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: 'Students', href: '/mentor/students', icon: <Users className="w-5 h-5" /> },
    { label: 'Camps', href: '/mentor/camps', icon: <Tent className="w-5 h-5" /> },
    { label: 'Contests', href: '/mentor/contests', icon: <Trophy className="w-5 h-5" /> },
    { label: 'Reports', href: '/mentor/reports', icon: <BarChart3 className="w-5 h-5" /> },
  ],
  STUDENT: [
    { label: 'Dashboard', href: '/student', icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: 'Profile', href: '/student/profile', icon: <UserCircle className="w-5 h-5" /> },
    { label: 'Friends', href: '/student/friends', icon: <UsersRound className="w-5 h-5" /> },
    { label: 'Compare', href: '/student/compare', icon: <GitCompare className="w-5 h-5" /> },
  ],
};

export default function Sidebar({ role }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const navItems = navItemsByRole[role] || [];

  const isActive = (href: string) => {
    if (href === `/${role.toLowerCase()}`) return pathname === href;
    return pathname.startsWith(href);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          {!isCollapsed && (
            <h1 className="text-2xl font-extrabold gradient-text tracking-tight">
              Darpan
            </h1>
          )}
          {isCollapsed && (
            <h1 className="text-2xl font-extrabold gradient-text">D</h1>
          )}
        </Link>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all"
        >
          <ChevronLeft
            className={`w-4 h-4 transition-transform duration-300 ${
              isCollapsed ? 'rotate-180' : ''
            }`}
          />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-xl
                text-sm font-medium
                transition-all duration-200
                group relative
                ${
                  active
                    ? 'bg-primary-500/15 text-primary-300 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }
              `}
            >
              {active && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-primary-500" />
              )}
              <span className={active ? 'text-primary-400' : 'text-slate-400 group-hover:text-white'}>
                {item.icon}
              </span>
              {!isCollapsed && <span>{item.label}</span>}
              {item.badge && !isCollapsed && (
                <span className="ml-auto bg-primary-500/20 text-primary-300 text-xs px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="px-3 pb-4 space-y-2">
        <div className="px-3 py-2 flex items-center justify-between">
          <ThemeToggle />
          <NotificationDropdown />
        </div>

        <div className="border-t border-slate-700/50 pt-3">
          <div className="flex items-center gap-3 px-3 py-2">
            <Avatar
              name={user?.name || 'User'}
              size="sm"
            />
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-slate-500 truncate">
                  {user?.email || ''}
                </p>
              </div>
            )}
            <button
              onClick={logout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 rounded-xl glass text-slate-300 hover:text-white transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`
          lg:hidden fixed top-0 left-0 z-50 h-full w-72
          glass border-r border-slate-700/50
          transform transition-transform duration-300 ease-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all"
        >
          <X className="w-5 h-5" />
        </button>
        {sidebarContent}
      </aside>

      {/* Desktop Sidebar */}
      <aside
        className={`
          hidden lg:block fixed top-0 left-0 h-full z-30
          glass border-r border-slate-700/50
          transition-all duration-300 ease-out
          ${isCollapsed ? 'w-20' : 'w-64'}
        `}
      >
        {sidebarContent}
      </aside>

      {/* Spacer for content */}
      <div
        className={`hidden lg:block flex-shrink-0 transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      />
    </>
  );
}
