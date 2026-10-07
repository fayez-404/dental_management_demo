import React, { useState, useEffect } from 'react';
import {
  Menu,
  ChevronRight,
  Search,
  Megaphone,
  Stethoscope,
  Calendar as CalendarIcon,
  Bell,
  ArrowUp,
  User,
  Check,
  X,
  Volume2
} from 'lucide-react';

interface TopHeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onToggleSidebar: () => void;
  onOpenSearch: () => void;
  onCallAssistant: () => void;
  patientName?: string;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  currentView,
  onNavigate,
  onToggleSidebar,
  onOpenSearch,
  onCallAssistant,
}) => {
  const [currentTime, setCurrentTime] = useState('Wed, Oct 7 | 12:57 PM');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    // Keep exact format matching screenshot while tracking live minutes
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      };
      // Format as Wed, Oct 7 | 12:57 PM
      const formatted = now.toLocaleDateString('en-US', options).replace(/,/g, '');
      const parts = formatted.split(' ');
      // fallback to reliable Wed, Oct 7 | XX:YY AM/PM
      const day = parts[0];
      const month = parts[1];
      const date = parts[2];
      const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      setCurrentTime(`${day}, ${month} ${date} | ${timeStr}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  // Determine breadcrumb path
  const getBreadcrumbs = () => {
    switch (currentView) {
      case 'todays-patients':
        return (
          <>
            <span
              onClick={() => onNavigate('todays-patients')}
              className="text-slate-500 hover:text-slate-700 cursor-pointer font-normal hidden sm:inline"
            >
              Dashboard
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 stroke-[2] hidden sm:inline" />
            <span className="font-semibold text-slate-800 truncate">Today's patients</span>
          </>
        );
      case 'all-patients':
        return (
          <>
            <span
              onClick={() => onNavigate('todays-patients')}
              className="hover:text-slate-700 cursor-pointer transition-colors hidden sm:inline"
            >
              Dashboard
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 stroke-[2] hidden sm:inline" />
            <span className="text-slate-900 font-semibold truncate">All Patient</span>
          </>
        );
      case 'new-patient':
        return (
          <>
            <span
              onClick={() => onNavigate('todays-patients')}
              className="hover:text-slate-800 cursor-pointer transition-colors hidden md:inline"
            >
              Dashboard
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 stroke-[2] hidden md:inline" />
            <span
              onClick={() => onNavigate('all-patients')}
              className="hover:text-slate-800 cursor-pointer transition-colors hidden sm:inline"
            >
              All Patient
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 stroke-[2] hidden sm:inline" />
            <span className="text-slate-900 font-semibold truncate">Add New Patient</span>
          </>
        );
      case 'new-appointment':
        return (
          <>
            <span
              onClick={() => onNavigate('todays-patients')}
              className="hover:text-slate-700 cursor-pointer transition-colors hidden md:inline"
            >
              Dashboard
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 stroke-[2] hidden md:inline" />
            <span
              onClick={() => onNavigate('advance-appointment')}
              className="hover:text-slate-700 cursor-pointer transition-colors hidden sm:inline"
            >
              Appointment
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 stroke-[2] hidden sm:inline" />
            <span className="text-slate-900 font-semibold truncate">New Appointment</span>
          </>
        );
      case 'advance-appointment':
        return (
          <>
            <span
              onClick={() => onNavigate('todays-patients')}
              className="hover:text-slate-700 cursor-pointer transition-colors hidden md:inline"
            >
              Dashboard
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 stroke-[2] hidden md:inline" />
            <span
              onClick={() => onNavigate('new-appointment')}
              className="hover:text-slate-700 cursor-pointer transition-colors hidden sm:inline"
            >
              All Appointment
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 stroke-[2] hidden sm:inline" />
            <span className="text-slate-800 font-semibold truncate">Advance Reservation</span>
          </>
        );
      default:
        return (
          <>
            <span
              onClick={() => onNavigate('todays-patients')}
              className="hover:text-slate-700 cursor-pointer hidden sm:inline"
            >
              Dashboard
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 stroke-[2] hidden sm:inline" />
            <span className="text-slate-900 font-semibold capitalize truncate">{currentView.replace('-', ' ')}</span>
          </>
        );
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-3 sm:px-6 flex items-center justify-between shrink-0 z-30 sticky top-0">
      {/* Left side: Hamburger and Breadcrumbs */}
      <div className="flex items-center gap-2 sm:gap-4 min-w-0">
        <button
          onClick={onToggleSidebar}
          aria-label="Toggle Menu"
          className="p-2 -ml-1 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer shrink-0"
          type="button"
        >
          <Menu className="w-5 h-5 stroke-[2]" />
        </button>

        <nav aria-label="Breadcrumb" className="flex items-center space-x-1.5 sm:space-x-2 text-xs md:text-sm truncate">
          {getBreadcrumbs()}
        </nav>
      </div>

      {/* Right side: Controls, Status & Profile */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        {/* Search Button */}
        <button
          onClick={onOpenSearch}
          aria-label="Search"
          className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition cursor-pointer"
          type="button"
          title="Search patients or appointments"
        >
          <Search className="w-4 h-4 stroke-[2]" />
        </button>

        {/* Call the Assistant Button */}
        <button
          onClick={onCallAssistant}
          className="h-9 px-2.5 sm:px-3 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 sm:gap-2 transition cursor-pointer"
          type="button"
          title="Call the assistant"
        >
          <Megaphone className="w-3.5 h-3.5 text-slate-500 stroke-[2]" />
          <span className="hidden md:inline">Call the assistant</span>
        </button>

        {/* Date & Time Info */}
        <div className="hidden xl:flex items-center gap-2 px-2 text-xs font-semibold text-slate-800 tracking-tight">
          <span>{currentTime}</span>
        </div>

        {/* Calendar Button */}
        <button
          onClick={() => onNavigate('advance-appointment')}
          aria-label="Open Calendar"
          className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition cursor-pointer"
          type="button"
          title="Open Calendar Schedule"
        >
          <CalendarIcon className="w-4 h-4 stroke-[1.8]" />
        </button>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notifications"
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition relative cursor-pointer"
            type="button"
          >
            <Bell className="w-4 h-4 stroke-[1.8]" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-teal-600"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-xl shadow-lg border border-slate-200 p-4 z-50">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-800">Notifications</span>
                <span className="text-[10px] bg-teal-50 text-teal-700 font-semibold px-2 py-0.5 rounded-full">
                  2 unread
                </span>
              </div>
              <div className="py-2 space-y-2 text-xs">
                <div className="p-2.5 rounded-lg bg-teal-50/50 hover:bg-teal-50 transition cursor-pointer">
                  <p className="font-semibold text-slate-800">Ahmed scheduled for Thursday</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">09:00 AM in Room dental</p>
                  <span className="text-[10px] text-slate-400">10m ago</span>
                </div>
                <div className="p-2.5 rounded-lg hover:bg-slate-50 transition cursor-pointer">
                  <p className="font-semibold text-slate-800">Branch clinic inventory updated</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Main branch stock verified</p>
                  <span className="text-[10px] text-slate-400">1h ago</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown Button */}
        <div className="relative">
          <div
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-1.5 sm:gap-2 pl-1 sm:pl-2 cursor-pointer group select-none"
          >
            <span className="text-xs font-semibold text-slate-800 group-hover:text-slate-950 transition hidden sm:inline">
              dr demo
            </span>
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-teal-100 border border-teal-300 flex items-center justify-center text-teal-800 overflow-hidden shadow-xs">
                <img
                  src="/src/assets/images/dr_demo_avatar.jpg"
                  alt="Dr. Demo"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to stethoscope / user icon
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <User className="w-4 h-4 text-[#0d6559]" />
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 rotate-90 stroke-[2] transition hidden sm:block" />
          </div>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-52 sm:w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50 text-xs">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="font-bold text-slate-900">Dr. Demo</p>
                <p className="text-[11px] text-slate-500">General Dental Surgeon</p>
                <span className="inline-block mt-1 text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                  الفرع الرئيسي
                </span>
              </div>
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  onNavigate('todays-patients');
                }}
                className="w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Today's Overview
              </button>
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  onNavigate('all-patients');
                }}
                className="w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Patients Directory
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
