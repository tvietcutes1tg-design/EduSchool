import React, { useState, useMemo } from 'react';
import { Teacher, ClassRoom, SUBJECT_LIST } from '../types';
import { exportTeachersToCsv } from '../services/storage';
import { 
  Search, 
  Plus, 
  Download, 
  Printer, 
  Eye, 
  Pencil, 
  Trash2, 
  Phone, 
  Mail, 
  Copy, 
  Check, 
  GraduationCap
} from 'lucide-react';

interface TeacherListViewProps {
  teachers: Teacher[];
  classes: ClassRoom[];
  isReadOnly?: boolean;
  onAddTeacher: () => void;
  onViewTeacher: (teacher: Teacher) => void;
  onEditTeacher: (teacher: Teacher) => void;
  onDeleteTeacher: (id: string) => void;
}

export const TeacherListView: React.FC<TeacherListViewProps> = ({
  teachers,
  classes,
  isReadOnly = false,
  onAddTeacher,
  onViewTeacher,
  onEditTeacher,
  onDeleteTeacher
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedQual, setSelectedQual] = useState<string>('all');
  const [selectedHomeroom, setSelectedHomeroom] = useState<string>('all');
  const [copiedInfo, setCopiedInfo] = useState<string | null>(null);

  const filteredTeachers = useMemo(() => {
    return teachers.filter((t) => {
      const term = searchTerm.toLowerCase().trim();
      const matchSearch =
        !term ||
        t.fullName.toLowerCase().includes(term) ||
        t.code.toLowerCase().includes(term) ||
        t.phone.includes(term) ||
        t.email.toLowerCase().includes(term) ||
        t.subject.toLowerCase().includes(term);

      const matchSubject = selectedSubject === 'all' || t.subject === selectedSubject;
      const matchQual = selectedQual === 'all' || t.qualification === selectedQual;

      const hasHomeroom = !!t.homeroomClassId;
      const matchHomeroom =
        selectedHomeroom === 'all' ||
        (selectedHomeroom === 'yes' && hasHomeroom) ||
        (selectedHomeroom === 'no' && !hasHomeroom);

      return matchSearch && matchSubject && matchQual && matchHomeroom;
    });
  }, [teachers, searchTerm, selectedSubject, selectedQual, selectedHomeroom]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedInfo(text);
    setTimeout(() => setCopiedInfo(null), 2000);
  };

  const getStatusText = (status: Teacher['status']) => {
    switch (status) {
      case 'active':
        return { label: 'Đang giảng dạy', color: 'text-emerald-700 dark:text-emerald-400' };
      case 'on_leave':
        return { label: 'Nghỉ phép', color: 'text-amber-700 dark:text-amber-400' };
      case 'retired':
        return { label: 'Đã nghỉ hưu', color: 'text-neutral-500 dark:text-neutral-400' };
    }
  };

  return (
    <div className="space-y-4">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-blue-600" />
            <span>Hồ Sơ & Danh Sách Giáo Viên</span>
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Quản lý đội ngũ cán bộ, bộ môn giảng dạy, phân công chủ nhiệm và lịch công tác ({filteredTeachers.length}/{teachers.length} giáo viên)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => exportTeachersToCsv(filteredTeachers, classes)}
            className="px-3 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-200 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs whitespace-nowrap shrink-0"
          >
            <Download className="w-3.5 h-3.5 text-neutral-500" />
            <span>Xuất file CSV</span>
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="px-3 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-200 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs whitespace-nowrap shrink-0"
          >
            <Printer className="w-3.5 h-3.5 text-neutral-500" />
            <span className="hidden sm:inline">In danh sách</span>
          </button>
          {!isReadOnly && (
            <button
              type="button"
              onClick={onAddTeacher}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs whitespace-nowrap shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Giáo Viên Mới</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo tên giáo viên, mã GV, bộ môn, SĐT, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Subject Filter */}
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-2.5 py-2 text-xs bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-700 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">Tất cả bộ môn</option>
            {SUBJECT_LIST.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>

          {/* Qualification */}
          <select
            value={selectedQual}
            onChange={(e) => setSelectedQual(e.target.value)}
            className="px-2.5 py-2 text-xs bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-700 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">Tất cả trình độ</option>
            <option value="Tiến sĩ">Tiến sĩ</option>
            <option value="Thạc sĩ">Thạc sĩ</option>
            <option value="Cử nhân">Cử nhân</option>
          </select>

          {/* Homeroom filter */}
          <select
            value={selectedHomeroom}
            onChange={(e) => setSelectedHomeroom(e.target.value)}
            className="px-2.5 py-2 text-xs bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-700 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">Chủ nhiệm (Tất cả)</option>
            <option value="yes">Có lớp</option>
            <option value="no">Chưa chủ nhiệm</option>
          </select>

          {(searchTerm || selectedSubject !== 'all' || selectedQual !== 'all' || selectedHomeroom !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setSelectedSubject('all');
                setSelectedQual('all');
                setSelectedHomeroom('all');
              }}
              className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 px-2 py-1"
            >
              Đặt lại
            </button>
          )}
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40 text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                <th className="py-3 px-4">Mã & Giáo Viên</th>
                <th className="py-3 px-3">Bộ môn chính</th>
                <th className="py-3 px-3">Trình độ</th>
                <th className="py-3 px-3">Lớp</th>
                <th className="py-3 px-3">Liên lạc (SĐT & Email)</th>
                <th className="py-3 px-3">Thâm niên</th>
                <th className="py-3 px-3">Trạng thái</th>
                <th className="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 text-xs">
              {filteredTeachers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-neutral-400">
                    Không tìm thấy giáo viên nào phù hợp với điều kiện tìm kiếm.
                  </td>
                </tr>
              ) : (
                filteredTeachers.map((teacher) => {
                  const homeroomClass = classes.find((c) => c.id === teacher.homeroomClassId);
                  const statusInfo = getStatusText(teacher.status);
                  const currentYear = 2026;
                  const expYears = currentYear - teacher.startYear;

                  return (
                    <tr
                      key={teacher.id}
                      className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40 transition-colors group"
                    >
                      {/* Name & Code */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-semibold text-xs flex items-center justify-center shrink-0">
                            {teacher.fullName.slice(-1)}
                          </div>
                          <div>
                            <button
                              type="button"
                              onClick={() => onViewTeacher(teacher)}
                              className="font-semibold text-neutral-900 dark:text-neutral-100 hover:text-blue-600 dark:hover:text-blue-400 text-left block"
                            >
                              {teacher.fullName}
                            </button>
                            <span className="font-mono text-[11px] text-neutral-400">
                              {teacher.code} · {teacher.gender}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Subject */}
                      <td className="py-3 px-3 font-medium text-neutral-900 dark:text-neutral-100">
                        {teacher.subject}
                      </td>

                      {/* Qualification */}
                      <td className="py-3 px-3 text-neutral-700 dark:text-neutral-300">
                        {teacher.qualification}
                      </td>

                      {/* Homeroom */}
                      <td className="py-3 px-3">
                        {homeroomClass ? (
                          <div>
                            <span className="font-semibold text-blue-600 dark:text-blue-400">
                              Lớp {homeroomClass.name}
                            </span>
                            <div className="text-[11px] text-neutral-400">
                              {homeroomClass.roomNumber}
                            </div>
                          </div>
                        ) : (
                          <span className="text-neutral-400">Không chủ nhiệm</span>
                        )}
                      </td>

                      {/* Contact */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5 font-mono text-neutral-700 dark:text-neutral-300">
                          <Phone className="w-3 h-3 text-neutral-400" />
                          <span>{teacher.phone}</span>
                          <button
                            type="button"
                            onClick={() => handleCopy(teacher.phone)}
                            className="text-neutral-400 hover:text-blue-600 p-0.5"
                          >
                            {copiedInfo === teacher.phone ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 truncate max-w-[180px]">
                          <Mail className="w-3 h-3 text-neutral-400 shrink-0" />
                          <span className="truncate">{teacher.email}</span>
                        </div>
                      </td>

                      {/* Experience */}
                      <td className="py-3 px-3 text-neutral-600 dark:text-neutral-400">
                        <span className="font-mono font-medium">{expYears}</span> năm (từ {teacher.startYear})
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3">
                        <span className={`font-medium ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => onViewTeacher(teacher)}
                            title="Xem chi tiết lịch dạy & hồ sơ"
                            className="p-1.5 text-neutral-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {!isReadOnly && (
                            <>
                              <button
                                type="button"
                                onClick={() => onEditTeacher(teacher)}
                                title="Chỉnh sửa thông tin"
                                className="p-1.5 text-neutral-500 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (window.confirm(`Bạn có chắc chắn muốn xóa giáo viên "${teacher.fullName}" khỏi hệ thống?`)) {
                                    onDeleteTeacher(teacher.id);
                                  }
                                }}
                                title="Xóa giáo viên"
                                className="p-1.5 text-neutral-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
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
  );
};
