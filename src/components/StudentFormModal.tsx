import React, { useState, useEffect } from 'react';
import { Student, ClassRoom, StudentStatus, Gender } from '../types';
import { X, Check } from 'lucide-react';

interface StudentFormModalProps {
  isOpen: boolean;
  studentToEdit: Student | null;
  classes: ClassRoom[];
  onClose: () => void;
  onSave: (student: Student) => void;
}

export const StudentFormModal: React.FC<StudentFormModalProps> = ({
  isOpen,
  studentToEdit,
  classes,
  onClose,
  onSave
}) => {
  const [fullName, setFullName] = useState('');
  const [code, setCode] = useState('');
  const [gender, setGender] = useState<Gender>('Nam');
  const [dateOfBirth, setDateOfBirth] = useState('2010-01-15');
  const [classId, setClassId] = useState(classes[0]?.id || '');
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [address, setAddress] = useState('');
  const [enrollmentYear, setEnrollmentYear] = useState<number>(2025);
  const [status, setStatus] = useState<StudentStatus>('active');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (studentToEdit) {
      setFullName(studentToEdit.fullName);
      setCode(studentToEdit.code);
      setGender(studentToEdit.gender);
      setDateOfBirth(studentToEdit.dateOfBirth);
      setClassId(studentToEdit.classId);
      setParentName(studentToEdit.parentName);
      setParentPhone(studentToEdit.parentPhone);
      setParentEmail(studentToEdit.parentEmail || '');
      setAddress(studentToEdit.address);
      setEnrollmentYear(studentToEdit.enrollmentYear);
      setStatus(studentToEdit.status);
      setNotes(studentToEdit.notes || '');
    } else {
      // New student defaults
      const randNum = Math.floor(100 + Math.random() * 900);
      setCode(`HS25-${randNum}`);
      setFullName('');
      setGender('Nam');
      setDateOfBirth('2010-05-20');
      setClassId(classes[0]?.id || '');
      setParentName('');
      setParentPhone('');
      setParentEmail('');
      setAddress('');
      setEnrollmentYear(2025);
      setStatus('active');
      setNotes('');
    }
  }, [studentToEdit, isOpen, classes]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !code.trim() || !parentPhone.trim()) {
      alert('Vui lòng điền đầy đủ: Họ tên học sinh, Mã HS và Số điện thoại phụ huynh.');
      return;
    }

    const newStudent: Student = {
      id: studentToEdit ? studentToEdit.id : `s-${Date.now()}`,
      code: code.trim(),
      fullName: fullName.trim(),
      gender,
      dateOfBirth,
      classId,
      address: address.trim() || 'Hà Nội',
      parentName: parentName.trim() || 'Phụ huynh học sinh',
      parentPhone: parentPhone.trim(),
      parentEmail: parentEmail.trim() || undefined,
      status,
      enrollmentYear,
      notes: notes.trim() || undefined,
      grades: studentToEdit ? studentToEdit.grades : {
        HK1: {
          'Toán học': { tx1: 8, tx2: 8.5, gk: 8, ck: 8.5, avg: 8.3 },
          'Ngữ văn': { tx1: 7.5, tx2: 8, gk: 7.5, ck: 8, avg: 7.8 },
          'Tiếng Anh': { tx1: 8, tx2: 8, gk: 8.5, ck: 8.5, avg: 8.3 },
          'Vật lý': { tx1: 8, tx2: 8, gk: 8, ck: 8, avg: 8.0 }
        },
        HK2: {}
      }
    };

    onSave(newStudent);
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
            {studentToEdit ? 'Chỉnh Sửa Thông Tin Học Sinh' : 'Thêm Học Sinh Mới'}
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
          {/* Section: Academic Identity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Mã học sinh <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="VD: HS25-001"
                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 font-mono focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Lớp học <span className="text-rose-500">*</span>
              </label>
              <select
                value={classId}
                onChange={(e) => setClassId(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    Lớp {c.name} (Khối {c.grade})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Họ và tên học sinh <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="VD: Nguyễn Minh Quân"
                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Giới tính & Ngày sinh
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

          {/* Section: Parent & Contact */}
          <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Họ tên phụ huynh
              </label>
              <input
                type="text"
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                placeholder="VD: Nguyễn Văn Quang"
                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Số điện thoại liên lạc <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={parentPhone}
                onChange={(e) => setParentPhone(e.target.value)}
                placeholder="VD: 0981123456"
                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 font-mono focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Email phụ huynh (nếu có)
              </label>
              <input
                type="email"
                value={parentEmail}
                onChange={(e) => setParentEmail(e.target.value)}
                placeholder="VD: phuhuynh@gmail.com"
                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Trạng thái học sinh
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as StudentStatus)}
                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              >
                <option value="active">Đang học</option>
                <option value="transferred">Chuyển trường</option>
                <option value="suspended">Đình chỉ</option>
                <option value="graduated">Đã tốt nghiệp</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Địa chỉ thường trú
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="VD: Số 45 Hoàng Hoa Thám, Ba Đình, Hà Nội"
              className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Ghi chú đặc biệt / Thành tích
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="VD: Lớp trưởng, tham gia đội tuyển HSG, năng khiếu văn nghệ..."
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
              <span>{studentToEdit ? 'Lưu Thay Đổi' : 'Thêm Học Sinh'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
