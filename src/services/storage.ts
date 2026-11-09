import { 
  Student, 
  Teacher, 
  ClassRoom, 
  AttendanceRecord, 
  ScheduleItem, 
  AcademicRank, 
  SubjectScore, 
  WeeklyRecordItem,
  WeeklyComment,
  SeatingLayout,
  TeacherAccount,
  ActivityLog,
  LoginSession,
  ClassHandover,
  SUBJECT_LIST
} from '../types';
import { INITIAL_STUDENTS, INITIAL_TEACHERS, INITIAL_CLASSES, INITIAL_ATTENDANCE, INITIAL_SCHEDULE, INITIAL_WEEKLY_RECORDS } from '../data/mockData';

const STORAGE_KEYS = {
  STUDENTS: 'eduschool_students_v1',
  TEACHERS: 'eduschool_teachers_v1',
  CLASSES: 'eduschool_classes_v1',
  ATTENDANCE: 'eduschool_attendance_v1',
  SCHEDULE: 'eduschool_schedule_v1',
  WEEKLY_RECORDS: 'eduschool_weekly_records_v1',
  WEEKLY_COMMENTS: 'eduschool_weekly_comments_v1',
  SEATING: 'eduschool_seating_v1',
  SEMESTER: 'eduschool_selected_semester',
  TEACHER_ACCOUNTS: 'eduschool_teacher_accounts_v1',
  CLASS_SUBJECTS: 'eduschool_class_subjects_v1',
  ACTIVITY_LOGS: 'eduschool_activity_logs_v1',
  LOGIN_SESSIONS: 'eduschool_login_sessions_v1',
  CLASS_HANDOVERS: 'eduschool_class_handovers_v1',
  ADMIN_PASSWORD: 'eduschool_admin_password_v1'
};

// Safe deterministic password hashing for in-browser authentication
export function hashPassword(password: string): string {
  let hash = 0;
  const salted = `eduschool_salt_2026_${password}`;
  for (let i = 0; i < salted.length; i++) {
    const char = salted.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return 'h$' + Math.abs(hash).toString(16) + '$' + btoa(salted).slice(0, 10);
}

export function verifyPassword(password: string, storedHash: string): boolean {
  return hashPassword(password) === storedHash;
}

// Default initial teacher accounts
export const INITIAL_TEACHER_ACCOUNTS: TeacherAccount[] = [
  {
    id: 'ta-01',
    username: 'nguyenvanhung',
    passwordHash: hashPassword('123456'),
    fullName: 'Thầy Nguyễn Văn Hùng',
    gender: 'Nam',
    phone: '0912345678',
    email: 'hung.nv@thptgiaviena.edu.vn',
    className: '10A1',
    classId: 'c-10a1',
    schoolName: 'Trường THPT Gia Viễn A',
    province: 'Ninh Bình',
    createdAt: '2026-09-01',
    status: 'active',
    avatarInitial: 'NVH'
  },
  {
    id: 'ta-02',
    username: 'tranphuongmai',
    passwordHash: hashPassword('123456'),
    fullName: 'Cô Trần Thị Phương Mai',
    gender: 'Nữ',
    phone: '0983456789',
    email: 'mai.ttp@luongvantuy.edu.vn',
    className: '10B8',
    classId: 'c-10b8',
    schoolName: 'Trường THPT Chuyên Lương Văn Tụy',
    province: 'Ninh Bình',
    createdAt: '2026-09-01',
    status: 'active',
    avatarInitial: 'TPM'
  }
];

export const DEFAULT_ADMIN_PASSWORD_HASH = hashPassword('0978102756');

// Default initial seating layout for class 10A1 (4 columns x 5 rows x 2 seats)
export const INITIAL_SEATING_LAYOUT: SeatingLayout = {
  classId: 'c-10a1',
  columns: 4,
  rows: 5,
  seatsPerDesk: 2,
  seats: {
    '1-1-0': 's-01', // Nguyễn Minh Quân
    '1-1-1': 's-02', // Trần Thị Mai Anh
    '1-2-0': 's-03', // Lê Hoàng Long
    '1-2-1': 's-04', // Phạm Thị Thu Trang
    '1-3-0': 's-05', // Vũ Quốc Đạt
    '1-3-1': 's-06', // Đỗ Mỹ Linh
    '1-4-0': 's-07', // Hoàng Đức Thắng
    '1-4-1': 's-08', // Bùi Ngọc Ánh
    '2-1-0': 's-09', // Ngô Gia Huy
    '2-1-1': 's-10', // Trịnh Thu Hà
    '2-2-0': 's-11', // Đinh Văn Nam
    '2-2-1': 's-12', // Dương Quỳnh Nga
    '2-3-0': 's-13', // Phan Đình Tùng
    '2-3-1': 's-14', // Cao Bảo Ngọc
    '2-4-0': 's-15', // Lương Thế Vinh
    '2-4-1': 's-16', // Tạ Bích Phương
    '3-1-0': 's-17', // Hà Quang Dũng
    '3-1-1': 's-18', // Lâm Khánh Chi
    '3-2-0': 's-19', // Mai Tuấn Kiệt
    '3-2-1': 's-20'  // Nguyễn Phương Thảo
  }
};

// Default initial weekly comments by Homeroom Teacher
export const INITIAL_WEEKLY_COMMENTS: WeeklyComment[] = [
  {
    id: 'wc-1',
    studentId: 's-01',
    weekNumber: 10,
    comment: 'Minh Quân tuần này học tập rất tốt, đạt điểm 10 kiểm tra miệng môn Toán. Giữ vững tác phong lớp phó học tập!',
    updatedAt: '2026-11-06',
    createdByName: 'Thầy Hùng (GVCN)'
  },
  {
    id: 'wc-2',
    studentId: 's-02',
    weekNumber: 10,
    comment: 'Mai Anh chăm chỉ, tích cực hỗ trợ bạn bè trong giờ tự quản, làm bài tập về nhà đầy đủ.',
    updatedAt: '2026-11-06',
    createdByName: 'Thầy Hùng (GVCN)'
  },
  {
    id: 'wc-3',
    studentId: 's-03',
    weekNumber: 10,
    comment: 'Hoàng Long có tiến bộ trong giờ Tiếng Anh, tuy nhiên cần chú ý không nói chuyện riêng đầu giờ học.',
    updatedAt: '2026-11-06',
    createdByName: 'Thầy Hùng (GVCN)'
  },
  {
    id: 'wc-4',
    studentId: 's-20',
    weekNumber: 10,
    comment: 'Phương Thảo tuần này bị nhắc nhở vì quên vở bài tập và dùng điện thoại. Gia đình phối hợp nhắc nhở con.',
    updatedAt: '2026-11-06',
    createdByName: 'Thầy Hùng (GVCN)'
  }
];

// Helper to compute attendance stats for student across current records
export function getStudentAttendanceSummary(studentId: string, attendance: AttendanceRecord[]) {
  let excusedCount = 0;
  let unexcusedCount = 0;
  let lateCount = 0;
  let presentCount = 0;

  attendance.forEach((record) => {
    const st = record.records[studentId];
    if (!st) return;
    if (st.status === 'present') presentCount++;
    else if (st.status === 'excused') excusedCount++;
    else if (st.status === 'unexcused') unexcusedCount++;
    else if (st.status === 'late') lateCount++;
  });

  const isNeverAbsent = excusedCount === 0 && unexcusedCount === 0;

  return {
    presentCount,
    excusedCount,
    unexcusedCount,
    lateCount,
    totalAbsences: excusedCount + unexcusedCount,
    isNeverAbsent,
    label: isNeverAbsent ? 'Không nghỉ buổi nào (Chuyên cần 100%)' : `Nghỉ ${excusedCount + unexcusedCount} buổi (${excusedCount} có phép, ${unexcusedCount} không phép)`
  };
}

// Calculate subject average: (TX1 + TX2 + (TX3 ?? 0) + GK*2 + CK*3) / total weight
export function calculateSubjectAverage(score: SubjectScore): number | undefined {
  const { tx1, tx2, tx3, gk, ck } = score;
  if (tx1 === undefined && tx2 === undefined && tx3 === undefined && gk === undefined && ck === undefined) {
    return undefined;
  }
  let sum = 0;
  let weight = 0;
  if (tx1 !== undefined) { sum += tx1 * 1; weight += 1; }
  if (tx2 !== undefined) { sum += tx2 * 1; weight += 1; }
  if (tx3 !== undefined) { sum += tx3 * 1; weight += 1; }
  if (gk !== undefined) { sum += gk * 2; weight += 2; }
  if (ck !== undefined) { sum += ck * 3; weight += 3; }
  
  if (weight === 0) return undefined;
  return +(sum / weight).toFixed(1);
}

// Calculate student GPA across all subjects in a semester
export function calculateSemesterGpa(student: Student, semester: 'HK1' | 'HK2'): number | undefined {
  const semesterGrades = student.grades[semester];
  if (!semesterGrades) return undefined;

  const validAverages: number[] = [];
  Object.values(semesterGrades).forEach((sub) => {
    const avg = sub.avg ?? calculateSubjectAverage(sub);
    if (avg !== undefined) {
      validAverages.push(avg);
    }
  });

  if (validAverages.length === 0) return undefined;
  const sum = validAverages.reduce((acc, curr) => acc + curr, 0);
  return +(sum / validAverages.length).toFixed(1);
}

// Academic ranking according to VN Ministry of Education
export function getAcademicRank(gpa: number | undefined, student?: Student, semester?: 'HK1' | 'HK2'): AcademicRank {
  if (gpa === undefined) return 'Trung bình';

  let minSubjectScore = 10;
  if (student && semester && student.grades[semester]) {
    const scores = Object.values(student.grades[semester])
      .map(s => s.avg ?? calculateSubjectAverage(s))
      .filter((s): s is number => s !== undefined);
    if (scores.length > 0) {
      minSubjectScore = Math.min(...scores);
    }
  }

  if (gpa >= 9.0 && minSubjectScore >= 6.5) return 'Xuất sắc';
  if (gpa >= 8.0 && minSubjectScore >= 5.0) return 'Giỏi';
  if (gpa >= 6.5 && minSubjectScore >= 3.5) return 'Khá';
  if (gpa >= 5.0 && minSubjectScore >= 2.0) return 'Trung bình';
  return 'Yếu';
}

export function getRankBadgeColor(rank: AcademicRank): { bg: string; text: string; border: string } {
  switch (rank) {
    case 'Xuất sắc':
      return { bg: 'bg-emerald-50 dark:bg-emerald-950/40', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-200 dark:border-emerald-800' };
    case 'Giỏi':
      return { bg: 'bg-blue-50 dark:bg-blue-950/40', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-200 dark:border-blue-800' };
    case 'Khá':
      return { bg: 'bg-sky-50 dark:bg-sky-950/40', text: 'text-sky-700 dark:text-sky-300', border: 'border-sky-200 dark:border-sky-800' };
    case 'Trung bình':
      return { bg: 'bg-amber-50 dark:bg-amber-950/40', text: 'text-amber-700 dark:text-amber-300', border: 'border-amber-200 dark:border-amber-800' };
    case 'Yếu':
      return { bg: 'bg-rose-50 dark:bg-rose-950/40', text: 'text-rose-700 dark:text-rose-300', border: 'border-rose-200 dark:border-rose-800' };
  }
}

// Local storage management
export function loadInitialData() {
  const getStored = <T>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  };

  return {
    students: getStored<Student[]>(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS),
    teachers: getStored<Teacher[]>(STORAGE_KEYS.TEACHERS, INITIAL_TEACHERS),
    classes: getStored<ClassRoom[]>(STORAGE_KEYS.CLASSES, INITIAL_CLASSES),
    attendance: getStored<AttendanceRecord[]>(STORAGE_KEYS.ATTENDANCE, INITIAL_ATTENDANCE),
    schedule: getStored<ScheduleItem[]>(STORAGE_KEYS.SCHEDULE, INITIAL_SCHEDULE),
    weeklyRecords: getStored<WeeklyRecordItem[]>(STORAGE_KEYS.WEEKLY_RECORDS, INITIAL_WEEKLY_RECORDS),
    weeklyComments: getStored<WeeklyComment[]>(STORAGE_KEYS.WEEKLY_COMMENTS, INITIAL_WEEKLY_COMMENTS),
    seatingLayout: getStored<SeatingLayout>(STORAGE_KEYS.SEATING, INITIAL_SEATING_LAYOUT)
  };
}

export function saveStudents(students: Student[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  } catch (e) {
    console.error('Failed to save students', e);
  }
}

export function saveTeachers(teachers: Teacher[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(teachers));
  } catch (e) {
    console.error('Failed to save teachers', e);
  }
}

export function saveClasses(classes: ClassRoom[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(classes));
  } catch (e) {
    console.error('Failed to save classes', e);
  }
}

export function saveAttendance(attendance: AttendanceRecord[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendance));
  } catch (e) {
    console.error('Failed to save attendance', e);
  }
}

export function saveSchedule(schedule: ScheduleItem[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.SCHEDULE, JSON.stringify(schedule));
  } catch (e) {
    console.error('Failed to save schedule', e);
  }
}

export function saveWeeklyRecords(records: WeeklyRecordItem[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.WEEKLY_RECORDS, JSON.stringify(records));
  } catch (e) {
    console.error('Failed to save weekly records', e);
  }
}

export function saveWeeklyComments(comments: WeeklyComment[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.WEEKLY_COMMENTS, JSON.stringify(comments));
  } catch (e) {
    console.error('Failed to save weekly comments', e);
  }
}

export function saveSeatingLayout(layout: SeatingLayout) {
  try {
    localStorage.setItem(STORAGE_KEYS.SEATING, JSON.stringify(layout));
  } catch (e) {
    console.error('Failed to save seating layout', e);
  }
}

export function resetAllData() {
  localStorage.removeItem(STORAGE_KEYS.STUDENTS);
  localStorage.removeItem(STORAGE_KEYS.TEACHERS);
  localStorage.removeItem(STORAGE_KEYS.CLASSES);
  localStorage.removeItem(STORAGE_KEYS.ATTENDANCE);
  localStorage.removeItem(STORAGE_KEYS.SCHEDULE);
  localStorage.removeItem(STORAGE_KEYS.WEEKLY_RECORDS);
  localStorage.removeItem(STORAGE_KEYS.WEEKLY_COMMENTS);
  localStorage.removeItem(STORAGE_KEYS.SEATING);
}

// Export backup
export function exportDataAsJson(data: {
  students: Student[];
  teachers: Teacher[];
  classes: ClassRoom[];
  attendance: AttendanceRecord[];
  schedule: ScheduleItem[];
  weeklyRecords: WeeklyRecordItem[];
  weeklyComments?: WeeklyComment[];
  seatingLayout?: SeatingLayout;
}) {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `eduschool_backup_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

// Export students to CSV
export function exportStudentsToCsv(students: Student[], classes: ClassRoom[], semester: 'HK1' | 'HK2') {
  const headers = ['Mã HS', 'Họ và tên', 'Giới tính', 'Ngày sinh', 'Lớp', 'Địa chỉ', 'Phụ huynh', 'SĐT Phụ huynh', 'Điểm TB (' + semester + ')', 'Xếp loại', 'Trạng thái'];
  const rows = students.map(s => {
    const cls = classes.find(c => c.id === s.classId)?.name || 'Chưa xếp lớp';
    const gpa = calculateSemesterGpa(s, semester) ?? 'Chưa có';
    const rank = getAcademicRank(typeof gpa === 'number' ? gpa : undefined, s, semester);
    const statusMap = {
      active: 'Đang học',
      graduated: 'Đã tốt nghiệp',
      suspended: 'Đình chỉ',
      transferred: 'Chuyển trường'
    };

    return [
      `"${s.code}"`,
      `"${s.fullName}"`,
      `"${s.gender}"`,
      `"${s.dateOfBirth}"`,
      `"${cls}"`,
      `"${s.address.replace(/"/g, '""')}"`,
      `"${s.parentName}"`,
      `"${s.parentPhone}"`,
      `"${gpa}"`,
      `"${rank}"`,
      `"${statusMap[s.status] || s.status}"`
    ].join(',');
  });

  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `danh_sach_hoc_sinh_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// Export teachers to CSV
export function exportTeachersToCsv(teachers: Teacher[], classes: ClassRoom[]) {
  const headers = ['Mã GV', 'Họ và tên', 'Giới tính', 'Môn giảng dạy', 'Trình độ', 'Chủ nhiệm lớp', 'Số điện thoại', 'Email', 'Năm công tác', 'Trạng thái'];
  const rows = teachers.map(t => {
    const homeroom = classes.find(c => c.id === t.homeroomClassId)?.name || 'Không';
    const statusMap = {
      active: 'Đang giảng dạy',
      on_leave: 'Nghỉ phép',
      retired: 'Đã nghỉ hưu'
    };

    return [
      `"${t.code}"`,
      `"${t.fullName}"`,
      `"${t.gender}"`,
      `"${t.subject}"`,
      `"${t.qualification}"`,
      `"${homeroom}"`,
      `"${t.phone}"`,
      `"${t.email}"`,
      `"${t.startYear}"`,
      `"${statusMap[t.status] || t.status}"`
    ].join(',');
  });

  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `danh_sach_giao_vien_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// -------------------------------------------------------------
// Teacher Accounts Management (GVCN & Admin)
// -------------------------------------------------------------
export function loadTeacherAccounts(): TeacherAccount[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TEACHER_ACCOUNTS);
    if (!raw) {
      saveTeacherAccounts(INITIAL_TEACHER_ACCOUNTS);
      return INITIAL_TEACHER_ACCOUNTS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.map((acc: any) => ({
        ...acc,
        schoolName: acc.schoolName || (acc.username === 'tranphuongmai' ? 'Trường THPT Chuyên Lương Văn Tụy' : 'Trường THPT Gia Viễn A'),
        province: acc.province || 'Ninh Bình'
      }));
    }
    return INITIAL_TEACHER_ACCOUNTS;
  } catch {
    return INITIAL_TEACHER_ACCOUNTS;
  }
}

export function saveTeacherAccounts(accounts: TeacherAccount[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.TEACHER_ACCOUNTS, JSON.stringify(accounts));
  } catch (e) {
    console.error('Failed to save teacher accounts', e);
  }
}

export function updateTeacherAccountProfile(id: string, updates: Partial<TeacherAccount>): TeacherAccount | null {
  const accounts = loadTeacherAccounts();
  const idx = accounts.findIndex(a => a.id === id || a.username === id);
  if (idx === -1) return null;
  const updated: TeacherAccount = {
    ...accounts[idx],
    ...updates
  };
  accounts[idx] = updated;
  saveTeacherAccounts(accounts);
  return updated;
}

export function getAdminPasswordHash(): string {
  try {
    const hash = localStorage.getItem(STORAGE_KEYS.ADMIN_PASSWORD);
    return hash || DEFAULT_ADMIN_PASSWORD_HASH;
  } catch {
    return DEFAULT_ADMIN_PASSWORD_HASH;
  }
}

export function setAdminPassword(newPasswordPlain: string) {
  try {
    const hashed = hashPassword(newPasswordPlain);
    localStorage.setItem(STORAGE_KEYS.ADMIN_PASSWORD, hashed);
  } catch (e) {
    console.error('Failed to set admin password', e);
  }
}

// -------------------------------------------------------------
// Custom Subjects Management Per Class
// -------------------------------------------------------------
export function loadClassSubjects(classId: string): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CLASS_SUBJECTS);
    if (raw) {
      const map: Record<string, string[]> = JSON.parse(raw);
      if (map[classId] && map[classId].length > 0) {
        return map[classId];
      }
    }
  } catch (e) {
    console.error('Failed to load class subjects', e);
  }
  return [...SUBJECT_LIST];
}

export function saveClassSubjects(classId: string, subjects: string[]) {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CLASS_SUBJECTS);
    const map: Record<string, string[]> = raw ? JSON.parse(raw) : {};
    map[classId] = subjects;
    localStorage.setItem(STORAGE_KEYS.CLASS_SUBJECTS, JSON.stringify(map));
  } catch (e) {
    console.error('Failed to save class subjects', e);
  }
}

// -------------------------------------------------------------
// Activity Logs & Security Sessions (Admin Audit)
// -------------------------------------------------------------
export function loadActivityLogs(): ActivityLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVITY_LOGS);
    if (!raw) {
      const initialLogs: ActivityLog[] = [
        {
          id: 'log-01',
          timestamp: '2026-11-08 08:30:00',
          userName: 'admin123',
          role: 'admin',
          action: 'Khởi tạo hệ thống',
          details: 'Thiết lập danh mục lớp học và cơ sở dữ liệu học sinh năm học 2026 - 2027.'
        },
        {
          id: 'log-02',
          timestamp: '2026-11-08 09:15:22',
          userName: 'nguyenvanhung',
          role: 'teacher',
          action: 'Điểm danh buổi sáng',
          details: 'Hoàn tất điểm danh chuyên cần ngày 08/11/2026 cho lớp 10A1.'
        }
      ];
      saveActivityLogs(initialLogs);
      return initialLogs;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveActivityLogs(logs: ActivityLog[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVITY_LOGS, JSON.stringify(logs.slice(0, 100)));
  } catch (e) {
    console.error('Failed to save activity logs', e);
  }
}

export function addActivityLog(userName: string, role: 'admin' | 'teacher' | 'student', action: string, details: string) {
  const currentLogs = loadActivityLogs();
  const newLog: ActivityLog = {
    id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
    userName,
    role,
    action,
    details
  };
  saveActivityLogs([newLog, ...currentLogs]);
}

export function loadLoginSessions(): LoginSession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LOGIN_SESSIONS);
    if (!raw) {
      const initialSessions: LoginSession[] = [
        {
          id: 'ses-1',
          username: 'admin123',
          role: 'admin',
          timestamp: '2026-11-08 08:10:15',
          device: 'Chrome / Windows 11',
          status: 'success',
          ip: '192.168.1.100'
        },
        {
          id: 'ses-2',
          username: 'nguyenvanhung',
          role: 'teacher',
          timestamp: '2026-11-08 08:35:40',
          device: 'Safari / iPhone 15 Pro',
          status: 'success',
          ip: '192.168.1.104'
        }
      ];
      saveLoginSessions(initialSessions);
      return initialSessions;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveLoginSessions(sessions: LoginSession[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.LOGIN_SESSIONS, JSON.stringify(sessions.slice(0, 50)));
  } catch (e) {
    console.error('Failed to save login sessions', e);
  }
}

export function addLoginSession(username: string, role: 'admin' | 'teacher' | 'student', status: 'success' | 'failed', device?: string) {
  const current = loadLoginSessions();
  const newSession: LoginSession = {
    id: `ses-${Date.now()}`,
    username,
    role,
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
    device: device || (navigator.userAgent.includes('Mobile') ? 'Mobile Device' : 'Desktop Browser'),
    status,
    ip: '127.0.0.1'
  };
  saveLoginSessions([newSession, ...current]);
}

// -------------------------------------------------------------
// Class Handover History
// -------------------------------------------------------------
export function loadClassHandovers(): ClassHandover[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CLASS_HANDOVERS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addClassHandover(handover: ClassHandover) {
  try {
    const current = loadClassHandovers();
    const updated = [handover, ...current];
    localStorage.setItem(STORAGE_KEYS.CLASS_HANDOVERS, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save class handover', e);
  }
}

// -------------------------------------------------------------
// Attendance Percentage Calculation (Requirement 19)
// Tỷ lệ chuyên cần = (Số lượt có mặt / Tổng số lượt điểm danh hợp lệ) × 100%
// Có mặt + Đi muộn = có mặt; Vắng phép + Vắng không phép = vắng
// -------------------------------------------------------------
export function calculateClassAttendanceRate(classId: string, attendance: AttendanceRecord[]): {
  rate: number;
  presentCount: number;
  totalValidRecords: number;
  excusedCount: number;
  unexcusedCount: number;
  lateCount: number;
} {
  let presentCount = 0;
  let excusedCount = 0;
  let unexcusedCount = 0;
  let lateCount = 0;

  const classRecords = attendance.filter(a => a.classId === classId);
  classRecords.forEach(rec => {
    Object.values(rec.records).forEach(st => {
      if (st.status === 'present') {
        presentCount++;
      } else if (st.status === 'late') {
        lateCount++;
        presentCount++; // Đi muộn vẫn được tính là có mặt
      } else if (st.status === 'excused') {
        excusedCount++;
      } else if (st.status === 'unexcused') {
        unexcusedCount++;
      }
    });
  });

  const totalValidRecords = presentCount + excusedCount + unexcusedCount;
  const rate = totalValidRecords > 0 ? +((presentCount / totalValidRecords) * 100).toFixed(1) : 100;

  return {
    rate,
    presentCount,
    totalValidRecords,
    excusedCount,
    unexcusedCount,
    lateCount
  };
}
