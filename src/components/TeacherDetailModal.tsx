import React, { useState } from 'react';
import { Teacher, ClassRoom, Student, ScheduleItem } from '../types';
import { calculateSemesterGpa } from '../services/storage';
import { 
  X, 
  Phone, 
  Mail, 
  School, 
  Calendar, 
  Users, 
  Briefcase, 
  BookOpen
} from 'lucide-react';

interface TeacherDetailModalProps {
  teacher: Teacher | null;
  classes: ClassRoom[];
  students: Student[];
  schedule: ScheduleItem[];
  isReadOnly?: boolean;
  onClose: () => void;
  onEdit: (teacher: Teacher) => void;
  onViewStudent: (student: Student) => void;
}

export const TeacherDetailModal: React.FC<TeacherDetailModalProps> = ({
  teacher,
  classes,
  students,
  schedule,
  isReadOnly = false,
  onClose,
  onEdit,
  onViewStudent
}) => {
  const [activeTab, setActiveTab] = useState<'schedule' | 'homeroom' | 'info'>('schedule');

  if (!teacher) return null;

  const homeroomClass = classes.find((c) => c.id === teacher.homeroomClassId);
  const homeroomStudents = homeroomClass
    ? students.filter((s) => s.classId === homeroomClass.id)
    : [];

  // Filter weekly schedule for this teacher
  const teacherSchedule = schedule.filter((s) => s.teacherId === teacher.id);

  // Group schedule by day of week (2 to 7) and period (1 to 9)
  const scheduleMatrix: Record<number, Record<number, ScheduleItem | undefined>> = {
    2: {}, 3: {}, 4: {}, 5: {}, 6: {}, 7: {}
  };
  teacherSchedule.forEach((item) => {
    if (scheduleMatrix[item.dayOfWeek]) {
      scheduleMatrix[item.dayOfWeek][item.period] = item;
    }
  });

  const days = [
    { day: 2, label: 'Thứ Hai' },
    { day: 3, label: 'Thứ Ba' },
    { day: 4, label: 'Thứ Tư' },
    { day: 5, label: 'Thứ Năm' },
    { day: 6, label: 'Thứ Sáu' },
    { day: 7, label: 'Thứ Bảy' }
  ];

  const periods = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div 
        className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl w-full max-w-4xl shadow-xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 flex items-start justify-between gap-4 bg-neutral-50/50 dark:bg-neutral-800/30">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-emerald-600 text-white font-bold text-xl flex items-center justify-center shadow-xs">
              {teacher.fullName.slice(-1)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-50">
                  {teacher.fullName}
                </h2>
                <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-neutral-200/70 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200">
                  {teacher.code}
                </span>
              </div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 flex flex-wrap items-center gap-3">
                <span>Bộ môn: <strong className="text-neutral-800 dark:text-neutral-200">{teacher.subject}</strong></span>
                <span>·</span>
                <span>Trình độ: <strong className="text-neutral-800 dark:text-neutral-200">{teacher.qualification}</strong></span>
                <span>·</span>
                <span>Chủ nhiệm: <strong className="text-neutral-800 dark:text-neutral-200">{homeroomClass ? `Lớp ${homeroomClass.name}` : 'Không'}</strong></span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isReadOnly && (
              <button
                type="button"
                onClick={() => onEdit(teacher)}
                className="px-3 py-1.5 text-xs font-medium text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 rounded-lg transition-colors"
              >
                Chỉnh Sửa
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-6 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('schedule')}
            className={`py-3.5 border-b-2 transition-colors ${
              activeTab === 'schedule'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100'
            }`}
          >
            Lịch Giảng Dạy Tuần
          </button>
          {homeroomClass && (
            <button
              type="button"
              onClick={() => setActiveTab('homeroom')}
              className={`py-3.5 border-b-2 transition-colors ${
                activeTab === 'homeroom'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100'
              }`}
            >
              Lớp ({homeroomClass.name} - {homeroomStudents.length} HS)
            </button>
          )}
          <button
            type="button"
            onClick={() => setActiveTab('info')}
            className={`py-3.5 border-b-2 transition-colors ${
              activeTab === 'info'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100'
            }`}
          >
            Hồ Sơ & Tiểu Sử
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {/* Schedule View */}
          {activeTab === 'schedule' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-neutral-500">
                <span>Tổng số tiết giảng dạy trong tuần: <strong className="text-neutral-900 dark:text-neutral-100 font-mono">{teacherSchedule.length} tiết</strong></span>
                <span>Buổi sáng: Tiết 1 - 5 | Buổi chiều: Tiết 6 - 9</span>
              </div>

              <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-xs text-center">
                    <thead>
                      <tr className="bg-neutral-50 dark:bg-neutral-800/60 border-b border-neutral-200 dark:border-neutral-800 text-[11px] font-semibold text-neutral-500">
                        <th className="py-2.5 px-3 w-16 text-left">Tiết</th>
                        {days.map((d) => (
                          <th key={d.day} className="py-2.5 px-3 min-w-[110px]">
                            {d.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                      {periods.map((period) => (
                        <tr key={period} className="hover:bg-neutral-50/40 dark:hover:bg-neutral-800/20">
                          <td className="py-2.5 px-3 text-left font-mono font-medium text-neutral-400">
                            Tiết {period}
                          </td>
                          {days.map((d) => {
                            const item = scheduleMatrix[d.day]?.[period];
                            const cls = item ? classes.find((c) => c.id === item.classId)?.name : null;
                            return (
                              <td key={d.day} className="py-2 px-2">
                                {item ? (
                                  <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-left">
                                    <div className="font-semibold text-blue-900 dark:text-blue-200">
                                      Lớp {cls}
                                    </div>
                                    <div className="text-[11px] text-blue-700 dark:text-blue-300">
                                      {item.subject}
                                    </div>
                                    <div className="text-[10px] text-neutral-400 font-mono mt-0.5">
                                      {item.room}
                                    </div>
                                  </div>
                                ) : (
                                  <span className="text-neutral-300 dark:text-neutral-700">—</span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Homeroom View */}
          {activeTab === 'homeroom' && homeroomClass && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-neutral-500">
                <span>
                  Danh sách học sinh lớp <strong className="text-neutral-900 dark:text-neutral-100">{homeroomClass.name}</strong> ({homeroomStudents.length} học sinh)
                </span>
                <span>Phòng sinh hoạt: <strong className="font-mono text-neutral-900 dark:text-neutral-100">{homeroomClass.roomNumber}</strong></span>
              </div>

              <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-neutral-50 dark:bg-neutral-800/60 border-b border-neutral-200 dark:border-neutral-800 text-[11px] font-semibold text-neutral-500">
                      <th className="py-2.5 px-4">Họ và tên</th>
                      <th className="py-2.5 px-3">Giới tính</th>
                      <th className="py-2.5 px-3">Ngày sinh</th>
                      <th className="py-2.5 px-3">Phụ huynh & SĐT</th>
                      <th className="py-2.5 px-3 text-right">ĐTB (HK1)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                    {homeroomStudents.map((st) => {
                      const gpa = calculateSemesterGpa(st, 'HK1');
                      return (
                        <tr
                          key={st.id}
                          onClick={() => {
                            onClose();
                            onViewStudent(st);
                          }}
                          className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40 cursor-pointer"
                        >
                          <td className="py-2.5 px-4 font-medium text-neutral-900 dark:text-neutral-100">
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
                            <span className="text-neutral-400 font-mono ml-1.5">({st.parentPhone})</span>
                          </td>
                          <td className="py-2.5 px-3 text-right font-bold font-mono text-blue-600 dark:text-blue-400">
                            {gpa ?? '—'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Info View */}
          {activeTab === 'info' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 space-y-3">
                <h3 className="font-semibold text-neutral-400 uppercase tracking-wider text-[11px]">
                  Lý lịch chuyên môn
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800">
                    <span className="text-neutral-500">Họ và tên:</span>
                    <span className="font-semibold text-neutral-900 dark:text-neutral-100">{teacher.fullName}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800">
                    <span className="text-neutral-500">Bộ môn giảng dạy:</span>
                    <span className="font-semibold text-neutral-900 dark:text-neutral-100">{teacher.subject}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800">
                    <span className="text-neutral-500">Trình độ đào tạo:</span>
                    <span className="text-neutral-800 dark:text-neutral-200">{teacher.qualification}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800">
                    <span className="text-neutral-500">Năm bắt đầu giảng dạy:</span>
                    <span className="font-mono text-neutral-800 dark:text-neutral-200">{teacher.startYear}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-neutral-500">Trạng thái công tác:</span>
                    <span className="text-emerald-600 font-medium">Đang giảng dạy</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 space-y-3">
                <h3 className="font-semibold text-neutral-400 uppercase tracking-wider text-[11px]">
                  Liên hệ & Giới thiệu
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800">
                    <span className="text-neutral-500">Số điện thoại:</span>
                    <a href={`tel:${teacher.phone}`} className="font-mono text-blue-600 hover:underline">
                      {teacher.phone}
                    </a>
                  </div>
                  <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800">
                    <span className="text-neutral-500">Hòm thư điện tử (Email):</span>
                    <a href={`mailto:${teacher.email}`} className="text-blue-600 hover:underline">
                      {teacher.email}
                    </a>
                  </div>
                  <div className="pt-2">
                    <span className="text-neutral-500 block mb-1">Tiểu sử & Chuyên môn:</span>
                    <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed bg-neutral-50 dark:bg-neutral-800/40 p-3 rounded-lg border border-neutral-100 dark:border-neutral-800">
                      {teacher.bio || 'Chưa có thông tin giới thiệu chi tiết.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
