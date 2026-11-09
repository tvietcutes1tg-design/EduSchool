import React, { useState } from 'react';
import { CurrentUser, ClassRoom, TeacherAccount, ClassHandover } from '../types';
import { 
  ArrowRightLeft, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  UserCheck, 
  KeyRound, 
  School,
  Lock
} from 'lucide-react';
import { 
  loadTeacherAccounts, 
  saveTeacherAccounts, 
  hashPassword, 
  addClassHandover,
  addActivityLog 
} from '../services/storage';

interface ClassHandoverModalProps {
  isOpen: boolean;
  currentUser: CurrentUser;
  classroom: ClassRoom;
  onClose: () => void;
  onHandoverSuccess: (updatedAccount: TeacherAccount, newClassName: string) => void;
}

export const ClassHandoverModal: React.FC<ClassHandoverModalProps> = ({
  isOpen,
  currentUser,
  classroom,
  onClose,
  onHandoverSuccess
}) => {
  const [newTeacherName, setNewTeacherName] = useState('');
  const [newTeacherUsername, setNewTeacherUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newClassName, setNewClassName] = useState(classroom.name);
  const [handoverNote, setHandoverNote] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!newTeacherName.trim()) {
      setError('Vui lòng nhập họ và tên giáo viên chủ nhiệm mới!');
      return;
    }

    if (!newTeacherUsername.trim()) {
      setError('Vui lòng nhập tên đăng nhập cho giáo viên mới!');
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setError('Mật khẩu mới phải có tối thiểu 6 ký tự!');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Xác nhận mật khẩu mới không khớp!');
      return;
    }

    if (!newClassName.trim()) {
      setError('Vui lòng nhập tên lớp học tiếp nhận!');
      return;
    }

    const accounts = loadTeacherAccounts();
    const cleanUsername = newTeacherUsername.trim().toLowerCase();
    const cleanClassName = newClassName.trim().toUpperCase();

    // Find current account or update it
    const currentAccount = accounts.find(a => a.username.toLowerCase() === (currentUser.username || '').toLowerCase()) || accounts[0];

    // Create updated account for new teacher
    const updatedAccount: TeacherAccount = {
      ...currentAccount,
      fullName: newTeacherName.trim(),
      username: cleanUsername,
      passwordHash: hashPassword(newPassword),
      className: cleanClassName,
      createdAt: new Date().toISOString().slice(0, 10),
      status: 'active'
    };

    const updatedAccountsList = accounts.map(a => a.id === currentAccount.id ? updatedAccount : a);
    saveTeacherAccounts(updatedAccountsList);

    // Record handover
    const handoverRecord: ClassHandover = {
      id: `ho-${Date.now()}`,
      classId: classroom.id,
      oldTeacherName: currentUser.name,
      oldTeacherUsername: currentUser.username || currentUser.code,
      newTeacherName: newTeacherName.trim(),
      newTeacherUsername: cleanUsername,
      handoverDate: new Date().toISOString().slice(0, 10),
      previousClassName: classroom.name,
      newClassName: cleanClassName,
      notes: handoverNote.trim() || undefined
    };

    addClassHandover(handoverRecord);
    addActivityLog(
      currentUser.username || 'gvcn', 
      'teacher', 
      'Bàn giao lớp học', 
      `Bàn giao lớp ${classroom.name} cho Thầy/Cô ${newTeacherName} (tên lớp mới: ${cleanClassName})`
    );

    alert(`Bàn giao lớp thành công cho ${newTeacherName}! Tên lớp đã được cập nhật thành "${cleanClassName}".`);
    onHandoverSuccess(updatedAccount, cleanClassName);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div 
        className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden my-6 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-700 to-indigo-700 text-white relative">
          <button 
            type="button" 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 text-white/90 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1 text-xs uppercase tracking-wider font-semibold text-blue-200">
            <ArrowRightLeft className="w-4 h-4" />
            <span>Nhiệm Kỳ Năm Học 2026 - 2027</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight">
            Bàn Giao Quản Lý Lớp & Tài Khoản
          </h2>
          <p className="text-xs text-blue-100 mt-0.5">
            Chuyển giao quyền quản lý lớp {classroom.name} cho giáo viên chủ nhiệm mới.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 text-xs">
          {error && (
            <div className="p-3 bg-rose-50 text-rose-800 font-semibold rounded-xl flex items-center gap-2 border border-rose-200">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="p-3 bg-neutral-50 dark:bg-neutral-800/60 rounded-xl space-y-1 text-neutral-600 dark:text-neutral-400">
            <div>GVCN hiện tại bàn giao: <strong>{currentUser.name}</strong></div>
            <div>Lớp hiện tại: <strong>Lớp {classroom.name}</strong></div>
          </div>

          <div>
            <label className="block font-bold text-neutral-700 dark:text-neutral-300 mb-1">
              Họ và tên Giáo viên chủ nhiệm mới <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={newTeacherName}
              onChange={(e) => setNewTeacherName(e.target.value)}
              placeholder="Ví dụ: Cô Nguyễn Thị Thu Hà"
              className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-neutral-700 dark:text-neutral-300 mb-1">
              Tên đăng nhập mới của lớp <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={newTeacherUsername}
              onChange={(e) => setNewTeacherUsername(e.target.value)}
              placeholder="Ví dụ: thuha.gv"
              className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                Mật khẩu mới <span className="text-rose-500">*</span>
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Tối thiểu 6 ký tự"
                className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                Xác nhận mật khẩu <span className="text-rose-500">*</span>
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Nhập lại mật khẩu"
                className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-neutral-700 dark:text-neutral-300 mb-1">
              Tên lớp mới (nếu chuyển lớp lên năm sau) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={newClassName}
              onChange={(e) => setNewClassName(e.target.value)}
              placeholder="Ví dụ: 11A1, 10B8..."
              className="w-full px-3 py-2 text-sm font-bold uppercase rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 focus:ring-2 focus:ring-blue-500"
              required
            />
            <div className="text-[11px] text-neutral-500 mt-1">
              Sau khi nhận bàn giao, tên lớp sẽ tự động cập nhật theo tên mới này.
            </div>
          </div>

          <div>
            <label className="block font-bold text-neutral-700 dark:text-neutral-300 mb-1">
              Ghi chú bàn giao
            </label>
            <textarea
              value={handoverNote}
              onChange={(e) => setHandoverNote(e.target.value)}
              placeholder="Ví dụ: Đã bàn giao đủ hồ sơ giấy, sổ chủ nhiệm, tài khoản quản lý..."
              rows={2}
              className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Xác Nhận Bàn Giao</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
