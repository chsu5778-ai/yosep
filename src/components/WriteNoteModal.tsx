import React, { useState } from 'react';
import { CardColor, FontStyle, RollingNote } from '../types';
import { X, Sparkles, Send, Heart, Smile, Palette, Type, Lightbulb } from 'lucide-react';
import confetti from 'canvas-confetti';

interface WriteNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (note: Omit<RollingNote, 'id' | 'timestamp' | 'likes'>) => Promise<void>;
  teacherName: string;
}

const COLOR_OPTIONS: { id: CardColor; label: string; bg: string; border: string }[] = [
  { id: 'yellow', label: '레몬 옐로우', bg: 'bg-amber-100', border: 'border-amber-300' },
  { id: 'pink', label: '베이비 핑크', bg: 'bg-rose-100', border: 'border-rose-300' },
  { id: 'green', label: '민트 그린', bg: 'bg-emerald-100', border: 'border-emerald-300' },
  { id: 'blue', label: '스카이 블루', bg: 'bg-sky-100', border: 'border-sky-300' },
  { id: 'purple', label: '라벤더 퍼플', bg: 'bg-purple-100', border: 'border-purple-300' },
  { id: 'peach', label: '피치 오렌지', bg: 'bg-orange-100', border: 'border-orange-300' },
  { id: 'white', label: '크림 화이트', bg: 'bg-stone-50', border: 'border-stone-300' }
];

const STICKER_OPTIONS = [
  '💖', '🌸', '🍀', '🎓', '🌟', '🍎', '📚', '✨', '🧸', '☕', '🎉', '💌', '🐾', '🍧', '🕊️'
];

const INSPIRATION_PROMPTS = [
  '선생님 수업이 세상에서 제일 재미있었어요! 🌟',
  '매일 밝게 웃어주셔서 학교 올 때마다 기운이 났어요 😊',
  '선생님처럼 멋지고 따뜻한 사람이 되고 싶어요 💖',
  '임용고시 단번에 합격하실 거예요! 🍀 꼭 다시 만나요!',
  '실습 마지막 날이라니 너무 아쉬워요 ㅠㅠ 잊지 못할 거예요 🌸',
  '저희 고민 진지하게 들어주시고 격려해주셔서 감사했습니다 💌'
];

export const WriteNoteModal: React.FC<WriteNoteModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  teacherName
}) => {
  const [authorName, setAuthorName] = useState('');
  const [studentNo, setStudentNo] = useState('');
  const [content, setContent] = useState('');
  const [cardColor, setCardColor] = useState<CardColor>('yellow');
  const [emoji, setEmoji] = useState('💖');
  const [fontStyle, setFontStyle] = useState<FontStyle>('gaegu');
  const [photoUrl, setPhotoUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim()) {
      setErrorMsg('이름(작성자)을 입력해주세요!');
      return;
    }
    if (!content.trim()) {
      setErrorMsg('선생님께 전할 편지 내용을 적어주세요!');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg('');

      // Random natural tilt
      const randomRotation = Number(((Math.random() * 6) - 3).toFixed(1));

      await onSubmit({
        authorName: authorName.trim(),
        studentNo: studentNo.trim() || undefined,
        content: content.trim(),
        cardColor,
        emoji,
        fontStyle,
        rotation: randomRotation,
        photoUrl: photoUrl.trim() || undefined
      });

      // Fire festive confetti!
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      // Reset
      setContent('');
      onClose();
    } catch {
      setErrorMsg('쪽지 저장 중 문제가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedColorObj = COLOR_OPTIONS.find(c => c.id === cardColor) || COLOR_OPTIONS[0];

  const previewFontClass = 
    fontStyle === 'nanum' ? 'font-handwriting text-2xl' :
    fontStyle === 'gaegu' ? 'font-cute text-xl font-bold' :
    'font-sans text-base';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Top Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-white/20 rounded-xl">
              <Sparkles className="w-5 h-5 text-amber-100" />
            </span>
            <div>
              <h3 className="text-lg font-bold">교생선생님께 롤링페이퍼 남기기</h3>
              <p className="text-xs text-amber-100">
                {teacherName}께 소중한 추억과 감사의 마음을 전해보세요
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white/90 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {errorMsg && (
            <div className="p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl">
              ⚠️ {errorMsg}
            </div>
          )}

          {/* Author Name & Student No */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                작성자 이름 <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="예: 3반 김민우, 익명의 제자"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-sm text-stone-800"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                학번 / 번호 / 역할 (선택)
              </label>
              <input
                type="text"
                value={studentNo}
                onChange={(e) => setStudentNo(e.target.value)}
                placeholder="예: 14번, 부반장, 과학부장"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-sm text-stone-800"
              />
            </div>
          </div>

          {/* Card Color & Font Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            {/* Color Palette */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 mb-2">
                <Palette className="w-3.5 h-3.5 text-amber-600" />
                포스트잇 색상
              </label>
              <div className="flex items-center gap-2 flex-wrap">
                {COLOR_OPTIONS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCardColor(c.id)}
                    className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer ${c.bg} ${
                      cardColor === c.id
                        ? 'border-amber-600 scale-110 shadow-md ring-2 ring-amber-400/40'
                        : 'border-stone-300 hover:scale-105'
                    }`}
                    title={c.label}
                  />
                ))}
              </div>
            </div>

            {/* Handwriting Font */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 mb-2">
                <Type className="w-3.5 h-3.5 text-amber-600" />
                손글씨 스타일
              </label>
              <div className="flex gap-1.5">
                {[
                  { id: 'gaegu' as FontStyle, name: '귀여운 개구체', font: 'font-cute text-sm' },
                  { id: 'nanum' as FontStyle, name: '따뜻한 손글씨체', font: 'font-handwriting text-base' },
                  { id: 'sans' as FontStyle, name: '깔끔한 본고딕체', font: 'font-sans text-xs' }
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFontStyle(f.id)}
                    className={`flex-1 py-1.5 px-2 rounded-xl border text-center transition-all cursor-pointer ${
                      fontStyle === f.id
                        ? 'bg-amber-100 border-amber-500 text-amber-900 font-bold shadow-xs'
                        : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    <span className={f.font}>{f.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sticker Emoji Picker */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 mb-2">
              <Smile className="w-3.5 h-3.5 text-amber-600" />
              마음을 전하는 스티커
            </label>
            <div className="flex items-center gap-1.5 flex-wrap p-2 bg-stone-50 rounded-xl border border-stone-200">
              {STICKER_OPTIONS.map((stk) => (
                <button
                  key={stk}
                  type="button"
                  onClick={() => setEmoji(stk)}
                  className={`w-9 h-9 rounded-lg text-xl flex items-center justify-center transition-all cursor-pointer ${
                    emoji === stk
                      ? 'bg-white shadow-md scale-115 border border-amber-400'
                      : 'hover:bg-white/80 hover:scale-105'
                  }`}
                >
                  {stk}
                </button>
              ))}
            </div>
          </div>

          {/* Inspiration Quick Prompts */}
          <div>
            <label className="flex items-center gap-1 text-[11px] font-semibold text-stone-500 mb-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              편지 내용이 고민될 땐 클릭해보세요 (문구 추천):
            </label>
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {INSPIRATION_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setContent(prev => prev ? `${prev}\n${prompt}` : prompt)}
                  className="shrink-0 text-xs px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-full border border-amber-200 transition-colors cursor-pointer"
                >
                  + {prompt.slice(0, 16)}...
                </button>
              ))}
            </div>
          </div>

          {/* Letter Content */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              편지 내용 <span className="text-rose-500">*</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="선생님께 그동안 전하지 못했던 감사의 마음, 기억에 남는 추억, 응원의 메시지를 자유롭게 적어주세요 :)"
              rows={4}
              className={`w-full p-3.5 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-stone-900 ${previewFontClass}`}
              required
            />
          </div>

          {/* Live Preview Box */}
          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
            <span className="text-[11px] font-semibold text-stone-500 block mb-2">
              📝 실시간 미리보기:
            </span>
            <div className={`p-4 rounded-xl border ${selectedColorObj.bg} ${selectedColorObj.border} shadow-sm relative`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl">{emoji}</span>
                  <span className="font-bold text-stone-900 text-sm">
                    {authorName || '이름을 입력하세요'}
                  </span>
                  {studentNo && (
                    <span className="text-xs px-1.5 py-0.5 rounded bg-black/5 text-stone-600">
                      {studentNo}
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-stone-400">방금 전</span>
              </div>
              <p className={`whitespace-pre-wrap break-words text-stone-800 ${previewFontClass}`}>
                {content || '여기에 작성한 편지 내용이 나타납니다... ✨'}
              </p>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl text-stone-600 hover:bg-stone-100 font-medium text-sm transition-colors cursor-pointer"
            >
              닫기
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>저장 중...</>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>롤링페이퍼 붙이기</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
