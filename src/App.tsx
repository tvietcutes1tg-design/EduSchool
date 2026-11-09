import React, { useState, useEffect } from 'react';
import { 
  Student, 
  Teacher, 
  ClassRoom, 
  AttendanceRecord, 
  ScheduleItem,
  WeeklyRecordItem,
  WeeklyComment,
  SeatingLayout,
  CurrentUser,
  TeacherAccount
} from './types';
import { 
  loadInitialData, 
  saveStudents, 
  saveClasses,
  saveAttendance, 
  saveSchedule, 
  saveWeeklyRecords,
  saveWeeklyComments,
  saveSeatingLayout,
  resetAllData, 
  exportDataAsJson,
  addActivityLog,
  updateTeacherAccountProfile
} from './services/storage';
import { Navbar } from './components/Navbar';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { StudentListView } from './components/StudentListView';
import { StudentDetailModal } from './components/StudentDetailModal';
import { StudentFormModal } from './components/StudentFormModal';
import { SeatingChartView } from './components/SeatingChartView';
import { GradebookView } from './components/GradebookView';
import { AttendanceView } from './components/AttendanceView';
import { ScheduleView } from './components/ScheduleView';
import { WeeklyReportView } from './components/WeeklyReportView';
import { PrintTranscriptModal } from './components/PrintTranscriptModal';
import { LoginModal } from './components/LoginModal';
import { EduSchoolLanding } from './components/EduSchoolLanding';
import { AdminPortal } from './components/AdminPortal';
import { ClassHandoverModal } from './components/ClassHandoverModal';
import { SchoolProfileModal } from './components/SchoolProfileModal';

export default function App() {
  const initial = loadInitialData();
  const [students, setStudents] = useState<Student[]>(initial.students);
  const [teachers] = useState<Teacher[]>(initial.teachers);
  const [classes, setClasses] = useState<ClassRoom[]>(initial.classes);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(initial.attendance);
  const [schedule, setSchedule] = useState<ScheduleItem[]>(initial.schedule);
  const [weeklyRecords, setWeeklyRecords] = useState<WeeklyRecordItem[]>(initial.weeklyRecords);
  const [weeklyComments, setWeeklyComments] = useState<WeeklyComment[]>(initial.weeklyComments);
  const [seatingLayout, setSeatingLayout] = useState<SeatingLayout>(initial.seatingLayout);

  // Authentication State: null = Landing Page, or CurrentUser (admin, teacher, student/parent)
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(() => {
    const saved = localStorage.getItem('eduschool_current_user_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    // Default logged in user for immediate preview: GVCN Nguyễn Văn Hùng
    return {
      role: 'teacher',
      id: 'GV-01',
      name: 'Thầy Nguyễn Văn Hùng',
      code: 'GV-01',
      title: 'GVCN Lớp 10A1 · THPT Gia Viễn A',
      avatarInitial: 'NVH',
      className: '10A1',
      schoolName: 'Trường THPT Gia Viễn A',
      province: 'Ninh Bình',
      username: 'nguyenvanhung'
    };
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginInitialMode, setLoginInitialMode] = useState<'login' | 'register'>('login');
  const [isHandoverModalOpen, setIsHandoverModalOpen] = useState(false);
  const [isSchoolProfileModalOpen, setIsSchoolProfileModalOpen] = useState(false);

  const isReadOnly = currentUser?.role === 'student';
  const parentStudentId = currentUser?.role === 'student' ? (currentUser.studentId || 's-01') : undefined;

  const handleSwitchUser = (user: CurrentUser) => {
    setCurrentUser(user);
    localStorage.setItem('eduschool_current_user_v1', JSON.stringify(user));
  };

  const handleLogout = () => {
    if (currentUser) {
      addActivityLog(
        currentUser.username || currentUser.name,
        currentUser.role === 'teacher' ? 'teacher' : currentUser.role === 'admin' ? 'admin' : 'student',
        'Đăng xuất',
        `Đăng xuất khỏi hệ thống (${currentUser.name})`
      );
    }
    setCurrentUser(null);
    localStorage.removeItem('eduschool_current_user_v1');
  };

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [selectedSemester, setSelectedSemester] = useState<'HK1' | 'HK2'>('HK1');

  // Dynamic Class Resolution for GVCN / Parent
  const homeroomClass: ClassRoom = (currentUser?.role === 'teacher' && currentUser.className)
    ? (classes.find(c => c.name.toLowerCase() === currentUser.className?.toLowerCase()) || {
        id: `c-${currentUser.className.toLowerCase().replace(/\s+/g, '')}`,
        name: currentUser.className,
        grade: parseInt(currentUser.className.match(/\d+/)?.[0] || '10', 10),
        schoolYear: '2026 - 2027',
        homeroomTeacherId: currentUser.id,
        roomNumber: `Phòng ${currentUser.className}`,
        maxStudents: 45,
        schoolName: currentUser.schoolName || 'Trường THPT Gia Viễn A',
        province: currentUser.province || 'Ninh Bình'
      })
    : (classes.find(c => c.id === 'c-10a1') || classes[0] || {
        id: 'c-10a1',
        name: '10A1',
        grade: 10,
        schoolYear: '2026 - 2027',
        homeroomTeacherId: 'GV-01',
        roomNumber: 'Phòng 101',
        maxStudents: 45,
        schoolName: 'Trường THPT Gia Viễn A',
        province: 'Ninh Bình'
      });

  // Dynamic active school name and province
  const activeSchoolName = currentUser?.schoolName || homeroomClass.schoolName || 'Trường THPT Gia Viễn A';
  const activeProvince = currentUser?.province || homeroomClass.province || 'Ninh Bình';

  // Dark mode
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Modals state
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isStudentFormOpen, setIsStudentFormOpen] = useState(false);
  const [printingStudent, setPrintingStudent] = useState<Student | null>(null);

  // Persistence handlers
  const handleSaveStudent = (newOrUpdated: Student) => {
    if (isReadOnly) return;
    const exists = students.some(s => s.id === newOrUpdated.id);
    let updated: Student[];
    if (exists) {
      updated = students.map(s => s.id === newOrUpdated.id ? newOrUpdated : s);
    } else {
      updated = [newOrUpdated, ...students];
    }
    setStudents(updated);
    saveStudents(updated);
    if (viewingStudent?.id === newOrUpdated.id) {
      setViewingStudent(newOrUpdated);
    }
  };

  const handleDeleteStudent = (studentId: string) => {
    if (isReadOnly) return;
    const updated = students.filter(s => s.id !== studentId);
    setStudents(updated);
    saveStudents(updated);
    if (viewingStudent?.id === studentId) {
      setViewingStudent(null);
    }
  };

  const handleUpdateStudentGrades = (updatedStudents: Student[]) => {
    if (isReadOnly) return;
    setStudents(updatedStudents);
    saveStudents(updatedStudents);
    if (viewingStudent) {
      const found = updatedStudents.find(s => s.id === viewingStudent.id);
      if (found) setViewingStudent(found);
    }
  };

  const handleUpdateAttendance = (updatedAttendance: AttendanceRecord[]) => {
    if (isReadOnly) return;
    setAttendance(updatedAttendance);
    saveAttendance(updatedAttendance);
  };

  const handleUpdateSchedule = (updatedSchedule: ScheduleItem[]) => {
    if (isReadOnly) return;
    setSchedule(updatedSchedule);
    saveSchedule(updatedSchedule);
  };

  const handleUpdateWeeklyRecords = (updatedRecords: WeeklyRecordItem[]) => {
    if (isReadOnly) return;
    setWeeklyRecords(updatedRecords);
    saveWeeklyRecords(updatedRecords);
  };

  const handleUpdateWeeklyComments = (updatedComments: WeeklyComment[]) => {
    if (isReadOnly) return;
    setWeeklyComments(updatedComments);
    saveWeeklyComments(updatedComments);
  };

  const handleUpdateSeatingLayout = (updatedLayout: SeatingLayout) => {
    if (isReadOnly) return;
    setSeatingLayout(updatedLayout);
    saveSeatingLayout(updatedLayout);
  };

  const handleResetData = () => {
    if (isReadOnly) return;
    resetAllData();
    const fresh = loadInitialData();
    setStudents(fresh.students);
    setAttendance(fresh.attendance);
    setSchedule(fresh.schedule);
    setWeeklyRecords(fresh.weeklyRecords);
    setWeeklyComments(fresh.weeklyComments);
    setSeatingLayout(fresh.seatingLayout);
  };

  const handleExportBackup = () => {
    exportDataAsJson({
      students,
      teachers,
      classes,
      attendance,
      schedule,
      weeklyRecords,
      weeklyComments,
      seatingLayout
    });
  };

  // Handover Success Handler
  const handleHandoverSuccess = (_updatedAccount: TeacherAccount, newClassName: string) => {
    // If the class was renamed, update classes list
    const updatedClasses = classes.map(c => c.id === homeroomClass.id ? { ...c, name: newClassName } : c);
    setClasses(updatedClasses);
    saveClasses(updatedClasses);
    setIsHandoverModalOpen(false);
    // Log out current teacher to allow new teacher to log in
    handleLogout();
  };

  // School Profile & Info Update Handler (Requirement 22.3)
  const handleSaveSchoolProfile = (updated: {
    schoolName: string;
    province: string;
    fullName: string;
    phone?: string;
    email?: string;
  }) => {
    if (!currentUser) return;

    // 1. Update in teacher accounts storage
    if (currentUser.id || currentUser.username) {
      updateTeacherAccountProfile(currentUser.id, {
        schoolName: updated.schoolName,
        province: updated.province,
        fullName: updated.fullName,
        phone: updated.phone,
        email: updated.email
      });
    }

    // 2. Update homeroom class in classes state & storage
    const updatedClasses = classes.map(c => 
      c.id === homeroomClass.id 
        ? { ...c, schoolName: updated.schoolName, province: updated.province } 
        : c
    );
    setClasses(updatedClasses);
    saveClasses(updatedClasses);

    // 3. Update currentUser state & localStorage
    const updatedUser: CurrentUser = {
      ...currentUser,
      name: updated.fullName,
      schoolName: updated.schoolName,
      province: updated.province,
      title: `GVCN Lớp ${homeroomClass.name} · ${updated.schoolName}`
    };
    handleSwitchUser(updatedUser);

    // 4. Log activity
    addActivityLog(
      currentUser.username || currentUser.name,
      'teacher',
      'Cập nhật trường học & tài khoản',
      `Giáo viên ${updated.fullName} cập nhật tên trường thành "${updated.schoolName}" (${updated.province})`
    );
  };

  // Filter students for active class
  const classStudents = students.filter(s => {
    if (homeroomClass.id === 'c-10a1') {
      return s.classId === 'c-10a1';
    }
    return s.classId === homeroomClass.id;
  });

  // Effective students to display (for new classes without students, fallback to sample or classStudents)
  const displayStudents = classStudents.length > 0 ? classStudents : students;

  // 1. If not logged in, show EduSchool Landing Page
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 font-sans">
        <EduSchoolLanding
          schoolName={activeSchoolName}
          province={activeProvince}
          onOpenLogin={() => {
            setLoginInitialMode('login');
            setIsLoginModalOpen(true);
          }}
          onOpenRegister={() => {
            setLoginInitialMode('register');
            setIsLoginModalOpen(true);
          }}
        />

        <LoginModal
          isOpen={isLoginModalOpen}
          initialMode={loginInitialMode}
          currentUser={currentUser}
          students={students}
          classes={classes}
          onClose={() => setIsLoginModalOpen(false)}
          onLogin={handleSwitchUser}
        />
      </div>
    );
  }

  // 2. If logged in as ADMIN, show Full Admin Portal
  if (currentUser.role === 'admin') {
    return (
      <AdminPortal
        currentUser={currentUser}
        students={students}
        classes={classes}
        onLogout={handleLogout}
        onUpdateClasses={setClasses}
      />
    );
  }

  // 3. Main GVCN / Parent Portal Interface
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col font-sans antialiased selection:bg-blue-500 selection:text-white transition-colors">
      {/* Top Navbar */}
      <Navbar
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
        selectedSemester={selectedSemester}
        onSemesterChange={setSelectedSemester}
        onResetData={handleResetData}
        onExportBackup={handleExportBackup}
        onPrintReport={() => {
          if (displayStudents.length > 0) {
            setPrintingStudent(parentStudentId ? (students.find(s => s.id === parentStudentId) || displayStudents[0]) : displayStudents[0]);
          } else {
            window.print();
          }
        }}
        schoolName={activeSchoolName}
        province={activeProvince}
        currentUser={currentUser}
        className={homeroomClass.name}
        onOpenLogin={() => {
          setLoginInitialMode('login');
          setIsLoginModalOpen(true);
        }}
        onLogout={handleLogout}
        onOpenHandover={() => setIsHandoverModalOpen(true)}
        onOpenSchoolProfile={() => setIsSchoolProfileModalOpen(true)}
      />

      {/* Main Layout Area */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
          }}
          studentCount={displayStudents.length}
          currentUser={currentUser}
          className={homeroomClass.name}
          schoolName={activeSchoolName}
          province={activeProvince}
          onOpenLogin={() => {
            setLoginInitialMode('login');
            setIsLoginModalOpen(true);
          }}
          onLogout={handleLogout}
          onOpenHandover={() => setIsHandoverModalOpen(true)}
          onOpenSchoolProfile={() => setIsSchoolProfileModalOpen(true)}
        />

        {/* Content Viewport */}
        <main className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8 min-w-0 overflow-x-hidden">
          {/* Read-Only Notice Banner for Parents */}
          {isReadOnly && (
            <div className="mb-5 p-3.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900 dark:text-amber-200 shadow-xs">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">🔒</span>
                <div>
                  <div className="font-bold text-amber-950 dark:text-amber-100">
                    Cổng Tra Cứu Phụ Huynh Học Sinh · {activeSchoolName}
                  </div>
                  <div className="text-amber-800 dark:text-amber-300 mt-0.5">
                    Đang xem thông tin học sinh: <strong>{currentUser.name}</strong> ({currentUser.code}) thuộc Lớp <strong>{homeroomClass.name}</strong> · Trường <strong>{activeSchoolName}</strong> {activeProvince ? `(${activeProvince})` : ''}. Toàn bộ điểm số, hạnh kiểm, chuyên cần và vị trí chỗ ngồi đều ở chế độ chỉ đọc.
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setLoginInitialMode('login');
                    setIsLoginModalOpen(true);
                  }}
                  className="px-3 py-1.5 bg-amber-200/80 hover:bg-amber-300/80 dark:bg-amber-900/60 dark:hover:bg-amber-800/60 rounded-lg font-semibold text-amber-950 dark:text-amber-100 whitespace-nowrap transition-colors cursor-pointer text-xs"
                >
                  Đổi tài khoản
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-3 py-1.5 bg-rose-100 hover:bg-rose-200 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 rounded-lg font-semibold whitespace-nowrap transition-colors cursor-pointer text-xs"
                >
                  Đăng xuất
                </button>
              </div>
            </div>
          )}

          {activeTab === 'dashboard' && (
            <DashboardView
              students={displayStudents}
              classroom={homeroomClass}
              attendance={attendance}
              weeklyRecords={weeklyRecords}
              weeklyComments={weeklyComments}
              seatingLayout={seatingLayout}
              selectedSemester={selectedSemester}
              isReadOnly={isReadOnly}
              parentStudentId={parentStudentId}
              schoolName={activeSchoolName}
              province={activeProvince}
              onNavigate={(tab) => {
                setActiveTab(tab);
              }}
              onOpenAddStudent={() => {
                if (isReadOnly) return;
                setEditingStudent(null);
                setIsStudentFormOpen(true);
              }}
              onSelectStudent={(st) => setViewingStudent(st)}
              onOpenHandover={() => setIsHandoverModalOpen(true)}
            />
          )}

          {activeTab === 'students' && (
            <StudentListView
              students={displayStudents}
              classes={classes}
              selectedSemester={selectedSemester}
              isReadOnly={isReadOnly}
              onAddStudent={() => {
                if (isReadOnly) return;
                setEditingStudent(null);
                setIsStudentFormOpen(true);
              }}
              onViewStudent={(st) => setViewingStudent(st)}
              onEditStudent={(st) => {
                if (isReadOnly) return;
                setEditingStudent(st);
                setIsStudentFormOpen(true);
              }}
              onDeleteStudent={handleDeleteStudent}
              onPrintStudent={(st) => setPrintingStudent(st)}
            />
          )}

          {activeTab === 'seating' && (
            <SeatingChartView
              students={displayStudents}
              classroom={homeroomClass}
              seatingLayout={seatingLayout}
              isReadOnly={isReadOnly}
              highlightStudentId={parentStudentId}
              onUpdateSeatingLayout={handleUpdateSeatingLayout}
              onViewStudent={(st) => setViewingStudent(st)}
            />
          )}

          {activeTab === 'grades' && (
            <GradebookView
              students={displayStudents}
              classroom={homeroomClass}
              attendance={attendance}
              selectedSemester={selectedSemester}
              isReadOnly={isReadOnly}
              parentStudentId={parentStudentId}
              onUpdateStudentGrades={handleUpdateStudentGrades}
            />
          )}

          {activeTab === 'attendance' && (
            <AttendanceView
              students={displayStudents}
              classroom={homeroomClass}
              attendance={attendance}
              isReadOnly={isReadOnly}
              parentStudentId={parentStudentId}
              onUpdateAttendance={handleUpdateAttendance}
            />
          )}

          {activeTab === 'weekly_report' && (
            <WeeklyReportView
              students={displayStudents}
              classroom={homeroomClass}
              weeklyRecords={weeklyRecords}
              weeklyComments={weeklyComments}
              isReadOnly={isReadOnly}
              parentStudentId={parentStudentId}
              onUpdateWeeklyRecords={handleUpdateWeeklyRecords}
              onUpdateWeeklyComments={handleUpdateWeeklyComments}
              onViewStudent={(st) => setViewingStudent(st)}
            />
          )}

          {activeTab === 'schedule' && (
            <ScheduleView
              schedule={schedule}
              classes={classes}
              teachers={teachers}
              isReadOnly={isReadOnly}
              onUpdateSchedule={handleUpdateSchedule}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      <StudentDetailModal
        student={viewingStudent}
        classes={classes}
        teachers={teachers}
        attendance={attendance}
        weeklyRecords={weeklyRecords}
        isReadOnly={isReadOnly}
        onClose={() => setViewingStudent(null)}
        onPrintTranscript={(st) => setPrintingStudent(st)}
        onEdit={(st) => {
          if (isReadOnly) return;
          setViewingStudent(null);
          setEditingStudent(st);
          setIsStudentFormOpen(true);
        }}
      />

      <StudentFormModal
        isOpen={isStudentFormOpen && !isReadOnly}
        studentToEdit={editingStudent}
        classes={classes}
        onClose={() => {
          setIsStudentFormOpen(false);
          setEditingStudent(null);
        }}
        onSave={handleSaveStudent}
      />

      <PrintTranscriptModal
        student={printingStudent}
        classes={classes}
        teachers={teachers}
        selectedSemester={selectedSemester}
        schoolName={activeSchoolName}
        province={activeProvince}
        onClose={() => setPrintingStudent(null)}
      />

      {/* Login & Registration Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        initialMode={loginInitialMode}
        currentUser={currentUser}
        students={students}
        classes={classes}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleSwitchUser}
      />

      {/* Class Handover Modal */}
      <ClassHandoverModal
        isOpen={isHandoverModalOpen}
        currentUser={currentUser}
        classroom={homeroomClass}
        onClose={() => setIsHandoverModalOpen(false)}
        onHandoverSuccess={handleHandoverSuccess}
      />

      {/* School Profile Modal (Requirement 22.3) */}
      {currentUser && (
        <SchoolProfileModal
          isOpen={isSchoolProfileModalOpen}
          currentUser={currentUser}
          onClose={() => setIsSchoolProfileModalOpen(false)}
          onSave={handleSaveSchoolProfile}
        />
      )}
    </div>
  );
}
