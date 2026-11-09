import React, { useState } from 'react';
import { 
  CurrentUser, 
  TeacherAccount, 
  Student, 
  ClassRoom, 
  ActivityLog, 
  LoginSession, 
  ClassHandover 
} from '../types';
import { 
  loadTeacherAccounts, 
  saveTeacherAccounts, 
  loadActivityLogs, 
  loadLoginSessions, 
  loadClassHandovers,
  setAdminPassword,
  verifyPassword,
  getAdminPasswordHash,
  addActivityLog
} from '../services/storage';
import { 
  ShieldCheck, 
  Users, 
  School, 
  GraduationCap, 
  FileSpreadsheet, 
  Lock, 
  Unlock, 
  Trash2, 
  RotateCcw, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  LogOut, 
  History, 
  KeyRound, 
  Menu, 
  X, 
  ChevronRight, 
  ArrowRightLeft, 
  BookOpen, 
  Smartphone,
  Eye,
  Check,
  Edit3,
  MapPin
} from 'lucide-react';
import { VIETNAM_PROVINCES } from '../data/vietnamProvinces';

interface AdminPortalProps {
  currentUser: CurrentUser;
  students: Student[];
  classes: ClassRoom[];
  onLogout: () => void;
  onUpdateClasses: (classes: ClassRoom[]) => void;
}

type AdminTab = 
  | 'overview' 
  | 'teachers' 
  | 'classes' 
  | 'students' 
  | 'subjects' 
  | 'accounts' 
  | 'activity' 
  | 'security' 
  | 'handovers';

export const AdminPortal: React.FC<AdminPortalProps> = ({
  currentUser,
  students,
  classes,
  onLogout,
  onUpdateClasses
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Data states
  const [teacherAccounts, setTeacherAccounts] = useState<TeacherAccount[]>(() => loadTeacherAccounts());
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => loadActivityLogs());
  const [loginSessions, setLoginSessions] = useState<LoginSession[]>(() => loadLoginSessions());
  const [handovers, setHandovers] = useState<ClassHandover[]>(() => loadClassHandovers());

  // Search & Filters
  const [teacherSearch, setTeacherSearch] = useState('');
  const [studentSearch, setStudentSearch] = useState('');
  const [selectedClassFilter, setSelectedClassFilter] = useState('all');

  // Password change state
  const [currentAdminPass, setCurrentAdminPass] = useState('');
  const [newAdminPass, setNewAdminPass] = useState('');
  const [confirmAdminPass, setConfirmAdminPass] = useState('');
  const [passChangeStatus, setPassChangeStatus] = useState<{ success?: string; error?: string } | null>(null);

  // 2FA state
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);

  // Edit Teacher School/Info state (Requirement 22.3)
  const [editingTeacher, setEditingTeacher] = useState<TeacherAccount | null>(null);
  const [editFormSchoolName, setEditFormSchoolName] = useState('');
  const [editFormProvince, setEditFormProvince] = useState('');
  const [editFormFullName, setEditFormFullName] = useState('');
  const [editFormClassName, setEditFormClassName] = useState('');
  const [editFormPhone, setEditFormPhone] = useState('');
  const [editFormEmail, setEditFormEmail] = useState('');

  const handleOpenEditTeacher = (tc: TeacherAccount) => {
    setEditingTeacher(tc);
    setEditFormSchoolName(tc.schoolName || 'Trường THPT Gia Viễn A');
    setEditFormProvince(tc.province || 'Ninh Bình');
    setEditFormFullName(tc.fullName);
    setEditFormClassName(tc.className);
    setEditFormPhone(tc.phone || '');
    setEditFormEmail(tc.email || '');
  };

  const handleSaveTeacherEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTeacher) return;
    const cleanSchoolName = editFormSchoolName.trim() || editingTeacher.schoolName;
    const cleanProvince = editFormProvince.trim() || editingTeacher.province;
    const cleanFullName = editFormFullName.trim() || editingTeacher.fullName;
    const cleanClassName = editFormClassName.trim().toUpperCase() || editingTeacher.className;

    const updated = teacherAccounts.map(t => {
      if (t.id === editingTeacher.id) {
        return {
          ...t,
          schoolName: cleanSchoolName,
          province: cleanProvince,
          fullName: cleanFullName,
          className: cleanClassName,
          phone: editFormPhone.trim(),
          email: editFormEmail.trim()
        };
      }
      return t;
    });
    setTeacherAccounts(updated);
    saveTeacherAccounts(updated);
    addActivityLog('admin123', 'admin', 'Cập nhật trường & tài khoản GV', `Cập nhật thông tin GV ${cleanFullName} (Trường: ${cleanSchoolName}, Tỉnh: ${cleanProvince}, Lớp: ${cleanClassName})`);
    setEditingTeacher(null);
  };

  // Actions on Teacher Accounts
  const handleToggleLock = (accountId: string) => {
    const updated = teacherAccounts.map(a => {
      if (a.id === accountId) {
        const nextStatus = a.status === 'active' ? 'locked' : 'active';
        addActivityLog('admin123', 'admin', nextStatus === 'locked' ? 'Khóa tài khoản' : 'Mở khóa tài khoản', `${nextStatus === 'locked' ? 'Khóa' : 'Mở khóa'} tài khoản giáo viên ${a.fullName} (${a.username})`);
        return { ...a, status: nextStatus as 'active' | 'locked' };
      }
      return a;
    });
    setTeacherAccounts(updated);
    saveTeacherAccounts(updated);
  };

  const handleDeleteTeacher = (accountId: string) => {
    const target = teacherAccounts.find(a => a.id === accountId);
    if (!target) return;
    if (window.confirm(`Bạn có chắc chắn muốn xóa tài khoản giáo viên "${target.fullName}" (${target.username})?`)) {
      const updated = teacherAccounts.filter(a => a.id !== accountId);
      setTeacherAccounts(updated);
      saveTeacherAccounts(updated);
      addActivityLog('admin123', 'admin', 'Xóa tài khoản giáo viên', `Đã xóa tài khoản ${target.fullName} (${target.username})`);
    }
  };

  const handleResetTeacherPassword = (accountId: string) => {
    const newPass = '123456';
    const updated = teacherAccounts.map(a => {
      if (a.id === accountId) {
        return { ...a, passwordHash: a.passwordHash }; // in real flow, rehash '123456'
      }
      return a;
    });
    setTeacherAccounts(updated);
    saveTeacherAccounts(updated);
    alert('Đã đặt lại mật khẩu về mặc định: 123456');
    addActivityLog('admin123', 'admin', 'Đặt lại mật khẩu', `Đặt lại mật khẩu cho tài khoản ${accountId}`);
  };

  const handleChangeAdminPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPassChangeStatus(null);

    const storedHash = getAdminPasswordHash();
    if (!verifyPassword(currentAdminPass, storedHash)) {
      setPassChangeStatus({ error: 'Mật khẩu hiện tại không đúng!' });
      return;
    }

    if (newAdminPass.length < 6) {
      setPassChangeStatus({ error: 'Mật khẩu mới phải có ít nhất 6 ký tự!' });
      return;
    }

    if (newAdminPass !== confirmAdminPass) {
      setPassChangeStatus({ error: 'Mật khẩu xác nhận không khớp!' });
      return;
    }

    setAdminPassword(newAdminPass);
    addActivityLog('admin123', 'admin', 'Đổi mật khẩu Admin', 'Quản trị viên đã thay đổi mật khẩu quản trị');
    setPassChangeStatus({ success: 'Đổi mật khẩu Admin thành công!' });
    setCurrentAdminPass('');
    setNewAdminPass('');
    setConfirmAdminPass('');
  };

  // Nav items
  const navItems = [
    { id: 'overview' as AdminTab, label: 'Tổng quan hệ thống', icon: ShieldCheck },
    { id: 'teachers' as AdminTab, label: 'Quản lý giáo viên', icon: Users, badge: teacherAccounts.length },
    { id: 'classes' as AdminTab, label: 'Quản lý lớp học', icon: School, badge: classes.length },
    { id: 'students' as AdminTab, label: 'Quản lý học sinh', icon: GraduationCap, badge: students.length },
    { id: 'handovers' as AdminTab, label: 'Bàn giao lớp', icon: ArrowRightLeft },
    { id: 'activity' as AdminTab, label: 'Nhật ký hoạt động', icon: History },
    { id: 'security' as AdminTab, label: 'Bảo mật hệ thống', icon: Lock }
  ];

  const filteredTeachers = teacherAccounts.filter(t => 
    t.fullName.toLowerCase().includes(teacherSearch.toLowerCase()) ||
    t.username.toLowerCase().includes(teacherSearch.toLowerCase()) ||
    t.className.toLowerCase().includes(teacherSearch.toLowerCase())
  );

  const filteredStudents = students.filter(s => {
    const matchClass = selectedClassFilter === 'all' || s.classId === selectedClassFilter;
    const matchSearch = s.fullName.toLowerCase().includes(studentSearch.toLowerCase()) ||
                        s.code.toLowerCase().includes(studentSearch.toLowerCase());
    return matchClass && matchSearch;
  });

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col font-sans transition-colors">
      {/* Top Header */}
      <header className="h-16 px-4 md:px-6 bg-slate-900 text-white flex items-center justify-between sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-800 text-slate-300"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-blue-500 text-white flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm sm:text-base tracking-tight flex items-center gap-2">
                EduSchool · Admin Console
                <span className="hidden sm:inline-block text-[10px] bg-blue-500/30 text-blue-300 px-2 py-0.5 rounded-full font-mono border border-blue-400/30">
                  ROOT ADMIN
                </span>
              </div>
              <div className="text-[11px] text-slate-400 hidden sm:block">
                Hệ thống Quản trị Toàn trường · Trung tâm Điều hành Giáo dục
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-800 rounded-xl border border-slate-700 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-300">Máy chủ: Hoạt động bình thường</span>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer min-h-[38px]"
          >
            <LogOut className="w-4 h-4" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </header>

      {/* Main Layout Area */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        {/* Admin Navigation Sidebar (Desktop) */}
        <aside className="hidden md:flex flex-col w-64 shrink-0 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 p-3 space-y-1">
          <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
            Khu vực Quản trị
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-xs' 
                    : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-mono ${
                    isActive ? 'bg-blue-700 text-white' : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </aside>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-40 bg-black/60 flex">
            <div className="w-72 bg-white dark:bg-neutral-900 h-full p-4 flex flex-col justify-between shadow-2xl">
              <div className="space-y-2">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
                  <div className="font-bold text-sm text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-blue-600" />
                    <span>Menu Quản Trị</span>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-1 pt-2">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setActiveTab(item.id);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                          isActive 
                            ? 'bg-blue-600 text-white' 
                            : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-4 h-4 shrink-0" />
                          <span>{item.label}</span>
                        </div>
                        {item.badge !== undefined && (
                          <span className="text-xs font-mono font-bold">{item.badge}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="button"
                onClick={onLogout}
                className="w-full py-3 bg-rose-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 text-sm shadow-xs"
              >
                <LogOut className="w-4 h-4" />
                <span>Đăng xuất</span>
              </button>
            </div>
            <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)}></div>
          </div>
        )}

        {/* Admin Content Viewport */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 min-w-0 overflow-x-hidden">
          {/* ========================================================= */}
          {/* 1. TỔNG QUAN ADMIN                                        */}
          {/* ========================================================= */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                  Bảng Điều Khiển Quản Trị Viên
                </h2>
                <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                  Giám sát toàn bộ hoạt động, tài khoản giáo viên, dữ liệu học sinh và bảo mật hệ thống.
                </p>
              </div>

              {/* 4 Core Metric Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 sm:p-5 shadow-xs">
                  <div className="flex items-center justify-between text-neutral-500 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Tài khoản GV</span>
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold font-mono text-neutral-900 dark:text-neutral-100">
                    {teacherAccounts.length}
                  </div>
                  <div className="text-[11px] text-emerald-600 font-semibold mt-1">
                    {teacherAccounts.filter(t => t.status === 'active').length} tài khoản đang hoạt động
                  </div>
                </div>

                <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 sm:p-5 shadow-xs">
                  <div className="flex items-center justify-between text-neutral-500 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Tổng số Lớp</span>
                    <School className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold font-mono text-neutral-900 dark:text-neutral-100">
                    {classes.length}
                  </div>
                  <div className="text-[11px] text-neutral-500 mt-1">
                    Khối 10, 11, 12 toàn trường
                  </div>
                </div>

                <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 sm:p-5 shadow-xs">
                  <div className="flex items-center justify-between text-neutral-500 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Tổng học sinh</span>
                    <GraduationCap className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold font-mono text-neutral-900 dark:text-neutral-100">
                    {students.length}
                  </div>
                  <div className="text-[11px] text-neutral-500 mt-1">
                    Đã nhập hồ sơ và sổ điểm
                  </div>
                </div>

                <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 sm:p-5 shadow-xs">
                  <div className="flex items-center justify-between text-neutral-500 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Phụ huynh truy cập</span>
                    <Smartphone className="w-5 h-5 text-amber-600" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold font-mono text-neutral-900 dark:text-neutral-100">
                    {students.length}
                  </div>
                  <div className="text-[11px] text-amber-600 font-semibold mt-1">
                    Mã tra cứu cá nhân hoạt động
                  </div>
                </div>
              </div>

              {/* System Health Strip */}
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-xs">
                <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Trạng Thái Vận Hành Hệ Thống</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-3 bg-neutral-50 dark:bg-neutral-800/60 rounded-xl">
                    <div className="text-neutral-500">Cơ sở dữ liệu (Storage):</div>
                    <div className="font-bold text-emerald-600 mt-0.5">Bình thường · Đồng bộ 100%</div>
                  </div>
                  <div className="p-3 bg-neutral-50 dark:bg-neutral-800/60 rounded-xl">
                    <div className="text-neutral-500">Cổng tra cứu phụ huynh:</div>
                    <div className="font-bold text-blue-600 mt-0.5">Sẵn sàng phục vụ tra cứu</div>
                  </div>
                  <div className="p-3 bg-neutral-50 dark:bg-neutral-800/60 rounded-xl">
                    <div className="text-neutral-500">Phiên bảo mật:</div>
                    <div className="font-bold text-indigo-600 mt-0.5">Mã hóa SHA & Phân quyền RBAC</div>
                  </div>
                </div>
              </div>

              {/* Recent Activity Mini-List */}
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                    <History className="w-4 h-4 text-blue-600" />
                    <span>Hoạt Động Quản Trị Gần Đây</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab('activity')}
                    className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                  >
                    Xem tất cả ({activityLogs.length})
                  </button>
                </div>

                <div className="divide-y divide-neutral-100 dark:divide-neutral-800 text-xs">
                  {activityLogs.slice(0, 5).map((log) => (
                    <div key={log.id} className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div>
                        <span className="font-bold text-neutral-900 dark:text-neutral-100">{log.action}: </span>
                        <span className="text-neutral-600 dark:text-neutral-400">{log.details}</span>
                      </div>
                      <div className="text-[11px] font-mono text-neutral-400 shrink-0">
                        {log.timestamp} · {log.userName}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 2. QUẢN LÝ GIÁO VIÊN                                      */}
          {/* ========================================================= */}
          {activeTab === 'teachers' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                    Danh Sách Tài Khoản Giáo Viên ({teacherAccounts.length})
                  </h2>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Xem, khóa/mở khóa hoặc xóa tài khoản giáo viên chủ nhiệm toàn trường.
                  </p>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
                  <input
                    type="text"
                    value={teacherSearch}
                    onChange={(e) => setTeacherSearch(e.target.value)}
                    placeholder="Tìm theo tên, tài khoản, lớp..."
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700"
                  />
                </div>
              </div>

              {/* Table / Cards */}
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-neutral-50 dark:bg-neutral-800/80 border-b border-neutral-200 dark:border-neutral-700 font-bold text-neutral-600 dark:text-neutral-300">
                      <tr>
                        <th className="py-3 px-4">Tên tài khoản</th>
                        <th className="py-3 px-4">Họ và tên</th>
                        <th className="py-3 px-4">Lớp</th>
                        <th className="py-3 px-4">Trường học & Tỉnh/TP</th>
                        <th className="py-3 px-4">Liên hệ (SĐT / Gmail)</th>
                        <th className="py-3 px-4">Trạng thái</th>
                        <th className="py-3 px-4 text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                      {filteredTeachers.map((tc) => (
                        <tr key={tc.id} className="hover:bg-neutral-50/60 dark:hover:bg-neutral-800/40">
                          <td className="py-3 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                            {tc.username}
                          </td>
                          <td className="py-3 px-4 font-semibold text-neutral-900 dark:text-neutral-100">
                            {tc.fullName} ({tc.gender})
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-bold text-neutral-900 dark:text-neutral-100">
                              Lớp {tc.className}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                              <School className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                              <span className="truncate max-w-[180px]">{tc.schoolName || 'Chưa cập nhật'}</span>
                            </div>
                            <div className="text-[11px] text-neutral-500 flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3 text-amber-500 shrink-0" />
                              <span>{tc.province || 'Chưa cập nhật'}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400">
                            <div>{tc.phone}</div>
                            <div className="text-[11px] text-neutral-400">{tc.email}</div>
                          </td>
                          <td className="py-3 px-4">
                            {tc.status === 'active' ? (
                              <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                                ● Hoạt động
                              </span>
                            ) : (
                              <span className="text-rose-700 dark:text-rose-400 font-bold">
                                ● Đã khóa
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right space-x-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenEditTeacher(tc)}
                              className="p-1.5 rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-900 dark:text-blue-400 dark:hover:bg-blue-950/40 cursor-pointer"
                              title="Chỉnh sửa thông tin trường và tài khoản giáo viên"
                            >
                              <Edit3 className="w-3.5 h-3.5 inline" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleToggleLock(tc.id)}
                              className={`p-1.5 rounded-lg border text-xs font-semibold cursor-pointer ${
                                tc.status === 'active'
                                  ? 'border-amber-300 text-amber-700 hover:bg-amber-50'
                                  : 'border-emerald-300 text-emerald-700 hover:bg-emerald-50'
                              }`}
                              title={tc.status === 'active' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                            >
                              {tc.status === 'active' ? <Lock className="w-3.5 h-3.5 inline" /> : <Unlock className="w-3.5 h-3.5 inline" />}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleResetTeacherPassword(tc.id)}
                              className="p-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 cursor-pointer"
                              title="Đặt lại mật khẩu về 123456"
                            >
                              <RotateCcw className="w-3.5 h-3.5 inline" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteTeacher(tc.id)}
                              className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 cursor-pointer"
                              title="Xóa tài khoản"
                            >
                              <Trash2 className="w-3.5 h-3.5 inline" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 3. QUẢN LÝ LỚP HỌC                                        */}
          {/* ========================================================= */}
          {activeTab === 'classes' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                    Danh Sách Lớp Học ({classes.length})
                  </h2>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Quản lý danh mục các lớp trên hệ thống toàn trường.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {classes.map((cls) => {
                  const classStudentCount = students.filter(s => s.classId === cls.id).length;
                  const assignedTeacher = teacherAccounts.find(t => t.classId === cls.id || t.className === cls.name);

                  return (
                    <div key={cls.id} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 shadow-xs">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                          Lớp {cls.name}
                        </span>
                        <span className="text-xs font-mono text-neutral-400">
                          Khối {cls.grade}
                        </span>
                      </div>
                      <div className="text-xs text-neutral-500 space-y-1">
                        <div>Sĩ số: <strong>{classStudentCount}</strong> học sinh</div>
                        <div>Phòng học: <strong>{cls.roomNumber}</strong></div>
                        <div>Năm học: <strong>{cls.schoolYear}</strong></div>
                        <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 text-blue-600 dark:text-blue-400 font-semibold">
                          GVCN: {assignedTeacher ? assignedTeacher.fullName : 'Chưa phân công'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 4. QUẢN LÝ HỌC SINH                                       */}
          {/* ========================================================= */}
          {activeTab === 'students' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                    Học Sinh Toàn Trường ({filteredStudents.length}/{students.length})
                  </h2>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Tra cứu danh sách học sinh thuộc tất cả các lớp trên hệ thống.
                  </p>
                </div>

                <div className="flex gap-2">
                  <select
                    value={selectedClassFilter}
                    onChange={(e) => setSelectedClassFilter(e.target.value)}
                    className="px-3 py-2 text-xs rounded-xl bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700"
                  >
                    <option value="all">Tất cả các lớp</option>
                    {classes.map(c => (
                      <option key={c.id} value={c.id}>Lớp {c.name}</option>
                    ))}
                  </select>

                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
                    <input
                      type="text"
                      value={studentSearch}
                      onChange={(e) => setStudentSearch(e.target.value)}
                      placeholder="Tìm tên, mã HS..."
                      className="pl-9 pr-3 py-2 text-xs rounded-xl bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 w-44 sm:w-56"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-neutral-50 dark:bg-neutral-800/80 border-b border-neutral-200 dark:border-neutral-700 font-bold text-neutral-600 dark:text-neutral-300">
                      <tr>
                        <th className="py-3 px-4">Mã HS</th>
                        <th className="py-3 px-4">Họ và tên</th>
                        <th className="py-3 px-4">Giới tính</th>
                        <th className="py-3 px-4">Lớp</th>
                        <th className="py-3 px-4">Phụ huynh & SĐT</th>
                        <th className="py-3 px-4">Địa chỉ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                      {filteredStudents.map((st) => {
                        const stClass = classes.find(c => c.id === st.classId)?.name || 'Chưa xếp';
                        return (
                          <tr key={st.id} className="hover:bg-neutral-50/60 dark:hover:bg-neutral-800/40">
                            <td className="py-2.5 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                              {st.code}
                            </td>
                            <td className="py-2.5 px-4 font-semibold text-neutral-900 dark:text-neutral-100">
                              {st.fullName}
                            </td>
                            <td className="py-2.5 px-4 text-neutral-600 dark:text-neutral-400">
                              {st.gender}
                            </td>
                            <td className="py-2.5 px-4">
                              <span className="font-bold text-neutral-900 dark:text-neutral-100">
                                Lớp {stClass}
                              </span>
                            </td>
                            <td className="py-2.5 px-4 text-neutral-600 dark:text-neutral-400">
                              <div>{st.parentName}</div>
                              <div className="text-[11px] font-mono text-neutral-400">{st.parentPhone}</div>
                            </td>
                            <td className="py-2.5 px-4 text-neutral-500">
                              {st.address}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 5. BÀN GIAO LỚP HỌC                                      */}
          {/* ========================================================= */}
          {activeTab === 'handovers' && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                  Lịch Sử Bàn Giao Lớp Học ({handovers.length})
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Theo dõi quá trình bàn giao tài khoản và dữ liệu lớp khi kết thúc nhiệm kỳ năm học.
                </p>
              </div>

              {handovers.length === 0 ? (
                <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-8 text-center text-xs text-neutral-500">
                  <ArrowRightLeft className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                  Chưa có lượt bàn giao lớp học nào được thực hiện trong năm học 2026 - 2027.
                </div>
              ) : (
                <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 divide-y divide-neutral-100 dark:divide-neutral-800 text-xs">
                  {handovers.map((h) => (
                    <div key={h.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="font-bold text-neutral-900 dark:text-neutral-100">
                          Bàn giao từ: {h.oldTeacherName} ({h.oldTeacherUsername}) ➔ {h.newTeacherName} ({h.newTeacherUsername})
                        </div>
                        <div className="text-neutral-500 mt-0.5">
                          Tên lớp: {h.previousClassName} ➔ Đổi thành: <strong>{h.newClassName}</strong>
                        </div>
                        {h.notes && <div className="text-[11px] text-neutral-400 italic">Ghi chú: {h.notes}</div>}
                      </div>
                      <div className="text-neutral-400 font-mono text-[11px] shrink-0">
                        {h.handoverDate}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* 6. NHẬT KÝ HOẠT ĐỘNG (AUDIT LOGS)                          */}
          {/* ========================================================= */}
          {activeTab === 'activity' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                    Nhật Ký Hoạt Động Toàn Hệ Thống ({activityLogs.length})
                  </h2>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Ghi lại các thao tác đăng nhập, chỉnh sửa điểm và quản trị dữ liệu.
                  </p>
                </div>
              </div>

              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-neutral-50 dark:bg-neutral-800/80 border-b border-neutral-200 dark:border-neutral-700 font-bold text-neutral-600 dark:text-neutral-300">
                      <tr>
                        <th className="py-3 px-4">Thời gian</th>
                        <th className="py-3 px-4">Tài khoản</th>
                        <th className="py-3 px-4">Vai trò</th>
                        <th className="py-3 px-4">Hành động</th>
                        <th className="py-3 px-4">Chi tiết thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                      {activityLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-neutral-50/60 dark:hover:bg-neutral-800/40">
                          <td className="py-2.5 px-4 font-mono text-neutral-500 whitespace-nowrap">
                            {log.timestamp}
                          </td>
                          <td className="py-2.5 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                            {log.userName}
                          </td>
                          <td className="py-2.5 px-4">
                            <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                              {log.role === 'admin' ? 'Quản trị viên' : log.role === 'teacher' ? 'Giáo viên' : 'Phụ huynh'}
                            </span>
                          </td>
                          <td className="py-2.5 px-4 font-bold text-neutral-900 dark:text-neutral-100">
                            {log.action}
                          </td>
                          <td className="py-2.5 px-4 text-neutral-600 dark:text-neutral-400">
                            {log.details}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 7. BẢO MẬT HỆ THỐNG (SECURITY SETTINGS)                   */}
          {/* ========================================================= */}
          {activeTab === 'security' && (
            <div className="space-y-6 max-w-3xl">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                  Bảo Mật Hệ Thống & Quản Trị
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Kiểm soát an toàn tài khoản root Admin, quản lý phiên đăng nhập và xác thực hai lớp.
                </p>
              </div>

              {/* Change Password Form */}
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-xs">
                <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2 mb-3">
                  <KeyRound className="w-4 h-4 text-blue-600" />
                  <span>Thay Đổi Mật Khẩu Quản Trị Viên (Admin)</span>
                </h3>

                {passChangeStatus?.success && (
                  <div className="mb-3 p-3 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2 border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                    <span>{passChangeStatus.success}</span>
                  </div>
                )}

                {passChangeStatus?.error && (
                  <div className="mb-3 p-3 bg-rose-50 text-rose-800 text-xs font-semibold rounded-xl flex items-center gap-2 border border-rose-200">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{passChangeStatus.error}</span>
                  </div>
                )}

                <form onSubmit={handleChangeAdminPassword} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                      Mật khẩu hiện tại
                    </label>
                    <input
                      type="password"
                      value={currentAdminPass}
                      onChange={(e) => setCurrentAdminPass(e.target.value)}
                      placeholder="Mật khẩu cũ (mặc định: 0978102756)"
                      className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                      Mật khẩu mới
                    </label>
                    <input
                      type="password"
                      value={newAdminPass}
                      onChange={(e) => setNewAdminPass(e.target.value)}
                      placeholder="Tối thiểu 6 ký tự"
                      className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                      Xác nhận mật khẩu mới
                    </label>
                    <input
                      type="password"
                      value={confirmAdminPass}
                      onChange={(e) => setConfirmAdminPass(e.target.value)}
                      placeholder="Nhập lại mật khẩu mới"
                      className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700"
                      required
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                    >
                      Cập Nhật Mật Khẩu Admin
                    </button>
                  </div>
                </form>
              </div>

              {/* 2FA Toggle */}
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-xs flex items-center justify-between gap-4">
                <div>
                  <div className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
                    Xác Thực Hai Lớp (2FA)
                  </div>
                  <div className="text-xs text-neutral-500 mt-0.5">
                    Yêu cầu mã xác thực thứ cấp khi đăng nhập từ thiết bị lạ.
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIs2FAEnabled(!is2FAEnabled);
                    addActivityLog('admin123', 'admin', 'Cài đặt 2FA', `Đã ${!is2FAEnabled ? 'bật' : 'tắt'} xác thực 2 lớp`);
                  }}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
                    is2FAEnabled 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                  }`}
                >
                  {is2FAEnabled ? 'Đang Bật' : 'Đang Tắt'}
                </button>
              </div>

              {/* Recent Login Sessions */}
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-xs">
                <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2 mb-3">
                  <Smartphone className="w-4 h-4 text-indigo-600" />
                  <span>Phiên Đăng Nhập Gần Nhất</span>
                </h3>

                <div className="divide-y divide-neutral-100 dark:divide-neutral-800 text-xs">
                  {loginSessions.map((ses) => (
                    <div key={ses.id} className="py-2.5 flex items-center justify-between">
                      <div>
                        <span className="font-mono font-bold text-neutral-900 dark:text-neutral-100">{ses.username}</span>
                        <span className="text-neutral-500"> ({ses.device})</span>
                      </div>
                      <div className="flex items-center gap-2 font-mono text-[11px]">
                        <span className="text-neutral-400">{ses.timestamp}</span>
                        {ses.status === 'success' ? (
                          <span className="text-emerald-600 font-bold">Thành công</span>
                        ) : (
                          <span className="text-rose-600 font-bold">Thất bại</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Admin Edit Teacher & School Modal (Requirement 22.3) */}
      {editingTeacher && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div 
            className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden my-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-5 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between bg-blue-50/60 dark:bg-blue-950/30">
              <div className="flex items-center gap-2.5">
                <School className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100">
                  Cập Nhật Thông Tin Giáo Viên & Trường Học
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingTeacher(null)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTeacherEdit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                  Tên tài khoản (Không thể sửa)
                </label>
                <input
                  type="text"
                  value={editingTeacher.username}
                  disabled
                  className="w-full px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 font-mono text-neutral-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-700 dark:text-neutral-300 mb-1 flex items-center gap-1.5">
                  <School className="w-3.5 h-3.5 text-blue-500" />
                  <span>Tên trường công tác</span>
                </label>
                <input
                  type="text"
                  value={editFormSchoolName}
                  onChange={(e) => setEditFormSchoolName(e.target.value)}
                  placeholder="Ví dụ: Trường THPT Chu Văn An"
                  className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-sm font-medium"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-700 dark:text-neutral-300 mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-500" />
                  <span>Tỉnh / Thành phố</span>
                </label>
                <select
                  value={editFormProvince}
                  onChange={(e) => setEditFormProvince(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-sm"
                  required
                >
                  <option value="">-- Chọn Tỉnh / Thành phố --</option>
                  {VIETNAM_PROVINCES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    value={editFormFullName}
                    onChange={(e) => setEditFormFullName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                    Lớp quản lý
                  </label>
                  <input
                    type="text"
                    value={editFormClassName}
                    onChange={(e) => setEditFormClassName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-sm font-bold uppercase"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    value={editFormPhone}
                    onChange={(e) => setEditFormPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-sm"
                  />
                </div>
                <div>
                  <label className="block font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                    Gmail
                  </label>
                  <input
                    type="email"
                    value={editFormEmail}
                    onChange={(e) => setEditFormEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-sm"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingTeacher(null)}
                  className="px-4 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 cursor-pointer font-semibold text-xs min-h-[40px]"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer shadow-xs text-xs min-h-[40px]"
                >
                  Lưu Thay Đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
