export type Gender = 'Nam' | 'Nữ';

export type UserRole = 'admin' | 'teacher' | 'student';

export interface CurrentUser {
  role: UserRole;
  id: string;
  name: string;
  code: string;
  title: string;
  avatarInitial: string;
  studentId?: string;
  teacherId?: string;
  classId?: string;
  className?: string; // Tên lớp mà GVCN đăng ký quản lý (vd: 10A1, 10B8, 11A2...)
  schoolName?: string; // Tên trường học công tác/học tập
  province?: string; // Tỉnh/Thành phố
  username?: string;
}

export interface TeacherAccount {
  id: string;
  username: string;
  passwordHash: string; // Mật khẩu (được mã hóa/bảo vệ)
  fullName: string;
  gender: Gender;
  phone: string;
  email: string;
  className: string; // Tên lớp (vd: 10A1, 10B8)
  classId: string;
  schoolName: string; // Tên trường đang công tác (vd: THPT Chuyên Lương Văn Tụy, THPT Gia Viễn A, THPT Chu Văn An...)
  province: string; // Tỉnh/Thành phố tương ứng
  createdAt: string;
  status: 'active' | 'locked';
  avatarInitial?: string;
  note?: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  userName: string;
  role: UserRole;
  action: string;
  details: string;
  ipOrDevice?: string;
}

export interface LoginSession {
  id: string;
  username: string;
  role: UserRole;
  timestamp: string;
  device: string;
  status: 'success' | 'failed';
  ip?: string;
}

export interface ClassSubject {
  id: string;
  classId: string;
  name: string;
  createdAt: string;
}

export interface ClassHandover {
  id: string;
  classId: string;
  oldTeacherName: string;
  oldTeacherUsername: string;
  newTeacherName: string;
  newTeacherUsername: string;
  handoverDate: string;
  previousClassName: string;
  newClassName: string;
  notes?: string;
}

export type StudentStatus = 'active' | 'graduated' | 'suspended' | 'transferred';
export type TeacherStatus = 'active' | 'on_leave' | 'retired';
export type AcademicRank = 'Xuất sắc' | 'Giỏi' | 'Khá' | 'Trung bình' | 'Yếu';
export type ConductRank = 'Tốt' | 'Khá' | 'Trung bình' | 'Yếu';

export type AttendanceStatus = 'present' | 'excused' | 'unexcused' | 'late';

export interface SubjectScore {
  tx1?: number; // Điểm đánh giá thường xuyên 1 (đgtx 1)
  tx2?: number; // Điểm đánh giá thường xuyên 2 (đgtx 2)
  tx3?: number; // Điểm đánh giá thường xuyên 3 (đgtx 3)
  gk?: number;  // Điểm giữa kỳ (gk)
  ck?: number;  // Điểm cuối kỳ (ck)
  avg?: number; // Điểm trung bình môn (tbm)
}

export interface SemesterEvaluation {
  academicResult: 'Tốt' | 'Khá' | 'Đạt' | 'Chưa đạt'; // Kết quả học tập
  trainingResult: 'Tốt' | 'Khá' | 'Đạt' | 'Chưa đạt'; // Kết quả rèn luyện
  notes?: string;
}

export interface Student {
  id: string;
  code: string; // Mã học sinh: HS25-001
  fullName: string;
  gender: Gender;
  dateOfBirth: string; // YYYY-MM-DD
  classId: string;
  address: string;
  parentName: string;
  parentPhone: string;
  parentEmail?: string;
  status: StudentStatus;
  enrollmentYear: number;
  avatarUrl?: string;
  grades: {
    HK1: Record<string, SubjectScore>;
    HK2: Record<string, SubjectScore>;
  };
  evaluations?: {
    HK1?: SemesterEvaluation;
    HK2?: SemesterEvaluation;
  };
  notes?: string;
  schoolName?: string;
  province?: string;
}

export interface Teacher {
  id: string;
  code: string; // Mã giáo viên: GV-012
  fullName: string;
  gender: Gender;
  dateOfBirth: string;
  subject: string; // Môn giảng dạy chính: Toán, Ngữ văn, Tiếng Anh...
  qualification: 'Cử nhân' | 'Thạc sĩ' | 'Tiến sĩ';
  homeroomClassId?: string | null; // ID lớp chủ nhiệm
  phone: string;
  email: string;
  startYear: number;
  status: TeacherStatus;
  avatarUrl?: string;
  bio?: string;
}

export interface ClassRoom {
  id: string;
  name: string; // 10A1, 11B2...
  grade: number; // 10, 11, 12
  schoolYear: string; // 2026-2027
  homeroomTeacherId?: string | null;
  roomNumber: string; // P.201, P.305...
  maxStudents: number;
  schoolName?: string; // Tên trường liên kết với lớp
  province?: string; // Tỉnh/Thành phố của trường
}

export type WeeklyEntryType = 'bonus' | 'penalty';

export interface WeeklyRecordItem {
  id: string;
  studentId: string;
  weekNumber: number; // Tuần 1 -> 35
  date: string; // YYYY-MM-DD
  type: WeeklyEntryType;
  category: string; // 'Điểm TX 9-10', 'Phát biểu tốt', 'Không thuộc bài', 'Đi học muộn'...
  points: number; // Số điểm cộng (+) hoặc trừ (-)
  subject?: string; // Môn học liên quan
  note?: string; // Chi tiết cụ thể
  createdByName?: string; // Người ghi nhận: GV bộ môn, GVCN, Đội cờ đỏ...
}

export interface AttendanceRecord {
  id: string;
  date: string; // YYYY-MM-DD
  classId: string;
  records: Record<string, { status: AttendanceStatus; note?: string }>; // studentId -> status
}

export interface ScheduleItem {
  id: string;
  classId: string;
  dayOfWeek: 2 | 3 | 4 | 5 | 6 | 7; // Thứ 2 - Thứ 7
  period: number; // Tiết 1 - 9
  subject: string;
  teacherId: string;
  room: string;
}

export const SUBJECT_LIST = [
  'Toán học',
  'Ngữ văn',
  'Tiếng Anh',
  'Vật lý',
  'Hóa học',
  'Sinh học',
  'Lịch sử',
  'Địa lý',
  'Tin học',
  'GDCD',
  'Thể dục'
];

export interface WeeklyComment {
  id: string;
  studentId: string;
  weekNumber: number;
  comment: string;
  updatedAt: string;
  createdByName?: string;
}

export interface SeatingLayout {
  classId: string;
  columns: number; // Số dãy bàn (mặc định 4 dãy)
  rows: number; // Số hàng bàn (mặc định 5 hàng)
  seatsPerDesk: number; // 2 (bàn đôi: 2 ghế)
  // Key format: `${col}-${row}-${seatIdx}` -> studentId or null
  seats: Record<string, string | null>;
}

