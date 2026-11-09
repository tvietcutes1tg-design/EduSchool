import { Student, Teacher, ClassRoom, AttendanceRecord, ScheduleItem, WeeklyRecordItem } from '../types';

export const INITIAL_CLASSES: ClassRoom[] = [
  { id: 'c-10a1', name: '10A1', grade: 10, schoolYear: '2026-2027', homeroomTeacherId: 't-01', roomNumber: 'P.101', maxStudents: 40 },
  { id: 'c-10a2', name: '10A2', grade: 10, schoolYear: '2026-2027', homeroomTeacherId: 't-02', roomNumber: 'P.102', maxStudents: 40 },
  { id: 'c-11a1', name: '11A1', grade: 11, schoolYear: '2026-2027', homeroomTeacherId: 't-03', roomNumber: 'P.201', maxStudents: 40 },
  { id: 'c-11a2', name: '11A2', grade: 11, schoolYear: '2026-2027', homeroomTeacherId: 't-04', roomNumber: 'P.202', maxStudents: 40 },
  { id: 'c-12a1', name: '12A1', grade: 12, schoolYear: '2026-2027', homeroomTeacherId: 't-05', roomNumber: 'P.301', maxStudents: 40 },
  { id: 'c-12a2', name: '12A2', grade: 12, schoolYear: '2026-2027', homeroomTeacherId: 't-06', roomNumber: 'P.302', maxStudents: 40 }
];

export const INITIAL_TEACHERS: Teacher[] = [
  {
    id: 't-01',
    code: 'GV-01',
    fullName: 'Nguyễn Văn Hùng',
    gender: 'Nam',
    dateOfBirth: '1984-05-14',
    subject: 'Toán học',
    qualification: 'Thạc sĩ',
    homeroomClassId: 'c-10a1',
    phone: '0912345678',
    email: 'nguyenvanhung@eduschool.edu.vn',
    startYear: 2012,
    status: 'active',
    bio: 'Thạc sĩ Toán giải tích, 14 năm kinh nghiệm bồi dưỡng học sinh giỏi tỉnh.'
  },
  {
    id: 't-02',
    code: 'GV-02',
    fullName: 'Trần Thị Phương Mai',
    gender: 'Nữ',
    dateOfBirth: '1988-11-20',
    subject: 'Ngữ văn',
    qualification: 'Thạc sĩ',
    homeroomClassId: 'c-10a2',
    phone: '0983456789',
    email: 'tranphuongmai@eduschool.edu.vn',
    startYear: 2015,
    status: 'active',
    bio: 'Giáo viên dạy giỏi cấp thành phố, phụ trách chuyên đề văn học hiện đại.'
  },
  {
    id: 't-03',
    code: 'GV-03',
    fullName: 'Lê Hoàng Nam',
    gender: 'Nam',
    dateOfBirth: '1981-03-08',
    subject: 'Vật lý',
    qualification: 'Tiến sĩ',
    homeroomClassId: 'c-11a1',
    phone: '0904567890',
    email: 'lehoangnam@eduschool.edu.vn',
    startYear: 2008,
    status: 'active',
    bio: 'Tiến sĩ Vật lý lượng tử, tổ trưởng chuyên môn Tự nhiên.'
  },
  {
    id: 't-04',
    code: 'GV-04',
    fullName: 'Phạm Thị Thu Hà',
    gender: 'Nữ',
    dateOfBirth: '1990-09-12',
    subject: 'Tiếng Anh',
    qualification: 'Thạc sĩ',
    homeroomClassId: 'c-11a2',
    phone: '0975678901',
    email: 'phamthuha@eduschool.edu.vn',
    startYear: 2017,
    status: 'active',
    bio: 'IELTS 8.5, giảng viên luyện thi chứng chỉ quốc tế và Olympic tiếng Anh.'
  },
  {
    id: 't-05',
    code: 'GV-05',
    fullName: 'Đặng Quốc Bảo',
    gender: 'Nam',
    dateOfBirth: '1979-01-25',
    subject: 'Hóa học',
    qualification: 'Thạc sĩ',
    homeroomClassId: 'c-12a1',
    phone: '0936789012',
    email: 'dangquocbao@eduschool.edu.vn',
    startYear: 2006,
    status: 'active',
    bio: 'Hơn 18 năm thâm niên, chuyên gia luyện thi đại học khối A, B.'
  },
  {
    id: 't-06',
    code: 'GV-06',
    fullName: 'Vũ Minh Trang',
    gender: 'Nữ',
    dateOfBirth: '1992-07-19',
    subject: 'Sinh học',
    qualification: 'Cử nhân',
    homeroomClassId: 'c-12a2',
    phone: '0947890123',
    email: 'vuminhtrang@eduschool.edu.vn',
    startYear: 2018,
    status: 'active',
    bio: 'Tốt nghiệp xuất sắc ĐH Sư Phạm, đạt giải Nhì giáo viên trẻ sáng tạo.'
  },
  {
    id: 't-07',
    code: 'GV-07',
    fullName: 'Hoàng Tuấn Anh',
    gender: 'Nam',
    dateOfBirth: '1986-12-04',
    subject: 'Tin học',
    qualification: 'Thạc sĩ',
    homeroomClassId: null,
    phone: '0968901234',
    email: 'hoangtuananh@eduschool.edu.vn',
    startYear: 2014,
    status: 'active',
    bio: 'Phụ trách đội tuyển lập trình tin học trẻ, quản trị hệ thống công nghệ nhà trường.'
  },
  {
    id: 't-08',
    code: 'GV-08',
    fullName: 'Đỗ Hải Yến',
    gender: 'Nữ',
    dateOfBirth: '1987-04-30',
    subject: 'Lịch sử',
    qualification: 'Cử nhân',
    homeroomClassId: null,
    phone: '0919012345',
    email: 'dohaiyen@eduschool.edu.vn',
    startYear: 2013,
    status: 'active',
    bio: 'Đam mê lịch sử dân tộc, ứng dụng phương pháp kể chuyện tương tác trong giảng dạy.'
  },
  {
    id: 't-09',
    code: 'GV-09',
    fullName: 'Ngô Thanh Tùng',
    gender: 'Nam',
    dateOfBirth: '1985-08-15',
    subject: 'Thể dục',
    qualification: 'Cử nhân',
    homeroomClassId: null,
    phone: '0921122334',
    email: 'ngothanhtung@eduschool.edu.vn',
    startYear: 2011,
    status: 'active',
    bio: 'Huấn luyện viên bóng rổ và điền kinh trường, trọng tài cấp quốc gia.'
  }
];

// Helper to generate realistic subject scores
const sampleScores = (base: number) => ({
  tx1: Math.min(10, Math.max(4, +(base + (Math.random() * 1.5 - 0.75)).toFixed(1))),
  tx2: Math.min(10, Math.max(4, +(base + (Math.random() * 1.5 - 0.75)).toFixed(1))),
  gk: Math.min(10, Math.max(4, +(base + (Math.random() * 1.6 - 0.8)).toFixed(1))),
  ck: Math.min(10, Math.max(4, +(base + (Math.random() * 1.4 - 0.7)).toFixed(1))),
  avg: 0 // Will be computed
});

const calculateAverage = (score: { tx1?: number; tx2?: number; gk?: number; ck?: number }): number => {
  const tx1 = score.tx1 ?? 8;
  const tx2 = score.tx2 ?? 8;
  const gk = score.gk ?? 8;
  const ck = score.ck ?? 8;
  // Standard Vietnamese evaluation: (TX1 + TX2 + GK*2 + CK*3) / 7
  return +((tx1 + tx2 + gk * 2 + ck * 3) / 7).toFixed(1);
};

const createStudentGrades = (baseScore: number) => {
  const subjects = ['Toán học', 'Ngữ văn', 'Tiếng Anh', 'Vật lý', 'Hóa học', 'Sinh học', 'Lịch sử', 'Tin học'];
  const hk1: Record<string, any> = {};
  const hk2: Record<string, any> = {};

  subjects.forEach(sub => {
    const s1 = sampleScores(baseScore);
    s1.avg = calculateAverage(s1);
    hk1[sub] = s1;

    const s2 = sampleScores(baseScore + 0.2);
    s2.avg = calculateAverage(s2);
    hk2[sub] = s2;
  });

  return { HK1: hk1, HK2: hk2 };
};

export const INITIAL_STUDENTS: Student[] = [
  // Lớp 10A1
  {
    id: 's-01',
    code: 'HS25-001',
    fullName: 'Nguyễn Minh Quân',
    gender: 'Nam',
    dateOfBirth: '2010-02-15',
    classId: 'c-10a1',
    address: 'Số 45 Hoàng Hoa Thám, Ba Đình, Hà Nội',
    parentName: 'Nguyễn Văn Quang',
    parentPhone: '0981123456',
    parentEmail: 'vquang78@gmail.com',
    status: 'active',
    enrollmentYear: 2025,
    grades: createStudentGrades(8.8),
    notes: 'Lớp trưởng 10A1, đạt giải Ba học sinh giỏi Toán cấp quận.'
  },
  {
    id: 's-02',
    code: 'HS25-002',
    fullName: 'Lê Thuỳ Linh',
    gender: 'Nữ',
    dateOfBirth: '2010-05-22',
    classId: 'c-10a1',
    address: 'Số 12 ngõ 80 Chùa Láng, Đống Đa, Hà Nội',
    parentName: 'Lê Đức Minh',
    parentPhone: '0972234567',
    parentEmail: 'ducminhle@yahoo.com',
    status: 'active',
    enrollmentYear: 2025,
    grades: createStudentGrades(9.2),
    notes: 'Bí thư chi đoàn, học lực xuất sắc.'
  },
  {
    id: 's-03',
    code: 'HS25-003',
    fullName: 'Trần Gia Huy',
    gender: 'Nam',
    dateOfBirth: '2010-09-10',
    classId: 'c-10a1',
    address: 'P.402 Nhà N03, Dịch Vọng, Cầu Giấy, Hà Nội',
    parentName: 'Trần Quốc Đạt',
    parentPhone: '0913345678',
    status: 'active',
    enrollmentYear: 2025,
    grades: createStudentGrades(7.4),
    notes: 'Thành viên đội tuyển bóng rổ trường.'
  },
  {
    id: 's-04',
    code: 'HS25-004',
    fullName: 'Hoàng Bảo Ngọc',
    gender: 'Nữ',
    dateOfBirth: '2010-11-03',
    classId: 'c-10a1',
    address: 'Số 88 Lạc Long Quân, Tây Hồ, Hà Nội',
    parentName: 'Hoàng Văn Thắng',
    parentPhone: '0904456789',
    status: 'active',
    enrollmentYear: 2025,
    grades: createStudentGrades(8.5)
  },
  {
    id: 's-05',
    code: 'HS25-005',
    fullName: 'Phạm Đức Anh',
    gender: 'Nam',
    dateOfBirth: '2010-07-18',
    classId: 'c-10a1',
    address: 'Số 16 Xuân Thủy, Cầu Giấy, Hà Nội',
    parentName: 'Phạm Văn Hưng',
    parentPhone: '0935567890',
    status: 'active',
    enrollmentYear: 2025,
    grades: createStudentGrades(6.8),
    notes: 'Cần bồi dưỡng thêm môn Tiếng Anh.'
  },

  // Lớp 10A2
  {
    id: 's-06',
    code: 'HS25-006',
    fullName: 'Vũ Khánh Huyền',
    gender: 'Nữ',
    dateOfBirth: '2010-04-12',
    classId: 'c-10a2',
    address: 'Số 29 Đội Cấn, Ba Đình, Hà Nội',
    parentName: 'Vũ Mạnh Cường',
    parentPhone: '0946678901',
    status: 'active',
    enrollmentYear: 2025,
    grades: createStudentGrades(8.9),
    notes: 'Lớp phó học tập 10A2, năng khiếu văn nghệ.'
  },
  {
    id: 's-07',
    code: 'HS25-007',
    fullName: 'Đặng Tuấn Kiệt',
    gender: 'Nam',
    dateOfBirth: '2010-08-30',
    classId: 'c-10a2',
    address: 'Số 54 Liễu Giai, Ba Đình, Hà Nội',
    parentName: 'Đặng Văn Long',
    parentPhone: '0967789012',
    status: 'active',
    enrollmentYear: 2025,
    grades: createStudentGrades(7.8)
  },
  {
    id: 's-08',
    code: 'HS25-008',
    fullName: 'Bùi Mai Anh',
    gender: 'Nữ',
    dateOfBirth: '2010-12-14',
    classId: 'c-10a2',
    address: 'Số 102 Kim Mã, Ba Đình, Hà Nội',
    parentName: 'Bùi Quốc Tuấn',
    parentPhone: '0988890123',
    status: 'active',
    enrollmentYear: 2025,
    grades: createStudentGrades(9.0)
  },

  // Lớp 11A1
  {
    id: 's-09',
    code: 'HS24-001',
    fullName: 'Ngô Hải Đăng',
    gender: 'Nam',
    dateOfBirth: '2009-01-20',
    classId: 'c-11a1',
    address: 'Số 72 Trần Duy Hưng, Cầu Giấy, Hà Nội',
    parentName: 'Ngô Quang Vinh',
    parentPhone: '0912233445',
    status: 'active',
    enrollmentYear: 2024,
    grades: createStudentGrades(9.4),
    notes: 'Giải Nhì HSG Vật lý Thành phố, học bổng danh dự kỳ 1.'
  },
  {
    id: 's-10',
    code: 'HS24-002',
    fullName: 'Đỗ Quỳnh Chi',
    gender: 'Nữ',
    dateOfBirth: '2009-03-25',
    classId: 'c-11a1',
    address: 'Số 15 Nguyễn Thị Định, Thanh Xuân, Hà Nội',
    parentName: 'Đỗ Hoàng Nam',
    parentPhone: '0933344556',
    status: 'active',
    enrollmentYear: 2024,
    grades: createStudentGrades(8.6)
  },
  {
    id: 's-11',
    code: 'HS24-003',
    fullName: 'Lý Quốc Bảo',
    gender: 'Nam',
    dateOfBirth: '2009-06-19',
    classId: 'c-11a1',
    address: 'Số 41 Hoàng Đạo Thúy, Cầu Giấy, Hà Nội',
    parentName: 'Lý Văn Phúc',
    parentPhone: '0944455667',
    status: 'active',
    enrollmentYear: 2024,
    grades: createStudentGrades(7.2)
  },
  {
    id: 's-12',
    code: 'HS24-004',
    fullName: 'Trịnh Thanh Hằng',
    gender: 'Nữ',
    dateOfBirth: '2009-10-08',
    classId: 'c-11a1',
    address: 'Số 18 Lê Văn Lương, Thanh Xuân, Hà Nội',
    parentName: 'Trịnh Quốc Trung',
    parentPhone: '0965566778',
    status: 'active',
    enrollmentYear: 2024,
    grades: createStudentGrades(8.3)
  },

  // Lớp 11A2
  {
    id: 's-13',
    code: 'HS24-005',
    fullName: 'Phan Tấn Dũng',
    gender: 'Nam',
    dateOfBirth: '2009-08-11',
    classId: 'c-11a2',
    address: 'Số 63 Thái Hà, Đống Đa, Hà Nội',
    parentName: 'Phan Đình Thắng',
    parentPhone: '0976677889',
    status: 'active',
    enrollmentYear: 2024,
    grades: createStudentGrades(8.1)
  },
  {
    id: 's-14',
    code: 'HS24-006',
    fullName: 'Nguyễn Phương Thảo',
    gender: 'Nữ',
    dateOfBirth: '2009-12-05',
    classId: 'c-11a2',
    address: 'Số 9 ngách 2 ngõ 105 Láng Hạ, Đống Đa, Hà Nội',
    parentName: 'Nguyễn Hải Phong',
    parentPhone: '0987788990',
    status: 'active',
    enrollmentYear: 2024,
    grades: createStudentGrades(9.1),
    notes: 'IELTS 7.5, chủ nhiệm CLB Tiếng Anh trường.'
  },

  // Lớp 12A1
  {
    id: 's-15',
    code: 'HS23-001',
    fullName: 'Trần Nhật Minh',
    gender: 'Nam',
    dateOfBirth: '2008-02-09',
    classId: 'c-12a1',
    address: 'Số 210 Giảng Võ, Ba Đình, Hà Nội',
    parentName: 'Trần Đức Thành',
    parentPhone: '0901122334',
    status: 'active',
    enrollmentYear: 2023,
    grades: createStudentGrades(9.6),
    notes: 'Thủ khoa đầu vào khóa 2023, dự thi học sinh giỏi Quốc gia môn Hóa.'
  },
  {
    id: 's-16',
    code: 'HS23-002',
    fullName: 'Lê Ngọc Ánh',
    gender: 'Nữ',
    dateOfBirth: '2008-07-14',
    classId: 'c-12a1',
    address: 'Số 82 Nguyên Hồng, Đống Đa, Hà Nội',
    parentName: 'Lê Hữu Cảnh',
    parentPhone: '0912233445',
    status: 'active',
    enrollmentYear: 2023,
    grades: createStudentGrades(9.0)
  },
  {
    id: 's-17',
    code: 'HS23-003',
    fullName: 'Vương Đình Phong',
    gender: 'Nam',
    dateOfBirth: '2008-10-28',
    classId: 'c-12a1',
    address: 'Số 35 Huỳnh Thúc Kháng, Đống Đa, Hà Nội',
    parentName: 'Vương Đình Toàn',
    parentPhone: '0923344556',
    status: 'active',
    enrollmentYear: 2023,
    grades: createStudentGrades(7.9)
  },

  // Lớp 12A2
  {
    id: 's-18',
    code: 'HS23-004',
    fullName: 'Đoàn Bảo Châu',
    gender: 'Nữ',
    dateOfBirth: '2008-04-16',
    classId: 'c-12a2',
    address: 'Số 95 Nguyễn Chí Thanh, Đống Đa, Hà Nội',
    parentName: 'Đoàn Ngọc Sơn',
    parentPhone: '0934455667',
    status: 'active',
    enrollmentYear: 2023,
    grades: createStudentGrades(8.7)
  },
  {
    id: 's-19',
    code: 'HS23-005',
    fullName: 'Hoàng Công Danh',
    gender: 'Nam',
    dateOfBirth: '2008-09-02',
    classId: 'c-12a2',
    address: 'Số 51 Vũ Ngọc Phan, Đống Đa, Hà Nội',
    parentName: 'Hoàng Công Lý',
    parentPhone: '0945566778',
    status: 'active',
    enrollmentYear: 2023,
    grades: createStudentGrades(8.2)
  },
  {
    id: 's-20',
    code: 'HS23-006',
    fullName: 'Chu Thảo My',
    gender: 'Nữ',
    dateOfBirth: '2008-12-18',
    classId: 'c-12a2',
    address: 'Số 114 Chùa Bộc, Đống Đa, Hà Nội',
    parentName: 'Chu Quang Huy',
    parentPhone: '0956677889',
    status: 'active',
    enrollmentYear: 2023,
    grades: createStudentGrades(6.4),
    notes: 'Học lực Trung bình, cần đôn đốc ôn thi tốt nghiệp THPT.'
  }
];

export const INITIAL_SCHEDULE: ScheduleItem[] = [
  // Thứ 2 lớp 10A1
  { id: 'sc-1', classId: 'c-10a1', dayOfWeek: 2, period: 1, subject: 'Chào cờ & SHDC', teacherId: 't-01', room: 'Sân trường' },
  { id: 'sc-2', classId: 'c-10a1', dayOfWeek: 2, period: 2, subject: 'Toán học', teacherId: 't-01', room: 'P.101' },
  { id: 'sc-3', classId: 'c-10a1', dayOfWeek: 2, period: 3, subject: 'Toán học', teacherId: 't-01', room: 'P.101' },
  { id: 'sc-4', classId: 'c-10a1', dayOfWeek: 2, period: 4, subject: 'Ngữ văn', teacherId: 't-02', room: 'P.101' },
  { id: 'sc-5', classId: 'c-10a1', dayOfWeek: 2, period: 5, subject: 'Tiếng Anh', teacherId: 't-04', room: 'P.101' },

  // Thứ 3 lớp 10A1
  { id: 'sc-6', classId: 'c-10a1', dayOfWeek: 3, period: 1, subject: 'Vật lý', teacherId: 't-03', room: 'P.101' },
  { id: 'sc-7', classId: 'c-10a1', dayOfWeek: 3, period: 2, subject: 'Vật lý', teacherId: 't-03', room: 'P.101' },
  { id: 'sc-8', classId: 'c-10a1', dayOfWeek: 3, period: 3, subject: 'Hóa học', teacherId: 't-05', room: 'P.101' },
  { id: 'sc-9', classId: 'c-10a1', dayOfWeek: 3, period: 4, subject: 'Sinh học', teacherId: 't-06', room: 'P.101' },
  { id: 'sc-10', classId: 'c-10a1', dayOfWeek: 3, period: 5, subject: 'Tin học', teacherId: 't-07', room: 'Phòng Lab 1' },

  // Thứ 4 lớp 10A1
  { id: 'sc-11', classId: 'c-10a1', dayOfWeek: 4, period: 1, subject: 'Ngữ văn', teacherId: 't-02', room: 'P.101' },
  { id: 'sc-12', classId: 'c-10a1', dayOfWeek: 4, period: 2, subject: 'Ngữ văn', teacherId: 't-02', room: 'P.101' },
  { id: 'sc-13', classId: 'c-10a1', dayOfWeek: 4, period: 3, subject: 'Toán học', teacherId: 't-01', room: 'P.101' },
  { id: 'sc-14', classId: 'c-10a1', dayOfWeek: 4, period: 4, subject: 'Tiếng Anh', teacherId: 't-04', room: 'P.101' },
  { id: 'sc-15', classId: 'c-10a1', dayOfWeek: 4, period: 5, subject: 'Thể dục', teacherId: 't-09', room: 'Nhà đa năng' },

  // Thứ 5 lớp 10A1
  { id: 'sc-16', classId: 'c-10a1', dayOfWeek: 5, period: 1, subject: 'Lịch sử', teacherId: 't-08', room: 'P.101' },
  { id: 'sc-17', classId: 'c-10a1', dayOfWeek: 5, period: 2, subject: 'Hóa học', teacherId: 't-05', room: 'P.101' },
  { id: 'sc-18', classId: 'c-10a1', dayOfWeek: 5, period: 3, subject: 'Sinh học', teacherId: 't-06', room: 'P.101' },
  { id: 'sc-19', classId: 'c-10a1', dayOfWeek: 5, period: 4, subject: 'Toán học', teacherId: 't-01', room: 'P.101' },
  { id: 'sc-20', classId: 'c-10a1', dayOfWeek: 5, period: 5, subject: 'Tin học', teacherId: 't-07', room: 'Phòng Lab 1' },

  // Thứ 6 lớp 10A1
  { id: 'sc-21', classId: 'c-10a1', dayOfWeek: 6, period: 1, subject: 'Tiếng Anh', teacherId: 't-04', room: 'P.101' },
  { id: 'sc-22', classId: 'c-10a1', dayOfWeek: 6, period: 2, subject: 'Tiếng Anh', teacherId: 't-04', room: 'P.101' },
  { id: 'sc-23', classId: 'c-10a1', dayOfWeek: 6, period: 3, subject: 'Vật lý', teacherId: 't-03', room: 'P.101' },
  { id: 'sc-24', classId: 'c-10a1', dayOfWeek: 6, period: 4, subject: 'Thể dục', teacherId: 't-09', room: 'Sân bóng' },
  { id: 'sc-25', classId: 'c-10a1', dayOfWeek: 6, period: 5, subject: 'Sinh hoạt lớp', teacherId: 't-01', room: 'P.101' },

  // Schedule for 11A1
  { id: 'sc-26', classId: 'c-11a1', dayOfWeek: 2, period: 1, subject: 'Chào cờ & SHDC', teacherId: 't-03', room: 'Sân trường' },
  { id: 'sc-27', classId: 'c-11a1', dayOfWeek: 2, period: 2, subject: 'Vật lý', teacherId: 't-03', room: 'P.201' },
  { id: 'sc-28', classId: 'c-11a1', dayOfWeek: 2, period: 3, subject: 'Vật lý', teacherId: 't-03', room: 'P.201' },
  { id: 'sc-29', classId: 'c-11a1', dayOfWeek: 2, period: 4, subject: 'Toán học', teacherId: 't-01', room: 'P.201' },
  { id: 'sc-30', classId: 'c-11a1', dayOfWeek: 2, period: 5, subject: 'Toán học', teacherId: 't-01', room: 'P.201' },

  // Schedule for 12A1
  { id: 'sc-31', classId: 'c-12a1', dayOfWeek: 2, period: 1, subject: 'Chào cờ & SHDC', teacherId: 't-05', room: 'Sân trường' },
  { id: 'sc-32', classId: 'c-12a1', dayOfWeek: 2, period: 2, subject: 'Hóa học', teacherId: 't-05', room: 'P.301' },
  { id: 'sc-33', classId: 'c-12a1', dayOfWeek: 2, period: 3, subject: 'Hóa học', teacherId: 't-05', room: 'P.301' },
  { id: 'sc-34', classId: 'c-12a1', dayOfWeek: 2, period: 4, subject: 'Sinh học', teacherId: 't-06', room: 'P.301' },
  { id: 'sc-35', classId: 'c-12a1', dayOfWeek: 2, period: 5, subject: 'Toán học', teacherId: 't-01', room: 'P.301' }
];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  {
    id: 'att-1',
    date: '2026-11-06',
    classId: 'c-10a1',
    records: {
      's-01': { status: 'present' },
      's-02': { status: 'present' },
      's-03': { status: 'late', note: 'Đến muộn 10 phút' },
      's-04': { status: 'present' },
      's-05': { status: 'excused', note: 'Bị ốm có đơn phụ huynh' }
    }
  },
  {
    id: 'att-2',
    date: '2026-11-07',
    classId: 'c-10a1',
    records: {
      's-01': { status: 'present' },
      's-02': { status: 'present' },
      's-03': { status: 'present' },
      's-04': { status: 'present' },
      's-05': { status: 'present' }
    }
  },
  {
    id: 'att-3',
    date: '2026-11-08',
    classId: 'c-10a1',
    records: {
      's-01': { status: 'present' },
      's-02': { status: 'present' },
      's-03': { status: 'present' },
      's-04': { status: 'present' },
      's-05': { status: 'present' }
    }
  }
];

export const INITIAL_WEEKLY_RECORDS: WeeklyRecordItem[] = [
  // Tuần 10 (Hiện tại: 02/11/2026 - 08/11/2026)
  {
    id: 'wr-1',
    studentId: 's-01',
    weekNumber: 10,
    date: '2026-11-03',
    type: 'bonus',
    category: 'Điểm kiểm tra thường xuyên 10',
    points: 10,
    subject: 'Toán học',
    note: 'Kiểm tra 15 phút đạt điểm tối đa',
    createdByName: 'Thầy Hùng (Toán)'
  },
  {
    id: 'wr-2',
    studentId: 's-01',
    weekNumber: 10,
    date: '2026-11-05',
    type: 'bonus',
    category: 'Tích cực phát biểu xây dựng bài',
    points: 5,
    subject: 'Tiếng Anh',
    note: 'Hăng hái phát biểu và chữa bài tập ngữ pháp',
    createdByName: 'Cô Hà (Tiếng Anh)'
  },
  {
    id: 'wr-3',
    studentId: 's-02',
    weekNumber: 10,
    date: '2026-11-04',
    type: 'bonus',
    category: 'Điểm kiểm tra thường xuyên 10',
    points: 10,
    subject: 'Ngữ văn',
    note: 'Bài viết đoạn văn cảm thụ sâu sắc đạt 9.5',
    createdByName: 'Cô Mai (Văn)'
  },
  {
    id: 'wr-4',
    studentId: 's-02',
    weekNumber: 10,
    date: '2026-11-06',
    type: 'bonus',
    category: 'Gương người tốt việc tốt',
    points: 5,
    subject: 'Hoạt động đoàn',
    note: 'Tổ chức tốt buổi sinh hoạt chuyên đề lớp',
    createdByName: 'GVCN'
  },
  {
    id: 'wr-5',
    studentId: 's-03',
    weekNumber: 10,
    date: '2026-11-04',
    type: 'penalty',
    category: 'Đi học muộn',
    points: 2,
    note: 'Đi học muộn 15 phút tiết 1',
    createdByName: 'Đội Cờ Đỏ'
  },
  {
    id: 'wr-6',
    studentId: 's-03',
    weekNumber: 10,
    date: '2026-11-05',
    type: 'penalty',
    category: 'Không làm bài tập về nhà',
    points: 5,
    subject: 'Vật lý',
    note: 'Không hoàn thành bài tập giao về nhà',
    createdByName: 'Thầy Nam (Lý)'
  },
  {
    id: 'wr-7',
    studentId: 's-04',
    weekNumber: 10,
    date: '2026-11-02',
    type: 'bonus',
    category: 'Điểm kiểm tra thường xuyên 9',
    points: 8,
    subject: 'Hóa học',
    note: 'Kiểm tra miệng phản ứng hóa học đạt 9.0',
    createdByName: 'Thầy Bảo (Hóa)'
  },
  {
    id: 'wr-8',
    studentId: 's-05',
    weekNumber: 10,
    date: '2026-11-04',
    type: 'penalty',
    category: 'Nói chuyện riêng trong giờ',
    points: 2,
    subject: 'Tiếng Anh',
    note: 'Mất tập trung trong giờ giảng',
    createdByName: 'Cô Hà (Tiếng Anh)'
  },
  {
    id: 'wr-9',
    studentId: 's-09',
    weekNumber: 10,
    date: '2026-11-03',
    type: 'bonus',
    category: 'Điểm kiểm tra thường xuyên 10',
    points: 10,
    subject: 'Vật lý',
    note: 'Giải bài tập nâng cao quang học xuất sắc',
    createdByName: 'Thầy Nam (Lý)'
  },
  {
    id: 'wr-10',
    studentId: 's-14',
    weekNumber: 10,
    date: '2026-11-05',
    type: 'bonus',
    category: 'Tích cực phát biểu xây dựng bài',
    points: 5,
    subject: 'Tiếng Anh',
    note: 'Thuyết trình bài nói tiếng Anh lưu loát',
    createdByName: 'Cô Hà (Tiếng Anh)'
  },
  {
    id: 'wr-11',
    studentId: 's-20',
    weekNumber: 10,
    date: '2026-11-03',
    type: 'penalty',
    category: 'Sử dụng điện thoại trong giờ học',
    points: 10,
    subject: 'Lịch sử',
    note: 'Bị nhắc nhở và tịch thu điện thoại cuối buổi',
    createdByName: 'Cô Yến (Sử)'
  },
  {
    id: 'wr-12',
    studentId: 's-20',
    weekNumber: 10,
    date: '2026-11-06',
    type: 'penalty',
    category: 'Không chuẩn bị bài',
    points: 5,
    subject: 'Toán học',
    note: 'Không có vở ghi bài tập',
    createdByName: 'Thầy Hùng (Toán)'
  }
];
