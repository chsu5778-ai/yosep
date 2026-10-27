import React, { useState, useEffect } from 'react';
import { RollingNote, TeacherInfo } from '../types';
import { X, ChevronLeft, ChevronRight, Play, Pause, Maximize, Heart, Sparkles, School } from 'lucide-react';

interface SlideshowModalProps {
  isOpen: boolean;
  onClose: () => void;
  notes: RollingNote[];
  teacherInfo: TeacherInfo;
}

export const SlideshowModal: React.FC<SlideshowModalProps> = ({
  isOpen,
  onClose,
  notes,
  teacherInfo
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState<number>(5000); // 5 seconds per note

  useEffect(() => {
    if (!isOpen || !isPlaying || notes.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % notes.length);
    }, speed);

    return () => clearInterval(interval);
  }, [isOpen, isPlaying, notes.length, speed]);

  // Handle keyboard arrow navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        setCurrentIndex((prev) => (prev + 1) % notes.length);
      } else if (e.key === 'ArrowLeft') {
        setCurrentIndex((prev) => (prev - 1 + notes.length) % notes.length);
      } else if (e.key === 'Escape') {
        onClose();
      } else if (e.key === ' ') {
        setIsPlaying((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, notes.length, onClose]);

  if (!isOpen || notes.length === 0) return null;

  const currentNote = notes[currentIndex] || notes[0];

  const fontClass =
    currentNote.fontStyle === 'nanum' ? 'font-handwriting text-3xl sm:text-4xl leading-relaxed' :
    currentNote.fontStyle === 'gaegu' ? 'font-cute text-2xl sm:text-3xl font-bold leading-relaxed' :
    'font-sans text-xl sm:text-2xl leading-relaxed';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/95 backdrop-blur-md text-white p-4 sm:p-8 animate-in fade-in duration-300">
      {/* Top Controls */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/20 rounded-xl border border-amber-500/30 text-amber-300">
            <School className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base text-amber-200">
              {teacherInfo.name} 교생선생님 환송 슬라이드쇼
            </h3>
            <p className="text-xs text-stone-400">
              {currentIndex + 1} / {notes.length}개의 소중한 편지
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Speed Toggle */}
          <select
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="bg-stone-800 text-stone-300 text-xs px-2.5 py-1.5 rounded-lg border border-stone-700 cursor-pointer"
          >
            <option value={3000}>3초</option>
            <option value={5000}>5초 (기본)</option>
            <option value={8000}>8초 (여유롭게)</option>
          </select>

          {/* Play/Pause */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl border border-stone-700 transition-colors cursor-pointer"
            title={isPlaying ? '일시 정지 (스페이스바)' : '자동 재생 (스페이스바)'}
          >
            {isPlaying ? <Pause className="w-5 h-5 text-amber-400" /> : <Play className="w-5 h-5 text-emerald-400" />}
          </button>

          {/* Close */}
          <button
            onClick={onClose}
            className="p-2 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl border border-stone-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Slide Card Area */}
      <div className="relative w-full max-w-3xl flex flex-col items-center justify-center">
        {/* Previous Button */}
        <button
          onClick={() => setCurrentIndex((prev) => (prev - 1 + notes.length) % notes.length)}
          className="absolute -left-4 sm:-left-16 top-1/2 -translate-y-1/2 p-3 rounded-full bg-stone-800/80 hover:bg-stone-700 text-white transition-all hover:scale-110 z-10 cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Current Sticky Note (Enlarged) */}
        <div
          key={currentNote.id}
          className="w-full bg-amber-100 text-stone-900 rounded-3xl p-8 sm:p-12 shadow-2xl border-4 border-amber-200/80 relative transform animate-in zoom-in-95 duration-300"
        >
          {/* Decorative Pin */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-red-500 shadow-md border-2 border-white flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-white/70" />
          </div>

          {/* Top Note Info */}
          <div className="flex items-center justify-between border-b border-amber-200/80 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <span className="text-4xl filter drop-shadow-xs">{currentNote.emoji}</span>
              <div>
                <h4 className="text-2xl font-bold text-stone-900 flex items-center gap-2">
                  {currentNote.authorName}
                  {currentNote.studentNo && (
                    <span className="text-sm font-normal px-2.5 py-0.5 rounded-full bg-black/10 text-stone-700">
                      {currentNote.studentNo}
                    </span>
                  )}
                </h4>
                <span className="text-xs text-stone-500">{currentNote.timestamp}</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 bg-rose-100 text-rose-700 rounded-full font-bold text-sm">
              <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
              <span>{currentNote.likes || 0}</span>
            </div>
          </div>

          {/* Content */}
          <div className={`whitespace-pre-wrap break-words min-h-[160px] ${fontClass} text-stone-900`}>
            {currentNote.content}
          </div>

          {/* Teacher Reply (if exists) */}
          {currentNote.teacherReply && (
            <div className="mt-6 p-4 rounded-2xl bg-white/90 border border-amber-300 shadow-xs">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 mb-1">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>선생님의 화답:</span>
              </div>
              <p className="font-cute text-stone-800 text-lg">
                {currentNote.teacherReply}
              </p>
            </div>
          )}
        </div>

        {/* Next Button */}
        <button
          onClick={() => setCurrentIndex((prev) => (prev + 1) % notes.length)}
          className="absolute -right-4 sm:-right-16 top-1/2 -translate-y-1/2 p-3 rounded-full bg-stone-800/80 hover:bg-stone-700 text-white transition-all hover:scale-110 z-10 cursor-pointer"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Bottom Progress Indicator Dots */}
      <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center gap-1.5 px-4 overflow-x-auto">
        {notes.slice(0, 30).map((n, idx) => (
          <button
            key={n.id}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2 rounded-full transition-all cursor-pointer ${
              idx === currentIndex
                ? 'w-6 bg-amber-400'
                : 'w-2 bg-stone-700 hover:bg-stone-500'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
