import React, { useState } from 'react';
import { 
  Student, 
  ClassRoom, 
  AttendanceRecord, 
  SubjectScore, 
  SemesterEvaluation 
} from '../types';
import { 
  calculateSubjectAverage, 
  getStudentAttendanceSummary,
  loadClassSubjects,
  saveClassSubjects 
} from '../services/storage';
import { 
  FileSpreadsheet, 
  Download, 
  Printer, 
  Edit3, 
  Check, 
  X, 
  Plus, 
  Award, 
  Clock, 
  CalendarCheck, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Search,
  Sparkles,
  BookOpen,
  RotateCcw
} from 'lucide-react';
import { SubjectManagementModal } from './SubjectManagementModal';

interface GradebookViewProps {
  students: Student[];
  classroom: ClassRoom;
  attendance: AttendanceRecord[];
  selectedSemester: 'HK1' | 'HK2';
  isReadOnly?: boolean;
  parentStudentId?: string; // If parent logged in, locked to this child
  onUpdateStudentGrades: (updatedStudents: Student[]) => void;
}

export const GradebookView: React.FC<GradebookViewProps> = ({
  students,
  classroom,
  attendance,
  selectedSemester,
  isReadOnly = false,
  parentStudentId,
  onUpdateStudentGrades
}) => {
  // Dynamic subjects for this class (Requirement 18.2)
  const [classSubjects, setClassSubjects] = useState<string[]>(() => loadClassSubjects(classroom.id));
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);

  // Students in this homeroom class
  const classStudents = students.filter((s) => s.classId === classroom.id);

  // If in parent mode, lock to parent's student
  const defaultStudentId = parentStudentId || classStudents[0]?.id || '';
  const [selectedStudentId, setSelectedStudentId] = useState<string>(defaultStudentId);
  const [viewMode, setViewMode] = useState<'individual' | 'class_subject'>('individual');
  const [selectedSubject, setSelectedSubject] = useState<string>(classSubjects[0] || 'Toán học');
  const [saveToast, setSaveToast] = useState(false);

  // Modal to edit evaluation (Kết quả học tập, Kết quả rèn luyện)
  const [isEvaluationModalOpen, setIsEvaluationModalOpen] = useState(false);
  const [evalAcademic, setEvalAcademic] = useState<'Tốt' | 'Khá' | 'Đạt' | 'Chưa đạt'>('Tốt');
  const [evalTraining, setEvalTraining] = useState<'Tốt' | 'Khá' | 'Đạt' | 'Chưa đạt'>('Tốt');
  const [evalNotes, setEvalNotes] = useState('');

  // Selected student record
  const currentStudent = students.find((s) => s.id === (parentStudentId || selectedStudentId)) || classStudents[0];

  // Attendance summary for current student (Requirement: Chuyên cần)
  const attendanceStats = currentStudent
    ? getStudentAttendanceSummary(currentStudent.id, attendance)
    : { excusedCount: 0, unexcusedCount: 0, lateCount: 0, totalAbsences: 0, isNeverAbsent: true, label: '' };

  // Evaluation data for semester (Kết quả học tập & rèn luyện)
  const currentEvaluation = currentStudent?.evaluations?.[selectedSemester] || {
    academicResult: 'Tốt',
    trainingResult: 'Tốt',
    notes: 'Chăm ngoan, chấp hành tốt nội quy trường lớp.'
  };

  // Handle score change for TX, GK, CK
  const handleScoreChange = (
    studentId: string,
    subjectName: string,
    field: 'tx1' | 'tx2' | 'tx3' | 'gk' | 'ck',
    value: string
  ) => {
    if (isReadOnly) return;
    let numVal: number | undefined = undefined;
    if (value.trim() !== '') {
      const parsed = parseFloat(value);
      if (!isNaN(parsed) && parsed >= 0 && parsed <= 10) {
        numVal = +(parsed.toFixed(1));
      } else {
        return;
      }
    }

    const updated = students.map((st) => {
      if (st.id !== studentId) return st;

      const currentSemGrades = st.grades[selectedSemester] || {};
      const currentSubjectScore = currentSemGrades[subjectName] || {};

      const newSubjectScore: SubjectScore = {
        ...currentSubjectScore,
        [field]: numVal
      };

      // Auto-calculate TBM unless teacher previously locked a manual override
      newSubjectScore.avg = calculateSubjectAverage(newSubjectScore);

      return {
        ...st,
        grades: {
          ...st.grades,
          [selectedSemester]: {
            ...currentSemGrades,
            [subjectName]: newSubjectScore
          }
        }
      };
    });

    onUpdateStudentGrades(updated);
    showToast();
  };

  // Handle Manual TBM Entry / Override (Requirement 6)
  const handleManualTbmChange = (
    studentId: string,
    subjectName: string,
    value: string
  ) => {
    if (isReadOnly) return;
    let numVal: number | undefined = undefined;
    if (value.trim() !== '') {
      const parsed = parseFloat(value);
      if (!isNaN(parsed) && parsed >= 0 && parsed <= 10) {
        numVal = +(parsed.toFixed(1));
      } else {
        return;
      }
    }

    const updated = students.map((st) => {
      if (st.id !== studentId) return st;

      const currentSemGrades = st.grades[selectedSemester] || {};
      const currentSubjectScore = currentSemGrades[subjectName] || {};

      const newSubjectScore: SubjectScore = {
        ...currentSubjectScore,
        avg: numVal
      };

      return {
        ...st,
        grades: {
          ...st.grades,
          [selectedSemester]: {
            ...currentSemGrades,
            [subjectName]: newSubjectScore
          }
        }
      };
    });

    onUpdateStudentGrades(updated);
    showToast();
  };

  // Reset TBM back to auto-calculated formula
  const handleResetToAutoTbm = (studentId: string, subjectName: string) => {
    if (isReadOnly) return;
    const updated = students.map((st) => {
      if (st.id !== studentId) return st;

      const currentSemGrades = st.grades[selectedSemester] || {};
      const currentSubjectScore = currentSemGrades[subjectName] || {};

      const autoAvg = calculateSubjectAverage(currentSubjectScore);

      return {
        ...st,
        grades: {
          ...st.grades,
          [selectedSemester]: {
            ...currentSemGrades,
            [subjectName]: {
              ...currentSubjectScore,
              avg: autoAvg
            }
          }
        }
      };
    });

    onUpdateStudentGrades(updated);
    showToast();
  };

  // Open edit evaluation modal
  const handleOpenEvaluationModal = () => {
    if (isReadOnly || !currentStudent) return;
    setEvalAcademic(currentEvaluation.academicResult);
    setEvalTraining(currentEvaluation.trainingResult);
    setEvalNotes(currentEvaluation.notes || '');
    setIsEvaluationModalOpen(true);
  };

  // Save evaluation modal
  const handleSaveEvaluation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentStudent || isReadOnly) return;

    const newEval: SemesterEvaluation = {
      academicResult: evalAcademic,
      trainingResult: evalTraining,
      notes: evalNotes.trim() || undefined
    };

    const updated = students.map((st) => {
      if (st.id !== currentStudent.id) return st;
      return {
        ...st,
        evaluations: {
          ...st.evaluations,
          [selectedSemester]: newEval
        }
      };
    });

    onUpdateStudentGrades(updated);
    setIsEvaluationModalOpen(false);
    showToast();
  };

  const showToast = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  const handleUpdateSubjects = (updatedSubjects: string[]) => {
    setClassSubjects(updatedSubjects);
    saveClassSubjects(classroom.id, updatedSubjects);
    if (!updatedSubjects.includes(selectedSubject) && updatedSubjects.length > 0) {
      setSelectedSubject(updatedSubjects[0]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Save Notification Toast */}
      {saveToast && (
        <div className="fixed bottom-5 right-5 z-50 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-lg flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>Đã lưu điểm và cập nhật thành công!</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <FileSpreadsheet className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <span>Sổ Điểm Học Tập</span>
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
              Lớp {classroom.name}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            {isReadOnly
              ? 'Tra cứu bảng điểm chi tiết các môn học và kết quả rèn luyện của học sinh.'
              : 'GVCN tự do quản lý môn học, nhập điểm đgtx, gk, ck và chỉnh sửa TBM linh hoạt.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {!isReadOnly && (
            <button
              type="button"
              onClick={() => setIsSubjectModalOpen(true)}
              className="px-3.5 py-2 text-xs font-bold rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5 transition-colors cursor-pointer min-h-[40px]"
            >
              <BookOpen className="w-4 h-4" />
              <span>Quản Lý Môn Học ({classSubjects.length})</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => window.print()}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer min-h-[40px]"
          >
            <Printer className="w-4 h-4" />
            <span>In Bảng Điểm</span>
          </button>
        </div>
      </div>

      {/* Control Viewport Bar */}
      <div className="bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* If in Parent mode: locked to parent's child */}
        {parentStudentId ? (
          <div className="flex items-center gap-2 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
            <span className="text-amber-500">⭐</span>
            <span>Học bạ cá nhân của con: <strong>{currentStudent?.fullName}</strong> ({currentStudent?.code})</span>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setViewMode('individual')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'individual'
                    ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
                }`}
              >
                Theo từng học sinh
              </button>
              <button
                type="button"
                onClick={() => setViewMode('class_subject')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'class_subject'
                    ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
                }`}
              >
                Theo môn cả lớp
              </button>
            </div>

            {/* If Individual: Student Picker */}
            {viewMode === 'individual' && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-neutral-600 dark:text-neutral-400">Chọn HS:</span>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-neutral-100 font-semibold focus:ring-2 focus:ring-blue-500"
                >
                  {classStudents.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.code} - {st.fullName} ({st.gender})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* If Class Subject: Subject Picker */}
            {viewMode === 'class_subject' && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-neutral-600 dark:text-neutral-400">Bộ môn:</span>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-neutral-100 font-semibold focus:ring-2 focus:ring-blue-500"
                >
                  {classSubjects.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}

        <div className="text-xs text-neutral-500">
          Học kỳ: <strong>{selectedSemester === 'HK1' ? 'Học kỳ 1' : 'Học kỳ 2'} (2026 - 2027)</strong>
        </div>
      </div>

      {/* ============================================================== */}
      {/* VIEW 1: INDIVIDUAL STUDENT GRADEBOOK                          */}
      {/* ============================================================== */}
      {viewMode === 'individual' && currentStudent && (
        <div className="space-y-6">
          {/* 3 Prominent Summary Cards for the Student:
              1. Hồ Sơ Học Sinh
              2. Tổng Kết Kì (Kết quả học tập, Kết quả rèn luyện - NO GPA per Req 18.1)
              3. Chuyên Cần (Nghỉ có phép, nghỉ không phép, không nghỉ buổi nào)
          */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card 1: Student Profile */}
            <div className="p-5 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xs flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-xl shadow-xs shrink-0">
                {currentStudent.fullName.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <span className="text-[11px] font-mono text-neutral-400">{currentStudent.code}</span>
                <h3 className="font-extrabold text-base text-neutral-900 dark:text-neutral-100 truncate">
                  {currentStudent.fullName}
                </h3>
                <div className="text-xs text-neutral-500 mt-0.5">
                  Lớp {classroom.name} · Giới tính: {currentStudent.gender}
                </div>
              </div>
            </div>

            {/* Card 2: Tổng Kết Kì (KQHT & KQRL - NO GPA per Requirement 18.1) */}
            <div className="p-5 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                  Tổng Kết Kì ({selectedSemester})
                </span>
                {!isReadOnly && (
                  <button
                    type="button"
                    onClick={handleOpenEvaluationModal}
                    className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Sửa Đánh Giá</span>
                  </button>
                )}
              </div>

              <div className="mt-2 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">Kết quả học tập (KQHT):</span>
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                    {currentEvaluation.academicResult}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">Kết quả rèn luyện (KQRL):</span>
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    {currentEvaluation.trainingResult}
                  </span>
                </div>
              </div>
            </div>

            {/* Card 3: Chuyên Cần (P, KP, Không nghỉ buổi nào) */}
            <div className="p-5 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                  Chuyên Cần Cả Học Kỳ
                </span>
                <CalendarCheck className="w-4 h-4 text-emerald-600" />
              </div>

              <div className="mt-2 space-y-1 text-xs">
                {attendanceStats.isNeverAbsent ? (
                  <div className="p-2 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-300 font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Không nghỉ buổi nào (Chuyên cần 100%)</span>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-500">Nghỉ có phép (P):</span>
                      <strong className="font-mono text-amber-600">{attendanceStats.excusedCount} buổi</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-500">Nghỉ không phép (KP):</span>
                      <strong className="font-mono text-rose-600">{attendanceStats.unexcusedCount} buổi</strong>
                    </div>
                  </>
                )}
                <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-1">
                  <span>Đi muộn: {attendanceStats.lateCount} lần</span>
                  <span>Tổng vắng: {attendanceStats.totalAbsences} buổi</span>
                </div>
              </div>
            </div>
          </div>

          {/* Table of Subjects & Grades (Môn học, đgtx1, đgtx2, đgtx3, gk, ck, tbm) */}
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-xs">
            <div className="p-4 bg-neutral-50 dark:bg-neutral-800/60 border-b border-neutral-200 dark:border-neutral-700 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                <span>Bảng Điểm Chi Tiết Môn Học</span>
                <span className="text-neutral-400 font-normal">({classSubjects.length} môn)</span>
              </div>
              <div className="text-neutral-500 text-[11px]">
                {isReadOnly 
                  ? 'Điểm do giáo viên bộ môn và GVCN cập nhật'
                  : 'GVCN có thể nhập đgtx, gk, ck hoặc nhập đè TBM trực tiếp'}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-neutral-50/80 dark:bg-neutral-800/80 border-b border-neutral-200 dark:border-neutral-700 font-bold text-neutral-600 dark:text-neutral-300">
                  <tr>
                    <th className="py-3 px-4 min-w-[140px]">Môn học</th>
                    <th className="py-3 px-2 w-20 text-center">đgtx 1</th>
                    <th className="py-3 px-2 w-20 text-center">đgtx 2</th>
                    <th className="py-3 px-2 w-20 text-center">đgtx 3</th>
                    <th className="py-3 px-2 w-24 text-center">Giữa kỳ (gk)</th>
                    <th className="py-3 px-2 w-24 text-center">Cuối kỳ (ck)</th>
                    <th className="py-3 px-3 w-32 text-center text-emerald-700 dark:text-emerald-300">
                      TBM (tbm)
                    </th>
                    <th className="py-3 px-3 w-28 text-center">Đánh giá môn</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {classSubjects.map((subject) => {
                    const studentGrades = currentStudent.grades?.[selectedSemester] || {};
                    const sc = studentGrades[subject] || {};
                    const autoAvg = calculateSubjectAverage(sc);
                    const tbm = sc.avg !== undefined ? sc.avg : autoAvg;

                    let subjectRating = '—';
                    if (tbm !== undefined) {
                      if (tbm >= 8.0) subjectRating = 'Tốt';
                      else if (tbm >= 6.5) subjectRating = 'Khá';
                      else if (tbm >= 5.0) subjectRating = 'Đạt';
                      else subjectRating = 'Chưa đạt';
                    }

                    return (
                      <tr key={subject} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30">
                        <td className="py-3 px-4 font-bold text-neutral-900 dark:text-neutral-100">
                          {subject}
                        </td>

                        {/* đgtx 1 */}
                        <td className="py-2 px-2 text-center">
                          {isReadOnly ? (
                            <span className="font-mono font-medium">{sc.tx1 !== undefined ? sc.tx1 : '—'}</span>
                          ) : (
                            <input
                              type="number"
                              min={0}
                              max={10}
                              step={0.1}
                              value={sc.tx1 !== undefined ? sc.tx1 : ''}
                              onChange={(e) => handleScoreChange(currentStudent.id, subject, 'tx1', e.target.value)}
                              placeholder="—"
                              className="w-16 px-1.5 py-1 text-center font-mono text-xs bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                          )}
                        </td>

                        {/* đgtx 2 */}
                        <td className="py-2 px-2 text-center">
                          {isReadOnly ? (
                            <span className="font-mono font-medium">{sc.tx2 !== undefined ? sc.tx2 : '—'}</span>
                          ) : (
                            <input
                              type="number"
                              min={0}
                              max={10}
                              step={0.1}
                              value={sc.tx2 !== undefined ? sc.tx2 : ''}
                              onChange={(e) => handleScoreChange(currentStudent.id, subject, 'tx2', e.target.value)}
                              placeholder="—"
                              className="w-16 px-1.5 py-1 text-center font-mono text-xs bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                          )}
                        </td>

                        {/* đgtx 3 */}
                        <td className="py-2 px-2 text-center">
                          {isReadOnly ? (
                            <span className="font-mono font-medium">{sc.tx3 !== undefined ? sc.tx3 : '—'}</span>
                          ) : (
                            <input
                              type="number"
                              min={0}
                              max={10}
                              step={0.1}
                              value={sc.tx3 !== undefined ? sc.tx3 : ''}
                              onChange={(e) => handleScoreChange(currentStudent.id, subject, 'tx3', e.target.value)}
                              placeholder="—"
                              className="w-16 px-1.5 py-1 text-center font-mono text-xs bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                          )}
                        </td>

                        {/* gk */}
                        <td className="py-2 px-2 text-center">
                          {isReadOnly ? (
                            <span className="font-mono font-bold text-amber-600">{sc.gk !== undefined ? sc.gk : '—'}</span>
                          ) : (
                            <input
                              type="number"
                              min={0}
                              max={10}
                              step={0.1}
                              value={sc.gk !== undefined ? sc.gk : ''}
                              onChange={(e) => handleScoreChange(currentStudent.id, subject, 'gk', e.target.value)}
                              placeholder="—"
                              className="w-16 px-1.5 py-1 text-center font-mono text-xs font-bold text-amber-700 dark:text-amber-300 bg-white dark:bg-neutral-800 border border-amber-300 dark:border-amber-700 rounded-lg focus:ring-2 focus:ring-amber-500"
                            />
                          )}
                        </td>

                        {/* ck */}
                        <td className="py-2 px-2 text-center">
                          {isReadOnly ? (
                            <span className="font-mono font-bold text-indigo-600">{sc.ck !== undefined ? sc.ck : '—'}</span>
                          ) : (
                            <input
                              type="number"
                              min={0}
                              max={10}
                              step={0.1}
                              value={sc.ck !== undefined ? sc.ck : ''}
                              onChange={(e) => handleScoreChange(currentStudent.id, subject, 'ck', e.target.value)}
                              placeholder="—"
                              className="w-16 px-1.5 py-1 text-center font-mono text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-white dark:bg-neutral-800 border border-indigo-300 dark:border-indigo-700 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            />
                          )}
                        </td>

                        {/* TBM (Requirement 6: Cho phép tự nhập hoặc để hệ thống tự tính) */}
                        <td className="py-2 px-3 text-center bg-emerald-50/40 dark:bg-emerald-950/20">
                          {isReadOnly ? (
                            <span className={`font-mono font-extrabold text-sm ${
                              tbm !== undefined && tbm >= 8.0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-neutral-900 dark:text-neutral-100'
                            }`}>
                              {tbm !== undefined ? tbm : '—'}
                            </span>
                          ) : (
                            <div className="flex items-center justify-center gap-1">
                              <input
                                type="number"
                                min={0}
                                max={10}
                                step={0.1}
                                value={sc.avg !== undefined ? sc.avg : (autoAvg !== undefined ? autoAvg : '')}
                                onChange={(e) => handleManualTbmChange(currentStudent.id, subject, e.target.value)}
                                placeholder="—"
                                className="w-16 px-1.5 py-1 text-center font-mono text-xs font-extrabold text-emerald-700 dark:text-emerald-300 bg-white dark:bg-neutral-800 border border-emerald-300 dark:border-emerald-700 rounded-lg focus:ring-2 focus:ring-emerald-500 shadow-xs"
                                title="GVCN có thể tự nhập điểm TBM hoặc hệ thống tự tính"
                              />
                              {sc.avg !== undefined && (
                                <button
                                  type="button"
                                  onClick={() => handleResetToAutoTbm(currentStudent.id, subject)}
                                  title="Tính lại tự động theo công thức"
                                  className="p-1 rounded text-neutral-400 hover:text-blue-600 cursor-pointer"
                                >
                                  <RotateCcw className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          )}
                        </td>

                        {/* Đánh giá môn */}
                        <td className="py-2 px-3 text-center">
                          <span className={`px-2 py-0.5 rounded-md font-bold text-[11px] ${
                            subjectRating === 'Tốt' ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40' :
                            subjectRating === 'Khá' ? 'text-blue-600 bg-blue-50 dark:bg-blue-950/40' :
                            subjectRating === 'Đạt' ? 'text-amber-600 bg-amber-50 dark:bg-amber-950/40' :
                            'text-neutral-400'
                          }`}>
                            {subjectRating}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* VIEW 2: CLASS BY SUBJECT GRADE ENTRY (For Teachers)            */}
      {/* ============================================================== */}
      {viewMode === 'class_subject' && !isReadOnly && (
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-xs space-y-4">
          <div className="p-4 bg-neutral-50 dark:bg-neutral-800/60 border-b border-neutral-200 dark:border-neutral-700 flex items-center justify-between">
            <div className="font-bold text-sm text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span>Vào Điểm Môn: {selectedSubject} · Lớp {classroom.name}</span>
            </div>
            <div className="text-xs text-neutral-500">
              Nhập trực tiếp điểm cho toàn bộ {classStudents.length} học sinh
            </div>
          </div>

          <div className="overflow-x-auto p-4">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-neutral-50 dark:bg-neutral-800 font-bold text-neutral-600 dark:text-neutral-300">
                <tr>
                  <th className="py-2.5 px-3">STT</th>
                  <th className="py-2.5 px-4 min-w-[170px]">Họ và tên</th>
                  <th className="py-2.5 px-2 w-20 text-center">đgtx 1</th>
                  <th className="py-2.5 px-2 w-20 text-center">đgtx 2</th>
                  <th className="py-2.5 px-2 w-20 text-center">đgtx 3</th>
                  <th className="py-2.5 px-2 w-24 text-center">Giữa kỳ (gk)</th>
                  <th className="py-2.5 px-2 w-24 text-center">Cuối kỳ (ck)</th>
                  <th className="py-2.5 px-3 w-28 text-center text-emerald-700">TBM</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {classStudents.map((st, idx) => {
                  const studentGrades = st.grades?.[selectedSemester] || {};
                  const sc = studentGrades[selectedSubject] || {};
                  const autoAvg = calculateSubjectAverage(sc);
                  const tbm = sc.avg !== undefined ? sc.avg : autoAvg;

                  return (
                    <tr key={st.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30">
                      <td className="py-2 px-3 font-mono text-neutral-400">{idx + 1}</td>
                      <td className="py-2 px-4 font-bold text-neutral-900 dark:text-neutral-100">
                        {st.fullName} <span className="font-normal text-neutral-400">({st.code})</span>
                      </td>

                      <td className="py-2 px-2 text-center">
                        <input
                          type="number"
                          min={0}
                          max={10}
                          step={0.1}
                          value={sc.tx1 !== undefined ? sc.tx1 : ''}
                          onChange={(e) => handleScoreChange(st.id, selectedSubject, 'tx1', e.target.value)}
                          placeholder="—"
                          className="w-16 px-1.5 py-1 text-center font-mono text-xs bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </td>

                      <td className="py-2 px-2 text-center">
                        <input
                          type="number"
                          min={0}
                          max={10}
                          step={0.1}
                          value={sc.tx2 !== undefined ? sc.tx2 : ''}
                          onChange={(e) => handleScoreChange(st.id, selectedSubject, 'tx2', e.target.value)}
                          placeholder="—"
                          className="w-16 px-1.5 py-1 text-center font-mono text-xs bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </td>

                      <td className="py-2 px-2 text-center">
                        <input
                          type="number"
                          min={0}
                          max={10}
                          step={0.1}
                          value={sc.tx3 !== undefined ? sc.tx3 : ''}
                          onChange={(e) => handleScoreChange(st.id, selectedSubject, 'tx3', e.target.value)}
                          placeholder="—"
                          className="w-16 px-1.5 py-1 text-center font-mono text-xs bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </td>

                      <td className="py-2 px-2 text-center">
                        <input
                          type="number"
                          min={0}
                          max={10}
                          step={0.1}
                          value={sc.gk !== undefined ? sc.gk : ''}
                          onChange={(e) => handleScoreChange(st.id, selectedSubject, 'gk', e.target.value)}
                          placeholder="—"
                          className="w-16 px-1.5 py-1 text-center font-mono text-xs font-bold text-amber-700 dark:text-amber-300 bg-white dark:bg-neutral-800 border border-amber-300 dark:border-amber-700 rounded-lg focus:ring-2 focus:ring-amber-500"
                        />
                      </td>

                      <td className="py-2 px-2 text-center">
                        <input
                          type="number"
                          min={0}
                          max={10}
                          step={0.1}
                          value={sc.ck !== undefined ? sc.ck : ''}
                          onChange={(e) => handleScoreChange(st.id, selectedSubject, 'ck', e.target.value)}
                          placeholder="—"
                          className="w-16 px-1.5 py-1 text-center font-mono text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-white dark:bg-neutral-800 border border-indigo-300 dark:border-indigo-700 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        />
                      </td>

                      {/* TBM (editable / auto-computed) */}
                      <td className="py-2 px-2 text-center">
                        <input
                          type="number"
                          min={0}
                          max={10}
                          step={0.1}
                          value={sc.avg !== undefined ? sc.avg : (autoAvg !== undefined ? autoAvg : '')}
                          onChange={(e) => handleManualTbmChange(st.id, selectedSubject, e.target.value)}
                          placeholder="—"
                          className="w-16 px-1.5 py-1 text-center font-mono text-xs font-extrabold text-emerald-700 dark:text-emerald-300 bg-white dark:bg-neutral-800 border border-emerald-300 dark:border-emerald-700 rounded-lg focus:ring-2 focus:ring-emerald-500 shadow-xs"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Evaluation Modal (KQHT & KQRL) */}
      {isEvaluationModalOpen && currentStudent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div 
            className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">Đánh Giá Học Kỳ ({selectedSemester})</h3>
                <div className="text-xs text-blue-100">{currentStudent.fullName} ({currentStudent.code})</div>
              </div>
              <button
                type="button"
                onClick={() => setIsEvaluationModalOpen(false)}
                className="p-1 rounded-full hover:bg-white/20 text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEvaluation} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                  Kết quả học tập (KQHT) <span className="text-rose-500">*</span>
                </label>
                <select
                  value={evalAcademic}
                  onChange={(e) => setEvalAcademic(e.target.value as any)}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl font-bold text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Tốt">Tốt</option>
                  <option value="Khá">Khá</option>
                  <option value="Đạt">Đạt</option>
                  <option value="Chưa đạt">Chưa đạt</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                  Kết quả rèn luyện (KQRL) <span className="text-rose-500">*</span>
                </label>
                <select
                  value={evalTraining}
                  onChange={(e) => setEvalTraining(e.target.value as any)}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl font-bold text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Tốt">Tốt</option>
                  <option value="Khá">Khá</option>
                  <option value="Đạt">Đạt</option>
                  <option value="Chưa đạt">Chưa đạt</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                  Nhận xét đánh giá của GVCN
                </label>
                <textarea
                  rows={3}
                  value={evalNotes}
                  onChange={(e) => setEvalNotes(e.target.value)}
                  placeholder="Nhập nhận xét cụ thể về sự tiến bộ và ý thức của học sinh..."
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsEvaluationModalOpen(false)}
                  className="px-4 py-2 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl font-semibold cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold cursor-pointer"
                >
                  Lưu Đánh Giá
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Subject Management Modal */}
      <SubjectManagementModal
        isOpen={isSubjectModalOpen}
        classId={classroom.id}
        className={classroom.name}
        subjects={classSubjects}
        students={students}
        onClose={() => setIsSubjectModalOpen(false)}
        onUpdateSubjects={handleUpdateSubjects}
      />
    </div>
  );
};
