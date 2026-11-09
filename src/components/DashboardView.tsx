import React from 'react';
import { 
  Student, 
  ClassRoom, 
  AttendanceRecord, 
  WeeklyRecordItem, 
  WeeklyComment, 
  SeatingLayout 
} from '../types';
import { 
  getStudentAttendanceSummary,
  calculateClassAttendanceRate
} from '../services/storage';
import { 
  Users, 
  CalendarCheck, 
  Armchair, 
  Trophy, 
  Star, 
  MessageSquare, 
  User, 
  ArrowRightLeft,
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';

interface DashboardViewProps {
  students: Student[];
  classroom: ClassRoom;
  attendance: AttendanceRecord[];
  weeklyRecords: WeeklyRecordItem[];
  weeklyComments: WeeklyComment[];
  seatingLayout: SeatingLayout;
  selectedSemester: 'HK1' | 'HK2';
  isReadOnly?: boolean;
  parentStudentId?: string;
  onNavigate: (tab: any) => void;
  onOpenAddStudent: () => void;
  onSelectStudent: (student: Student) => void;
  onOpenHandover?: () => void;
  currentTeacherName?: string;
  schoolName?: string;
  province?: string;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  students,
  classroom,
  attendance,
  weeklyRecords,
  weeklyComments,
  seatingLayout,
  selectedSemester,
  isReadOnly = false,
  parentStudentId,
  onNavigate,
  onOpenAddStudent,
  onSelectStudent,
  onOpenHandover,
  currentTeacherName = 'Thầy Nguyễn Văn Hùng',
  schoolName,
  province
}) => {
  // Class students for this homeroom class
  const classStudents = students.filter((s) => s.classId === classroom.id);
  const totalStudents = classStudents.length;
  const maleStudents = classStudents.filter((s) => s.gender === 'Nam').length;
  const femaleStudents = classStudents.filter((s) => s.gender === 'Nữ').length;

  // Single student for Parent View
  const parentStudent = parentStudentId ? classStudents.find((s) => s.id === parentStudentId) : null;

  // Class attendance rate according to Requirement 19:
  // Tỷ lệ chuyên cần = (Số lượt có mặt / Tổng số lượt điểm danh hợp lệ) × 100%
  const classAttendanceSummary = calculateClassAttendanceRate(classroom.id, attendance);

  // Parent Child calculations
  let childSeatInfo: { col: number; row: number; seatIdx: number } | null = null;
  let childAttendanceStats = null;
  let childWeeklyScore = 100;
  let childLatestComment = '';

  if (parentStudent) {
    for (const [key, id] of Object.entries(seatingLayout.seats)) {
      if (id === parentStudent.id) {
        const [c, r, s] = key.split('-').map(Number);
        childSeatInfo = { col: c, row: r, seatIdx: s };
        break;
      }
    }
    childAttendanceStats = getStudentAttendanceSummary(parentStudent.id, attendance);

    const weekRecords = weeklyRecords.filter(r => r.studentId === parentStudent.id);
    const bonus = weekRecords.filter(r => r.type === 'bonus').reduce((acc, r) => acc + r.points, 0);
    const penalty = weekRecords.filter(r => r.type === 'penalty').reduce((acc, r) => acc + r.points, 0);
    childWeeklyScore = 100 + bonus - penalty;

    const comm = weeklyComments.find(c => c.studentId === parentStudent.id);
    childLatestComment = comm?.comment || 'Con chấp hành tốt nề nếp trường lớp, chăm ngoan.';
  }

  // ----------------------------------------------------
  // PARENT VIEW: INDIVIDUAL STUDENT OVERVIEW (NO GPA)
  // ----------------------------------------------------
  if (parentStudentId && parentStudent) {
    return (
      <div className="space-y-6">
        {/* Parent Welcome Banner */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 rounded-xl text-xs font-semibold backdrop-blur-xs mb-2">
              <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
              <span>Sổ Liên Lạc Điện Tử Cá Nhân (Dành Riêng Cho Phụ Huynh)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Học Sinh: {parentStudent.fullName}
            </h1>
            <p className="text-xs sm:text-sm text-blue-100 mt-1">
              Mã số: <strong>{parentStudent.code}</strong> · Lớp: <strong>{classroom.name}</strong> · {schoolName || classroom.schoolName || 'Trường THPT'}{province ? ` (${province})` : ''} · Năm học 2026 - 2027
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigate('grades')}
              className="px-4 py-2.5 bg-white text-blue-700 hover:bg-blue-50 rounded-xl font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer min-h-[40px]"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Xem Sổ Điểm Của Con</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('weekly_report')}
              className="px-4 py-2.5 bg-white/20 hover:bg-white/30 text-white rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 backdrop-blur-xs cursor-pointer min-h-[40px]"
            >
              <Trophy className="w-4 h-4" />
              <span>Xem Thi Đua Tuần</span>
            </button>
          </div>
        </div>

        {/* 4 Cards for Parent: Profile, Chuyên Cần, Chỗ Ngồi, Thi Đua */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Chuyên cần con em */}
          <div 
            onClick={() => onNavigate('attendance')}
            className="p-5 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xs cursor-pointer hover:border-blue-400 transition-all"
          >
            <div className="flex items-center justify-between text-neutral-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Chuyên cần con em</span>
              <CalendarCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-neutral-900 dark:text-neutral-100">
              {childAttendanceStats?.isNeverAbsent ? '100% Chuyên cần' : `Nghỉ ${childAttendanceStats?.totalAbsences} buổi`}
            </div>
            <div className="text-xs text-neutral-500 mt-1">
              Có phép: {childAttendanceStats?.excusedCount} · Không phép: {childAttendanceStats?.unexcusedCount}
            </div>
          </div>

          {/* Card 2: Chỗ ngồi trong lớp */}
          <div 
            onClick={() => onNavigate('seating')}
            className="p-5 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xs cursor-pointer hover:border-blue-400 transition-all"
          >
            <div className="flex items-center justify-between text-neutral-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Vị trí chỗ ngồi</span>
              <Armchair className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
              {childSeatInfo ? `Dãy ${childSeatInfo.col} · Bàn ${childSeatInfo.row}` : 'Chưa xếp chỗ'}
            </div>
            <div className="text-xs text-indigo-600 font-semibold mt-1">
              {childSeatInfo ? `Ghế ${childSeatInfo.seatIdx === 0 ? 'Trái' : 'Phải'}` : 'Đang cập nhật'}
            </div>
          </div>

          {/* Card 3: Thi đua nề nếp */}
          <div 
            onClick={() => onNavigate('weekly_report')}
            className="p-5 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xs cursor-pointer hover:border-blue-400 transition-all"
          >
            <div className="flex items-center justify-between text-neutral-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Điểm thi đua tuần</span>
              <Trophy className="w-5 h-5 text-amber-500" />
            </div>
            <div className="text-xl sm:text-2xl font-extrabold font-mono text-emerald-600">
              {childWeeklyScore} điểm
            </div>
            <div className="text-xs text-neutral-500 mt-1">
              Đánh giá nề nếp & hoa điểm tốt
            </div>
          </div>

          {/* Card 4: Nhận xét của GVCN */}
          <div className="p-5 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xs">
            <div className="flex items-center justify-between text-neutral-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Nhận xét GVCN</span>
              <MessageSquare className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-xs text-neutral-700 dark:text-neutral-300 italic line-clamp-2">
              "{childLatestComment}"
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ------------------------------------------------------------------------------------
  // GVCN VIEW: STRICTLY 4 METRICS PER REQUIREMENT 17:
  // 1. Chuyên cần (Thống kê tình hình chuyên cần của học sinh trong lớp)
  // 2. Sĩ số (Tổng số học sinh hiện có trong lớp)
  // 3. Sĩ số nam (Tổng số học sinh nam)
  // 4. Sĩ số nữ (Tổng số học sinh nữ)
  // Không hiển thị thêm chỉ số GPA hay thống kê khác trong phần Tổng quan
  // ------------------------------------------------------------------------------------
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 text-xs font-bold mb-2">
            <span>Quản Lý Lớp {classroom.name}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50">
            Tổng Quan Lớp {classroom.name}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Giáo viên phụ trách: <strong>{currentTeacherName}</strong> · {schoolName || classroom.schoolName || 'Trường THPT'}{province ? ` (${province})` : ''} · Năm học 2026 - 2027
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          {onOpenHandover && (
            <button
              type="button"
              onClick={onOpenHandover}
              className="px-3.5 py-2 text-xs font-bold text-neutral-700 dark:text-neutral-300 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer min-h-[40px]"
              title="Bàn giao quản lý lớp khi kết thúc năm học"
            >
              <ArrowRightLeft className="w-4 h-4 text-neutral-500" />
              <span>Bàn Giao Lớp</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenAddStudent}
            className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer min-h-[40px]"
          >
            <User className="w-4 h-4" />
            <span>Tiếp Nhận Học Sinh</span>
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 4 CORE CARDS FOR GVCN (REQUIREMENT 17):                              */}
      {/* 1. Chuyên cần                                                        */}
      {/* 2. Sĩ số                                                             */}
      {/* 3. Sĩ số nam                                                         */}
      {/* 4. Sĩ số nữ                                                          */}
      {/* ==================================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* THẺ 1: CHUYÊN CẦN */}
        <div 
          onClick={() => onNavigate('attendance')}
          className="p-5 sm:p-6 bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-xs cursor-pointer hover:border-emerald-400 dark:hover:border-emerald-600 transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-neutral-500 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
              Chuyên Cần
            </span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>

          <div>
            <div className="text-3xl font-extrabold font-mono tracking-tight text-neutral-900 dark:text-neutral-50">
              {classAttendanceSummary.rate}%
            </div>
            <div className="text-xs text-emerald-600 font-semibold mt-1">
              Tỷ lệ chuyên cần chung của lớp
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800/80 text-[11px] text-neutral-500 space-y-0.5">
            <div>Số lượt có mặt: <strong className="text-neutral-800 dark:text-neutral-200">{classAttendanceSummary.presentCount}</strong></div>
            <div>Vắng có phép: <strong className="text-amber-600">{classAttendanceSummary.excusedCount}</strong> · Không phép: <strong className="text-rose-600">{classAttendanceSummary.unexcusedCount}</strong></div>
            <div>Số lượt đi muộn: <strong className="text-neutral-700 dark:text-neutral-300">{classAttendanceSummary.lateCount}</strong></div>
          </div>
        </div>

        {/* THẺ 2: SĨ SỐ */}
        <div 
          onClick={() => onNavigate('students')}
          className="p-5 sm:p-6 bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-xs cursor-pointer hover:border-blue-400 dark:hover:border-blue-600 transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-neutral-500 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
              Sĩ Số
            </span>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div>
            <div className="text-3xl font-extrabold font-mono tracking-tight text-neutral-900 dark:text-neutral-50">
              {totalStudents}
            </div>
            <div className="text-xs text-blue-600 font-semibold mt-1">
              Học sinh hiện có trong Lớp {classroom.name}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800/80 text-[11px] text-neutral-500 flex items-center justify-between">
            <span>Sức chứa tối đa: {classroom.maxStudents} HS</span>
            <span className="font-bold text-blue-600">Xem danh sách →</span>
          </div>
        </div>

        {/* THẺ 3: SĨ SỐ NAM */}
        <div 
          onClick={() => onNavigate('students')}
          className="p-5 sm:p-6 bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-xs cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-600 transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-neutral-500 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
              Sĩ Số Nam
            </span>
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <span className="text-base font-bold">♂</span>
            </div>
          </div>

          <div>
            <div className="text-3xl font-extrabold font-mono tracking-tight text-neutral-900 dark:text-neutral-50">
              {maleStudents}
            </div>
            <div className="text-xs text-indigo-600 font-semibold mt-1">
              Học sinh nam ({totalStudents > 0 ? ((maleStudents / totalStudents) * 100).toFixed(0) : 0}%)
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800/80 text-[11px] text-neutral-500">
            Được phân bổ đều theo sơ đồ bàn học
          </div>
        </div>

        {/* THẺ 4: SĨ SỐ NỮ */}
        <div 
          onClick={() => onNavigate('students')}
          className="p-5 sm:p-6 bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-xs cursor-pointer hover:border-rose-400 dark:hover:border-rose-600 transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-neutral-500 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
              Sĩ Số Nữ
            </span>
            <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <span className="text-base font-bold">♀</span>
            </div>
          </div>

          <div>
            <div className="text-3xl font-extrabold font-mono tracking-tight text-neutral-900 dark:text-neutral-50">
              {femaleStudents}
            </div>
            <div className="text-xs text-rose-600 font-semibold mt-1">
              Học sinh nữ ({totalStudents > 0 ? ((femaleStudents / totalStudents) * 100).toFixed(0) : 0}%)
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800/80 text-[11px] text-neutral-500">
            Chăm chỉ, tích cực trong phong trào lớp
          </div>
        </div>
      </div>
    </div>
  );
};
