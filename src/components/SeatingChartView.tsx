import React, { useState } from 'react';
import { Student, ClassRoom, SeatingLayout } from '../types';
import { 
  Armchair, 
  Plus, 
  Minus, 
  Sparkles, 
  RotateCcw, 
  Printer, 
  User, 
  X, 
  Check, 
  Shuffle, 
  School,
  ArrowRightLeft,
  Star,
  Users
} from 'lucide-react';

interface SeatingChartViewProps {
  students: Student[];
  classroom: ClassRoom;
  seatingLayout: SeatingLayout;
  isReadOnly?: boolean;
  highlightStudentId?: string; // For parent viewing their child
  onUpdateSeatingLayout: (layout: SeatingLayout) => void;
  onViewStudent?: (student: Student) => void;
}

export const SeatingChartView: React.FC<SeatingChartViewProps> = ({
  students,
  classroom,
  seatingLayout,
  isReadOnly = false,
  highlightStudentId,
  onUpdateSeatingLayout,
  onViewStudent
}) => {
  // Modal for assigning student to a specific seat
  const [targetSeatKey, setTargetSeatKey] = useState<string | null>(null);
  const [swapSourceSeatKey, setSwapSourceSeatKey] = useState<string | null>(null);
  const [saveToast, setSaveToast] = useState(false);

  // Filter students belonging to this class
  const classStudents = students.filter((s) => s.classId === classroom.id);

  // Set of assigned student IDs
  const assignedStudentIds = new Set(
    Object.values(seatingLayout.seats).filter((id): id is string => Boolean(id))
  );

  // Unassigned students
  const unassignedStudents = classStudents.filter((s) => !assignedStudentIds.has(s.id));

  // Find position of highlighted student (if any)
  let highlightedSeatInfo: { col: number; row: number; seatIdx: number } | null = null;
  if (highlightStudentId) {
    for (const [key, id] of Object.entries(seatingLayout.seats)) {
      if (id === highlightStudentId) {
        const [c, r, s] = key.split('-').map(Number);
        highlightedSeatInfo = { col: c, row: r, seatIdx: s };
        break;
      }
    }
  }

  // Handle assign a student to seat
  const handleAssignStudent = (seatKey: string, studentId: string | null) => {
    if (isReadOnly) return;
    const newSeats = { ...seatingLayout.seats };
    
    // If student was already in another seat, clear that seat first
    if (studentId) {
      for (const [k, sId] of Object.entries(newSeats)) {
        if (sId === studentId && k !== seatKey) {
          newSeats[k] = null;
        }
      }
    }

    newSeats[seatKey] = studentId;

    const updated: SeatingLayout = {
      ...seatingLayout,
      seats: newSeats
    };

    onUpdateSeatingLayout(updated);
    setTargetSeatKey(null);
    showToast();
  };

  // Handle Swap two seats
  const handleStartSwap = (seatKey: string) => {
    if (isReadOnly) return;
    if (!swapSourceSeatKey) {
      setSwapSourceSeatKey(seatKey);
    } else {
      // Swap seats
      const newSeats = { ...seatingLayout.seats };
      const sourceStudentId = newSeats[swapSourceSeatKey] || null;
      const targetStudentId = newSeats[seatKey] || null;

      newSeats[swapSourceSeatKey] = targetStudentId;
      newSeats[seatKey] = sourceStudentId;

      onUpdateSeatingLayout({
        ...seatingLayout,
        seats: newSeats
      });

      setSwapSourceSeatKey(null);
      showToast();
    }
  };

  // Add column (dãy bàn)
  const handleAddColumn = () => {
    if (isReadOnly) return;
    if (seatingLayout.columns >= 6) return;
    onUpdateSeatingLayout({
      ...seatingLayout,
      columns: seatingLayout.columns + 1
    });
    showToast();
  };

  // Remove column
  const handleRemoveColumn = () => {
    if (isReadOnly) return;
    if (seatingLayout.columns <= 2) return;
    onUpdateSeatingLayout({
      ...seatingLayout,
      columns: seatingLayout.columns - 1
    });
    showToast();
  };

  // Add row (hàng bàn)
  const handleAddRow = () => {
    if (isReadOnly) return;
    if (seatingLayout.rows >= 8) return;
    onUpdateSeatingLayout({
      ...seatingLayout,
      rows: seatingLayout.rows + 1
    });
    showToast();
  };

  // Remove row
  const handleRemoveRow = () => {
    if (isReadOnly) return;
    if (seatingLayout.rows <= 3) return;
    onUpdateSeatingLayout({
      ...seatingLayout,
      rows: seatingLayout.rows - 1
    });
    showToast();
  };

  // Auto assign all students
  const handleAutoAssign = () => {
    if (isReadOnly) return;
    if (!window.confirm('Hệ thống sẽ sắp xếp ngẫu nhiên toàn bộ học sinh trong lớp vào các bàn ghế. Bạn có muốn tiếp tục?')) {
      return;
    }

    const shuffled = [...classStudents].sort(() => Math.random() - 0.5);
    const newSeats: Record<string, string | null> = {};
    let studentIdx = 0;

    for (let r = 1; r <= seatingLayout.rows; r++) {
      for (let c = 1; c <= seatingLayout.columns; c++) {
        for (let s = 0; s < (seatingLayout.seatsPerDesk || 2); s++) {
          const key = `${c}-${r}-${s}`;
          if (studentIdx < shuffled.length) {
            newSeats[key] = shuffled[studentIdx].id;
            studentIdx++;
          } else {
            newSeats[key] = null;
          }
        }
      }
    }

    onUpdateSeatingLayout({
      ...seatingLayout,
      seats: newSeats
    });
    showToast();
  };

  // Clear all seats
  const handleClearAll = () => {
    if (isReadOnly) return;
    if (!window.confirm('Bạn có chắc chắn muốn xóa toàn bộ học sinh khỏi sơ đồ chỗ ngồi?')) return;
    onUpdateSeatingLayout({
      ...seatingLayout,
      seats: {}
    });
    showToast();
  };

  const showToast = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 flex items-center gap-2">
            <Armchair className="w-5 h-5 text-blue-600" />
            <span>Sơ Đồ Xếp Chỗ Ngồi Lớp {classroom.name}</span>
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            {isReadOnly 
              ? 'Sơ đồ vị trí bàn ghế học sinh lớp trong phòng học năm học 2026 - 2027.'
              : 'Quản lý dãy bàn, hàng ghế, phân công và đổi chỗ ngồi cho học sinh lớp.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {saveToast && (
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
              <Check className="w-3.5 h-3.5" />
              <span>Đã lưu sơ đồ</span>
            </span>
          )}

          <button
            type="button"
            onClick={() => window.print()}
            className="px-3 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-200 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs whitespace-nowrap shrink-0"
          >
            <Printer className="w-3.5 h-3.5 text-neutral-500" />
            <span>In Sơ Đồ Lớp</span>
          </button>

          {!isReadOnly && (
            <>
              <button
                type="button"
                onClick={handleAutoAssign}
                className="px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs whitespace-nowrap shrink-0"
                title="Xếp chỗ ngẫu nhiên tự động cho toàn bộ học sinh lớp"
              >
                <Shuffle className="w-4 h-4" />
                <span>Xếp Tự Động</span>
              </button>

              <button
                type="button"
                onClick={handleClearAll}
                className="px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-lg transition-colors"
                title="Xóa tất cả chỗ ngồi hiện tại"
              >
                Đặt lại sơ đồ
              </button>
            </>
          )}
        </div>
      </div>

      {/* Highlight alert for Parent View */}
      {highlightStudentId && (
        <div className="p-4 bg-amber-50 dark:bg-amber-950/50 border-2 border-amber-400 dark:border-amber-600 rounded-xl flex items-center gap-3 shadow-xs">
          <div className="w-9 h-9 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center font-bold shrink-0">
            <Star className="w-5 h-5 fill-amber-950" />
          </div>
          <div className="text-xs text-amber-950 dark:text-amber-100">
            <div className="font-bold text-sm">
              ⭐ Vị trí chỗ ngồi của con em trong lớp:
            </div>
            {highlightedSeatInfo ? (
              <div className="mt-0.5">
                Em đang ngồi tại: <strong>Dãy {highlightedSeatInfo.col}</strong> · <strong>Bàn {highlightedSeatInfo.row}</strong> · <strong>Ghế {highlightedSeatInfo.seatIdx === 0 ? 'Trái' : 'Phải'}</strong> (Xem ô sáng màu vàng hổ phách trên sơ đồ phía dưới).
              </div>
            ) : (
              <div className="mt-0.5 text-neutral-500">
                Học sinh hiện chưa được xếp chỗ trên sơ đồ. GVCN sẽ cập nhật sớm.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Classroom Dimension Controls (for Teacher) */}
      {!isReadOnly && (
        <div className="p-3 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-4">
            {/* Column control */}
            <div className="flex items-center gap-2">
              <span className="font-semibold text-neutral-700 dark:text-neutral-300">Số dãy bàn:</span>
              <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg p-0.5">
                <button
                  type="button"
                  onClick={handleRemoveColumn}
                  disabled={seatingLayout.columns <= 2}
                  className="p-1.5 text-neutral-600 hover:bg-white dark:hover:bg-neutral-700 rounded disabled:opacity-30"
                  title="Giảm dãy bàn"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-mono font-bold px-2 text-neutral-900 dark:text-neutral-100">
                  {seatingLayout.columns} dãy
                </span>
                <button
                  type="button"
                  onClick={handleAddColumn}
                  disabled={seatingLayout.columns >= 6}
                  className="p-1.5 text-neutral-600 hover:bg-white dark:hover:bg-neutral-700 rounded disabled:opacity-30"
                  title="Thêm dãy bàn mới"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Row control */}
            <div className="flex items-center gap-2">
              <span className="font-semibold text-neutral-700 dark:text-neutral-300">Số hàng bàn:</span>
              <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg p-0.5">
                <button
                  type="button"
                  onClick={handleRemoveRow}
                  disabled={seatingLayout.rows <= 3}
                  className="p-1.5 text-neutral-600 hover:bg-white dark:hover:bg-neutral-700 rounded disabled:opacity-30"
                  title="Giảm hàng bàn"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-mono font-bold px-2 text-neutral-900 dark:text-neutral-100">
                  {seatingLayout.rows} hàng
                </span>
                <button
                  type="button"
                  onClick={handleAddRow}
                  disabled={seatingLayout.rows >= 8}
                  className="p-1.5 text-neutral-600 hover:bg-white dark:hover:bg-neutral-700 rounded disabled:opacity-30"
                  title="Thêm hàng bàn mới"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-neutral-500">
            <span>Sức chứa: <strong className="font-mono text-neutral-800 dark:text-neutral-200">{seatingLayout.columns * seatingLayout.rows * 2} chỗ</strong></span>
            <span>·</span>
            <span>Đã xếp: <strong className="font-mono text-blue-600">{assignedStudentIds.size}/{classStudents.length} HS</strong></span>
            {unassignedStudents.length > 0 && (
              <span className="text-amber-600 font-medium">({unassignedStudents.length} HS chưa có chỗ)</span>
            )}
          </div>
        </div>
      )}

      {/* Main Classroom Layout Grid Canvas */}
      <div className="p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-6 overflow-x-auto">
        {/* Front of Classroom per Requirement 4:
            - Chính giữa phía trên: Bục giảng và bảng đen
            - Phía tay trái: Bàn giáo viên
            - Phía tay phải: Cửa chính
            - Phần còn lại: Các dãy bàn học sinh
        */}
        <div className="w-full max-w-4xl mx-auto space-y-3 pb-3 border-b border-neutral-200 dark:border-neutral-800">
          {/* Chính giữa phía trên: Bục giảng và bảng đen */}
          <div className="flex flex-col items-center justify-center">
            <div className="w-full max-w-lg h-10 rounded-xl bg-emerald-800 text-emerald-100 flex items-center justify-center font-bold tracking-widest text-xs uppercase shadow-inner border-2 border-emerald-950">
              BẢNG ĐEN LỚP HỌC (GÓC NHÌN TỪ TRÊN XUỐNG)
            </div>
            <div className="w-48 h-5 bg-neutral-300 dark:bg-neutral-700 rounded-b-lg text-[10px] text-neutral-600 dark:text-neutral-300 flex items-center justify-center font-bold uppercase tracking-wider shadow-xs">
              BỤC GIẢNG
            </div>
          </div>

          {/* Phía tay trái: Bàn giáo viên | Phía tay phải: Cửa chính */}
          <div className="flex items-center justify-between px-2 sm:px-6">
            {/* Phía tay trái: Bàn giáo viên */}
            <div className="px-3.5 py-2 bg-amber-100 dark:bg-amber-950/70 border-2 border-amber-400 dark:border-amber-700 text-amber-950 dark:text-amber-100 rounded-xl text-left font-bold text-xs shadow-xs flex items-center gap-2">
              <span className="text-xl">👨‍🏫</span>
              <div>
                <div>BÀN GIÁO VIÊN</div>
                <div className="text-[10px] font-normal text-amber-800 dark:text-amber-300">Phía tay trái lớp</div>
              </div>
            </div>

            {/* Giữa: khoảng trống thoáng */}
            <div className="text-[11px] text-neutral-400 font-mono hidden sm:block">
              ↕ Khoảng trống lên bục giảng
            </div>

            {/* Phía tay phải: Cửa chính */}
            <div className="px-3.5 py-2 bg-blue-50 dark:bg-blue-950/60 border-2 border-blue-400 dark:border-blue-700 text-blue-950 dark:text-blue-100 rounded-xl text-right font-bold text-xs shadow-xs flex items-center gap-2">
              <div>
                <div>CỬA CHÍNH</div>
                <div className="text-[10px] font-normal text-blue-800 dark:text-blue-300">Phía tay phải lớp</div>
              </div>
              <span className="text-xl">🚪</span>
            </div>
          </div>
        </div>

        {/* Swap Mode Indicator */}
        {swapSourceSeatKey && (
          <div className="p-2.5 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 rounded-xl flex items-center justify-between text-xs text-blue-700 dark:text-blue-300">
            <span>Đang chọn đổi chỗ. Nhấp vào ghế thứ hai muốn hoán đổi vị trí.</span>
            <button
              type="button"
              onClick={() => setSwapSourceSeatKey(null)}
              className="text-xs font-bold underline text-blue-800 dark:text-blue-200"
            >
              Hủy đổi chỗ
            </button>
          </div>
        )}

        {/* Desks Grid */}
        <div className="flex justify-center gap-6 md:gap-8 min-w-[700px] py-4">
          {Array.from({ length: seatingLayout.columns }).map((_, colIdx) => {
            const col = colIdx + 1;
            return (
              <div key={col} className="flex flex-col items-center gap-4">
                {/* Column header */}
                <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider py-1 px-3 bg-neutral-100 dark:bg-neutral-800 rounded-md">
                  Dãy {col}
                </div>

                {/* Rows for this column */}
                <div className="space-y-4">
                  {Array.from({ length: seatingLayout.rows }).map((_, rowIdx) => {
                    const row = rowIdx + 1;
                    const leftKey = `${col}-${row}-0`;
                    const rightKey = `${col}-${row}-1`;

                    const leftStudentId = seatingLayout.seats[leftKey];
                    const rightStudentId = seatingLayout.seats[rightKey];

                    const leftStudent = leftStudentId ? students.find((s) => s.id === leftStudentId) : null;
                    const rightStudent = rightStudentId ? students.find((s) => s.id === rightStudentId) : null;

                    const isLeftHighlighted = highlightStudentId && leftStudentId === highlightStudentId;
                    const isRightHighlighted = highlightStudentId && rightStudentId === highlightStudentId;

                    return (
                      <div
                        key={row}
                        className="p-2 bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-700 rounded-xl flex flex-col items-center gap-1.5 shadow-xs"
                      >
                        <span className="text-[10px] font-mono text-neutral-400 font-medium">
                          Bàn {row}
                        </span>

                        {/* Double Seat Desk */}
                        <div className="flex items-center gap-1.5">
                          {/* Seat 1 (Left) */}
                          <div
                            onClick={() => {
                              if (isReadOnly) return;
                              if (swapSourceSeatKey) {
                                handleStartSwap(leftKey);
                              } else if (!leftStudent) {
                                setTargetSeatKey(leftKey);
                              }
                            }}
                            className={`w-28 h-20 rounded-lg p-1.5 flex flex-col justify-between text-xs transition-all relative ${
                              isLeftHighlighted
                                ? 'bg-amber-100 dark:bg-amber-950/80 border-2 border-amber-500 shadow-md ring-2 ring-amber-400'
                                : swapSourceSeatKey === leftKey
                                ? 'bg-blue-100 border-2 border-blue-500'
                                : leftStudent
                                ? 'bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700'
                                : 'bg-neutral-100/70 dark:bg-neutral-800/20 border border-dashed border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 hover:border-blue-400 cursor-pointer'
                            }`}
                          >
                            {leftStudent ? (
                              <>
                                <div className="flex items-center justify-between">
                                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded font-mono ${
                                    leftStudent.gender === 'Nam' ? 'bg-blue-50 text-blue-700' : 'bg-rose-50 text-rose-700'
                                  }`}>
                                    {leftStudent.gender}
                                  </span>
                                  {isLeftHighlighted && (
                                    <span className="text-[10px] text-amber-600 font-bold">⭐ Con bạn</span>
                                  )}
                                  {!isReadOnly && (
                                    <div className="flex items-center gap-0.5">
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleStartSwap(leftKey);
                                        }}
                                        className="text-neutral-400 hover:text-blue-600 p-0.5"
                                        title="Đổi chỗ với ghế khác"
                                      >
                                        <ArrowRightLeft className="w-3 h-3" />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleAssignStudent(leftKey, null);
                                        }}
                                        className="text-neutral-400 hover:text-rose-600 p-0.5"
                                        title="Rút học sinh khỏi ghế"
                                      >
                                        <X className="w-3 h-3" />
                                      </button>
                                    </div>
                                  )}
                                </div>
                                <div className="font-semibold text-neutral-900 dark:text-neutral-100 truncate text-[11px] mt-0.5">
                                  {leftStudent.fullName}
                                </div>
                                <div className="text-[10px] text-neutral-400 font-mono">
                                  {leftStudent.code}
                                </div>
                              </>
                            ) : (
                              <div className="h-full flex flex-col items-center justify-center text-neutral-400 gap-0.5">
                                <Plus className="w-4 h-4" />
                                <span className="text-[10px]">Ghế 1</span>
                              </div>
                            )}
                          </div>

                          {/* Seat 2 (Right) */}
                          <div
                            onClick={() => {
                              if (isReadOnly) return;
                              if (swapSourceSeatKey) {
                                handleStartSwap(rightKey);
                              } else if (!rightStudent) {
                                setTargetSeatKey(rightKey);
                              }
                            }}
                            className={`w-28 h-20 rounded-lg p-1.5 flex flex-col justify-between text-xs transition-all relative ${
                              isRightHighlighted
                                ? 'bg-amber-100 dark:bg-amber-950/80 border-2 border-amber-500 shadow-md ring-2 ring-amber-400'
                                : swapSourceSeatKey === rightKey
                                ? 'bg-blue-100 border-2 border-blue-500'
                                : rightStudent
                                ? 'bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700'
                                : 'bg-neutral-100/70 dark:bg-neutral-800/20 border border-dashed border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 hover:border-blue-400 cursor-pointer'
                            }`}
                          >
                            {rightStudent ? (
                              <>
                                <div className="flex items-center justify-between">
                                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded font-mono ${
                                    rightStudent.gender === 'Nam' ? 'bg-blue-50 text-blue-700' : 'bg-rose-50 text-rose-700'
                                  }`}>
                                    {rightStudent.gender}
                                  </span>
                                  {isRightHighlighted && (
                                    <span className="text-[10px] text-amber-600 font-bold">⭐ Con bạn</span>
                                  )}
                                  {!isReadOnly && (
                                    <div className="flex items-center gap-0.5">
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleStartSwap(rightKey);
                                        }}
                                        className="text-neutral-400 hover:text-blue-600 p-0.5"
                                        title="Đổi chỗ với ghế khác"
                                      >
                                        <ArrowRightLeft className="w-3 h-3" />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleAssignStudent(rightKey, null);
                                        }}
                                        className="text-neutral-400 hover:text-rose-600 p-0.5"
                                        title="Rút học sinh khỏi ghế"
                                      >
                                        <X className="w-3 h-3" />
                                      </button>
                                    </div>
                                  )}
                                </div>
                                <div className="font-semibold text-neutral-900 dark:text-neutral-100 truncate text-[11px] mt-0.5">
                                  {rightStudent.fullName}
                                </div>
                                <div className="text-[10px] text-neutral-400 font-mono">
                                  {rightStudent.code}
                                </div>
                              </>
                            ) : (
                              <div className="h-full flex flex-col items-center justify-center text-neutral-400 gap-0.5">
                                <Plus className="w-4 h-4" />
                                <span className="text-[10px]">Ghế 2</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Unassigned Students Quick Drawer (for Teacher only) */}
      {!isReadOnly && unassignedStudents.length > 0 && (
        <div className="p-4 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800">
          <div className="text-xs font-bold text-neutral-900 dark:text-neutral-100 flex items-center justify-between mb-3">
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-amber-600" />
              <span>Học sinh chưa được xếp chỗ ({unassignedStudents.length} em)</span>
            </span>
            <span className="text-[11px] font-normal text-neutral-500">
              Nhấp vào ghế trống bất kỳ ở sơ đồ trên để chọn học sinh xếp vào.
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {unassignedStudents.map((st) => (
              <div
                key={st.id}
                className="px-3 py-1.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-xs font-medium text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5"
              >
                <span>{st.fullName}</span>
                <span className="font-mono text-neutral-400 text-[10px]">({st.code})</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Select Student for a Seat */}
      {targetSeatKey && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl w-full max-w-md shadow-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-50">
                  Xếp Học Sinh Vào Chỗ Ngồi
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Dãy {targetSeatKey.split('-')[0]}, Bàn {targetSeatKey.split('-')[1]}, Ghế {targetSeatKey.split('-')[2] === '0' ? 'Trái' : 'Phải'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setTargetSeatKey(null)}
                className="p-1 text-neutral-400 hover:text-neutral-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 max-h-96 overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-800 text-xs">
              {/* Option to clear seat */}
              <button
                type="button"
                onClick={() => handleAssignStudent(targetSeatKey, null)}
                className="w-full py-2.5 text-left text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 px-3 rounded-lg font-medium transition-colors"
              >
                (Để trống chỗ này)
              </button>

              {classStudents.map((st) => {
                const isAssigned = assignedStudentIds.has(st.id);
                return (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => handleAssignStudent(targetSeatKey, st.id)}
                    className="w-full py-2.5 px-3 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors text-left rounded-lg"
                  >
                    <div>
                      <div className="font-semibold text-neutral-900 dark:text-neutral-100">
                        {st.fullName}
                      </div>
                      <div className="text-[11px] text-neutral-400 font-mono">
                        {st.code} · {st.gender}
                      </div>
                    </div>
                    {isAssigned && (
                      <span className="text-[10px] text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded">
                        Đang ở chỗ khác
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
