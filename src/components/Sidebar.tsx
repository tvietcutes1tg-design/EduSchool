import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  FileSpreadsheet, 
  CalendarCheck, 
  CalendarDays,
  ShieldCheck,
  Trophy,
  Armchair,
  User,
  LogOut,
  ArrowRightLeft,
  School,
  MapPin,
  Settings
} from 'lucide-react';
import { CurrentUser } from '../types';

export type ActiveTab = 'dashboard' | 'students' | 'seating' | 'grades' | 'attendance' | 'schedule' | 'weekly_report';

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  studentCount: number;
  currentUser: CurrentUser;
  className?: string;
  schoolName?: string;
  province?: string;
  onOpenLogin: () => void;
  onLogout: () => void;
  onOpenHandover?: () => void;
  onOpenSchoolProfile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  studentCount,
  currentUser,
  className = '10A1',
  schoolName,
  province,
  onOpenLogin,
  onLogout,
  onOpenHandover,
  onOpenSchoolProfile
}) => {
  const isParent = currentUser.role === 'student';

  // Navigation Items for GVCN vs Parent
  const navItems = isParent
    ? [
        {
          id: 'dashboard' as ActiveTab,
          label: 'Hồ sơ & Tổng quan con',
          icon: User
        },
        {
          id: 'grades' as ActiveTab,
          label: 'Sổ điểm học tập của con',
          icon: FileSpreadsheet
        },
        {
          id: 'weekly_report' as ActiveTab,
          label: 'Thi đua & Nhận xét tuần',
          icon: Trophy
        },
        {
          id: 'attendance' as ActiveTab,
          label: 'Chuyên cần con em',
          icon: CalendarCheck
        },
        {
          id: 'seating' as ActiveTab,
          label: 'Vị trí chỗ ngồi trong lớp',
          icon: Armchair
        },
        {
          id: 'schedule' as ActiveTab,
          label: 'Thời khóa biểu lớp',
          icon: CalendarDays
        }
      ]
    : [
        {
          id: 'dashboard' as ActiveTab,
          label: 'Tổng quan lớp',
          icon: LayoutDashboard
        },
        {
          id: 'students' as ActiveTab,
          label: 'Danh sách học sinh',
          icon: Users,
          badge: studentCount
        },
        {
          id: 'seating' as ActiveTab,
          label: 'Sơ đồ chỗ ngồi lớp',
          icon: Armchair
        },
        {
          id: 'grades' as ActiveTab,
          label: 'Sổ điểm học tập',
          icon: FileSpreadsheet
        },
        {
          id: 'attendance' as ActiveTab,
          label: 'Điểm danh & Chuyên cần',
          icon: CalendarCheck
        },
        {
          id: 'weekly_report' as ActiveTab,
          label: 'Báo cáo tuần & Thi đua',
          icon: Trophy
        },
        {
          id: 'schedule' as ActiveTab,
          label: 'Thời khóa biểu lớp',
          icon: CalendarDays
        }
      ];

  return (
    <aside className="no-print w-64 shrink-0 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 flex flex-col justify-between h-[calc(100vh-4rem)] sticky top-16 transition-colors">
      <div className="p-3 space-y-1 overflow-y-auto">
        <div className="px-3 py-2 text-[11px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider flex items-center justify-between">
          <span>{isParent ? 'Sổ liên lạc học sinh' : `Lớp ${className}`}</span>
          {isParent && <span className="text-amber-500 font-normal">Chỉ xem</span>}
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-semibold shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-neutral-500'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 shrink-0">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* User profile / System info footer */}
      <div className="p-3 border-t border-neutral-200 dark:border-neutral-800 space-y-2">
        {/* School name strip */}
        <div className="px-2.5 py-1.5 bg-neutral-50 dark:bg-neutral-800/60 rounded-xl border border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-1.5 text-[11px]">
          <div className="flex items-center gap-1.5 min-w-0 text-neutral-600 dark:text-neutral-300">
            <School className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            <span className="truncate font-medium">{schoolName || currentUser.schoolName || 'Trường THPT'}</span>
          </div>
          {!isParent && onOpenSchoolProfile && (
            <button
              type="button"
              onClick={onOpenSchoolProfile}
              title="Chỉnh sửa thông tin trường học & tỉnh/thành phố"
              className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline shrink-0 font-semibold cursor-pointer"
            >
              Sửa
            </button>
          )}
        </div>

        {/* User Card */}
        <div 
          onClick={onOpenLogin}
          className="p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800/70 cursor-pointer transition-colors border border-transparent hover:border-neutral-200 dark:hover:border-neutral-700 group"
          title="Nhấp để đổi tài khoản đăng nhập"
        >
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
              isParent
                ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                : 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300'
            }`}>
              {currentUser.avatarInitial}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 truncate flex items-center gap-1">
                <span className="truncate">{currentUser.name}</span>
                {!isParent ? (
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                ) : (
                  <span className="text-[10px] px-1 py-0.2 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-normal shrink-0">Chỉ xem</span>
                )}
              </div>
              <div className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate flex items-center justify-between">
                <span>{isParent ? 'Phụ huynh tra cứu' : `GVCN Lớp ${className}`}</span>
                <span className="text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">Đổi</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons: Handover (for GVCN) & Logout */}
        <div className="flex items-center gap-1.5 pt-1">
          {!isParent && onOpenHandover && (
            <button
              type="button"
              onClick={onOpenHandover}
              className="flex-1 px-2.5 py-1.5 text-[11px] font-medium text-neutral-600 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors flex items-center justify-center gap-1.5 border border-neutral-200 dark:border-neutral-800 cursor-pointer"
              title="Bàn giao lớp cuối năm học cho giáo viên mới"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>Bàn giao lớp</span>
            </button>
          )}
          <button
            type="button"
            onClick={onLogout}
            className={`px-2.5 py-1.5 text-[11px] font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors flex items-center justify-center gap-1.5 border border-rose-200 dark:border-rose-900/40 cursor-pointer ${
              isParent ? 'w-full' : ''
            }`}
            title="Đăng xuất khỏi hệ thống"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
