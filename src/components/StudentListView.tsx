import React, { useState, useMemo } from 'react';
import { Student, ClassRoom, AcademicRank, StudentStatus } from '../types';
import { calculateSemesterGpa, getAcademicRank, exportStudentsToCsv } from '../services/storage';
import { 
  Search, 
  Plus, 
  Download, 
  Printer, 
  Eye, 
  Pencil, 
  Trash2, 
  Phone, 
  Check, 
  Copy,
  Users
} from 'lucide-react';

interface StudentListViewProps {
  students: Student[];
  classes: ClassRoom[];
  selectedSemester: 'HK1' | 'HK2';
  isReadOnly?: boolean;
  onAddStudent: () => void;
  onViewStudent: (student: Student) => void;
  onEditStudent: (student: Student) => void;
  onDeleteStudent: (id: string) => void;
  onPrintStudent: (student: Student) => void;
}

export const StudentListView: React.FC<StudentListViewProps> = ({
  students,
  classes,
  selectedSemester,
  isReadOnly = false,
  onAddStudent,
  onViewStudent,
  onEditStudent,
  onDeleteStudent
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClassId, setSelectedClassId] = useState<string>('all');
  const [selectedRank, setSelectedRank] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);

  // Filter students
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      // Search term
      const term = searchTerm.toLowerCase().trim();
      const matchSearch =
        !term ||
        student.fullName.toLowerCase().includes(term) ||
        student.code.toLowerCase().includes(term) ||
        student.parentPhone.includes(term) ||
        student.parentName.toLowerCase().includes(term);

      // Class
      const matchClass = selectedClassId === 'all' || student.classId === selectedClassId;

      // Status
      const matchStatus = selectedStatus === 'all' || student.status === selectedStatus;

      // Academic rank
      const gpa = calculateSemesterGpa(student, selectedSemester);
      const rank = getAcademicRank(gpa, student, selectedSemester);
      const matchRank = selectedRank === 'all' || rank === selectedRank;

      return matchSearch && matchClass && matchStatus && matchRank;
    });
  }, [students, searchTerm, selectedClassId, selectedRank, selectedStatus, selectedSemester]);

  const handleCopyPhone = (phone: string) => {
    navigator.clipboard.writeText(phone);
    setCopiedPhone(phone);
    setTimeout(() => setCopiedPhone(null), 2000);
  };

  const getStatusText = (status: StudentStatus) => {
    switch (status) {
      case 'active':
        return { label: 'Đang học', color: 'text-emerald-700 dark:text-emerald-400' };
      case 'graduated':
        return { label: 'Đã tốt nghiệp', color: 'text-blue-700 dark:text-blue-400' };
      case 'suspended':
        return { label: 'Đình chỉ', color: 'text-rose-700 dark:text-rose-400' };
      case 'transferred':
        return { label: 'Chuyển trường', color: 'text-neutral-500 dark:text-neutral-400' };
    }
  };

  return (
    <div className="space-y-4">
      {/* Page Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span>Hồ Sơ & Danh Sách Học Sinh</span>
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Quản lý thông tin hồ sơ, phụ huynh, lớp học và kết quả học tập ({filteredStudents.length}/{students.length} học sinh)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => exportStudentsToCsv(filteredStudents, classes, selectedSemester)}
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
              onClick={onAddStudent}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs whitespace-nowrap shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Học Sinh Mới</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo tên học sinh, mã HS, tên/SĐT phụ huynh..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Class Filter */}
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="px-2.5 py-2 text-xs bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-700 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">Tất cả các lớp</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                Lớp {c.name}
              </option>
            ))}
          </select>

          {/* Academic Rank Filter */}
          <select
            value={selectedRank}
            onChange={(e) => setSelectedRank(e.target.value)}
            className="px-2.5 py-2 text-xs bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-700 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">Tất cả học lực</option>
            <option value="Xuất sắc">Xuất sắc (ĐTB ≥ 9.0)</option>
            <option value="Giỏi">Giỏi (ĐTB ≥ 8.0)</option>
            <option value="Khá">Khá (ĐTB ≥ 6.5)</option>
            <option value="Trung bình">Trung bình (ĐTB ≥ 5.0)</option>
            <option value="Yếu">Yếu (ĐTB &lt; 5.0)</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-2.5 py-2 text-xs bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-700 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang học</option>
            <option value="transferred">Chuyển trường</option>
            <option value="suspended">Đình chỉ</option>
            <option value="graduated">Đã tốt nghiệp</option>
          </select>

          {(searchTerm || selectedClassId !== 'all' || selectedRank !== 'all' || selectedStatus !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setSelectedClassId('all');
                setSelectedRank('all');
                setSelectedStatus('all');
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
                <th className="py-3 px-4">Mã & Học Sinh</th>
                <th className="py-3 px-3">Lớp</th>
                <th className="py-3 px-3">Giới tính / Ngày sinh</th>
                <th className="py-3 px-3">Phụ huynh & SĐT</th>
                <th className="py-3 px-3 text-right">ĐTB ({selectedSemester})</th>
                <th className="py-3 px-3">Xếp loại</th>
                <th className="py-3 px-3">Trạng thái</th>
                <th className="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 text-xs">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-neutral-400">
                    Không tìm thấy học sinh nào phù hợp với bộ lọc tìm kiếm.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => {
                  const cls = classes.find((c) => c.id === student.classId);
                  const gpa = calculateSemesterGpa(student, selectedSemester);
                  const rank: AcademicRank = getAcademicRank(gpa, student, selectedSemester);
                  const statusInfo = getStatusText(student.status);

                  return (
                    <tr
                      key={student.id}
                      className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40 transition-colors group"
                    >
                      {/* Name & Code */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-semibold text-xs flex items-center justify-center shrink-0">
                            {student.fullName.slice(-1)}
                          </div>
                          <div>
                            <button
                              type="button"
                              onClick={() => onViewStudent(student)}
                              className="font-semibold text-neutral-900 dark:text-neutral-100 hover:text-blue-600 dark:hover:text-blue-400 text-left block"
                            >
                              {student.fullName}
                            </button>
                            <span className="font-mono text-[11px] text-neutral-400">
                              {student.code}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Class */}
                      <td className="py-3 px-3">
                        <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                          {cls ? cls.name : '—'}
                        </span>
                        <div className="text-[11px] text-neutral-400">
                          Khối {cls?.grade || '—'}
                        </div>
                      </td>

                      {/* Gender & DOB */}
                      <td className="py-3 px-3 text-neutral-600 dark:text-neutral-300">
                        <div>{student.gender}</div>
                        <div className="text-[11px] text-neutral-400 font-mono">
                          {student.dateOfBirth}
                        </div>
                      </td>

                      {/* Parent & Phone */}
                      <td className="py-3 px-3">
                        <div className="text-neutral-900 dark:text-neutral-200 font-medium">
                          {student.parentName}
                        </div>
                        <div className="flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400 text-[11px] font-mono mt-0.5">
                          <Phone className="w-3 h-3 text-neutral-400" />
                          <span>{student.parentPhone}</span>
                          <button
                            type="button"
                            onClick={() => handleCopyPhone(student.parentPhone)}
                            title="Sao chép số điện thoại"
                            className="p-0.5 hover:text-blue-600 text-neutral-400 transition-colors"
                          >
                            {copiedPhone === student.parentPhone ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* GPA */}
                      <td className="py-3 px-3 text-right">
                        <span className="font-mono font-bold text-neutral-900 dark:text-neutral-100">
                          {gpa !== undefined ? gpa : '—'}
                        </span>
                      </td>

                      {/* Academic Rank: unboxed clean text per zero-pill discipline */}
                      <td className="py-3 px-3">
                        <span className="font-medium text-neutral-800 dark:text-neutral-200">
                          {rank}
                        </span>
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
                            onClick={() => onViewStudent(student)}
                            title="Xem chi tiết học bạ"
                            className="p-1.5 text-neutral-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {!isReadOnly && (
                            <>
                              <button
                                type="button"
                                onClick={() => onEditStudent(student)}
                                title="Chỉnh sửa thông tin"
                                className="p-1.5 text-neutral-500 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (window.confirm(`Bạn có chắc chắn muốn xóa học sinh "${student.fullName}" khỏi hệ thống?`)) {
                                    onDeleteStudent(student.id);
                                  }
                                }}
                                title="Xóa học sinh"
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
