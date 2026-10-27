import React, { useState } from 'react';
import { RollingNote, CardColor } from '../types';
import { Heart, MessageCircle, Pin, Sparkles, Send } from 'lucide-react';

interface NoteCardProps {
  note: RollingNote;
  onLike: (id: string) => void;
  onReply: (id: string, replyText: string) => void;
}

const COLOR_STYLES: Record<CardColor, { bg: string; border: string; tape: string; text: string; pin: string }> = {
  yellow: {
    bg: 'bg-amber-100',
    border: 'border-amber-200',
    tape: 'bg-amber-200/80',
    text: 'text-amber-950',
    pin: 'bg-red-500'
  },
  pink: {
    bg: 'bg-rose-100',
    border: 'border-rose-200',
    tape: 'bg-rose-200/80',
    text: 'text-rose-950',
    pin: 'bg-rose-500'
  },
  green: {
    bg: 'bg-emerald-100',
    border: 'border-emerald-200',
    tape: 'bg-emerald-200/80',
    text: 'text-emerald-950',
    pin: 'bg-emerald-600'
  },
  blue: {
    bg: 'bg-sky-100',
    border: 'border-sky-200',
    tape: 'bg-sky-200/80',
    text: 'text-sky-950',
    pin: 'bg-sky-500'
  },
  purple: {
    bg: 'bg-purple-100',
    border: 'border-purple-200',
    tape: 'bg-purple-200/80',
    text: 'text-purple-950',
    pin: 'bg-purple-500'
  },
  peach: {
    bg: 'bg-orange-100',
    border: 'border-orange-200',
    tape: 'bg-orange-200/80',
    text: 'text-orange-950',
    pin: 'bg-amber-500'
  },
  white: {
    bg: 'bg-white',
    border: 'border-stone-200',
    tape: 'bg-stone-200/80',
    text: 'text-stone-800',
    pin: 'bg-blue-500'
  }
};

export const NoteCard: React.FC<NoteCardProps> = ({ note, onLike, onReply }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyInput, setReplyInput] = useState('');
  const [hasLiked, setHasLiked] = useState(false);

  const style = COLOR_STYLES[note.cardColor] || COLOR_STYLES.yellow;

  const fontClass = 
    note.fontStyle === 'nanum' ? 'font-handwriting text-xl sm:text-2xl leading-relaxed' :
    note.fontStyle === 'gaegu' ? 'font-cute text-lg sm:text-xl font-bold leading-relaxed' :
    'font-sans text-sm sm:text-base leading-relaxed';

  const handleLike = () => {
    if (!hasLiked) {
      setHasLiked(true);
      onLike(note.id);
    }
  };

  const submitReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (replyInput.trim()) {
      onReply(note.id, replyInput.trim());
      setIsReplying(false);
      setReplyInput('');
    }
  };

  // Convert rotation to style
  const rotationStyle = {
    transform: `rotate(${note.rotation || 0}deg)`
  };

  return (
    <div
      style={rotationStyle}
      className={`group relative flex flex-col justify-between p-5 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:z-20 border ${style.bg} ${style.border} ${style.text} min-h-[220px]`}
    >
      {/* Decorative Washi Tape / Pushpin */}
      {note.isPinned ? (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 flex items-center justify-center">
          <div className={`w-4 h-4 rounded-full ${style.pin} pushpin border border-white/60 flex items-center justify-center`}>
            <div className="w-1.5 h-1.5 rounded-full bg-white/70" />
          </div>
        </div>
      ) : (
        <div
          className={`absolute -top-2 left-1/2 -translate-x-1/2 w-16 h-4 ${style.tape} backdrop-blur-xs rounded-xs shadow-xs -rotate-1 opacity-90`}
        />
      )}

      {/* Header: Sticker & Author Info */}
      <div className="flex items-start justify-between gap-2 mb-3 pt-1">
        <div className="flex items-center gap-2">
          <span className="text-2xl filter drop-shadow-xs select-none animate-pulse">
            {note.emoji || '💖'}
          </span>
          <div>
            <h4 className="font-bold text-stone-900 text-sm sm:text-base flex items-center gap-1.5">
              {note.authorName}
              {note.studentNo && (
                <span className="text-xs font-normal px-1.5 py-0.5 rounded-full bg-black/5 text-stone-600">
                  {note.studentNo}
                </span>
              )}
            </h4>
            <span className="text-[11px] text-stone-500 block">
              {note.timestamp}
            </span>
          </div>
        </div>

        {note.isPinned && (
          <span className="flex items-center gap-0.5 text-xs font-medium text-amber-700 bg-amber-200/60 px-1.5 py-0.5 rounded-md">
            <Pin className="w-3 h-3" /> 추천
          </span>
        )}
      </div>

      {/* Content */}
      <div className={`my-2 whitespace-pre-wrap break-words flex-1 ${fontClass}`}>
        {note.content}
      </div>

      {/* Optional Photo Attachment */}
      {note.photoUrl && (
        <div className="my-2 rounded-lg overflow-hidden border border-black/10 bg-white/40 max-h-48">
          <img
            src={note.photoUrl}
            alt="첨부 사진"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        </div>
      )}

      {/* Teacher Reply Section */}
      {note.teacherReply && (
        <div className="mt-3 p-2.5 rounded-xl bg-white/80 border border-amber-300 shadow-xs text-xs sm:text-sm text-stone-800">
          <div className="flex items-center gap-1 font-semibold text-amber-700 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>선생님의 답장 💌</span>
          </div>
          <p className="font-cute text-stone-700 whitespace-pre-wrap text-sm sm:text-base">
            {note.teacherReply}
          </p>
        </div>
      )}

      {/* Teacher Reply Input (Toggleable) */}
      {isReplying && (
        <form onSubmit={submitReply} className="mt-3 flex gap-1.5">
          <input
            type="text"
            value={replyInput}
            onChange={(e) => setReplyInput(e.target.value)}
            placeholder="학생에게 따뜻한 답장을 적어주세요..."
            className="flex-1 px-2.5 py-1.5 text-xs bg-white rounded-lg border border-stone-300 focus:outline-hidden focus:ring-1 focus:ring-amber-500 text-stone-800"
            autoFocus
          />
          <button
            type="submit"
            className="px-2.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-medium flex items-center gap-1 shadow-xs"
          >
            <Send className="w-3 h-3" />
          </button>
          <button
            type="button"
            onClick={() => setIsReplying(false)}
            className="px-2 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-600 rounded-lg text-xs"
          >
            취소
          </button>
        </form>
      )}

      {/* Footer: Like & Reply Buttons */}
      <div className="mt-3 pt-2 border-t border-black/5 flex items-center justify-between text-xs text-stone-600">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full transition-all duration-200 cursor-pointer ${
            hasLiked
              ? 'bg-rose-500 text-white shadow-xs scale-105'
              : 'hover:bg-white/60 text-stone-700 hover:text-rose-600'
          }`}
          title="하트 누르기"
        >
          <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-white' : 'hover:fill-rose-500'}`} />
          <span className="font-semibold">{note.likes || 0}</span>
        </button>

        {!isReplying && (
          <button
            onClick={() => setIsReplying(true)}
            className="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-white/60 text-stone-600 hover:text-stone-900 transition-colors cursor-pointer text-[11px]"
            title="선생님 답장 쓰기"
          >
            <MessageCircle className="w-3 h-3" />
            <span>{note.teacherReply ? '답장 수정' : '선생님 답장'}</span>
          </button>
        )}
      </div>
    </div>
  );
};
