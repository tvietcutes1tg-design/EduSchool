import React from 'react';
import { 
  GraduationCap, 
  Sun, 
  Moon, 
  RotateCcw, 
  Download, 
  Printer,
  ShieldCheck,
  Eye,
  LogOut,
  ArrowRightLeft,
  School,
  Settings
} from 'lucide-react';
import { CurrentUser } from '../types';

interface NavbarProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  selectedSemester: 'HK1' | 'HK2';
  onSemesterChange: (semester: 'HK1' | 'HK2') => void;
  onResetData: () => void;
  onExportBackup: () => void;
  onPrintReport: () => void;
  schoolName: string;
  province?: string;
  currentUser: CurrentUser;
  className?: string;
  onOpenLogin: () => void;
  onLogout: () => void;
  onOpenHandover?: () => void;
  onOpenSchoolProfile?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  darkMode,
  onToggleDarkMode,
  selectedSemester,
  onSemesterChange,
  onResetData,
  onExportBackup,
  onPrintReport,
  schoolName,
  province,
  currentUser,
  className = '10A1',
  onOpenLogin,
  onLogout,
  onOpenHandover,
  onOpenSchoolProfile
}) => {
  const isReadOnly = currentUser.role === 'student';

  return (
    <header className="no-print h-16 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-3 md:px-6 flex items-center justify-between gap-3 sticky top-0 z-30 transition-colors">
      {/* Brand */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs">
          <GraduationCap className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-base tracking-tight text-neutral-900 dark:text-neutral-50 leading-tight flex items-center gap-1.5">
            <span>EduSchool</span>
            <span className="text-xs px-1.5 py-0.2 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-semibold font-mono">
              Lớp {className}
            </span>
          </span>
          <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium truncate max-w-[170px] sm:max-w-none flex items-center gap-1">
            <School className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <span className="truncate">{schoolName}{province ? ` · ${province}` : ''}</span>
          </span>
        </div>
      </div>

      {/* Center Controls: Semester Switcher */}
      <div className="flex items-center gap-2">
        <div className="flex items-center p-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-xs font-medium">
          <button
            type="button"
            onClick={() => onSemesterChange('HK1')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              selectedSemester === 'HK1'
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 shadow-xs font-semibold'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
            }`}
          >
            <span className="hidden sm:inline">Học kỳ 1</span>
            <span className="sm:hidden">HK1</span> (2026 - 2027)
          </button>
          <button
            type="button"
            onClick={() => onSemesterChange('HK2')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              selectedSemester === 'HK2'
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 shadow-xs font-semibold'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
            }`}
          >
            <span className="hidden sm:inline">Học kỳ 2</span>
            <span className="sm:hidden">HK2</span> (2026 - 2027)
          </button>
        </div>
      </div>

      {/* Actions Zone */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* Edit School & Profile info button for GVCN (Requirement 22.3) */}
        {!isReadOnly && onOpenSchoolProfile && (
          <button
            type="button"
            onClick={onOpenSchoolProfile}
            title="Xem và chỉnh sửa tên trường công tác & tỉnh/thành phố"
            className="p-2 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors flex items-center gap-1 text-xs font-medium cursor-pointer"
          >
            <School className="w-4 h-4 text-blue-500" />
            <span className="hidden xl:inline">Sửa trường</span>
          </button>
        )}

        {/* Handover Button for GVCN */}
        {!isReadOnly && onOpenHandover && (
          <button
            type="button"
            onClick={onOpenHandover}
            title="Bàn giao lớp cuối năm cho GV mới"
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-blue-500" />
            <span>Bàn giao lớp</span>
          </button>
        )}

        {/* Current Role Badge & Switch Button */}
        <button
          type="button"
          onClick={onOpenLogin}
          className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
            isReadOnly
              ? 'bg-amber-100 hover:bg-amber-200 dark:bg-amber-950/60 dark:hover:bg-amber-900/60 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-700'
              : 'bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
          }`}
          title="Nhấp để đổi tài khoản đăng nhập"
        >
          {isReadOnly ? (
            <>
              <Eye className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
              <span className="truncate max-w-[90px] sm:max-w-[130px]">{currentUser.name}</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
              <span className="truncate max-w-[90px] sm:max-w-none">
                {currentUser.username ? `${currentUser.name}` : `GVCN Lớp ${className}`}
              </span>
            </>
          )}
          <span className="text-[10px] opacity-75 font-normal ml-0.5 underline hidden md:inline">Đổi vai trò</span>
        </button>

        {/* Backup / Export (only for GVCN) */}
        {!isReadOnly && (
          <button
            type="button"
            onClick={onExportBackup}
            title="Tải xuống bản sao lưu dữ liệu JSON"
            className="p-2 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer"
          >
            <Download className="w-4 h-4 text-neutral-500" />
            <span className="hidden xl:inline">Sao lưu</span>
          </button>
        )}

        {/* Reset (Strictly hidden for students/parents) */}
        {!isReadOnly && (
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Bạn có chắc chắn muốn khôi phục toàn bộ dữ liệu mẫu ban đầu? Mọi thay đổi của bạn sẽ được thiết lập lại.')) {
                onResetData();
              }
            }}
            title="Khôi phục dữ liệu mẫu ban đầu"
            className="p-2 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-neutral-500" />
            <span className="hidden xl:inline">Khôi phục</span>
          </button>
        )}

        {/* Quick Print Summary */}
        <button
          type="button"
          onClick={onPrintReport}
          title="In báo cáo tổng quan"
          className="p-2 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer"
        >
          <Printer className="w-4 h-4 text-neutral-500" />
          <span className="hidden xl:inline">In báo cáo</span>
        </button>

        {/* Dark Mode Toggle */}
        <button
          type="button"
          onClick={onToggleDarkMode}
          title={darkMode ? 'Chuyển sang giao diện Sáng' : 'Chuyển sang giao diện Tối'}
          className="p-2 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-neutral-600" />}
        </button>

        {/* Logout Button */}
        <button
          type="button"
          onClick={onLogout}
          title="Đăng xuất khỏi hệ thống"
          className="p-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors flex items-center gap-1 text-xs font-medium cursor-pointer border border-transparent hover:border-rose-200 dark:hover:border-rose-900/50"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Đăng xuất</span>
        </button>
      </div>
    </header>
  );
};
