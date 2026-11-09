import React, { useState, useMemo } from 'react';
import { 
  Student, 
  ClassRoom, 
  WeeklyRecordItem, 
  WeeklyComment, 
  WeeklyEntryType, 
  SUBJECT_LIST 
} from '../types';
import { 
  Trophy, 
  Plus, 
  Minus, 
  Download, 
  Printer, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  Star, 
  TrendingUp, 
  MessageSquare, 
  X, 
  Check, 
  Award,
  Sparkles,
  Calendar
} from 'lucide-react';

interface WeeklyReportViewProps {
  students: Student[];
  classroom: ClassRoom;
  weeklyRecords: WeeklyRecordItem[];
  weeklyComments: WeeklyComment[];
  isReadOnly?: boolean;
  parentStudentId?: string; // When logged in as parent
  onUpdateWeeklyRecords: (records: WeeklyRecordItem[]) => void;
  onUpdateWeeklyComments: (comments: WeeklyComment[]) => void;
  onViewStudent: (student: Student) => void;
}

const PRESET_CATEGORIES = {
  bonus: [
    { name: 'Điểm kiểm tra thường xuyên 10', points: 10 },
    { name: 'Điểm kiểm tra thường xuyên 9', points: 8 },
    { name: 'Điểm kiểm tra thường xuyên 8', points: 5 },
    { name: 'Tích cực phát biểu xây dựng bài', points: 5 },
    { name: 'Gương người tốt việc tốt / Giúp đỡ bạn', points: 5 },
    { name: 'Trực nhật sạch sẽ, đúng giờ', points: 5 },
    { name: 'Đạt giải phong trào / Văn nghệ / Thể thao', points: 10 }
  ],
  penalty: [
    { name: 'Đi học muộn', points: 2 },
    { name: 'Không thuộc bài / Không chuẩn bị bài', points: 5 },
    { name: 'Không làm bài tập về nhà', points: 5 },
    { name: 'Không mặc đúng đồng phục quy định', points: 2 },
    { name: 'Nói chuyện riêng / Làm mất trật tự', points: 2 },
    { name: 'Sử dụng điện thoại trong giờ học', points: 10 },
    { name: 'Nghỉ học không phép', points: 10 }
  ]
};

const SUGGESTED_COMMENTS = [
  'Tuần này con học tập rất tốt, đạt điểm cao kiểm tra miệng, chăm ngoan và tích cực.',
  'Có nhiều tiến bộ trong học tập, hoàn thành đầy đủ bài tập các môn.',
  'Ý thức kỷ luật nề nếp tốt, gương mẫu trong các hoạt động của lớp.',
  'Cần chú ý ôn tập thêm môn Toán và giữ trật tự đầu giờ học.',
  'Gia đình phối hợp nhắc nhở con đi ngủ sớm, không dùng điện thoại muộn để đi học đúng giờ.',
  'Cần tập trung nghe giảng hơn và tích cực phát biểu xây dựng bài.'
];

export const WeeklyReportView: React.FC<WeeklyReportViewProps> = ({
  students,
  classroom,
  weeklyRecords,
  weeklyComments,
  isReadOnly = false,
  parentStudentId,
  onUpdateWeeklyRecords,
  onUpdateWeeklyComments,
  onViewStudent
}) => {
  const [selectedWeek, setSelectedWeek] = useState<number>(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [saveToast, setSaveToast] = useState(false);

  // Modal 1: Add Point / Penalty Modal
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [modalStudentId, setModalStudentId] = useState<string>(students[0]?.id || '');
  const [modalType, setModalType] = useState<WeeklyEntryType>('bonus');
  const [modalCategory, setModalCategory] = useState<string>(PRESET_CATEGORIES.bonus[0].name);
  const [modalPoints, setModalPoints] = useState<number>(PRESET_CATEGORIES.bonus[0].points);
  const [modalSubject, setModalSubject] = useState<string>('Toán học');
  const [modalDate, setModalDate] = useState<string>('2026-11-06');
  const [modalNote, setModalNote] = useState<string>('');
  const [modalCreatedBy, setModalCreatedBy] = useState<string>('Thầy Hùng (GVCN)');

  // Modal 2: Edit Weekly Teacher Comment
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [commentStudentId, setCommentStudentId] = useState<string>('');
  const [commentText, setCommentText] = useState<string>('');

  // Class students
  const classStudents = students.filter((s) => s.classId === classroom.id);

  // Available weeks
  const weeks = Array.from({ length: 15 }, (_, i) => ({
    week: i + 1,
    label: `Tuần ${i + 1}`
  }));

  // Records for this week
  const weekRecords = useMemo(() => {
    return weeklyRecords.filter((r) => r.weekNumber === selectedWeek);
  }, [weeklyRecords, selectedWeek]);

  // Compute stats per student for the week
  const studentWeeklyStats = useMemo(() => {
    return classStudents.map((student) => {
      const records = weekRecords.filter((r) => r.studentId === student.id);
      const bonusRecords = records.filter((r) => r.type === 'bonus');
      const penaltyRecords = records.filter((r) => r.type === 'penalty');

      const totalBonus = bonusRecords.reduce((sum, r) => sum + r.points, 0);
      const totalPenalty = penaltyRecords.reduce((sum, r) => sum + r.points, 0);
      const baseScore = 100;
      const finalScore = baseScore + totalBonus - totalPenalty;

      let rankLabel: 'Xuất sắc' | 'Tốt' | 'Khá' | 'Cần rèn luyện';
      if (finalScore >= 110) rankLabel = 'Xuất sắc';
      else if (finalScore >= 100) rankLabel = 'Tốt';
      else if (finalScore >= 90) rankLabel = 'Khá';
      else rankLabel = 'Cần rèn luyện';

      // Find teacher comment for this student & week
      const commentObj = weeklyComments.find(
        (c) => c.studentId === student.id && c.weekNumber === selectedWeek
      );

      return {
        student,
        records,
        bonusRecords,
        penaltyRecords,
        totalBonus,
        totalPenalty,
        finalScore,
        rankLabel,
        comment: commentObj?.comment || ''
      };
    });
  }, [classStudents, weekRecords, weeklyComments, selectedWeek]);

  // Ranked stats
  const rankedStats = useMemo(() => {
    return [...studentWeeklyStats].sort((a, b) => b.finalScore - a.finalScore);
  }, [studentWeeklyStats]);

  // Filtered stats (search or parent lock)
  const displayStats = useMemo(() => {
    // If parent mode: lock to parent's child only
    if (parentStudentId) {
      return rankedStats.filter((item) => item.student.id === parentStudentId);
    }

    const term = searchTerm.toLowerCase().trim();
    if (!term) return rankedStats;

    return rankedStats.filter((item) => {
      const matchName = item.student.fullName.toLowerCase().includes(term);
      const matchCode = item.student.code.toLowerCase().includes(term);
      return matchName || matchCode;
    });
  }, [rankedStats, searchTerm, parentStudentId]);

  // Top Student
  const topStudent = rankedStats[0];

  // Open Add Record Modal (+ Điểm cộng or - Trừ điểm)
  const handleOpenAddRecord = (type: WeeklyEntryType, preselectedStudentId?: string) => {
    if (isReadOnly) return;
    setModalType(type);
    setModalStudentId(preselectedStudentId || classStudents[0]?.id || '');
    const presets = type === 'bonus' ? PRESET_CATEGORIES.bonus : PRESET_CATEGORIES.penalty;
    setModalCategory(presets[0].name);
    setModalPoints(presets[0].points);
    setModalSubject('Toán học');
    setModalDate('2026-11-06');
    setModalNote('');
    setModalCreatedBy('Thầy Hùng (GVCN)');
    setIsRecordModalOpen(true);
  };

  // Save Record
  const handleSaveRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (isReadOnly || !modalStudentId || !modalCategory.trim()) return;

    const newRec: WeeklyRecordItem = {
      id: `wr-${Date.now()}`,
      studentId: modalStudentId,
      weekNumber: selectedWeek,
      date: modalDate,
      type: modalType,
      category: modalCategory,
      points: Number(modalPoints) || 0,
      subject: modalSubject || undefined,
      note: modalNote.trim() || undefined,
      createdByName: modalCreatedBy.trim() || 'Thầy Hùng (GVCN)'
    };

    onUpdateWeeklyRecords([...weeklyRecords, newRec]);
    setIsRecordModalOpen(false);
    showToast();
  };

  // Delete Record
  const handleDeleteRecord = (recordId: string) => {
    if (isReadOnly) return;
    onUpdateWeeklyRecords(weeklyRecords.filter((r) => r.id !== recordId));
    showToast();
  };

  // Open Comment Modal
  const handleOpenCommentModal = (studentId: string) => {
    if (isReadOnly) return;
    setCommentStudentId(studentId);
    const existing = weeklyComments.find(
      (c) => c.studentId === studentId && c.weekNumber === selectedWeek
    );
    setCommentText(existing?.comment || '');
    setIsCommentModalOpen(true);
  };

  // Save Teacher Comment
  const handleSaveComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (isReadOnly || !commentStudentId) return;

    const existingIdx = weeklyComments.findIndex(
      (c) => c.studentId === commentStudentId && c.weekNumber === selectedWeek
    );

    let updatedList: WeeklyComment[];
    if (existingIdx >= 0) {
      updatedList = weeklyComments.map((c, i) =>
        i === existingIdx ? { ...c, comment: commentText.trim(), updatedAt: '2026-11-06' } : c
      );
    } else {
      const newComment: WeeklyComment = {
        id: `wc-${Date.now()}`,
        studentId: commentStudentId,
        weekNumber: selectedWeek,
        comment: commentText.trim(),
        updatedAt: '2026-11-06',
        createdByName: 'Thầy Hùng (GVCN)'
      };
      updatedList = [...weeklyComments, newComment];
    }

    onUpdateWeeklyComments(updatedList);
    setIsCommentModalOpen(false);
    showToast();
  };

  const showToast = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  // Export CSV
  const handleExportCsv = () => {
    const headers = [
      'Thứ hạng',
      'Mã HS',
      'Họ và tên',
      'Tuần',
      'Điểm gốc',
      'Điểm cộng (+)',
      'Điểm trừ (-)',
      'Tổng điểm thi đua',
      'Xếp loại',
      'Nhận xét của GVCN'
    ];

    const rows = displayStats.map((item, idx) => {
      return [
        idx + 1,
        `"${item.student.code}"`,
        `"${item.student.fullName}"`,
        `"Tuần ${selectedWeek}"`,
        100,
        item.totalBonus,
        item.totalPenalty,
        item.finalScore,
        `"${item.rankLabel}"`,
        `"${item.comment.replace(/"/g, '""')}"`
      ].join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `thi_dua_tuan_${selectedWeek}_lop_${classroom.name}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <span>Báo Cáo Học Tập, Thi Đua & Nhận Xét Tuần ({selectedWeek})</span>
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            {isReadOnly
              ? 'Theo dõi điểm cộng thi đua, điểm trừ vi phạm và lời nhận xét tuần của Giáo viên chủ nhiệm. (Chỉ xem)'
              : 'Ghi nhận điểm cộng (+), điểm trừ (-), xếp hạng nề nếp và nhập lời nhận xét tuần cho học sinh lớp.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {saveToast && (
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
              <Check className="w-3.5 h-3.5" />
              <span>Đã lưu thành công</span>
            </span>
          )}

          <button
            type="button"
            onClick={handleExportCsv}
            className="px-3 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-200 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs whitespace-nowrap shrink-0"
          >
            <Download className="w-3.5 h-3.5 text-neutral-500" />
            <span>Xuất Báo Cáo</span>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="px-3 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-200 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs whitespace-nowrap shrink-0"
          >
            <Printer className="w-3.5 h-3.5 text-neutral-500" />
            <span>In Bảng Thi Đua</span>
          </button>

          {/* Teacher CRUD Actions: Clear + Point and - Penalty Buttons */}
          {!isReadOnly && (
            <>
              <button
                type="button"
                onClick={() => handleOpenAddRecord('bonus')}
                className="px-3 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs whitespace-nowrap shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>+ Điểm Cộng Thi Đua</span>
              </button>

              <button
                type="button"
                onClick={() => handleOpenAddRecord('penalty')}
                className="px-3 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs whitespace-nowrap shrink-0"
              >
                <Minus className="w-4 h-4" />
                <span>- Trừ Điểm Vi Phạm</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Week Selector Ribbon */}
      <div className="p-3 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-300 whitespace-nowrap flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            <span>Chọn tuần:</span>
          </span>
          <div className="flex items-center gap-1">
            {weeks.slice(7, 13).map((w) => (
              <button
                key={w.week}
                type="button"
                onClick={() => setSelectedWeek(w.week)}
                className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors whitespace-nowrap ${
                  selectedWeek === w.week
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                }`}
              >
                {w.label} {w.week === 10 ? '(Hiện tại)' : ''}
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs text-neutral-500 font-mono">
          Lớp {classroom.name} · Điểm gốc thi đua: 100 điểm
        </div>
      </div>

      {/* When in Parent Mode: Highlight Card for the Child */}
      {parentStudentId && displayStats[0] && (
        <div className="p-5 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40 border-2 border-amber-300 dark:border-amber-700 rounded-2xl shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-200 flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                <span>Phiếu Báo Cáo Tuần Của Con Em (Tuần {selectedWeek})</span>
              </span>
              <div className="text-lg font-bold text-neutral-900 dark:text-neutral-50 mt-1">
                {displayStats[0].student.fullName} ({displayStats[0].student.code})
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-xs text-neutral-500 block">Tổng điểm thi đua tuần:</span>
                <span className="text-2xl font-bold font-mono text-emerald-600">
                  {displayStats[0].finalScore} điểm
                </span>
              </div>
              <div className="px-3 py-1.5 bg-amber-100 dark:bg-amber-900/60 rounded-xl text-amber-900 dark:text-amber-100 font-bold text-xs">
                Xếp loại: {displayStats[0].rankLabel}
              </div>
            </div>
          </div>

          {/* Teacher Comment Box */}
          <div className="p-4 bg-white dark:bg-neutral-900 rounded-xl border border-amber-200 dark:border-amber-800 space-y-1">
            <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5 text-blue-600">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Lời nhận xét tuần từ Thầy Nguyễn Văn Hùng (GVCN):</span>
            </span>
            <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed italic pt-1">
              {displayStats[0].comment ? `"${displayStats[0].comment}"` : 'Thầy chủ nhiệm chưa ghi nhận xét cụ thể trong tuần này. Con đang thực hiện tốt nề nếp học tập.'}
            </p>
          </div>
        </div>
      )}

      {/* Main Ranking Table */}
      <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-xs">
        <div className="p-3 bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
            {parentStudentId ? 'Chi Tiết Ghi Nhận Điểm & Lỗi Của Con' : 'Bảng Xếp Hạng & Nhận Xét Thi Đua Lớp ' + classroom.name}
          </span>

          {!parentStudentId && (
            <div className="relative w-64">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm tên học sinh..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-2.5 py-1 text-xs bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40 text-[11px] font-semibold text-neutral-500">
                <th className="py-3 px-3 w-16 text-center">Thứ hạng</th>
                <th className="py-3 px-4 min-w-[170px]">Học sinh</th>
                <th className="py-3 px-3 w-20 text-center">Gốc</th>
                <th className="py-3 px-3 w-28 text-center text-emerald-600">Điểm cộng (+)</th>
                <th className="py-3 px-3 w-28 text-center text-rose-600">Điểm trừ (-)</th>
                <th className="py-3 px-4 min-w-[240px]">Chi tiết hoa điểm tốt & Lỗi vi phạm</th>
                <th className="py-3 px-4 min-w-[260px]">Nhận xét tuần của GVCN</th>
                <th className="py-3 px-3 w-28 text-right font-bold text-neutral-900 dark:text-neutral-100">
                  Tổng điểm tuần
                </th>
                <th className="py-3 px-3 w-28 text-center">Xếp loại</th>
                {!isReadOnly && <th className="py-3 px-3 w-24 text-right">Thao tác</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {displayStats.length === 0 ? (
                <tr>
                  <td colSpan={isReadOnly ? 9 : 10} className="py-12 text-center text-neutral-400">
                    Không có dữ liệu học sinh phù hợp.
                  </td>
                </tr>
              ) : (
                displayStats.map((item, idx) => {
                  let rankIndicator: React.ReactNode = (
                    <span className="font-mono text-neutral-500 font-semibold">{idx + 1}</span>
                  );
                  if (idx === 0) {
                    rankIndicator = (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-100 text-amber-700 font-bold text-xs">
                        🥇 1
                      </span>
                    );
                  } else if (idx === 1) {
                    rankIndicator = (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-200 text-slate-700 font-bold text-xs">
                        🥈 2
                      </span>
                    );
                  } else if (idx === 2) {
                    rankIndicator = (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-50 text-amber-800 font-bold text-xs border border-amber-200">
                        🥉 3
                      </span>
                    );
                  }

                  let rankColorClass = 'text-blue-600 dark:text-blue-400';
                  if (item.rankLabel === 'Xuất sắc') rankColorClass = 'text-emerald-600 dark:text-emerald-400 font-bold';
                  else if (item.rankLabel === 'Cần rèn luyện') rankColorClass = 'text-rose-600 dark:text-rose-400 font-bold';

                  return (
                    <tr
                      key={item.student.id}
                      className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40 transition-colors"
                    >
                      {/* Rank */}
                      <td className="py-3 px-3 text-center">
                        {rankIndicator}
                      </td>

                      {/* Student info */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-neutral-900 dark:text-neutral-100">
                          {item.student.fullName}
                        </div>
                        <div className="text-[11px] text-neutral-400 font-mono">
                          {item.student.code} · {item.student.gender}
                        </div>
                      </td>

                      {/* Base score */}
                      <td className="py-3 px-3 text-center font-mono text-neutral-400">
                        100
                      </td>

                      {/* Bonus */}
                      <td className="py-3 px-3 text-center font-mono font-bold text-emerald-600">
                        {item.totalBonus > 0 ? `+${item.totalBonus}` : '0'}
                      </td>

                      {/* Penalty */}
                      <td className="py-3 px-3 text-center font-mono font-bold text-rose-600">
                        {item.totalPenalty > 0 ? `-${item.totalPenalty}` : '0'}
                      </td>

                      {/* Detailed badges */}
                      <td className="py-3 px-4">
                        {item.records.length === 0 ? (
                          <span className="text-neutral-400 italic text-[11px]">Không có ghi nhận</span>
                        ) : (
                          <div className="flex flex-wrap gap-1.5">
                            {item.bonusRecords.map((r) => (
                              <span
                                key={r.id}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                              >
                                <span className="font-bold">+{r.points}đ</span>
                                <span>{r.category}</span>
                                {!isReadOnly && (
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteRecord(r.id)}
                                    className="ml-1 text-emerald-400 hover:text-rose-600"
                                    title="Xóa"
                                  >
                                    ×
                                  </button>
                                )}
                              </span>
                            ))}

                            {item.penaltyRecords.map((r) => (
                              <span
                                key={r.id}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
                              >
                                <span className="font-bold">-{r.points}đ</span>
                                <span>{r.category}</span>
                                {!isReadOnly && (
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteRecord(r.id)}
                                    className="ml-1 text-rose-400 hover:text-rose-700"
                                    title="Xóa"
                                  >
                                    ×
                                  </button>
                                )}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>

                      {/* Teacher Weekly Comment */}
                      <td className="py-3 px-4">
                        {isReadOnly ? (
                          <span className="text-neutral-700 dark:text-neutral-300 italic text-xs">
                            {item.comment || '—'}
                          </span>
                        ) : (
                          <div className="flex items-center justify-between gap-2 group">
                            <span className="text-neutral-700 dark:text-neutral-300 text-xs italic line-clamp-2">
                              {item.comment || <span className="text-neutral-400 not-italic">(Chưa có nhận xét)</span>}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleOpenCommentModal(item.student.id)}
                              className="text-blue-600 hover:underline text-[11px] font-semibold shrink-0"
                            >
                              {item.comment ? 'Sửa' : '+ Nhận xét'}
                            </button>
                          </div>
                        )}
                      </td>

                      {/* Total Weekly Score */}
                      <td className="py-3 px-3 text-right">
                        <span className="font-mono font-bold text-sm text-neutral-900 dark:text-neutral-50">
                          {item.finalScore}
                        </span>
                        <span className="text-[11px] text-neutral-400 ml-1">đ</span>
                      </td>

                      {/* Rank Label */}
                      <td className="py-3 px-3 text-center">
                        <span className={`text-xs ${rankColorClass}`}>
                          {item.rankLabel}
                        </span>
                      </td>

                      {/* Actions */}
                      {!isReadOnly && (
                        <td className="py-3 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleOpenAddRecord('bonus', item.student.id)}
                            className="px-2 py-1 text-[11px] font-medium text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded transition-colors whitespace-nowrap"
                          >
                            + Điểm
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal 1: Add Point / Penalty Record */}
      {isRecordModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl w-full max-w-lg shadow-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-50 flex items-center gap-2">
                <span>{modalType === 'bonus' ? 'Thêm Điểm Cộng Thi Đua (+)' : 'Ghi Lỗi Vi Phạm & Trừ Điểm (-)'} (Tuần {selectedWeek})</span>
              </h2>
              <button
                type="button"
                onClick={() => setIsRecordModalOpen(false)}
                className="p-1 text-neutral-400 hover:text-neutral-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRecord} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Chọn học sinh <span className="text-rose-500">*</span>
                </label>
                <select
                  value={modalStudentId}
                  onChange={(e) => setModalStudentId(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                >
                  {classStudents.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.fullName} ({st.code})
                    </option>
                  ))}
                </select>
              </div>

              {/* Preset selection */}
              <div>
                <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Danh mục tiêu biểu
                </label>
                <select
                  value={modalCategory}
                  onChange={(e) => {
                    setModalCategory(e.target.value);
                    const found = [...PRESET_CATEGORIES.bonus, ...PRESET_CATEGORIES.penalty].find(
                      (p) => p.name === e.target.value
                    );
                    if (found) setModalPoints(found.points);
                  }}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                >
                  {(modalType === 'bonus' ? PRESET_CATEGORIES.bonus : PRESET_CATEGORIES.penalty).map(
                    (item) => (
                      <option key={item.name} value={item.name}>
                        {item.name} ({modalType === 'bonus' ? `+${item.points}đ` : `-${item.points}đ`})
                      </option>
                    )
                  )}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Số điểm {modalType === 'bonus' ? 'cộng (+)' : 'trừ (-)'}
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={modalPoints}
                    onChange={(e) => setModalPoints(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 font-mono font-bold focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Môn học liên quan
                  </label>
                  <select
                    value={modalSubject}
                    onChange={(e) => setModalSubject(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="">Không theo môn</option>
                    {SUBJECT_LIST.map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Chi tiết nội dung / Ghi chú
                </label>
                <textarea
                  rows={2}
                  value={modalNote}
                  onChange={(e) => setModalNote(e.target.value)}
                  placeholder="Ghi chú cụ thể..."
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRecordModalOpen(false)}
                  className="px-4 py-2 text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 rounded-lg font-medium transition-colors"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 text-white font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs ${
                    modalType === 'bonus' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
                  }`}
                >
                  <Check className="w-4 h-4" />
                  <span>Lưu Ghi Nhận</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Edit Teacher Comment for Student */}
      {isCommentModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl w-full max-w-lg shadow-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-50">
                  Ghi Nhận Xét Tuần Của GVCN (Tuần {selectedWeek})
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Học sinh: {classStudents.find((s) => s.id === commentStudentId)?.fullName}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCommentModalOpen(false)}
                className="p-1 text-neutral-400 hover:text-neutral-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveComment} className="p-5 space-y-4 text-xs">
              {/* Quick Suggestion Chips */}
              <div>
                <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Gợi ý nhận xét nhanh 1-chạm:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTED_COMMENTS.map((sug, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setCommentText(sug)}
                      className="px-2.5 py-1 text-[11px] bg-neutral-100 hover:bg-blue-50 hover:text-blue-700 dark:bg-neutral-800 dark:hover:bg-blue-950/40 rounded-lg transition-colors text-left"
                    >
                      {sug.slice(0, 45)}...
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Nội dung nhận xét gửi gia đình học sinh:
                </label>
                <textarea
                  rows={4}
                  required
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Nhập lời nhận xét về học tập, nề nếp kỷ luật, phát biểu bài trong tuần..."
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:ring-1 focus:ring-blue-500 focus:outline-none leading-relaxed"
                />
              </div>

              <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCommentModalOpen(false)}
                  className="px-4 py-2 text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 rounded-lg font-medium transition-colors"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Check className="w-4 h-4" />
                  <span>Lưu Nhận Xét</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
