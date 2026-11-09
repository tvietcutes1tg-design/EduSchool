import React, { useState } from 'react';
import { Student, ClassRoom, Teacher, AttendanceRecord, WeeklyRecordItem } from '../types';
import { calculateSemesterGpa, getAcademicRank, calculateSubjectAverage } from '../services/storage';
import { 
  X, 
  Printer, 
  Phone, 
  MapPin, 
  Calendar, 
  Award, 
  UserCheck, 
  BookOpen,
  Trophy,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';

interface StudentDetailModalProps {
  student: Student | null;
  classes: ClassRoom[];
  teachers: Teacher[];
  attendance: AttendanceRecord[];
  weeklyRecords?: WeeklyRecordItem[];
  isReadOnly?: boolean;
  onClose: () => void;
  onPrintTranscript: (student: Student) => void;
  onEdit: (student: Student) => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  student,
  classes,
  teachers,
  attendance,
  weeklyRecords = [],
  isReadOnly = false,
  onClose,
  onPrintTranscript,
  onEdit
}) => {
  const [activeTab, setActiveTab] = useState<'grades' | 'info' | 'attendance'>('grades');
  const [selectedSemester, setSelectedSemester] = useState<'HK1' | 'HK2'>('HK1');

  if (!student) return null;

  const currentClass = classes.find(c => c.id === student.classId);
  const homeroomTeacher = teachers.find(t => t.id === currentClass?.homeroomTeacherId);

  const gpa = calculateSemesterGpa(student, selectedSemester);
  const rank = getAcademicRank(gpa, student, selectedSemester);

  // Calculate student attendance metrics
  let totalDays = 0;
  let presentDays = 0;
  let excusedDays = 0;
  let unexcusedDays = 0;
  let lateDays = 0;

  attendance.forEach((att) => {
    const record = att.records[student.id];
    if (record) {
      totalDays++;
      if (record.status === 'present') presentDays++;
      else if (record.status === 'excused') excusedDays++;
      else if (record.status === 'unexcused') unexcusedDays++;
      else if (record.status === 'late') lateDays++;
    }
  });

  const semesterGrades = student.grades[selectedSemester] || {};
  const subjectList = Object.keys(semesterGrades);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div 
        className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl w-full max-w-4xl shadow-xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 flex items-start justify-between gap-4 bg-neutral-50/50 dark:bg-neutral-800/30">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-blue-600 text-white font-bold text-xl flex items-center justify-center shadow-xs">
              {student.fullName.slice(-1)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-50">
                  {student.fullName}
                </h2>
                <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-neutral-200/70 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200">
                  {student.code}
                </span>
              </div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 flex flex-wrap items-center gap-3">
                <span>Lớp: <strong className="text-neutral-800 dark:text-neutral-200">{currentClass?.name || 'Chưa xếp'}</strong></span>
                <span>·</span>
                <span>GVCN: <strong className="text-neutral-800 dark:text-neutral-200">{homeroomTeacher?.fullName || 'Chưa phân công'}</strong></span>
                <span>·</span>
                <span>Niên khóa: <strong className="text-neutral-800 dark:text-neutral-200">{student.enrollmentYear} - {student.enrollmentYear + 3}</strong></span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onPrintTranscript(student)}
              className="px-3 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-200 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Printer className="w-3.5 h-3.5 text-neutral-500" />
              <span>In Phiếu Điểm</span>
            </button>
            {!isReadOnly && (
              <button
                type="button"
                onClick={() => onEdit(student)}
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

        {/* Tab Controls */}
        <div className="px-6 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('grades')}
              className={`py-3.5 border-b-2 transition-colors ${
                activeTab === 'grades'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100'
              }`}
            >
              Bảng Điểm & Học Lực
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('info')}
              className={`py-3.5 border-b-2 transition-colors ${
                activeTab === 'info'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100'
              }`}
            >
              Hồ Sơ & Liên Lạc
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('attendance')}
              className={`py-3.5 border-b-2 transition-colors ${
                activeTab === 'attendance'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100'
              }`}
            >
              Chuyên Cần & Kỷ Luật
            </button>
          </div>

          {activeTab === 'grades' && (
            <div className="flex items-center p-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-xs">
              <button
                type="button"
                onClick={() => setSelectedSemester('HK1')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  selectedSemester === 'HK1'
                    ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                Học Kỳ 1
              </button>
              <button
                type="button"
                onClick={() => setSelectedSemester('HK2')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  selectedSemester === 'HK2'
                    ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                Học Kỳ 2
              </button>
            </div>
          )}
        </div>

        {/* Tab Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {/* Tab 1: Grades */}
          {activeTab === 'grades' && (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30">
                  <span className="text-xs text-neutral-500 dark:text-neutral-400 block">Điểm Trung Bình (GPA)</span>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-2xl font-bold font-mono text-neutral-900 dark:text-neutral-50">
                      {gpa !== undefined ? gpa : 'Chưa đủ'}
                    </span>
                    <span className="text-xs text-neutral-400">/ 10.0</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30">
                  <span className="text-xs text-neutral-500 dark:text-neutral-400 block">Xếp Loại Học Lực</span>
                  <div className="mt-1 text-lg font-bold text-neutral-900 dark:text-neutral-50 flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-500" />
                    <span>{rank}</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30">
                  <span className="text-xs text-neutral-500 dark:text-neutral-400 block">Xếp Loại Hạnh Kiểm</span>
                  <div className="mt-1 text-lg font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                    <UserCheck className="w-5 h-5" />
                    <span>Tốt</span>
                  </div>
                </div>
              </div>

              {/* Subject Breakdown Table */}
              <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-neutral-50 dark:bg-neutral-800/60 border-b border-neutral-200 dark:border-neutral-800 text-[11px] font-semibold text-neutral-500 dark:text-neutral-400">
                      <th className="py-2.5 px-4">Môn Học</th>
                      <th className="py-2.5 px-3 text-center">TX 1 (x1)</th>
                      <th className="py-2.5 px-3 text-center">TX 2 (x1)</th>
                      <th className="py-2.5 px-3 text-center">Giữa Kỳ (x2)</th>
                      <th className="py-2.5 px-3 text-center">Cuối Kỳ (x3)</th>
                      <th className="py-2.5 px-4 text-right">ĐTB Môn</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 font-mono">
                    {subjectList.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-6 text-center text-neutral-400 font-sans">
                          Chưa có dữ liệu điểm học kỳ này.
                        </td>
                      </tr>
                    ) : (
                      subjectList.map((subName) => {
                        const sc = semesterGrades[subName];
                        const avg = sc?.avg ?? calculateSubjectAverage(sc);
                        return (
                          <tr key={subName} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30">
                            <td className="py-2.5 px-4 font-sans font-medium text-neutral-900 dark:text-neutral-100">
                              {subName}
                            </td>
                            <td className="py-2.5 px-3 text-center text-neutral-600 dark:text-neutral-400">
                              {sc?.tx1 ?? '—'}
                            </td>
                            <td className="py-2.5 px-3 text-center text-neutral-600 dark:text-neutral-400">
                              {sc?.tx2 ?? '—'}
                            </td>
                            <td className="py-2.5 px-3 text-center text-neutral-600 dark:text-neutral-400">
                              {sc?.gk ?? '—'}
                            </td>
                            <td className="py-2.5 px-3 text-center text-neutral-600 dark:text-neutral-400">
                              {sc?.ck ?? '—'}
                            </td>
                            <td className="py-2.5 px-4 text-right font-bold text-blue-600 dark:text-blue-400">
                              {avg !== undefined ? avg : '—'}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {student.notes && (
                <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40 text-xs">
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200 block mb-1">
                    Nhận xét của Giáo viên chủ nhiệm:
                  </span>
                  <p className="text-neutral-600 dark:text-neutral-400">{student.notes}</p>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Info */}
          {activeTab === 'info' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 space-y-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                    Thông tin cá nhân
                  </h3>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800">
                      <span className="text-neutral-500">Họ và tên:</span>
                      <span className="font-semibold text-neutral-900 dark:text-neutral-100">{student.fullName}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800">
                      <span className="text-neutral-500">Giới tính:</span>
                      <span className="text-neutral-800 dark:text-neutral-200">{student.gender}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800">
                      <span className="text-neutral-500">Ngày sinh:</span>
                      <span className="font-mono text-neutral-800 dark:text-neutral-200">{student.dateOfBirth}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800">
                      <span className="text-neutral-500">Năm nhập học:</span>
                      <span className="font-mono text-neutral-800 dark:text-neutral-200">{student.enrollmentYear}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-neutral-500">Địa chỉ thường trú:</span>
                      <span className="text-neutral-800 dark:text-neutral-200 text-right max-w-[240px]">{student.address}</span>
                    </div>
                  </div>
                </div>

                {/* Family & Contact */}
                <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 space-y-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                    Thông tin liên hệ & Phụ huynh
                  </h3>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800">
                      <span className="text-neutral-500">Họ tên phụ huynh:</span>
                      <span className="font-semibold text-neutral-900 dark:text-neutral-100">{student.parentName}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800">
                      <span className="text-neutral-500">Số điện thoại liên lạc:</span>
                      <a href={`tel:${student.parentPhone}`} className="font-mono text-blue-600 hover:underline">
                        {student.parentPhone}
                      </a>
                    </div>
                    <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800">
                      <span className="text-neutral-500">Email phụ huynh:</span>
                      <span className="text-neutral-800 dark:text-neutral-200">{student.parentEmail || 'Chưa cập nhật'}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-neutral-500">Giáo viên chủ nhiệm:</span>
                      <span className="text-neutral-800 dark:text-neutral-200 font-medium">
                        {homeroomTeacher ? `${homeroomTeacher.fullName} (${homeroomTeacher.phone})` : 'Chưa phân công'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Attendance */}
          {activeTab === 'attendance' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-emerald-50/40 dark:bg-emerald-950/20">
                  <span className="text-xs text-neutral-500 block">Số buổi có mặt</span>
                  <span className="text-xl font-bold font-mono text-emerald-600">{presentDays}</span>
                </div>
                <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-blue-50/40 dark:bg-blue-950/20">
                  <span className="text-xs text-neutral-500 block">Nghỉ có phép</span>
                  <span className="text-xl font-bold font-mono text-blue-600">{excusedDays}</span>
                </div>
                <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-rose-50/40 dark:bg-rose-950/20">
                  <span className="text-xs text-neutral-500 block">Nghỉ không phép</span>
                  <span className="text-xl font-bold font-mono text-rose-600">{unexcusedDays}</span>
                </div>
                <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-amber-50/40 dark:bg-amber-950/20">
                  <span className="text-xs text-neutral-500 block">Số lần đi muộn</span>
                  <span className="text-xl font-bold font-mono text-amber-600">{lateDays}</span>
                </div>
              </div>

              <div className="mt-4 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 text-xs">
                <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">Đánh giá chuyên cần:</h4>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {unexcusedDays === 0 
                    ? 'Học sinh đi học chuyên cần đầy đủ, chấp hành nghiêm túc nội quy nề nếp nhà trường.'
                    : `Học sinh có ${unexcusedDays} buổi nghỉ không phép, gia đình và GVCN cần theo dõi sát sao.`}
                </p>
              </div>

              {/* Weekly Bonus & Penalty History */}
              <div className="mt-4 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 text-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                    <Trophy className="w-4 h-4 text-amber-500" />
                    <span>Lịch Sử Thi Đua & Điểm Thường Xuyên / Vi Phạm Theo Tuần</span>
                  </h4>
                  <span className="text-neutral-400 font-mono text-[11px]">
                    {weeklyRecords.filter((r) => r.studentId === student.id).length} ghi nhận
                  </span>
                </div>

                {weeklyRecords.filter((r) => r.studentId === student.id).length === 0 ? (
                  <p className="text-neutral-400 italic">Chưa có ghi nhận điểm thường xuyên hay vi phạm nào.</p>
                ) : (
                  <div className="space-y-2">
                    {weeklyRecords
                      .filter((r) => r.studentId === student.id)
                      .map((r) => (
                        <div
                          key={r.id}
                          className={`p-2.5 rounded-lg border flex items-center justify-between gap-3 ${
                            r.type === 'bonus'
                              ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800'
                              : 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-mono font-bold text-xs px-2 py-0.5 rounded ${
                                r.type === 'bonus' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                              }`}
                            >
                              {r.type === 'bonus' ? `+${r.points}đ` : `-${r.points}đ`}
                            </span>
                            <div>
                              <div className="font-semibold text-neutral-900 dark:text-neutral-100">
                                {r.category} {r.subject ? `(${r.subject})` : ''}
                              </div>
                              {r.note && (
                                <div className="text-[11px] text-neutral-500 dark:text-neutral-400">{r.note}</div>
                              )}
                            </div>
                          </div>
                          <div className="text-right text-[11px] text-neutral-400 font-mono shrink-0">
                            <div>Tuần {r.weekNumber}</div>
                            <div>{r.date}</div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
