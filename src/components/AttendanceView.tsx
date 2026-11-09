import React, { useState } from 'react';
import { Student, ClassRoom, AttendanceRecord, AttendanceStatus } from '../types';
import { getStudentAttendanceSummary } from '../services/storage';
import { 
  CalendarCheck, 
  Calendar as CalendarIcon, 
  Check, 
  UserCheck, 
  Clock, 
  AlertCircle, 
  XCircle,
  CheckCircle2,
  Printer,
  Plus,
  Star,
  Search
} from 'lucide-react';

interface AttendanceViewProps {
  students: Student[];
  classroom: ClassRoom;
  attendance: AttendanceRecord[];
  isReadOnly?: boolean;
  parentStudentId?: string; // If logged in as parent
  onUpdateAttendance: (updatedAttendance: AttendanceRecord[]) => void;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({
  students,
  classroom,
  attendance,
  isReadOnly = false,
  parentStudentId,
  onUpdateAttendance
}) => {
  const [selectedDate, setSelectedDate] = useState<string>('2026-11-08');
  const [activeTab, setActiveTab] = useState<'daily' | 'semester_summary'>('daily');
  const [saveToast, setSaveToast] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Class students
  const classStudents = students.filter((s) => s.classId === classroom.id);

  // If parent mode: get the single child
  const parentStudent = parentStudentId ? classStudents.find((s) => s.id === parentStudentId) : null;

  // Find attendance record for selected date
  const existingRecord = attendance.find(
    (a) => a.classId === classroom.id && a.date === selectedDate
  );

  const recordsMap = existingRecord ? existingRecord.records : {};

  // Status stats for selected date
  let presentCount = 0;
  let excusedCount = 0;
  let unexcusedCount = 0;
  let lateCount = 0;

  classStudents.forEach((st) => {
    const status = recordsMap[st.id]?.status || 'present';
    if (status === 'present') presentCount++;
    else if (status === 'excused') excusedCount++;
    else if (status === 'unexcused') unexcusedCount++;
    else if (status === 'late') lateCount++;
  });

  const handleSetStudentStatus = (
    studentId: string,
    status: AttendanceStatus,
    note?: string
  ) => {
    if (isReadOnly) return;
    const updatedRecords = { ...recordsMap };
    updatedRecords[studentId] = {
      status,
      note: note !== undefined ? note : updatedRecords[studentId]?.note
    };

    let updatedAttendanceList: AttendanceRecord[];
    if (existingRecord) {
      updatedAttendanceList = attendance.map((a) =>
        a.id === existingRecord.id ? { ...a, records: updatedRecords } : a
      );
    } else {
      const newRecord: AttendanceRecord = {
        id: `att-${Date.now()}`,
        date: selectedDate,
        classId: classroom.id,
        records: updatedRecords
      };
      updatedAttendanceList = [...attendance, newRecord];
    }

    onUpdateAttendance(updatedAttendanceList);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  const handleMarkAllPresent = () => {
    if (isReadOnly) return;
    const updatedRecords: Record<string, { status: AttendanceStatus; note?: string }> = {};
    classStudents.forEach((st) => {
      updatedRecords[st.id] = { status: 'present' };
    });

    let updatedAttendanceList: AttendanceRecord[];
    if (existingRecord) {
      updatedAttendanceList = attendance.map((a) =>
        a.id === existingRecord.id ? { ...a, records: updatedRecords } : a
      );
    } else {
      const newRecord: AttendanceRecord = {
        id: `att-${Date.now()}`,
        date: selectedDate,
        classId: classroom.id,
        records: updatedRecords
      };
      updatedAttendanceList = [...attendance, newRecord];
    }

    onUpdateAttendance(updatedAttendanceList);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  // If in Parent Mode: calculate history of all attendance dates for this child
  const childHistory = parentStudent ? attendance.map((record) => {
    const stStatus = record.records[parentStudent.id] || { status: 'present' };
    return {
      date: record.date,
      status: stStatus.status,
      note: stStatus.note
    };
  }).sort((a, b) => b.date.localeCompare(a.date)) : [];

  const childSemesterStats = parentStudent ? getStudentAttendanceSummary(parentStudent.id, attendance) : null;

  return (
    <div className="space-y-4">
      {/* Title & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-blue-600" />
            <span>Sổ Điểm Danh & Chuyên Cần Lớp {classroom.name}</span>
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            {parentStudentId
              ? 'Tình hình chuyên cần, số buổi nghỉ có phép, không phép và lịch sử điểm danh của con em.'
              : 'Ghi nhận và quản lý chuyên cần học sinh: nghỉ có phép, nghỉ không phép, đi muộn và thống kê toàn học kỳ.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {saveToast && (
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Đã lưu điểm danh</span>
            </span>
          )}

          <button
            type="button"
            onClick={() => window.print()}
            className="px-3 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-200 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs whitespace-nowrap shrink-0"
          >
            <Printer className="w-3.5 h-3.5 text-neutral-500" />
            <span>In Sổ Điểm Danh</span>
          </button>

          {!isReadOnly && !parentStudentId && (
            <button
              type="button"
              onClick={handleMarkAllPresent}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs whitespace-nowrap shrink-0"
            >
              <Check className="w-4 h-4" />
              <span>Đánh Dấu Tất Cả Có Mặt</span>
            </button>
          )}
        </div>
      </div>

      {/* PARENT MODE: DEDICATED CHILD VIEW */}
      {parentStudentId && parentStudent && childSemesterStats && (
        <div className="space-y-4">
          {/* Child summary strip */}
          <div className="p-5 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 border-2 border-emerald-300 dark:border-emerald-700 rounded-2xl shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-200 flex items-center gap-1.5">
                  <Star className="w-4 h-4 fill-emerald-600 text-emerald-600" />
                  <span>Theo Dõi Chuyên Cần Con Em</span>
                </span>
                <div className="text-lg font-bold text-neutral-900 dark:text-neutral-50 mt-1">
                  {parentStudent.fullName} ({parentStudent.code}) · Lớp {classroom.name}
                </div>
              </div>

              <div>
                {childSemesterStats.isNeverAbsent ? (
                  <span className="px-3.5 py-2 bg-emerald-600 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-xs">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Không nghỉ buổi nào (Chuyên cần 100%)</span>
                  </span>
                ) : (
                  <span className="px-3.5 py-2 bg-amber-500 text-white rounded-xl font-bold text-xs shadow-xs">
                    Vắng {childSemesterStats.totalAbsences} buổi
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 bg-white dark:bg-neutral-900 rounded-xl border border-emerald-200 dark:border-emerald-800 text-center">
                <span className="text-xs text-neutral-500 block">Số buổi có mặt</span>
                <span className="text-xl font-bold font-mono text-emerald-600">{childSemesterStats.presentCount}</span>
              </div>
              <div className="p-3 bg-white dark:bg-neutral-900 rounded-xl border border-emerald-200 dark:border-emerald-800 text-center">
                <span className="text-xs text-neutral-500 block">Nghỉ có phép (P)</span>
                <span className="text-xl font-bold font-mono text-blue-600">{childSemesterStats.excusedCount}</span>
              </div>
              <div className="p-3 bg-white dark:bg-neutral-900 rounded-xl border border-emerald-200 dark:border-emerald-800 text-center">
                <span className="text-xs text-neutral-500 block">Nghỉ không phép (KP)</span>
                <span className={`text-xl font-bold font-mono ${childSemesterStats.unexcusedCount > 0 ? 'text-rose-600' : 'text-neutral-800 dark:text-neutral-200'}`}>
                  {childSemesterStats.unexcusedCount}
                </span>
              </div>
              <div className="p-3 bg-white dark:bg-neutral-900 rounded-xl border border-emerald-200 dark:border-emerald-800 text-center">
                <span className="text-xs text-neutral-500 block">Đi muộn</span>
                <span className="text-xl font-bold font-mono text-amber-600">{childSemesterStats.lateCount}</span>
              </div>
            </div>
          </div>

          {/* Child Attendance History */}
          <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-xs">
            <div className="p-3 bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-800 font-bold text-xs text-neutral-900 dark:text-neutral-100">
              Nhật Ký Điểm Danh Từng Ngày Của Con Em
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40 text-[11px] font-semibold text-neutral-500">
                    <th className="py-3 px-3 w-16 text-center">STT</th>
                    <th className="py-3 px-4 w-40">Ngày điểm danh</th>
                    <th className="py-3 px-4 w-48">Trạng thái</th>
                    <th className="py-3 px-4">Lý do / Ghi chú của giáo viên</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {childHistory.map((item, idx) => (
                    <tr key={item.date} className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40">
                      <td className="py-3 px-3 text-center font-mono text-neutral-400">
                        {idx + 1}
                      </td>
                      <td className="py-3 px-4 font-mono font-medium text-neutral-900 dark:text-neutral-100">
                        {item.date}
                      </td>
                      <td className="py-3 px-4">
                        {item.status === 'present' && (
                          <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                            ✓ Có mặt đúng giờ
                          </span>
                        )}
                        {item.status === 'excused' && (
                          <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300">
                            ✉ Nghỉ có phép
                          </span>
                        )}
                        {item.status === 'unexcused' && (
                          <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300">
                            ⚠ Nghỉ không phép
                          </span>
                        )}
                        {item.status === 'late' && (
                          <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                            ⏱ Đi muộn
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400 italic">
                        {item.note || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TEACHER MODE: DAILY ATTENDANCE & SEMESTER RECAP */}
      {!parentStudentId && (
        <div className="space-y-4">
          {/* Mode Tabs */}
          <div className="flex items-center p-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-xs font-medium w-fit">
            <button
              type="button"
              onClick={() => setActiveTab('daily')}
              className={`px-3.5 py-1.5 rounded-md transition-colors ${
                activeTab === 'daily'
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
              }`}
            >
              Điểm Danh Theo Ngày
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('semester_summary')}
              className={`px-3.5 py-1.5 rounded-md transition-colors ${
                activeTab === 'semester_summary'
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
              }`}
            >
              Thống Kê Chuyên Cần Cả Học Kỳ (P, KP, 100%)
            </button>
          </div>

          {/* TAB 1: DAILY ATTENDANCE */}
          {activeTab === 'daily' && (
            <>
              {/* Date Selector & Stats */}
              <div className="p-4 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-xs">
                  <span className="font-semibold text-neutral-700 dark:text-neutral-300">Ngày điểm danh:</span>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg font-mono text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold"
                  />
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <div className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300">
                    Có mặt: <strong>{presentCount}</strong>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300">
                    Có phép (P): <strong>{excusedCount}</strong>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300">
                    Không phép (KP): <strong>{unexcusedCount}</strong>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300">
                    Đi muộn: <strong>{lateCount}</strong>
                  </div>
                </div>
              </div>

              {/* Attendance Table */}
              <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40 text-[11px] font-semibold text-neutral-500">
                        <th className="py-3 px-3 w-12 text-center">STT</th>
                        <th className="py-3 px-3 w-28">Mã HS</th>
                        <th className="py-3 px-4 min-w-[180px]">Họ và tên</th>
                        <th className="py-3 px-3">Phụ huynh & SĐT</th>
                        <th className="py-3 px-3 min-w-[280px]">Trạng thái điểm danh</th>
                        <th className="py-3 px-4 min-w-[200px]">Lý do / Ghi chú của GVCN</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                      {classStudents.map((st, idx) => {
                        const currentStatus = recordsMap[st.id]?.status || 'present';
                        const currentNote = recordsMap[st.id]?.note || '';

                        return (
                          <tr
                            key={st.id}
                            className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40 transition-colors"
                          >
                            <td className="py-3 px-3 text-center font-mono text-neutral-400">
                              {idx + 1}
                            </td>
                            <td className="py-3 px-3 font-mono text-neutral-500">
                              {st.code}
                            </td>
                            <td className="py-3 px-4 font-semibold text-neutral-900 dark:text-neutral-100">
                              {st.fullName}
                            </td>
                            <td className="py-3 px-3 text-neutral-600 dark:text-neutral-400">
                              <span>{st.parentName}</span>
                              <span className="font-mono text-neutral-400 ml-1">({st.parentPhone})</span>
                            </td>

                            {/* Status Buttons */}
                            <td className="py-2 px-3">
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleSetStudentStatus(st.id, 'present')}
                                  className={`px-2.5 py-1 rounded-md font-medium text-xs transition-colors ${
                                    currentStatus === 'present'
                                      ? 'bg-emerald-600 text-white shadow-xs'
                                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200'
                                  }`}
                                >
                                  Có mặt
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleSetStudentStatus(st.id, 'excused')}
                                  className={`px-2.5 py-1 rounded-md font-medium text-xs transition-colors ${
                                    currentStatus === 'excused'
                                      ? 'bg-blue-600 text-white shadow-xs'
                                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200'
                                  }`}
                                >
                                  Có phép (P)
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleSetStudentStatus(st.id, 'unexcused')}
                                  className={`px-2.5 py-1 rounded-md font-medium text-xs transition-colors ${
                                    currentStatus === 'unexcused'
                                      ? 'bg-rose-600 text-white shadow-xs'
                                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200'
                                  }`}
                                >
                                  Không phép (KP)
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleSetStudentStatus(st.id, 'late')}
                                  className={`px-2.5 py-1 rounded-md font-medium text-xs transition-colors ${
                                    currentStatus === 'late'
                                      ? 'bg-amber-600 text-white shadow-xs'
                                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200'
                                  }`}
                                >
                                  Đi muộn
                                </button>
                              </div>
                            </td>

                            {/* Note */}
                            <td className="py-2 px-4">
                              <input
                                type="text"
                                placeholder={currentStatus === 'present' ? 'Không có ghi chú' : 'Nhập lý do nghỉ/muộn...'}
                                value={currentNote}
                                onChange={(e) =>
                                  handleSetStudentStatus(st.id, currentStatus, e.target.value)
                                }
                                className="w-full px-2.5 py-1 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-md text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* TAB 2: SEMESTER CHUYÊN CẦN SUMMARY */}
          {activeTab === 'semester_summary' && (
            <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-xs">
              <div className="p-3 bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                  Bảng Thống Kê Chuyên Cần Toàn Diện Học Kỳ (Lớp {classroom.name})
                </span>
                <span className="text-[11px] text-neutral-500">
                  Tự động kết xuất sang phần Chuyên Cần của Sổ Điểm Học Tập.
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40 text-[11px] font-semibold text-neutral-500">
                      <th className="py-3 px-3 w-12 text-center">STT</th>
                      <th className="py-3 px-3 w-28">Mã HS</th>
                      <th className="py-3 px-4 min-w-[180px]">Họ và tên</th>
                      <th className="py-3 px-3 text-center">Có mặt</th>
                      <th className="py-3 px-3 text-center text-blue-600">Nghỉ có phép (P)</th>
                      <th className="py-3 px-3 text-center text-rose-600">Nghỉ không phép (KP)</th>
                      <th className="py-3 px-3 text-center text-amber-600">Đi muộn</th>
                      <th className="py-3 px-4 min-w-[200px]">Đánh giá chuyên cần</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                    {classStudents.map((st, idx) => {
                      const summary = getStudentAttendanceSummary(st.id, attendance);
                      return (
                        <tr
                          key={st.id}
                          className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40 transition-colors"
                        >
                          <td className="py-3 px-3 text-center font-mono text-neutral-400">
                            {idx + 1}
                          </td>
                          <td className="py-3 px-3 font-mono text-neutral-500">
                            {st.code}
                          </td>
                          <td className="py-3 px-4 font-semibold text-neutral-900 dark:text-neutral-100">
                            {st.fullName}
                          </td>
                          <td className="py-3 px-3 text-center font-mono">
                            {summary.presentCount}
                          </td>
                          <td className="py-3 px-3 text-center font-mono font-bold text-blue-600">
                            {summary.excusedCount} buổi
                          </td>
                          <td className="py-3 px-3 text-center font-mono font-bold text-rose-600">
                            {summary.unexcusedCount} buổi
                          </td>
                          <td className="py-3 px-3 text-center font-mono text-amber-600">
                            {summary.lateCount} lần
                          </td>
                          <td className="py-3 px-4">
                            {summary.isNeverAbsent ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Không nghỉ buổi nào (Chuyên cần 100%)</span>
                              </span>
                            ) : (
                              <span className="text-[11px] text-neutral-600 dark:text-neutral-400 font-medium">
                                Tổng vắng: <strong>{summary.totalAbsences} buổi</strong> ({summary.excusedCount}P, {summary.unexcusedCount}KP)
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
