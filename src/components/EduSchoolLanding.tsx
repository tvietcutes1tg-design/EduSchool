import React from 'react';
import { 
  GraduationCap, 
  LogIn, 
  UserPlus, 
  BookOpen, 
  Trophy, 
  Armchair, 
  CheckCircle2, 
  Star, 
  HeartHandshake, 
  Sparkles,
  School,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface EduSchoolLandingProps {
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  schoolName?: string;
  province?: string;
}

export const EduSchoolLanding: React.FC<EduSchoolLandingProps> = ({
  onOpenLogin,
  onOpenRegister,
  schoolName = 'Nền tảng Quản lý Giáo dục Toàn quốc',
  province
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-amber-50/40 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col font-sans transition-colors">
      {/* Top Header Bar */}
      <header className="h-16 px-4 md:px-8 border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="font-bold text-base md:text-lg tracking-tight text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
              EduSchool <span className="text-amber-500">★</span>
            </div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400 font-medium hidden sm:block">
              {schoolName}{province ? ` (${province})` : ''} · Năm học 2026 - 2027
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onOpenLogin}
            className="px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer min-h-[40px]"
          >
            <LogIn className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Đăng nhập</span>
          </button>
          <button
            type="button"
            onClick={onOpenRegister}
            className="px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors flex items-center gap-1.5 shadow-sm shadow-blue-500/20 cursor-pointer min-h-[40px]"
          >
            <UserPlus className="w-4 h-4" />
            <span>Tạo tài khoản</span>
          </button>
        </div>
      </header>

      {/* Hero Presentation */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 md:py-14 flex flex-col items-center">
        {/* Playful Stickers / Badges */}
        <div className="flex items-center gap-2 mb-4 px-3.5 py-1.5 bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 rounded-full text-xs font-semibold text-amber-900 dark:text-amber-300">
          <span>🎒</span>
          <span>Hệ thống Quản lý Học đường Hiện đại & Thông minh</span>
          <span>✏️</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center text-neutral-900 dark:text-neutral-50 tracking-tight max-w-3xl leading-tight">
          Sổ Quản Lý Lớp Học & Kết Nối Phụ Huynh Học Sinh
        </h1>
        
        <p className="mt-3.5 text-sm sm:text-base md:text-lg text-center text-neutral-600 dark:text-neutral-300 max-w-2xl">
          Đồng hành cùng giáo viên chủ nhiệm và phụ huynh học sinh: Theo dõi điểm số, xếp chỗ ngồi, chuyên cần và thi đua tuần minh bạch, tiện lợi trên cả máy tính và điện thoại.
        </p>

        {/* Primary CTA Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={onOpenLogin}
            className="w-full sm:w-auto px-7 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-md shadow-blue-600/25 flex items-center justify-center gap-2 text-base transition-transform active:scale-95 cursor-pointer min-h-[48px]"
          >
            <LogIn className="w-5 h-5" />
            <span>Đăng nhập hệ thống</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onOpenRegister}
            className="w-full sm:w-auto px-7 py-3.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-2xl shadow-md shadow-amber-500/25 flex items-center justify-center gap-2 text-base transition-transform active:scale-95 cursor-pointer min-h-[48px]"
          >
            <UserPlus className="w-5 h-5" />
            <span>Tạo tài khoản Giáo viên</span>
          </button>
        </div>

        {/* 3 Core Feature Cards - Vertical on Mobile */}
        <div className="mt-12 md:mt-16 w-full grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Phụ huynh */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 md:p-6 shadow-xs hover:border-blue-400 dark:hover:border-blue-700 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-2xl mb-4">
                👨‍👩‍👧‍👦
              </div>
              <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                Quản lí con em dễ dàng
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Phụ huynh chỉ cần nhập duy nhất <strong>Mã học sinh</strong> được cấp để tra cứu điểm môn học, nề nếp thi đua, thời khóa biểu và vị trí bàn ghế của con em mình. Tuyệt đối bảo mật và riêng tư.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center text-xs font-semibold text-emerald-700 dark:text-emerald-400 gap-1.5">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Tra cứu 1 chạm qua mã học sinh</span>
            </div>
          </div>

          {/* Card 2: Giáo viên */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 md:p-6 shadow-xs hover:border-blue-400 dark:hover:border-blue-700 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center text-2xl mb-4">
                📚
              </div>
              <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                Giáo viên quản lí học sinh
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                GVCN tự do thiết lập môn học theo chương trình lớp, nhập hoặc để hệ thống tự động tính điểm TBM, điểm danh chuyên cần theo công thức chuẩn và xuất báo cáo học tập nhanh chóng.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center text-xs font-semibold text-blue-700 dark:text-blue-400 gap-1.5">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Tùy biến danh mục môn học & lớp</span>
            </div>
          </div>

          {/* Card 3: Thi đua & Chỗ ngồi */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 md:p-6 shadow-xs hover:border-blue-400 dark:hover:border-blue-700 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center text-2xl mb-4">
                🏆
              </div>
              <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                Điểm số, chỗ ngồi & thi đua tuần
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Sơ đồ lớp học bố trí bục giảng, bàn giáo viên, cửa chính và bàn học sinh sinh động. Tính năng cộng điểm (+), trừ điểm (-) thi đua tuần luôn kèm lý do cụ thể, công khai và minh bạch.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center text-xs font-semibold text-amber-700 dark:text-amber-400 gap-1.5">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Ghi nhận lý do cộng/trừ chi tiết</span>
            </div>
          </div>
        </div>

        {/* Roles Access Footnote */}
        <div className="mt-12 text-center text-xs text-neutral-500 dark:text-neutral-400 max-w-xl">
          Hệ thống phân quyền 3 vai trò: <strong>Quản trị viên (Admin)</strong> kiểm soát toàn hệ thống, <strong>Giáo viên chủ nhiệm</strong> quản lý lớp được phân công, và <strong>Phụ huynh</strong> theo dõi cá nhân con em.
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-neutral-200 dark:border-neutral-800 text-center text-xs text-neutral-500 dark:text-neutral-400">
        © 2026 - 2027 EduSchool · Hệ thống quản lý trường học & sổ liên lạc điện tử chuyên nghiệp.
      </footer>
    </div>
  );
};
