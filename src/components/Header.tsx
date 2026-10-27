import React from 'react';
import { 
  Heart, 
  PlusCircle, 
  QrCode, 
  FileSpreadsheet, 
  Play, 
  FileText, 
  Palette, 
  RefreshCw,
  Sparkles,
  School
} from 'lucide-react';
import { BoardTheme, TeacherInfo } from '../types';

interface HeaderProps {
  teacherInfo: TeacherInfo;
  noteCount: number;
  theme: BoardTheme;
  onThemeChange: (theme: BoardTheme) => void;
  onOpenWriteModal: () => void;
  onOpenQRModal: () => void;
  onOpenSheetModal: () => void;
  onOpenSlideshow: () => void;
  onOpenPrdModal: () => void;
  onOpenTeacherModal: () => void;
  onRefresh: () => void;
  isSyncing: boolean;
  isDemoMode: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  teacherInfo,
  noteCount,
  theme,
  onThemeChange,
  onOpenWriteModal,
  onOpenQRModal,
  onOpenSheetModal,
  onOpenSlideshow,
  onOpenPrdModal,
  onOpenTeacherModal,
  onRefresh,
  isSyncing,
  isDemoMode
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-stone-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
        {/* Left: App Brand & Teacher info */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenTeacherModal}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-400 p-0.5 shadow-sm group-hover:scale-105 transition-transform">
              <img
                src={teacherInfo.profileImage}
                alt={teacherInfo.name}
                className="w-full h-full rounded-[14px] object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200';
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-base sm:text-lg font-bold text-stone-900 leading-tight">
                  {teacherInfo.name} 롤링페이퍼
                </h1>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold">
                  {noteCount}개 도착 💌
                </span>
              </div>
              <p className="text-[11px] text-stone-500 flex items-center gap-1">
                <span>{teacherInfo.gradeClass || teacherInfo.schoolName}</span>
                <span className="text-stone-300">•</span>
                <span className="text-rose-600 font-medium group-hover:underline">선생님 편지 보기 &gt;</span>
              </p>
            </div>
          </button>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Theme Selector (Desktop) */}
          <div className="hidden lg:flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs">
            <span className="px-1.5 text-stone-400">
              <Palette className="w-3.5 h-3.5" />
            </span>
            {[
              { id: 'chalkboard' as BoardTheme, label: '초록 칠판' },
              { id: 'cork' as BoardTheme, label: '코르크' },
              { id: 'pastel' as BoardTheme, label: '파스텔' },
              { id: 'paper' as BoardTheme, label: '모눈종이' }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => onThemeChange(t.id)}
                className={`px-2 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  theme === t.id
                    ? 'bg-white text-stone-900 shadow-xs font-bold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Refresh notes */}
          <button
            onClick={onRefresh}
            disabled={isSyncing}
            className="p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
            title="새로고침"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin text-amber-600' : ''}`} />
          </button>

          {/* PRD Modal Button */}
          <button
            onClick={onOpenPrdModal}
            className="px-2.5 py-1.5 rounded-xl border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
            title="제품 요구사항 정의서(PRD) 열람"
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">📋 PRD</span>
          </button>

          {/* Google Sheets Modal Button */}
          <button
            onClick={onOpenSheetModal}
            className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
              isDemoMode
                ? 'border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-800'
                : 'border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800'
            }`}
            title="구글 시트 연동 및 Code.gs"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span className="hidden md:inline">
              {isDemoMode ? '시트 연동(Code.gs)' : '시트 연동됨'}
            </span>
          </button>

          {/* QR & Share Button */}
          <button
            onClick={onOpenQRModal}
            className="px-3 py-1.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-800 text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <QrCode className="w-3.5 h-3.5 text-emerald-600" />
            <span>QR & 링크</span>
          </button>

          {/* Slideshow Presentation Mode */}
          <button
            onClick={onOpenSlideshow}
            className="hidden sm:flex px-3 py-1.5 rounded-xl border border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-bold transition-all items-center gap-1.5 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 text-purple-600 fill-purple-600" />
            <span>슬라이드쇼</span>
          </button>

          {/* Primary Action: Write Note Button */}
          <button
            onClick={onOpenWriteModal}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer transform hover:-translate-y-0.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>쪽지 남기기</span>
          </button>
        </div>
      </div>
    </header>
  );
};
