import React, { useState } from 'react';
import { TeacherInfo } from '../types';
import { X, Heart, Save, Sparkles, School, Calendar, BookOpen, User } from 'lucide-react';

interface TeacherProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacherInfo: TeacherInfo;
  onSave: (info: TeacherInfo) => void;
}

export const TeacherProfileModal: React.FC<TeacherProfileModalProps> = ({
  isOpen,
  onClose,
  teacherInfo,
  onSave
}) => {
  const [formData, setFormData] = useState<TeacherInfo>({ ...teacherInfo });
  const [isEditing, setIsEditing] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-6">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-amber-500 via-amber-600 to-rose-500 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-white/20 rounded-xl">
              <Heart className="w-5 h-5 text-rose-100" />
            </span>
            <div>
              <h3 className="text-lg font-bold">{formData.name} 선생님의 프로필 & 감사 편지</h3>
              <p className="text-xs text-amber-100">{formData.gradeClass} ({formData.practicumPeriod})</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white/90 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
          {!isEditing ? (
            /* View Mode */
            <div className="space-y-6">
              {/* Profile Card */}
              <div className="flex flex-col sm:flex-row items-center gap-5 p-5 bg-amber-50/70 rounded-2xl border border-amber-200">
                <div className="relative">
                  <img
                    src={formData.profileImage}
                    alt={formData.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400';
                    }}
                  />
                  <span className="absolute bottom-0 right-0 p-1.5 bg-amber-500 text-white rounded-full text-xs shadow-xs">
                    🌸
                  </span>
                </div>

                <div className="text-center sm:text-left space-y-1">
                  <div className="inline-block px-2.5 py-0.5 rounded-full bg-amber-200/80 text-amber-900 text-xs font-semibold">
                    {formData.subject}
                  </div>
                  <h3 className="text-xl font-bold text-stone-900">{formData.name}</h3>
                  <p className="text-xs text-stone-600 flex items-center justify-center sm:justify-start gap-1">
                    <School className="w-3.5 h-3.5 text-stone-500" />
                    {formData.gradeClass}
                  </p>
                  <p className="text-xs text-stone-500 flex items-center justify-center sm:justify-start gap-1">
                    <Calendar className="w-3.5 h-3.5 text-stone-400" />
                    {formData.practicumPeriod}
                  </p>
                </div>
              </div>

              {/* Teacher's Farewell Letter to Students */}
              <div className="p-6 bg-rose-50/70 rounded-3xl border border-rose-200 shadow-xs relative">
                <div className="flex items-center gap-2 font-bold text-rose-900 text-base mb-3">
                  <Sparkles className="w-5 h-5 text-rose-500" />
                  <span>선생님이 아이들에게 남기는 마지막 감사 편지 💌</span>
                </div>
                <div className="font-cute text-stone-800 text-lg sm:text-xl whitespace-pre-wrap leading-relaxed bg-white/90 p-5 rounded-2xl border border-rose-100 shadow-inner">
                  {formData.teacherFarewellLetter || '아직 등록된 편지가 없습니다.'}
                </div>
              </div>

              {/* Edit button */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  선생님 정보 / 편지 수정하기
                </button>
              </div>
            </div>
          ) : (
            /* Edit Form */
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    교생선생님 성함
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-stone-900"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    과목 및 직책
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="예: 국어과 교육실습생"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-stone-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    학교 및 담당 학급
                  </label>
                  <input
                    type="text"
                    value={formData.gradeClass}
                    onChange={(e) => setFormData({ ...formData, gradeClass: e.target.value })}
                    placeholder="예: 햇살중학교 2학년 3반"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-stone-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    실습 기간
                  </label>
                  <input
                    type="text"
                    value={formData.practicumPeriod}
                    onChange={(e) => setFormData({ ...formData, practicumPeriod: e.target.value })}
                    placeholder="예: 2026.04.06 ~ 2026.05.01"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  선생님 프로필 사진 URL
                </label>
                <input
                  type="url"
                  value={formData.profileImage}
                  onChange={(e) => setFormData({ ...formData, profileImage: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-stone-900"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  상단 인사말 (한 줄 소개)
                </label>
                <input
                  type="text"
                  value={formData.welcomeMessage}
                  onChange={(e) => setFormData({ ...formData, welcomeMessage: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-stone-900"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  아이들에게 전하는 선생님의 감사 편지 (본문)
                </label>
                <textarea
                  value={formData.teacherFarewellLetter}
                  onChange={(e) => setFormData({ ...formData, teacherFarewellLetter: e.target.value })}
                  rows={6}
                  placeholder="아이들에게 남기고 싶은 따뜻한 인사를 적어주세요..."
                  className="w-full p-3 rounded-xl border border-stone-300 text-stone-900 font-cute text-base"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-xl font-medium cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  저장하기
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
