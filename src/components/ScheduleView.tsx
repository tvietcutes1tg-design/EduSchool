import React, { useState } from 'react';
import { ScheduleItem, ClassRoom, Teacher, SUBJECT_LIST } from '../types';
import { 
  CalendarDays, 
  Printer, 
  Plus, 
  School, 
  GraduationCap, 
  DoorOpen, 
  X, 
  Check,
  Trash2,
  Calendar
} from 'lucide-react';

interface ScheduleViewProps {
  schedule: ScheduleItem[];
  classes: ClassRoom[];
  teachers: Teacher[];
  isReadOnly?: boolean;
  onUpdateSchedule: (updatedSchedule: ScheduleItem[]) => void;
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({
  schedule,
  classes,
  teachers,
  isReadOnly = false,
  onUpdateSchedule
}) => {
  const [viewMode, setViewMode] = useState<'class' | 'teacher'>('class');
  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || '');
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>(teachers[0]?.id || '');
  const [activeMobileDay, setActiveMobileDay] = useState<2 | 3 | 4 | 5 | 6 | 7>(2);

  // Add/edit slot modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalDay, setModalDay] = useState<2 | 3 | 4 | 5 | 6 | 7>(2);
  const [modalPeriod, setModalPeriod] = useState<number>(1);
  const [modalSubject, setModalSubject] = useState(SUBJECT_LIST[0]);
  const [modalTeacherId, setModalTeacherId] = useState(teachers[0]?.id || '');
  const [modalClassId, setModalClassId] = useState(classes[0]?.id || '');
  const [modalRoom, setModalRoom] = useState('P.101');
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const days: Array<{ day: 2 | 3 | 4 | 5 | 6 | 7; label: string; short: string }> = [
    { day: 2, label: 'Thứ Hai', short: 'T2' },
    { day: 3, label: 'Thứ Ba', short: 'T3' },
    { day: 4, label: 'Thứ Tư', short: 'T4' },
    { day: 5, label: 'Thứ Năm', short: 'T5' },
    { day: 6, label: 'Thứ Sáu', short: 'T6' },
    { day: 7, label: 'Thứ Bảy', short: 'T7' }
  ];

  const morningPeriods = [1, 2, 3, 4, 5];
  const afternoonPeriods = [6, 7, 8, 9];
  const allPeriods = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  // Filter schedule according to viewMode
  const filteredSchedule = schedule.filter((item) => {
    if (viewMode === 'class') {
      return item.classId === selectedClassId;
    } else {
      return item.teacherId === selectedTeacherId;
    }
  });

  // Build lookup matrix [day][period]
  const matrix: Record<number, Record<number, ScheduleItem | undefined>> = {
    2: {}, 3: {}, 4: {}, 5: {}, 6: {}, 7: {}
  };
  filteredSchedule.forEach((item) => {
    if (matrix[item.dayOfWeek]) {
      matrix[item.dayOfWeek][item.period] = item;
    }
  });

  const handleOpenSlot = (day: 2 | 3 | 4 | 5 | 6 | 7, period: number, existing?: ScheduleItem) => {
    if (isReadOnly) return;
    setModalDay(day);
    setModalPeriod(period);
    if (existing) {
      setEditingItemId(existing.id);
      setModalSubject(existing.subject);
      setModalTeacherId(existing.teacherId);
      setModalClassId(existing.classId);
      setModalRoom(existing.room);
    } else {
      setEditingItemId(null);
      setModalSubject(SUBJECT_LIST[0]);
      setModalTeacherId(viewMode === 'teacher' ? selectedTeacherId : (teachers[0]?.id || ''));
      setModalClassId(viewMode === 'class' ? selectedClassId : (classes[0]?.id || ''));
      const activeCls = classes.find(c => c.id === (viewMode === 'class' ? selectedClassId : classes[0]?.id));
      setModalRoom(activeCls?.roomNumber || 'P.101');
    }
    setIsModalOpen(true);
  };

  const handleSaveSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (isReadOnly) return;

    if (editingItemId) {
      const updated = schedule.map((s) =>
        s.id === editingItemId
          ? {
              ...s,
              dayOfWeek: modalDay,
              period: modalPeriod,
              subject: modalSubject,
              teacherId: modalTeacherId,
              classId: modalClassId,
              room: modalRoom
            }
          : s
      );
      onUpdateSchedule(updated);
    } else {
      const newItem: ScheduleItem = {
        id: `sc-${Date.now()}`,
        dayOfWeek: modalDay,
        period: modalPeriod,
        subject: modalSubject,
        teacherId: modalTeacherId,
        classId: modalClassId,
        room: modalRoom
      };
      onUpdateSchedule([...schedule, newItem]);
    }

    setIsModalOpen(false);
  };

  const handleDeleteSlot = (id: string) => {
    if (isReadOnly) return;
    const updated = schedule.filter((s) => s.id !== id);
    onUpdateSchedule(updated);
    setIsModalOpen(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const activeClass = classes.find((c) => c.id === selectedClassId);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <CalendarDays className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <span>Thời Khóa Biểu</span>
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
              Lớp {activeClass?.name || '10A1'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Thời khóa biểu các ngày trong tuần và phân công tiết học theo quy định.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={handlePrint}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer min-h-[40px]"
          >
            <Printer className="w-4 h-4" />
            <span>In TKB</span>
          </button>
        </div>
      </div>

      {/* Control Strip */}
      <div className="bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-neutral-600 dark:text-neutral-400">
            Xem theo Lớp:
          </label>
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-neutral-100 font-bold focus:ring-2 focus:ring-blue-500"
          >
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                Lớp {c.name} ({c.roomNumber})
              </option>
            ))}
          </select>
        </div>

        <div className="text-xs text-neutral-500">
          {isReadOnly
            ? 'Chế độ xem thời khóa biểu chính khóa học kỳ'
            : 'Bấm vào bất kỳ ô tiết học nào để phân công hoặc chỉnh sửa môn học.'}
        </div>
      </div>

      {/* ============================================================== */}
      {/* MOBILE RESPONSIVE DAY SELECTOR TABS (Requirement 16.7)         */}
      {/* ============================================================== */}
      <div className="md:hidden space-y-3">
        <div className="grid grid-cols-6 gap-1 bg-neutral-100 dark:bg-neutral-800/80 p-1 rounded-xl">
          {days.map((d) => (
            <button
              key={d.day}
              type="button"
              onClick={() => setActiveMobileDay(d.day)}
              className={`py-2 text-xs font-bold rounded-lg transition-all text-center cursor-pointer ${
                activeMobileDay === d.day
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
              }`}
            >
              {d.short}
            </button>
          ))}
        </div>

        {/* Vertical Cards for Mobile Day */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4 shadow-xs space-y-2.5">
          <div className="font-bold text-sm text-neutral-900 dark:text-neutral-100 flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
            <span>{days.find(d => d.day === activeMobileDay)?.label}</span>
            <span className="text-xs text-neutral-400 font-normal">Buổi sáng & Buổi chiều</span>
          </div>

          <div className="space-y-2">
            {allPeriods.map((period) => {
              const item = matrix[activeMobileDay]?.[period];
              const teacher = item ? teachers.find((t) => t.id === item.teacherId) : null;
              const isMorning = period <= 5;

              return (
                <div
                  key={period}
                  onClick={() => !isReadOnly && handleOpenSlot(activeMobileDay, period, item)}
                  className={`p-3 rounded-xl border flex items-center justify-between transition-colors ${
                    item
                      ? isMorning
                        ? 'bg-blue-50/70 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900'
                        : 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900'
                      : 'bg-neutral-50/40 dark:bg-neutral-800/30 border-neutral-200/60 dark:border-neutral-800/60'
                  } ${!isReadOnly ? 'cursor-pointer' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-bold text-xs flex items-center justify-center font-mono shadow-xs border border-neutral-200 dark:border-neutral-700">
                      T{period}
                    </span>
                    <div>
                      {item ? (
                        <>
                          <div className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
                            {item.subject}
                          </div>
                          <div className="text-xs text-neutral-500">
                            {teacher?.fullName || 'Giáo viên bộ môn'} · {item.room}
                          </div>
                        </>
                      ) : (
                        <div className="text-xs text-neutral-400 italic">
                          (Chưa xếp môn học)
                        </div>
                      )}
                    </div>
                  </div>

                  {!isReadOnly && !item && (
                    <span className="text-xs text-blue-600 font-bold">+ Thêm</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* DESKTOP TIMETABLE GRID (No start/end hours displayed)          */}
      {/* ============================================================== */}
      <div className="hidden md:block bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs text-center">
            <thead>
              <tr className="bg-neutral-50 dark:bg-neutral-800/80 border-b border-neutral-200 dark:border-neutral-700 text-xs font-bold text-neutral-600 dark:text-neutral-300">
                <th className="py-3.5 px-3 w-20 text-left">Tiết</th>
                {days.map((d) => (
                  <th key={d.day} className="py-3.5 px-3 min-w-[130px]">
                    {d.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {/* Morning header - No time displayed */}
              <tr className="bg-blue-50/40 dark:bg-blue-950/20">
                <td
                  colSpan={7}
                  className="py-2 px-3 text-left font-bold text-[11px] text-blue-800 dark:text-blue-300 uppercase tracking-wider"
                >
                  Buổi Sáng (Tiết 1 – Tiết 5)
                </td>
              </tr>

              {morningPeriods.map((period) => (
                <tr key={period} className="hover:bg-neutral-50/40 dark:hover:bg-neutral-800/20">
                  <td className="py-2.5 px-3 text-left font-mono font-bold text-neutral-500">
                    Tiết {period}
                  </td>
                  {days.map((d) => {
                    const item = matrix[d.day]?.[period];
                    const teacher = item ? teachers.find((t) => t.id === item.teacherId) : null;

                    return (
                      <td key={d.day} className="p-1.5">
                        {item ? (
                          <div
                            onClick={() => !isReadOnly && handleOpenSlot(d.day, period, item)}
                            className={`p-2 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-800 text-left transition-all ${
                              isReadOnly
                                ? ''
                                : 'cursor-pointer hover:border-blue-400 group'
                            }`}
                          >
                            <div className="font-bold text-neutral-900 dark:text-neutral-100 text-xs">
                              {item.subject}
                            </div>
                            <div className="text-[11px] text-blue-700 dark:text-blue-300 truncate mt-0.5">
                              {teacher?.fullName || 'Chưa gán GV'}
                            </div>
                            <div className="text-[10px] text-neutral-400 font-mono mt-0.5">
                              {item.room}
                            </div>
                          </div>
                        ) : isReadOnly ? (
                          <div className="w-full h-14 rounded-xl bg-neutral-50/30 dark:bg-neutral-800/20 border border-dashed border-neutral-200/60 dark:border-neutral-800/60" />
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleOpenSlot(d.day, period)}
                            className="w-full h-14 rounded-xl border border-dashed border-neutral-200 dark:border-neutral-800 hover:border-blue-400 hover:bg-blue-50/20 dark:hover:bg-blue-950/20 text-neutral-300 hover:text-blue-600 flex items-center justify-center transition-colors group cursor-pointer"
                          >
                            <Plus className="w-4 h-4 opacity-0 group-hover:opacity-100" />
                          </button>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}

              {/* Afternoon header - No time displayed */}
              <tr className="bg-emerald-50/40 dark:bg-emerald-950/20">
                <td
                  colSpan={7}
                  className="py-2 px-3 text-left font-bold text-[11px] text-emerald-800 dark:text-emerald-300 uppercase tracking-wider"
                >
                  Buổi Chiều (Tiết 6 – Tiết 9)
                </td>
              </tr>

              {afternoonPeriods.map((period) => (
                <tr key={period} className="hover:bg-neutral-50/40 dark:hover:bg-neutral-800/20">
                  <td className="py-2.5 px-3 text-left font-mono font-bold text-neutral-500">
                    Tiết {period}
                  </td>
                  {days.map((d) => {
                    const item = matrix[d.day]?.[period];
                    const teacher = item ? teachers.find((t) => t.id === item.teacherId) : null;

                    return (
                      <td key={d.day} className="p-1.5">
                        {item ? (
                          <div
                            onClick={() => !isReadOnly && handleOpenSlot(d.day, period, item)}
                            className={`p-2 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800 text-left transition-all ${
                              isReadOnly
                                ? ''
                                : 'cursor-pointer hover:border-emerald-400 group'
                            }`}
                          >
                            <div className="font-bold text-neutral-900 dark:text-neutral-100 text-xs">
                              {item.subject}
                            </div>
                            <div className="text-[11px] text-emerald-700 dark:text-emerald-300 truncate mt-0.5">
                              {teacher?.fullName || 'Chưa gán GV'}
                            </div>
                            <div className="text-[10px] text-neutral-400 font-mono mt-0.5">
                              {item.room}
                            </div>
                          </div>
                        ) : isReadOnly ? (
                          <div className="w-full h-14 rounded-xl bg-neutral-50/30 dark:bg-neutral-800/20 border border-dashed border-neutral-200/60 dark:border-neutral-800/60" />
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleOpenSlot(d.day, period)}
                            className="w-full h-14 rounded-xl border border-dashed border-neutral-200 dark:border-neutral-800 hover:border-emerald-400 hover:bg-emerald-50/20 dark:hover:bg-emerald-950/20 text-neutral-300 hover:text-emerald-600 flex items-center justify-center transition-colors group cursor-pointer"
                          >
                            <Plus className="w-4 h-4 opacity-0 group-hover:opacity-100" />
                          </button>
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

      {/* Edit Slot Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div 
            className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between">
              <div className="font-bold text-base">
                {editingItemId ? 'Chỉnh Sửa Tiết Học' : 'Phân Công Tiết Học'}
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSlot} className="p-5 space-y-4 text-xs">
              <div className="p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl text-neutral-700 dark:text-neutral-300 font-bold">
                Thứ {modalDay === 2 ? 'Hai' : modalDay === 3 ? 'Ba' : modalDay === 4 ? 'Tư' : modalDay === 5 ? 'Năm' : modalDay === 6 ? 'Sáu' : 'Bảy'} · Tiết {modalPeriod}
              </div>

              <div>
                <label className="block font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                  Môn học
                </label>
                <select
                  value={modalSubject}
                  onChange={(e) => setModalSubject(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-neutral-100 font-semibold focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Chào cờ & SHDC">Chào cờ & SHDC</option>
                  <option value="Sinh hoạt lớp">Sinh hoạt lớp</option>
                  {SUBJECT_LIST.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                  Lớp học
                </label>
                <select
                  value={modalClassId}
                  onChange={(e) => {
                    setModalClassId(e.target.value);
                    const c = classes.find(cl => cl.id === e.target.value);
                    if (c) setModalRoom(c.roomNumber);
                  }}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-neutral-100 font-semibold focus:ring-2 focus:ring-blue-500"
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      Lớp {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                  Giáo viên giảng dạy
                </label>
                <select
                  value={modalTeacherId}
                  onChange={(e) => setModalTeacherId(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-neutral-100 font-semibold focus:ring-2 focus:ring-blue-500"
                >
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.fullName} ({t.subject})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                  Phòng học
                </label>
                <input
                  type="text"
                  value={modalRoom}
                  onChange={(e) => setModalRoom(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-neutral-100 font-semibold focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="pt-3 flex items-center justify-between">
                {editingItemId ? (
                  <button
                    type="button"
                    onClick={() => handleDeleteSlot(editingItemId)}
                    className="px-3 py-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Xóa tiết</span>
                  </button>
                ) : <div />}

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl font-semibold cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold cursor-pointer"
                  >
                    Lưu phân công
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
