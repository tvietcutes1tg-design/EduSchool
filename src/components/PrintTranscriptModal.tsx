import React from 'react';
import { Student, ClassRoom, Teacher } from '../types';
import { calculateSemesterGpa, getAcademicRank, calculateSubjectAverage } from '../services/storage';
import { X, Printer } from 'lucide-react';

interface PrintTranscriptModalProps {
  student: Student | null;
  classes: ClassRoom[];
  teachers: Teacher[];
  selectedSemester: 'HK1' | 'HK2';
  schoolName: string;
  province?: string;
  onClose: () => void;
}

export const PrintTranscriptModal: React.FC<PrintTranscriptModalProps> = ({
  student,
  classes,
  teachers,
  selectedSemester,
  schoolName,
  province,
  onClose
}) => {
  if (!student) return null;

  const currentClass = classes.find((c) => c.id === student.classId);
  const homeroomTeacher = teachers.find((t) => t.id === currentClass?.homeroomTeacherId);

  const gpa = calculateSemesterGpa(student, selectedSemester);
  const rank = getAcademicRank(gpa, student, selectedSemester);
  const grades = student.grades[selectedSemester] || {};
  const subjectList = Object.keys(grades);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div 
        className="bg-white text-black border border-neutral-300 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Controls (Hidden in print) */}
        <div className="no-print p-4 bg-neutral-100 border-b border-neutral-200 flex items-center justify-between">
          <div className="text-xs font-semibold text-neutral-700">
            Bản xem trước khi in (Khổ giấy A4 chuẩn)
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-1.5 shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>In Ngay</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-neutral-500 hover:text-neutral-700 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Paper Canvas */}
        <div className="p-8 sm:p-12 bg-white text-neutral-900 font-sans space-y-6">
          {/* Header */}
          <div className="flex justify-between items-start text-xs border-b pb-4">
            <div>
              <div className="font-semibold uppercase tracking-wider text-[11px] text-neutral-600">
                SỞ GIÁO DỤC VÀ ĐÀO TẠO
              </div>
              <div className="font-bold text-sm text-neutral-900 uppercase">
                {schoolName}
              </div>
              <div className="text-[11px] text-neutral-500 mt-0.5">
                Mã trường: 01024 · Năm học 2026 - 2027
              </div>
            </div>

            <div className="text-center">
              <div className="font-bold text-[11px] uppercase tracking-wide">
                CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
              </div>
              <div className="font-semibold text-xs mt-0.5">
                Độc lập - Tự do - Hạnh phúc
              </div>
              <div className="w-24 h-0.5 bg-neutral-400 mx-auto mt-1" />
            </div>
          </div>

          {/* Title */}
          <div className="text-center pt-2">
            <h1 className="text-xl font-bold tracking-tight uppercase text-neutral-900">
              PHIẾU BÁO ĐIỂM HỌC TẬP VÀ RÈN LUYỆN
            </h1>
            <div className="text-xs font-medium text-neutral-600 mt-1">
              {selectedSemester === 'HK1' ? 'HỌC KỲ I' : 'HỌC KỲ II'} — NĂM HỌC 2026 - 2027
            </div>
          </div>

          {/* Student Profile Info */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs bg-neutral-50 p-4 rounded-lg border border-neutral-200">
            <div>
              <span className="text-neutral-500">Họ và tên học sinh:</span>{' '}
              <strong className="text-neutral-900 text-sm">{student.fullName}</strong>
            </div>
            <div>
              <span className="text-neutral-500">Mã định danh (Mã HS):</span>{' '}
              <strong className="font-mono text-neutral-900">{student.code}</strong>
            </div>
            <div>
              <span className="text-neutral-500">Lớp:</span>{' '}
              <strong className="text-neutral-900">{currentClass?.name || '—'}</strong>
            </div>
            <div>
              <span className="text-neutral-500">Ngày sinh:</span>{' '}
              <strong className="font-mono text-neutral-900">{student.dateOfBirth}</strong>
            </div>
            <div>
              <span className="text-neutral-500">Giáo viên chủ nhiệm:</span>{' '}
              <strong className="text-neutral-900">{homeroomTeacher?.fullName || 'Chưa phân công'}</strong>
            </div>
            <div>
              <span className="text-neutral-500">Phụ huynh học sinh:</span>{' '}
              <strong className="text-neutral-900">{student.parentName} ({student.parentPhone})</strong>
            </div>
          </div>

          {/* Transcript Table */}
          <div className="border border-neutral-300 rounded-lg overflow-hidden">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-neutral-100 border-b border-neutral-300 font-semibold text-neutral-700">
                  <th className="py-2 px-3 w-10 text-center">STT</th>
                  <th className="py-2 px-4">Môn Học</th>
                  <th className="py-2 px-3 text-center">TX 1 (x1)</th>
                  <th className="py-2 px-3 text-center">TX 2 (x1)</th>
                  <th className="py-2 px-3 text-center">Giữa kỳ (x2)</th>
                  <th className="py-2 px-3 text-center">Cuối kỳ (x3)</th>
                  <th className="py-2 px-3 text-right">ĐTB Môn</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 font-mono">
                {subjectList.map((sub, idx) => {
                  const sc = grades[sub];
                  const avg = sc?.avg ?? calculateSubjectAverage(sc);
                  return (
                    <tr key={sub}>
                      <td className="py-2 px-3 text-center text-neutral-500 font-sans">{idx + 1}</td>
                      <td className="py-2 px-4 font-sans font-medium text-neutral-900">{sub}</td>
                      <td className="py-2 px-3 text-center">{sc?.tx1 ?? '—'}</td>
                      <td className="py-2 px-3 text-center">{sc?.tx2 ?? '—'}</td>
                      <td className="py-2 px-3 text-center">{sc?.gk ?? '—'}</td>
                      <td className="py-2 px-3 text-center">{sc?.ck ?? '—'}</td>
                      <td className="py-2 px-3 text-right font-bold text-neutral-900">{avg ?? '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Academic Assessment & Rank */}
          <div className="grid grid-cols-3 gap-4 text-xs text-center">
            <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
              <span className="text-neutral-500 block">Điểm trung bình (GPA)</span>
              <span className="text-xl font-bold font-mono text-neutral-900 mt-1 block">
                {gpa !== undefined ? gpa : '—'}
              </span>
            </div>
            <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
              <span className="text-neutral-500 block">Xếp loại Học lực</span>
              <span className="text-lg font-bold text-neutral-900 mt-1 block">
                {rank}
              </span>
            </div>
            <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
              <span className="text-neutral-500 block">Xếp loại Hạnh kiểm</span>
              <span className="text-lg font-bold text-emerald-700 mt-1 block">
                Tốt
              </span>
            </div>
          </div>

          {/* Remarks */}
          <div className="p-3.5 bg-neutral-50 rounded-lg border border-neutral-200 text-xs">
            <span className="font-semibold text-neutral-800 block mb-1">
              Nhận xét của Giáo viên chủ nhiệm:
            </span>
            <p className="text-neutral-700 italic">
              {student.notes || 'Học sinh có ý thức học tập tốt, chấp hành đầy đủ nội quy trường lớp, phát huy tinh thần đoàn kết.'}
            </p>
          </div>

          {/* Signatures */}
          <div className="pt-6 grid grid-cols-2 gap-8 text-xs text-center">
            <div>
              <div className="text-neutral-500">{province ? `${province}, ngày 08 tháng 11 năm 2026` : 'Ngày 08 tháng 11 năm 2026'}</div>
              <div className="font-bold text-neutral-900 mt-1 uppercase">GIÁO VIÊN CHỦ NHIỆM</div>
              <div className="text-[11px] text-neutral-400 italic">(Ký và ghi rõ họ tên)</div>
              <div className="mt-16 font-semibold text-neutral-800">
                {homeroomTeacher?.fullName || 'Giáo viên chủ nhiệm'}
              </div>
            </div>

            <div>
              <div className="text-neutral-500">{province ? `${province}, ngày 08 tháng 11 năm 2026` : 'Ngày 08 tháng 11 năm 2026'}</div>
              <div className="font-bold text-neutral-900 mt-1 uppercase">HIỆU TRƯỞNG NHÀ TRƯỜNG</div>
              <div className="text-[11px] text-neutral-400 italic">(Ký tên và đóng dấu)</div>
              <div className="mt-16 font-semibold text-neutral-800">
                TS. Nguyễn Quốc Tuấn
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
