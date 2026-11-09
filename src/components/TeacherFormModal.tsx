import React, { useState, useEffect } from 'react';
import { Teacher, ClassRoom, TeacherStatus, Gender, SUBJECT_LIST } from '../types';
import { X, Check } from 'lucide-react';

interface TeacherFormModalProps {
  isOpen: boolean;
  teacherToEdit: Teacher | null;
  classes: ClassRoom[];
  onClose: () => void;
  onSave: (teacher: Teacher) => void;
}

export const TeacherFormModal: React.FC<TeacherFormModalProps> = ({
  isOpen,
  teacherToEdit,
  classes,
  onClose,
  onSave
}) => {
  const [fullName, setFullName] = useState('');
  const [code, setCode] = useState('');
  const [gender, setGender] = useState<Gender>('Nam');
  const [dateOfBirth, setDateOfBirth] = useState('1988-06-15');
  const [subject, setSubject] = useState(SUBJECT_LIST[0]);
  const [qualification, setQualification] = useState<'Cử nhân' | 'Thạc sĩ' | 'Tiến sĩ'>('Thạc sĩ');
  const [homeroomClassId, setHomeroomClassId] = useState<string>('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [startYear, setStartYear] = useState<number>(2015);
  const [status, setStatus] = useState<TeacherStatus>('active');
  const [bio, setBio] = useState('');

  useEffect(() => {
    if (teacherToEdit) {
      setFullName(teacherToEdit.fullName);
      setCode(teacherToEdit.code);
      setGender(teacherToEdit.gender);
      setDateOfBirth(teacherToEdit.dateOfBirth);
      setSubject(teacherToEdit.subject);
      setQualification(teacherToEdit.qualification);
      setHomeroomClassId(teacherToEdit.homeroomClassId || '');
      setPhone(teacherToEdit.phone);
      setEmail(teacherToEdit.email);
      setStartYear(teacherToEdit.startYear);
      setStatus(teacherToEdit.status);
      setBio(teacherToEdit.bio || '');
    } else {
      const randNum = Math.floor(10 + Math.random() * 90);
      setCode(`GV-${randNum}`);
      setFullName('');
      setGender('Nam');
      setDateOfBirth('1985-05-15');
      setSubject(SUBJECT_LIST[0]);
      setQualification('Thạc sĩ');
      setHomeroomClassId('');
      setPhone('');
      setEmail('');
      setStartYear(2016);
      setStatus('active');
      setBio('');
    }
  }, [teacherToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !code.trim() || !phone.trim()) {
      alert('Vui lòng điền đầy đủ: Họ tên giáo viên, Mã GV và Số điện thoại.');
      return;
    }

    const newTeacher: Teacher = {
      id: teacherToEdit ? teacherToEdit.id : `t-${Date.now()}`,
      code: code.trim(),
      fullName: fullName.trim(),
      gender,
      dateOfBirth,
      subject,
      qualification,
      homeroomClassId: homeroomClassId ? homeroomClassId : null,
      phone: phone.trim(),
      email: email.trim() || `${code.toLowerCase().replace('-', '')}@eduschool.edu.vn`,
      startYear,
      status,
      bio: bio.trim() || undefined
    };

    onSave(newTeacher);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div 
        className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl w-full max-w-2xl shadow-xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-50">
            {teacherToEdit ? 'Chỉnh Sửa Hồ Sơ Giáo Viên' : 'Thêm Giáo Viên Mới'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Mã giáo viên <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="VD: GV-10"
                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 font-mono focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Họ và tên giáo viên <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="VD: ThS. Hoàng Minh Tuấn"
                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Bộ môn giảng dạy <span className="text-rose-500">*</span>
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              >
                {SUBJECT_LIST.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Trình độ học vấn
              </label>
              <select
                value={qualification}
                onChange={(e) => setQualification(e.target.value as any)}
                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              >
                <option value="Cử nhân">Cử nhân</option>
                <option value="Thạc sĩ">Thạc sĩ</option>
                <option value="Tiến sĩ">Tiến sĩ</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Phân công chủ nhiệm
              </label>
              <select
                value={homeroomClassId}
                onChange={(e) => setHomeroomClassId(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              >
                <option value="">Không có lớp</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    Chủ nhiệm Lớp {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Giới tính & Năm sinh
              </label>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as Gender)}
                  className="px-2.5 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </select>

                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="px-2.5 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 font-mono focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Số điện thoại liên lạc <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="VD: 0912345678"
                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 font-mono focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Email công vụ
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="VD: giaovien@eduschool.edu.vn"
                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Năm bắt đầu công tác
              </label>
              <input
                type="number"
                min={1980}
                max={2026}
                value={startYear}
                onChange={(e) => setStartYear(parseInt(e.target.value) || 2020)}
                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 font-mono focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Trạng thái giảng dạy
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TeacherStatus)}
                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              >
                <option value="active">Đang giảng dạy</option>
                <option value="on_leave">Nghỉ phép / Nghỉ thai sản</option>
                <option value="retired">Đã nghỉ hưu</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Tiểu sử & Chuyên môn công tác
            </label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="VD: Kinh nghiệm luyện thi HSG, giải thưởng giáo viên dạy giỏi, các công trình nghiên cứu..."
              className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg font-medium transition-colors"
            >
              Hủy Bỏ
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Check className="w-4 h-4" />
              <span>{teacherToEdit ? 'Lưu Thay Đổi' : 'Thêm Giáo Viên'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
