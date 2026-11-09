import React, { useState } from 'react';
import { ClassRoom, Teacher, Student } from '../types';
import { calculateSemesterGpa } from '../services/storage';
import { 
  School, 
  Plus, 
  Users, 
  UserCheck, 
  DoorOpen, 
  Eye, 
  Pencil, 
  Trash2, 
  X, 
  Check,
  Award
} from 'lucide-react';

interface ClassListViewProps {
  classes: ClassRoom[];
  teachers: Teacher[];
  students: Student[];
  selectedSemester: 'HK1' | 'HK2';
  isReadOnly?: boolean;
  onAddClass: (newClass: ClassRoom) => void;
  onEditClass: (updatedClass: ClassRoom) => void;
  onDeleteClass: (classId: string) => void;
  onViewClassDetail: (classRoom: ClassRoom) => void;
  onNavigateToGradebook: (classId: string) => void;
  onNavigateToAttendance: (classId: string) => void;
}

export const ClassListView: React.FC<ClassListViewProps> = ({
  classes,
  teachers,
  students,
  selectedSemester,
  isReadOnly = false,
  onAddClass,
  onEditClass,
  onDeleteClass,
  onViewClassDetail,
  onNavigateToGradebook,
  onNavigateToAttendance
}) => {
  const [selectedGradeTab, setSelectedGradeTab] = useState<'all' | number>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassRoom | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [grade, setGrade] = useState<number>(10);
  const [roomNumber, setRoomNumber] = useState('');
  const [homeroomTeacherId, setHomeroomTeacherId] = useState<string>('');
  const [maxStudents, setMaxStudents] = useState<number>(40);

  const filteredClasses = classes.filter((c) => {
    if (selectedGradeTab === 'all') return true;
    return c.grade === selectedGradeTab;
  });

  const handleOpenAdd = () => {
    setEditingClass(null);
    setName('');
    setGrade(10);
    setRoomNumber('P.103');
    setHomeroomTeacherId('');
    setMaxStudents(40);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: ClassRoom) => {
    setEditingClass(c);
    setName(c.name);
    setGrade(c.grade);
    setRoomNumber(c.roomNumber);
    setHomeroomTeacherId(c.homeroomTeacherId || '');
    setMaxStudents(c.maxStudents);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !roomNumber.trim()) {
      alert('Vui lòng điền tên lớp và số phòng học.');
      return;
    }

    if (editingClass) {
      onEditClass({
        ...editingClass,
        name: name.trim(),
        grade,
        roomNumber: roomNumber.trim(),
        homeroomTeacherId: homeroomTeacherId || null,
        maxStudents
      });
    } else {
      const newClass: ClassRoom = {
        id: `c-${Date.now()}`,
        name: name.trim(),
        grade,
        schoolYear: '2026-2027',
        roomNumber: roomNumber.trim(),
        homeroomTeacherId: homeroomTeacherId || null,
        maxStudents
      };
      onAddClass(newClass);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 flex items-center gap-2">
            <School className="w-5 h-5 text-blue-600" />
            <span>Quản Lý Lớp Học & Phòng Học</span>
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Danh sách các lớp học khối 10, 11, 12, phân công giáo viên chủ nhiệm và phòng học năm học 2026-2027
          </p>
        </div>

        {!isReadOnly && (
          <button
            type="button"
            onClick={handleOpenAdd}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo Lớp Học Mới</span>
          </button>
        )}
      </div>

      {/* Grade Filter Tabs */}
      <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-xs font-medium w-fit">
        <button
          type="button"
          onClick={() => setSelectedGradeTab('all')}
          className={`px-3 py-1.5 rounded-md transition-colors ${
            selectedGradeTab === 'all'
              ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 shadow-xs'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
          }`}
        >
          Tất cả các khối ({classes.length})
        </button>
        <button
          type="button"
          onClick={() => setSelectedGradeTab(10)}
          className={`px-3 py-1.5 rounded-md transition-colors ${
            selectedGradeTab === 10
              ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 shadow-xs'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
          }`}
        >
          Khối 10 ({classes.filter((c) => c.grade === 10).length})
        </button>
        <button
          type="button"
          onClick={() => setSelectedGradeTab(11)}
          className={`px-3 py-1.5 rounded-md transition-colors ${
            selectedGradeTab === 11
              ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 shadow-xs'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
          }`}
        >
          Khối 11 ({classes.filter((c) => c.grade === 11).length})
        </button>
        <button
          type="button"
          onClick={() => setSelectedGradeTab(12)}
          className={`px-3 py-1.5 rounded-md transition-colors ${
            selectedGradeTab === 12
              ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 shadow-xs'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
          }`}
        >
          Khối 12 ({classes.filter((c) => c.grade === 12).length})
        </button>
      </div>

      {/* Class Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClasses.map((cls) => {
          const teacher = teachers.find((t) => t.id === cls.homeroomTeacherId);
          const classStudents = students.filter((s) => s.classId === cls.id);
          const studentCount = classStudents.length;

          // Compute Class Average GPA
          const classGpas = classStudents
            .map((s) => calculateSemesterGpa(s, selectedSemester))
            .filter((g): g is number => g !== undefined);
          const classAvgGpa = classGpas.length > 0 
            ? +(classGpas.reduce((a, b) => a + b, 0) / classGpas.length).toFixed(1)
            : undefined;

          return (
            <div
              key={cls.id}
              className="p-5 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all flex flex-col justify-between shadow-xs"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                      Lớp {cls.name}
                    </h3>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                      Khối {cls.grade} · Niên khóa {cls.schoolYear}
                    </div>
                  </div>

                    {!isReadOnly && (
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(cls)}
                          title="Sửa thông tin lớp"
                          className="p-1.5 text-neutral-400 hover:text-amber-600 dark:hover:text-amber-400 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Bạn có chắc chắn muốn xóa lớp "${cls.name}"?`)) {
                              onDeleteClass(cls.id);
                            }
                          }}
                          title="Xóa lớp học"
                          className="p-1.5 text-neutral-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                </div>

                <div className="mt-4 space-y-2.5 text-xs">
                  {/* Homeroom teacher */}
                  <div className="flex items-center justify-between py-1.5 border-b border-neutral-100 dark:border-neutral-800">
                    <span className="text-neutral-500 flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-neutral-400" />
                      <span>GV Chủ nhiệm:</span>
                    </span>
                    <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                      {teacher ? teacher.fullName : 'Chưa phân công'}
                    </span>
                  </div>

                  {/* Room number */}
                  <div className="flex items-center justify-between py-1.5 border-b border-neutral-100 dark:border-neutral-800">
                    <span className="text-neutral-500 flex items-center gap-1.5">
                      <DoorOpen className="w-3.5 h-3.5 text-neutral-400" />
                      <span>Phòng học:</span>
                    </span>
                    <span className="font-mono font-medium text-neutral-800 dark:text-neutral-200">
                      {cls.roomNumber}
                    </span>
                  </div>

                  {/* Student count */}
                  <div className="flex items-center justify-between py-1.5 border-b border-neutral-100 dark:border-neutral-800">
                    <span className="text-neutral-500 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-neutral-400" />
                      <span>Sĩ số hiện tại:</span>
                    </span>
                    <span className="font-mono font-medium text-neutral-800 dark:text-neutral-200">
                      {studentCount} / {cls.maxStudents} HS
                    </span>
                  </div>

                  {/* Average GPA */}
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-neutral-500 flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-amber-500" />
                      <span>ĐTB Lớp ({selectedSemester}):</span>
                    </span>
                    <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                      {classAvgGpa !== undefined ? `${classAvgGpa} / 10.0` : '—'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-5 pt-3 border-t border-neutral-100 dark:border-neutral-800 grid grid-cols-3 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => onViewClassDetail(cls)}
                  className="py-1.5 px-2 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg font-medium transition-colors text-center"
                >
                  Xem Sĩ Số
                </button>
                <button
                  type="button"
                  onClick={() => onNavigateToGradebook(cls.id)}
                  className="py-1.5 px-2 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg font-medium transition-colors text-center"
                >
                  Sổ Điểm
                </button>
                <button
                  type="button"
                  onClick={() => onNavigateToAttendance(cls.id)}
                  className="py-1.5 px-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-lg font-medium transition-colors text-center"
                >
                  Điểm Danh
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Add / Edit Class */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div 
            className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl w-full max-w-md shadow-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-50">
                {editingClass ? 'Sửa Thông Tin Lớp Học' : 'Thêm Lớp Học Mới'}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-neutral-400 hover:text-neutral-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Tên lớp học <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="VD: 10A3"
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Khối lớp
                  </label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(parseInt(e.target.value) || 10)}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value={10}>Khối 10</option>
                    <option value={11}>Khối 11</option>
                    <option value={12}>Khối 12</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Phòng học cố định
                  </label>
                  <input
                    type="text"
                    required
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    placeholder="VD: P.103"
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 font-mono focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Giáo viên chủ nhiệm
                </label>
                <select
                  value={homeroomTeacherId}
                  onChange={(e) => setHomeroomTeacherId(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">Chưa phân công giáo viên</option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.fullName} ({t.subject} - {t.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Sĩ số tối đa
                </label>
                <input
                  type="number"
                  min={20}
                  max={50}
                  value={maxStudents}
                  onChange={(e) => setMaxStudents(parseInt(e.target.value) || 40)}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 font-mono focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 rounded-lg font-medium transition-colors"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingClass ? 'Lưu Lớp' : 'Tạo Lớp'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
