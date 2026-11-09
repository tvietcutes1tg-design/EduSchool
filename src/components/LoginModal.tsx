import React, { useState, useEffect } from 'react';
import { CurrentUser, Student, ClassRoom, TeacherAccount, Gender } from '../types';
import { 
  ShieldCheck, 
  User, 
  GraduationCap, 
  Lock, 
  ArrowRight, 
  X, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  RefreshCw, 
  AlertCircle, 
  Phone, 
  Mail, 
  School, 
  Sparkles, 
  Users,
  MapPin
} from 'lucide-react';
import { 
  loadTeacherAccounts, 
  saveTeacherAccounts, 
  getAdminPasswordHash, 
  verifyPassword, 
  hashPassword,
  addActivityLog,
  addLoginSession
} from '../services/storage';
import { VIETNAM_PROVINCES } from '../data/vietnamProvinces';

interface LoginModalProps {
  isOpen: boolean;
  initialMode?: 'login' | 'register';
  currentUser?: CurrentUser | null;
  students: Student[];
  classes: ClassRoom[];
  onClose: () => void;
  onLogin: (user: CurrentUser) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  initialMode = 'login',
  currentUser,
  students,
  classes,
  onClose,
  onLogin
}) => {
  const [modalMode, setModalMode] = useState<'login' | 'register'>(initialMode);
  const [loginRole, setLoginRole] = useState<'admin' | 'teacher' | 'parent'>('teacher');

  // Sync mode when opening
  useEffect(() => {
    if (isOpen) {
      setModalMode(initialMode);
      setErrors({});
      setGeneralError(null);
      generateCaptcha();
    }
  }, [isOpen, initialMode]);

  // Login form state
  const [adminUsername, setAdminUsername] = useState('admin123');
  const [adminPassword, setAdminPassword] = useState('0978102756');

  const [teacherUsername, setTeacherUsername] = useState('nguyenvanhung');
  const [teacherPassword, setTeacherPassword] = useState('123456');

  const [parentStudentCode, setParentStudentCode] = useState('s-01');

  // Register form state (GVCN)
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regFullName, setRegFullName] = useState('');
  const [regGender, setRegGender] = useState<Gender>('Nam');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regSchoolName, setRegSchoolName] = useState('');
  const [regProvince, setRegProvince] = useState<string>('Ninh Bình');
  const [regClassName, setRegClassName] = useState('10A1');
  const [regCaptchaInput, setRegCaptchaInput] = useState('');

  // CAPTCHA generator
  const [captchaCode, setCaptchaCode] = useState('4829');

  const generateCaptcha = () => {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
    setRegCaptchaInput('');
  };

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // -------------------------------------------------------------
  // Admin Login Handler
  // -------------------------------------------------------------
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);

    const storedHash = getAdminPasswordHash();
    if (adminUsername.trim() === 'admin123' && verifyPassword(adminPassword, storedHash)) {
      addLoginSession('admin123', 'admin', 'success');
      addActivityLog('admin123', 'admin', 'Đăng nhập', 'Đăng nhập tài khoản Quản trị viên hệ thống');
      onLogin({
        role: 'admin',
        id: 'admin-01',
        name: 'Quản Trị Viên (Admin)',
        code: 'ADMIN',
        title: 'Quản trị viên Hệ thống Toàn trường',
        avatarInitial: 'AD',
        username: 'admin123'
      });
      onClose();
    } else {
      addLoginSession(adminUsername, 'admin', 'failed');
      setGeneralError('Tên tài khoản hoặc mật khẩu Quản trị viên không chính xác!');
    }
  };

  // -------------------------------------------------------------
  // Teacher Login Handler
  // -------------------------------------------------------------
  const handleTeacherLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);

    const accounts = loadTeacherAccounts();
    const cleanUsername = teacherUsername.trim().toLowerCase();
    const account = accounts.find(a => a.username.toLowerCase() === cleanUsername);

    if (!account) {
      addLoginSession(cleanUsername, 'teacher', 'failed');
      setGeneralError('Tài khoản giáo viên không tồn tại trong hệ thống!');
      return;
    }

    if (account.status === 'locked') {
      addLoginSession(cleanUsername, 'teacher', 'failed');
      setGeneralError('Tài khoản này đã bị khóa bởi Quản trị viên. Vui lòng liên hệ ban giám hiệu.');
      return;
    }

    if (!verifyPassword(teacherPassword, account.passwordHash)) {
      addLoginSession(cleanUsername, 'teacher', 'failed');
      setGeneralError('Mật khẩu không chính xác. Vui lòng kiểm tra lại!');
      return;
    }

    addLoginSession(account.username, 'teacher', 'success');
    addActivityLog(account.username, 'teacher', 'Đăng nhập', `Đăng nhập quản lý Lớp ${account.className} · ${account.schoolName}`);

    onLogin({
      role: 'teacher',
      id: account.id,
      teacherId: account.id,
      name: account.fullName,
      code: account.username.toUpperCase(),
      title: `GVCN Lớp ${account.className} · ${account.schoolName}`,
      avatarInitial: account.avatarInitial || account.fullName.slice(0, 2).toUpperCase(),
      classId: account.classId,
      className: account.className,
      schoolName: account.schoolName,
      province: account.province,
      username: account.username
    });
    onClose();
  };

  // -------------------------------------------------------------
  // Parent Login Handler (Single Student Code Input)
  // -------------------------------------------------------------
  const handleParentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);

    const query = parentStudentCode.trim().toLowerCase();
    if (!query) {
      setGeneralError('Vui lòng nhập Mã học sinh!');
      return;
    }

    const matchedStudent = students.find(
      s => s.code.toLowerCase() === query || 
           s.id.toLowerCase() === query || 
           s.parentPhone.replace(/\s+/g, '') === query
    );

    if (!matchedStudent) {
      setGeneralError(`Không tìm thấy học sinh với mã "${parentStudentCode}". Vui lòng kiểm tra mã được GVCN cung cấp (Ví dụ: HS25-001 hoặc s-01).`);
      return;
    }

    // Resolve Student's School & Province based on class / teacher
    const studentClass = classes.find(c => c.id === matchedStudent.classId);
    const teacherAccounts = loadTeacherAccounts();
    const classTeacher = teacherAccounts.find(t => 
      t.classId === matchedStudent.classId || 
      (studentClass && t.className.toLowerCase() === studentClass.name.toLowerCase())
    );
    const matchedSchoolName = studentClass?.schoolName || classTeacher?.schoolName || matchedStudent.schoolName || 'Trường THPT Gia Viễn A';
    const matchedProvince = studentClass?.province || classTeacher?.province || matchedStudent.province || 'Ninh Bình';

    addLoginSession(matchedStudent.code, 'student', 'success');
    addActivityLog(matchedStudent.code, 'student', 'Tra cứu phụ huynh', `Phụ huynh tra cứu thông tin học sinh ${matchedStudent.fullName} · ${matchedSchoolName}`);

    onLogin({
      role: 'student',
      id: `p-${matchedStudent.id}`,
      studentId: matchedStudent.id,
      classId: matchedStudent.classId,
      className: studentClass?.name || '10A1',
      name: `Phụ huynh em ${matchedStudent.fullName}`,
      code: matchedStudent.code,
      title: `Phụ huynh học sinh · Lớp ${studentClass ? studentClass.name : '10A1'}`,
      avatarInitial: 'PH',
      schoolName: matchedSchoolName,
      province: matchedProvince
    });
    onClose();
  };

  // -------------------------------------------------------------
  // Teacher Registration Handler (GVCN)
  // -------------------------------------------------------------
  const handleRegisterTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);
    setSuccessMessage(null);
    const newErrors: Record<string, string> = {};

    // Validate fields
    if (!regUsername.trim()) newErrors.username = 'Vui lòng nhập tên tài khoản';
    else if (regUsername.trim().length < 4) newErrors.username = 'Tên tài khoản tối thiểu 4 ký tự';

    if (!regPassword) newErrors.password = 'Vui lòng nhập mật khẩu';
    else if (regPassword.length < 6) newErrors.password = 'Mật khẩu tối thiểu 6 ký tự';

    if (!regFullName.trim()) newErrors.fullName = 'Vui lòng nhập họ và tên';

    const phoneRegex = /^[0-9]{9,11}$/;
    if (!regPhone.trim()) newErrors.phone = 'Vui lòng nhập số điện thoại';
    else if (!phoneRegex.test(regPhone.trim().replace(/\s+/g, ''))) newErrors.phone = 'Số điện thoại không hợp lệ (9 - 11 chữ số)';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regEmail.trim()) newErrors.email = 'Vui lòng nhập địa chỉ Gmail';
    else if (!emailRegex.test(regEmail.trim())) newErrors.email = 'Địa chỉ Gmail không đúng định dạng';

    // School Name & Province (Requirement 22.1)
    if (!regSchoolName.trim()) {
      newErrors.schoolName = 'Vui lòng nhập tên trường đang công tác';
    }

    if (!regProvince.trim()) {
      newErrors.province = 'Vui lòng chọn tỉnh/thành phố tương ứng';
    }

    if (!regClassName.trim()) newErrors.className = 'Vui lòng nhập tên lớp';

    if (!regCaptchaInput.trim()) newErrors.captcha = 'Vui lòng nhập mã CAPTCHA';
    else if (regCaptchaInput.trim().toUpperCase() !== captchaCode.toUpperCase()) {
      newErrors.captcha = 'Mã CAPTCHA không chính xác!';
    }

    // Check duplicate username
    const accounts = loadTeacherAccounts();
    const cleanUsername = regUsername.trim().toLowerCase();
    if (accounts.some(a => a.username.toLowerCase() === cleanUsername) || cleanUsername === 'admin123') {
      newErrors.username = 'Tên tài khoản này đã được sử dụng. Vui lòng chọn tên khác!';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Generate class ID based on className
    const cleanClassName = regClassName.trim().toUpperCase();
    const classId = `c-${cleanClassName.toLowerCase().replace(/[^a-z0-9]/g, '')}`;

    const newTeacherAccount: TeacherAccount = {
      id: `ta-${Date.now()}`,
      username: cleanUsername,
      passwordHash: hashPassword(regPassword),
      fullName: regFullName.trim(),
      gender: regGender,
      phone: regPhone.trim(),
      email: regEmail.trim(),
      className: cleanClassName,
      classId: classId,
      schoolName: regSchoolName.trim(),
      province: regProvince.trim(),
      createdAt: new Date().toISOString().slice(0, 10),
      status: 'active',
      avatarInitial: regFullName.trim().slice(0, 2).toUpperCase()
    };

    const updatedAccounts = [newTeacherAccount, ...accounts];
    saveTeacherAccounts(updatedAccounts);
    addActivityLog(cleanUsername, 'teacher', 'Đăng ký tài khoản', `Giáo viên ${regFullName} tạo tài khoản quản lý Lớp ${cleanClassName} · ${regSchoolName.trim()} (${regProvince.trim()})`);

    setSuccessMessage(`Đăng ký tài khoản GVCN Lớp ${cleanClassName} tại ${regSchoolName.trim()} thành công!`);

    // Auto-login newly registered teacher
    setTimeout(() => {
      onLogin({
        role: 'teacher',
        id: newTeacherAccount.id,
        teacherId: newTeacherAccount.id,
        name: newTeacherAccount.fullName,
        code: newTeacherAccount.username.toUpperCase(),
        title: `GVCN Lớp ${newTeacherAccount.className} · ${newTeacherAccount.schoolName}`,
        avatarInitial: newTeacherAccount.avatarInitial || 'GV',
        classId: newTeacherAccount.classId,
        className: newTeacherAccount.className,
        schoolName: newTeacherAccount.schoolName,
        province: newTeacherAccount.province,
        username: newTeacherAccount.username
      });
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div 
        className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden my-6 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Tabs: Đăng Nhập vs Tạo Tài Khoản */}
        <div className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-800/50 p-2 flex items-center justify-between">
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => {
                setModalMode('login');
                setGeneralError(null);
                setErrors({});
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                modalMode === 'login'
                  ? 'bg-white dark:bg-neutral-900 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
              }`}
            >
              Đăng Nhập
            </button>
            <button
              type="button"
              onClick={() => {
                setModalMode('register');
                setGeneralError(null);
                setErrors({});
                generateCaptcha();
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                modalMode === 'register'
                  ? 'bg-white dark:bg-neutral-900 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
              }`}
            >
              Tạo Tài Khoản GVCN
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {generalError && (
            <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{generalError}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 rounded-xl text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 1: ĐĂNG NHẬP (ADMIN / GVCN / PHỤ HUYNH)                */}
          {/* ========================================================= */}
          {modalMode === 'login' && (
            <div className="space-y-5">
              {/* Role Selector Tabs */}
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-2xl">
                <button
                  type="button"
                  onClick={() => {
                    setLoginRole('teacher');
                    setGeneralError(null);
                  }}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer ${
                    loginRole === 'teacher'
                      ? 'bg-white dark:bg-neutral-900 text-blue-600 dark:text-blue-400 shadow-xs'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                  <span>Giáo Viên</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setLoginRole('parent');
                    setGeneralError(null);
                  }}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer ${
                    loginRole === 'parent'
                      ? 'bg-white dark:bg-neutral-900 text-amber-600 dark:text-amber-400 shadow-xs'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
                  }`}
                >
                  <User className="w-3.5 h-3.5 shrink-0" />
                  <span>Phụ Huynh</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setLoginRole('admin');
                    setGeneralError(null);
                  }}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer ${
                    loginRole === 'admin'
                      ? 'bg-white dark:bg-neutral-900 text-purple-600 dark:text-purple-400 shadow-xs'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5 shrink-0" />
                  <span>Quản Trị</span>
                </button>
              </div>

              {/* 1.1 FORM: GIÁO VIÊN CHỦ NHIỆM */}
              {loginRole === 'teacher' && (
                <form onSubmit={handleTeacherLogin} className="space-y-4">
                  <div className="p-3 bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-xl text-xs text-blue-900 dark:text-blue-200">
                    Đăng nhập tài khoản Giáo viên chủ nhiệm để quản lý điểm, chuyên cần, xếp chỗ ngồi và thi đua tuần của lớp bạn.
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                      Tên tài khoản
                    </label>
                    <input
                      type="text"
                      value={teacherUsername}
                      onChange={(e) => setTeacherUsername(e.target.value)}
                      placeholder="Ví dụ: nguyenvanhung"
                      className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                      Mật khẩu
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={teacherPassword}
                        onChange={(e) => setTeacherPassword(e.target.value)}
                        placeholder="Nhập mật khẩu"
                        className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-neutral-400 hover:text-neutral-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer transition-colors min-h-[44px]"
                    >
                      <ArrowRight className="w-4 h-4" />
                      <span>Đăng Nhập Giáo Viên</span>
                    </button>
                  </div>

                  <div className="p-3 bg-neutral-50 dark:bg-neutral-800/60 rounded-xl border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-500 space-y-1">
                    <div className="font-semibold text-neutral-700 dark:text-neutral-300">Tài khoản GVCN mẫu có sẵn:</div>
                    <div className="font-mono text-[11px] text-blue-600 dark:text-blue-400">
                      • nguyenvanhung / 123456 (THPT Gia Viễn A · Lớp 10A1)
                    </div>
                    <div className="font-mono text-[11px] text-blue-600 dark:text-blue-400">
                      • tranphuongmai / 123456 (THPT Chuyên Lương Văn Tụy · Lớp 10B8)
                    </div>
                  </div>
                </form>
              )}

              {/* 1.2 FORM: PHỤ HUYNH HỌC SINH */}
              {loginRole === 'parent' && (
                <form onSubmit={handleParentLogin} className="space-y-4">
                  <div className="p-3 bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-xl text-xs text-amber-900 dark:text-amber-200">
                    Phụ huynh nhập <strong>Mã học sinh</strong> do Giáo viên chủ nhiệm cung cấp để truy cập sổ liên lạc cá nhân của con em mình (Chế độ chỉ xem).
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                      Mã học sinh tra cứu
                    </label>
                    <input
                      type="text"
                      value={parentStudentCode}
                      onChange={(e) => setParentStudentCode(e.target.value)}
                      placeholder="Ví dụ: s-01 hoặc HS25-001"
                      className="w-full px-3.5 py-2.5 text-sm font-mono font-bold uppercase rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                      required
                    />
                    <div className="text-[11px] text-neutral-500 mt-1">
                      Bạn có thể thử các mã mẫu: <span className="font-mono font-bold text-blue-600 cursor-pointer" onClick={() => setParentStudentCode('s-01')}>s-01</span> (Nguyễn Minh Quân), <span className="font-mono font-bold text-blue-600 cursor-pointer" onClick={() => setParentStudentCode('s-02')}>s-02</span> (Trần Thị Mai Anh), <span className="font-mono font-bold text-blue-600 cursor-pointer" onClick={() => setParentStudentCode('s-03')}>s-03</span>.
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm rounded-xl shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer transition-colors min-h-[44px]"
                    >
                      <User className="w-4 h-4" />
                      <span>Truy Cập Sổ Liên Lạc Con Em</span>
                    </button>
                  </div>
                </form>
              )}

              {/* 1.3 FORM: QUẢN TRỊ VIÊN ADMIN */}
              {loginRole === 'admin' && (
                <form onSubmit={handleAdminLogin} className="space-y-4">
                  <div className="p-3 bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900 rounded-xl text-xs text-purple-900 dark:text-purple-200">
                    Cổng quản trị viên cấp cao toàn trường: Quản lý toàn bộ giáo viên, các lớp, danh bạ học sinh và nhật ký bảo mật.
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                      Tài khoản Quản trị
                    </label>
                    <input
                      type="text"
                      value={adminUsername}
                      onChange={(e) => setAdminUsername(e.target.value)}
                      placeholder="admin123"
                      className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                      Mật khẩu Quản trị
                    </label>
                    <input
                      type="password"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="0978102756"
                      className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-xl shadow-md shadow-purple-500/20 flex items-center justify-center gap-2 cursor-pointer transition-colors min-h-[44px]"
                    >
                      <Lock className="w-4 h-4" />
                      <span>Đăng Nhập Quản Trị Viên</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: TẠO TÀI KHOẢN GIÁO VIÊN CHỦ NHIỆM                   */}
          {/* ========================================================= */}
          {modalMode === 'register' && (
            <form onSubmit={handleRegisterTeacher} className="space-y-3.5">
              <div className="p-3 bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-xl text-xs text-blue-900 dark:text-blue-200">
                Điền đầy đủ thông tin để khởi tạo tài khoản Giáo viên chủ nhiệm và thiết lập lớp học cùng trường công tác của bạn.
              </div>

              {/* 1. Tên tài khoản */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                  Tên tài khoản <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  placeholder="Ví dụ: hung.nguyen, gv_10b8..."
                  className={`w-full px-3 py-2 text-sm rounded-xl bg-neutral-50 dark:bg-neutral-800 border ${
                    errors.username ? 'border-rose-500' : 'border-neutral-300 dark:border-neutral-700'
                  } focus:outline-hidden focus:ring-2 focus:ring-blue-500`}
                />
                {errors.username && <div className="text-xs text-rose-500 mt-1 font-medium">{errors.username}</div>}
              </div>

              {/* 2. Mật khẩu */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                  Mật khẩu <span className="text-rose-500">*</span>
                </label>
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Tối thiểu 6 ký tự"
                  className={`w-full px-3 py-2 text-sm rounded-xl bg-neutral-50 dark:bg-neutral-800 border ${
                    errors.password ? 'border-rose-500' : 'border-neutral-300 dark:border-neutral-700'
                  } focus:outline-hidden focus:ring-2 focus:ring-blue-500`}
                />
                {errors.password && <div className="text-xs text-rose-500 mt-1 font-medium">{errors.password}</div>}
              </div>

              {/* 3. Họ và tên */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                  Họ và tên <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn Hùng"
                  className={`w-full px-3 py-2 text-sm rounded-xl bg-neutral-50 dark:bg-neutral-800 border ${
                    errors.fullName ? 'border-rose-500' : 'border-neutral-300 dark:border-neutral-700'
                  } focus:outline-hidden focus:ring-2 focus:ring-blue-500`}
                />
                {errors.fullName && <div className="text-xs text-rose-500 mt-1 font-medium">{errors.fullName}</div>}
              </div>

              {/* 4. Giới tính */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                  Giới tính <span className="text-rose-500">*</span>
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="regGender"
                      checked={regGender === 'Nam'}
                      onChange={() => setRegGender('Nam')}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span>Nam</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="regGender"
                      checked={regGender === 'Nữ'}
                      onChange={() => setRegGender('Nữ')}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span>Nữ</span>
                  </label>
                </div>
              </div>

              {/* 5. Số điện thoại & Gmail */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                    Số điện thoại <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="Ví dụ: 0912345678"
                    className={`w-full px-3 py-2 text-sm rounded-xl bg-neutral-50 dark:bg-neutral-800 border ${
                      errors.phone ? 'border-rose-500' : 'border-neutral-300 dark:border-neutral-700'
                    } focus:outline-hidden focus:ring-2 focus:ring-blue-500`}
                  />
                  {errors.phone && <div className="text-xs text-rose-500 mt-1 font-medium">{errors.phone}</div>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                    Gmail <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="hung.nguyen@gmail.com"
                    className={`w-full px-3 py-2 text-sm rounded-xl bg-neutral-50 dark:bg-neutral-800 border ${
                      errors.email ? 'border-rose-500' : 'border-neutral-300 dark:border-neutral-700'
                    } focus:outline-hidden focus:ring-2 focus:ring-blue-500`}
                  />
                  {errors.email && <div className="text-xs text-rose-500 mt-1 font-medium">{errors.email}</div>}
                </div>
              </div>

              {/* 6. Tên trường học (Requirement 22.1) */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1 flex items-center gap-1.5">
                  <School className="w-3.5 h-3.5 text-blue-500" />
                  <span>Tên trường công tác <span className="text-rose-500">*</span></span>
                </label>
                <input
                  type="text"
                  value={regSchoolName}
                  onChange={(e) => setRegSchoolName(e.target.value)}
                  placeholder="Ví dụ: Trường THPT Chu Văn An, THPT Chuyên Lê Hồng Phong..."
                  className={`w-full px-3 py-2 text-sm rounded-xl bg-neutral-50 dark:bg-neutral-800 border ${
                    errors.schoolName ? 'border-rose-500' : 'border-neutral-300 dark:border-neutral-700'
                  } focus:outline-hidden focus:ring-2 focus:ring-blue-500`}
                />
                <div className="text-[11px] text-neutral-500 mt-0.5">
                  Tên trường này sẽ hiển thị xuyên suốt trên toàn bộ hệ thống lớp học của bạn.
                </div>
                {errors.schoolName && <div className="text-xs text-rose-500 mt-1 font-medium">{errors.schoolName}</div>}
              </div>

              {/* 7. Tỉnh / Thành phố (Requirement 22.1) */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-500" />
                  <span>Tỉnh / Thành phố <span className="text-rose-500">*</span></span>
                </label>
                <select
                  value={regProvince}
                  onChange={(e) => setRegProvince(e.target.value)}
                  className={`w-full px-3 py-2 text-sm rounded-xl bg-neutral-50 dark:bg-neutral-800 border ${
                    errors.province ? 'border-rose-500' : 'border-neutral-300 dark:border-neutral-700'
                  } focus:outline-hidden focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="">-- Chọn Tỉnh / Thành phố --</option>
                  {VIETNAM_PROVINCES.map((prov) => (
                    <option key={prov} value={prov}>
                      {prov}
                    </option>
                  ))}
                </select>
                {errors.province && <div className="text-xs text-rose-500 mt-1 font-medium">{errors.province}</div>}
              </div>

              {/* 8. Lớp */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                  Lớp <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={regClassName}
                  onChange={(e) => setRegClassName(e.target.value)}
                  placeholder="Ví dụ: 10A1, 10B8, 11A2..."
                  className={`w-full px-3 py-2 text-sm font-bold uppercase rounded-xl bg-neutral-50 dark:bg-neutral-800 border ${
                    errors.className ? 'border-rose-500' : 'border-neutral-300 dark:border-neutral-700'
                  } focus:outline-hidden focus:ring-2 focus:ring-blue-500`}
                />
                <div className="text-[11px] text-neutral-500 mt-0.5">
                  Giao diện và sổ điểm sẽ tự động gắn với lớp này khi bạn đăng nhập.
                </div>
                {errors.className && <div className="text-xs text-rose-500 mt-1 font-medium">{errors.className}</div>}
              </div>

              {/* 9. Mã CAPTCHA */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                  Mã xác thực CAPTCHA <span className="text-rose-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={regCaptchaInput}
                    onChange={(e) => setRegCaptchaInput(e.target.value)}
                    placeholder="Nhập mã bên phải"
                    className={`flex-1 px-3 py-2 text-sm rounded-xl bg-neutral-50 dark:bg-neutral-800 border ${
                      errors.captcha ? 'border-rose-500' : 'border-neutral-300 dark:border-neutral-700'
                    } focus:outline-hidden focus:ring-2 focus:ring-blue-500`}
                  />
                  <div className="px-4 py-2 bg-gradient-to-r from-blue-200 to-indigo-200 dark:from-neutral-700 dark:to-neutral-600 rounded-xl select-none font-mono font-black text-lg tracking-widest text-neutral-800 dark:text-neutral-100 italic border border-neutral-300 dark:border-neutral-600 shadow-inner">
                    {captchaCode}
                  </div>
                  <button
                    type="button"
                    onClick={generateCaptcha}
                    title="Đổi mã khác"
                    className="p-2 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
                {errors.captcha && <div className="text-xs text-rose-500 mt-1 font-medium">{errors.captcha}</div>}
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer transition-colors min-h-[44px]"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Xác Nhận Tạo Tài Khoản</span>
                </button>
              </div>

              <div className="text-center pt-1">
                <span className="text-xs text-neutral-500">Đã có tài khoản? </span>
                <button
                  type="button"
                  onClick={() => {
                    setModalMode('login');
                    setGeneralError(null);
                  }}
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                >
                  Quay lại Đăng nhập
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
