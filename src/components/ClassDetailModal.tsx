import React from 'react';
import { ClassRoom, Teacher, Student } from '../types';
import { calculateSemesterGpa, getAcademicRank } from '../services/storage';
import { 
  X, 
  Users, 
  DoorOpen, 
  UserCheck, 
  Printer, 
  Award,
  Phone
} from 'lucide-react';

interface ClassDetailModalProps {
  classRoom: ClassRoom | null;
  teachers: Teacher[];
  students: Student[];
  selectedSemester: 'HK1' | 'HK2';
  onClose: () => void;
  onViewStudent: (student: Student) => void;
}

export const ClassDetailModal: React.FC<ClassDetailModalProps> = ({
  classRoom,
  teachers,
  students,
  selectedSemester,
  onClose,
  onViewStudent
}) => {
  if (!classRoom) return null;

  const homeroomTeacher = teachers.find((t) => t.id === classRoom.homeroomTeacherId);
  const classStudents = students.filter((s) => s.classId === classRoom.id);

  // Class rank breakdown
  const rankStats = {
    'Xuất sắc': 0,
    'Giỏi': 0,
    'Khá': 0,
    'Trung bình': 0,
    'Yếu': 0
  };

  classStudents.forEach((st) => {
    const gpa = calculateSemesterGpa(st, selectedSemester);
    const r = getAcademicRank(gpa, st, selectedSemester);
    rankStats[r] = (rankStats[r] || 0) + 1;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div 
        className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl w-full max-w-4xl shadow-xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 flex items-start justify-between gap-4 bg-neutral-50/50 dark:bg-neutral-800/30">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-50">
                Thông Tin Chi Tiết Lớp {classRoom.name}
              </h2>
              <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-neutral-200/70 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200">
                {classRoom.roomNumber}
              </span>
            </div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 flex flex-wrap items-center gap-3">
              <span>Khối: <strong className="text-neutral-800 dark:text-neutral-200">{classRoom.grade}</strong></span>
              <span>·</span>
              <span>Sĩ số: <strong className="font-mono text-neutral-800 dark:text-neutral-200">{classStudents.length}/{classRoom.maxStudents} HS</strong></span>
              <span>·</span>
              <span>GVCN: <strong className="text-neutral-800 dark:text-neutral-200">{homeroomTeacher?.fullName || 'Chưa phân công'}</strong></span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-200 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Printer className="w-3.5 h-3.5 text-neutral-500" />
              <span>In Danh Sách Lớp</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-neutral-600 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto text-xs">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
            <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-emerald-50/40 dark:bg-emerald-950/20">
              <span className="text-[11px] text-neutral-500 block">Xuất sắc</span>
              <span className="text-lg font-bold font-mono text-emerald-600">{rankStats['Xuất sắc']}</span>
            </div>
            <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-blue-50/40 dark:bg-blue-950/20">
              <span className="text-[11px] text-neutral-500 block">Giỏi</span>
              <span className="text-lg font-bold font-mono text-blue-600">{rankStats['Giỏi']}</span>
            </div>
            <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-sky-50/40 dark:bg-sky-950/20">
              <span className="text-[11px] text-neutral-500 block">Khá</span>
              <span className="text-lg font-bold font-mono text-sky-600">{rankStats['Khá']}</span>
            </div>
            <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-amber-50/40 dark:bg-amber-950/20">
              <span className="text-[11px] text-neutral-500 block">Trung bình</span>
              <span className="text-lg font-bold font-mono text-amber-600">{rankStats['Trung bình']}</span>
            </div>
            <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-rose-50/40 dark:bg-rose-950/20">
              <span className="text-[11px] text-neutral-500 block">Yếu</span>
              <span className="text-lg font-bold font-mono text-rose-600">{rankStats['Yếu']}</span>
            </div>
          </div>

          {/* Student Roster Table */}
          <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-xs">
            <div className="px-4 py-3 bg-neutral-50 dark:bg-neutral-800/40 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                <span>Danh Sách Học Sinh Trong Lớp ({classStudents.length} học sinh)</span>
              </h3>
            </div>

            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-neutral-50/50 dark:bg-neutral-800/20 border-b border-neutral-200 dark:border-neutral-800 text-[11px] font-semibold text-neutral-500">
                  <th className="py-2.5 px-4">STT</th>
                  <th className="py-2.5 px-3">Mã HS</th>
                  <th className="py-2.5 px-3">Họ và tên</th>
                  <th className="py-2.5 px-3">Giới tính</th>
                  <th className="py-2.5 px-3">Ngày sinh</th>
                  <th className="py-2.5 px-3">Phụ huynh & SĐT</th>
                  <th className="py-2.5 px-3 text-right">ĐTB ({selectedSemester})</th>
                  <th className="py-2.5 px-3">Xếp loại</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {classStudents.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-neutral-400">
                      Chưa có học sinh nào được xếp vào lớp này.
                    </td>
                  </tr>
                ) : (
                  classStudents.map((st, idx) => {
                    const gpa = calculateSemesterGpa(st, selectedSemester);
                    const rank = getAcademicRank(gpa, st, selectedSemester);
                    return (
                      <tr
                        key={st.id}
                        onClick={() => {
                          onClose();
                          onViewStudent(st);
                        }}
                        className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40 cursor-pointer transition-colors"
                      >
                        <td className="py-2.5 px-4 font-mono text-neutral-400">
                          {idx + 1}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-neutral-500">
                          {st.code}
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-neutral-900 dark:text-neutral-100">
                          {st.fullName}
                        </td>
                        <td className="py-2.5 px-3 text-neutral-600 dark:text-neutral-400">
                          {st.gender}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-neutral-500">
                          {st.dateOfBirth}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="text-neutral-800 dark:text-neutral-200">{st.parentName}</span>
                          <span className="text-neutral-400 font-mono ml-1">({st.parentPhone})</span>
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold font-mono text-blue-600 dark:text-blue-400">
                          {gpa ?? '—'}
                        </td>
                        <td className="py-2.5 px-3 font-medium text-neutral-800 dark:text-neutral-200">
                          {rank}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
