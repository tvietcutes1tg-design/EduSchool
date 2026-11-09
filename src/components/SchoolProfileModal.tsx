import React, { useState, useEffect } from 'react';
import { CurrentUser } from '../types';
import { VIETNAM_PROVINCES } from '../data/vietnamProvinces';
import { 
  School, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  CheckCircle2, 
  X, 
  AlertCircle,
  Building,
  GraduationCap
} from 'lucide-react';
import { loadTeacherAccounts } from '../services/storage';

interface SchoolProfileModalProps {
  isOpen: boolean;
  currentUser: CurrentUser;
  onClose: () => void;
  onSave: (updated: {
    schoolName: string;
    province: string;
    fullName: string;
    phone?: string;
    email?: string;
  }) => void;
}

export const SchoolProfileModal: React.FC<SchoolProfileModalProps> = ({
  isOpen,
  currentUser,
  onClose,
  onSave
}) => {
  const [schoolName, setSchoolName] = useState(currentUser.schoolName || 'Trường THPT Gia Viễn A');
  const [province, setProvince] = useState(currentUser.province || 'Ninh Bình');
  const [fullName, setFullName] = useState(currentUser.name || '');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSchoolName(currentUser.schoolName || 'Trường THPT Gia Viễn A');
      setProvince(currentUser.province || 'Ninh Bình');
      setFullName(currentUser.name || '');
      setError(null);
      setSuccessToast(false);

      // Load additional teacher phone and email from storage
      const accounts = loadTeacherAccounts();
      const acc = accounts.find(a => a.id === currentUser.id || a.username === currentUser.username);
      if (acc) {
        if (acc.schoolName) setSchoolName(acc.schoolName);
        if (acc.province) setProvince(acc.province);
        setPhone(acc.phone || '');
        setEmail(acc.email || '');
      }
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!schoolName.trim()) {
      setError('Vui lòng nhập tên trường đang công tác!');
      return;
    }

    if (!province.trim()) {
      setError('Vui lòng chọn Tỉnh/Thành phố tương ứng!');
      return;
    }

    if (!fullName.trim()) {
      setError('Vui lòng nhập họ và tên giáo viên!');
      return;
    }

    onSave({
      schoolName: schoolName.trim(),
      province: province.trim(),
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim()
    });

    setSuccessToast(true);
    setTimeout(() => {
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div 
        className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden my-6 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between bg-blue-50/60 dark:bg-blue-950/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-sm">
              <School className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-neutral-100">
                Thông Tin Trường & Tài Khoản
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Cập nhật thông tin trường công tác và tỉnh/thành phố của lớp bạn quản lý
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 rounded-xl text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successToast && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Đã lưu cập nhật thông tin trường và tài khoản thành công!</span>
            </div>
          )}

          {/* Readonly Class & Username tag */}
          <div className="flex flex-wrap gap-2 p-3 bg-neutral-50 dark:bg-neutral-800/60 rounded-2xl border border-neutral-200 dark:border-neutral-800 text-xs">
            <div className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-300">
              <GraduationCap className="w-4 h-4 text-blue-500" />
              <span>Lớp:</span>
              <strong className="font-mono text-blue-600 dark:text-blue-400">
                {currentUser.className || '10A1'}
              </strong>
            </div>
            {currentUser.username && (
              <div className="ml-auto flex items-center gap-1 text-neutral-500">
                <span>Tài khoản:</span>
                <span className="font-mono font-bold text-neutral-700 dark:text-neutral-300">{currentUser.username}</span>
              </div>
            )}
          </div>

          {/* 1. Tên trường */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1 flex items-center gap-1.5">
              <School className="w-3.5 h-3.5 text-blue-500" />
              <span>Tên trường học <span className="text-rose-500">*</span></span>
            </label>
            <input
              type="text"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              placeholder="Ví dụ: Trường THPT Chu Văn An, THPT Chuyên Lê Hồng Phong..."
              className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-neutral-900 dark:text-neutral-100 font-medium"
              required
            />
            <p className="text-[11px] text-neutral-500 mt-1">
              Tên trường này sẽ tự động hiển thị trên thanh tiêu đề, sổ điểm, bảng tổng kết, báo cáo và thời khóa biểu của lớp bạn.
            </p>
          </div>

          {/* 2. Tỉnh / Thành phố */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-500" />
              <span>Tỉnh / Thành phố <span className="text-rose-500">*</span></span>
            </label>
            <select
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-neutral-900 dark:text-neutral-100"
              required
            >
              <option value="">-- Chọn Tỉnh / Thành phố --</option>
              {VIETNAM_PROVINCES.map((prov) => (
                <option key={prov} value={prov}>
                  {prov}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Họ và tên GVCN */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-blue-500" />
              <span>Họ và tên Giáo viên chủ nhiệm <span className="text-rose-500">*</span></span>
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Ví dụ: Nguyễn Văn Hùng"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-neutral-900 dark:text-neutral-100"
              required
            />
          </div>

          {/* 4. SĐT & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-neutral-500" />
                <span>Số điện thoại</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0912345678"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-neutral-900 dark:text-neutral-100"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-neutral-500" />
                <span>Gmail / Email</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="teacher@school.edu.vn"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-neutral-900 dark:text-neutral-100"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-3 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 font-semibold text-xs transition-colors cursor-pointer min-h-[42px]"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center gap-2 transition-colors cursor-pointer min-h-[42px]"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Lưu Thay Đổi</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
