import React, { useState } from 'react';
import { 
  BookOpen, 
  Plus, 
  Pencil, 
  Trash2, 
  X, 
  Check, 
  AlertTriangle, 
  CheckCircle2, 
  Info 
} from 'lucide-react';
import { Student } from '../types';

interface SubjectManagementModalProps {
  isOpen: boolean;
  classId: string;
  className: string;
  subjects: string[];
  students: Student[];
  onClose: () => void;
  onUpdateSubjects: (updatedSubjects: string[]) => void;
}

export const SubjectManagementModal: React.FC<SubjectManagementModalProps> = ({
  isOpen,
  classId,
  className,
  subjects,
  students,
  onClose,
  onUpdateSubjects
}) => {
  const [subjectList, setSubjectList] = useState<string[]>(subjects);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editSubjectName, setEditSubjectName] = useState('');

  // Delete Confirmation State (Requirement 20)
  const [subjectToDelete, setSubjectToDelete] = useState<string | null>(null);
  const [hasExistingGrades, setHasExistingGrades] = useState(false);

  if (!isOpen) return null;

  // Check if subject has existing grades in the class
  const checkSubjectGradesExist = (subjectName: string): boolean => {
    return students.some(st => {
      const hk1Grades = st.grades?.HK1?.[subjectName];
      const hk2Grades = st.grades?.HK2?.[subjectName];
      const hasHK1 = hk1Grades && (hk1Grades.tx1 !== undefined || hk1Grades.tx2 !== undefined || hk1Grades.gk !== undefined || hk1Grades.ck !== undefined || hk1Grades.avg !== undefined);
      const hasHK2 = hk2Grades && (hk2Grades.tx1 !== undefined || hk2Grades.tx2 !== undefined || hk2Grades.gk !== undefined || hk2Grades.ck !== undefined || hk2Grades.avg !== undefined);
      return hasHK1 || hasHK2;
    });
  };

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = newSubjectName.trim();
    if (!cleanName) return;
    if (subjectList.includes(cleanName)) {
      alert(`Môn học "${cleanName}" đã có trong danh sách!`);
      return;
    }

    const updated = [...subjectList, cleanName];
    setSubjectList(updated);
    onUpdateSubjects(updated);
    setNewSubjectName('');
  };

  const handleStartEdit = (index: number) => {
    setEditingIndex(index);
    setEditSubjectName(subjectList[index]);
  };

  const handleSaveEdit = (index: number) => {
    const cleanName = editSubjectName.trim();
    if (!cleanName) return;
    if (subjectList.includes(cleanName) && subjectList[index] !== cleanName) {
      alert(`Môn học "${cleanName}" đã tồn tại!`);
      return;
    }

    const updated = [...subjectList];
    updated[index] = cleanName;
    setSubjectList(updated);
    onUpdateSubjects(updated);
    setEditingIndex(null);
  };

  // Trigger Confirmation Modal for Deletion
  const handleInitiateDelete = (subjectName: string) => {
    const gradesExist = checkSubjectGradesExist(subjectName);
    setHasExistingGrades(gradesExist);
    setSubjectToDelete(subjectName);
  };

  const handleConfirmDelete = () => {
    if (!subjectToDelete) return;
    const updated = subjectList.filter(s => s !== subjectToDelete);
    setSubjectList(updated);
    onUpdateSubjects(updated);
    setSubjectToDelete(null);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        <div 
          className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden my-6 transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white relative">
            <button 
              type="button" 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 text-white/90 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-1 text-xs uppercase tracking-wider font-semibold text-blue-200">
              <BookOpen className="w-4 h-4" />
              <span>Thiết Lập Môn Học Lớp {className}</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight">
              Quản Lý Danh Sách Môn Học
            </h2>
            <p className="text-xs text-blue-100 mt-0.5">
              Tự do thêm, sửa tên hoặc bỏ bớt môn học theo chương trình thực tế của lớp.
            </p>
          </div>

          {/* Body */}
          <div className="p-5 sm:p-6 space-y-5">
            {/* Add Subject Input */}
            <form onSubmit={handleAddSubject} className="flex gap-2">
              <input
                type="text"
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
                placeholder="Nhập tên môn học mới (vd: Âm nhạc, Mỹ thuật, Tin học ứng dụng...)"
                className="flex-1 px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-xs flex items-center gap-1.5 cursor-pointer whitespace-nowrap min-h-[40px]"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm môn</span>
              </button>
            </form>

            {/* List of current subjects */}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2 flex items-center justify-between">
                <span>Các môn đang giảng dạy ({subjectList.length})</span>
                <span className="text-[11px] font-normal normal-case text-neutral-400">
                  Tự động đồng bộ vào Bảng điểm
                </span>
              </div>

              <div className="divide-y divide-neutral-100 dark:divide-neutral-800 max-h-80 overflow-y-auto border border-neutral-200 dark:border-neutral-800 rounded-2xl">
                {subjectList.map((subject, index) => {
                  const isEditing = editingIndex === index;

                  return (
                    <div key={subject} className="p-3 flex items-center justify-between gap-3 hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40">
                      {isEditing ? (
                        <div className="flex-1 flex items-center gap-2">
                          <input
                            type="text"
                            value={editSubjectName}
                            onChange={(e) => setEditSubjectName(e.target.value)}
                            className="flex-1 px-2.5 py-1 text-xs rounded-lg border border-blue-400 bg-white dark:bg-neutral-800"
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveEdit(index)}
                            className="p-1.5 rounded-lg bg-emerald-600 text-white cursor-pointer"
                            title="Lưu"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingIndex(null)}
                            className="p-1.5 rounded-lg bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 cursor-pointer"
                            title="Hủy"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-2.5">
                            <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold text-xs flex items-center justify-center font-mono">
                              {index + 1}
                            </span>
                            <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                              {subject}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleStartEdit(index)}
                              className="p-1.5 rounded-lg text-neutral-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 cursor-pointer"
                              title="Sửa tên môn"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleInitiateDelete(subject)}
                              className="p-1.5 rounded-lg text-neutral-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                              title="Xóa môn học"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-xs cursor-pointer"
              >
                Hoàn tất & Đóng
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* REQUIREMENT 20: XÁC NHẬN TRƯỚC KHI XÓA MÔN HỌC                 */}
      {/* ============================================================== */}
      {subjectToDelete && (
        <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div 
            className="bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-2xl w-full max-w-md p-5 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-950/60 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100">
                  Xác Nhận Xóa Môn Học
                </h3>
                <div className="text-xs text-neutral-500">
                  Môn học sắp bị xóa: <strong>{subjectToDelete}</strong>
                </div>
              </div>
            </div>

            <div className="text-xs text-neutral-600 dark:text-neutral-400 space-y-2">
              <p>
                Môn học <strong>"{subjectToDelete}"</strong> sẽ bị loại khỏi danh sách môn học đang sử dụng của Lớp {className}.
              </p>
              {hasExistingGrades && (
                <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl text-amber-900 dark:text-amber-200 text-xs">
                  <strong>⚠️ Cảnh báo dữ liệu điểm:</strong> Môn học này đã có dữ liệu điểm được nhập trước đó. Hệ thống sẽ giữ lại dữ liệu điểm để bảo toàn lịch sử học bạ và có thể khôi phục khi cần thiết.
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSubjectToDelete(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xác nhận xóa</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
