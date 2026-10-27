import React, { useState, useMemo } from 'react';
import { RollingNote, TeacherInfo, BoardTheme } from '../types';
import { NoteCard } from './NoteCard';
import { Search, Sparkles, Heart, Filter, MessageSquare, Plus, School, Calendar, ArrowUpDown } from 'lucide-react';

interface RollingBoardProps {
  notes: RollingNote[];
  teacherInfo: TeacherInfo;
  theme: BoardTheme;
  onLikeNote: (id: string) => void;
  onReplyNote: (id: string, replyText: string) => void;
  onOpenWriteModal: () => void;
  onOpenTeacherModal: () => void;
}

export const RollingBoard: React.FC<RollingBoardProps> = ({
  notes,
  teacherInfo,
  theme,
  onLikeNote,
  onReplyNote,
  onOpenWriteModal,
  onOpenTeacherModal
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'likes'>('newest');

  // Filter & Sort
  const filteredNotes = useMemo(() => {
    let result = [...notes];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (n) =>
          n.authorName.toLowerCase().includes(q) ||
          (n.studentNo && n.studentNo.toLowerCase().includes(q)) ||
          n.content.toLowerCase().includes(q)
      );
    }

    if (selectedEmoji) {
      result = result.filter((n) => n.emoji === selectedEmoji);
    }

    if (sortBy === 'likes') {
      result.sort((a, b) => (b.likes || 0) - (a.likes || 0));
    } else {
      // newest (keep pinned notes on top)
      result.sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return 0;
      });
    }

    return result;
  }, [notes, searchQuery, selectedEmoji, sortBy]);

  // Unique emojis in current notes
  const availableEmojis = useMemo(() => {
    const set = new Set<string>();
    notes.forEach((n) => {
      if (n.emoji) set.add(n.emoji);
    });
    return Array.from(set);
  }, [notes]);

  // Theme container classes
  const themeContainerClass =
    theme === 'chalkboard'
      ? 'bg-chalkboard text-stone-100 min-h-[calc(100vh-65px)]'
      : theme === 'cork'
      ? 'bg-cork text-stone-900 min-h-[calc(100vh-65px)]'
      : theme === 'paper'
      ? 'bg-paper-grid text-stone-900 min-h-[calc(100vh-65px)]'
      : 'bg-gradient-to-b from-rose-50/60 via-amber-50/60 to-orange-50/40 text-stone-900 min-h-[calc(100vh-65px)]';

  return (
    <main className={`relative pb-24 transition-colors duration-300 ${themeContainerClass}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Warm Teacher Hero Banner */}
        <div
          className={`relative rounded-3xl p-6 sm:p-8 overflow-hidden shadow-lg border backdrop-blur-md ${
            theme === 'chalkboard'
              ? 'bg-stone-900/80 border-stone-700/80 text-white'
              : 'bg-white/85 border-amber-200/80 text-stone-800'
          }`}
        >
          {/* Subtle classroom background accents */}
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
              <div
                onClick={onOpenTeacherModal}
                className="relative group cursor-pointer"
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-4 border-amber-400 shadow-lg group-hover:scale-105 transition-transform">
                  <img
                    src={teacherInfo.profileImage}
                    alt={teacherInfo.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400';
                    }}
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-amber-500 text-white text-xs p-1 rounded-full shadow-md">
                  💌
                </div>
              </div>

              <div className="space-y-1.5 max-w-xl">
                <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-bold border border-amber-500/30">
                    {teacherInfo.subject}
                  </span>
                  <span className="text-xs text-stone-500 flex items-center gap-1">
                    <School className="w-3 h-3" />
                    {teacherInfo.gradeClass}
                  </span>
                  <span className="text-xs text-stone-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {teacherInfo.practicumPeriod}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold font-cute">
                  선생님, 그동안 감사했습니다! 사랑해요 ❤️
                </h2>

                <p
                  className={`text-xs sm:text-sm leading-relaxed ${
                    theme === 'chalkboard' ? 'text-stone-300' : 'text-stone-600'
                  }`}
                >
                  {teacherInfo.welcomeMessage}
                </p>
              </div>
            </div>

            {/* Quick Actions in Hero */}
            <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0 w-full sm:w-auto">
              <button
                onClick={onOpenWriteModal}
                className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-2xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>나도 쪽지 쓰기</span>
              </button>

              <button
                onClick={onOpenTeacherModal}
                className={`px-4 py-2 rounded-2xl text-xs font-semibold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  theme === 'chalkboard'
                    ? 'border-stone-700 bg-stone-800/80 text-stone-200 hover:bg-stone-700'
                    : 'border-rose-200 bg-rose-50 text-rose-800 hover:bg-rose-100'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                <span>선생님의 감사 답장 읽기</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div
          className={`p-3 rounded-2xl border backdrop-blur-xs flex flex-wrap items-center justify-between gap-3 shadow-xs ${
            theme === 'chalkboard'
              ? 'bg-stone-900/70 border-stone-700/60'
              : 'bg-white/80 border-stone-200/80'
          }`}
        >
          {/* Search Input */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="학생 이름이나 편지 내용 검색..."
              className={`w-full pl-9 pr-3 py-1.5 rounded-xl text-xs border focus:outline-hidden focus:ring-2 focus:ring-amber-500 ${
                theme === 'chalkboard'
                  ? 'bg-stone-800 border-stone-700 text-white placeholder-stone-400'
                  : 'bg-stone-50 border-stone-300 text-stone-800'
              }`}
            />
          </div>

          {/* Sticker Filter Pills */}
          {availableEmojis.length > 0 && (
            <div className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-none">
              <button
                onClick={() => setSelectedEmoji(null)}
                className={`px-2 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                  selectedEmoji === null
                    ? 'bg-amber-500 text-white'
                    : theme === 'chalkboard'
                    ? 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                전체 ({notes.length})
              </button>
              {availableEmojis.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => setSelectedEmoji(selectedEmoji === emoji ? null : emoji)}
                  className={`px-2 py-1 rounded-lg text-xs cursor-pointer transition-all ${
                    selectedEmoji === emoji
                      ? 'bg-amber-500 text-white scale-105'
                      : theme === 'chalkboard'
                      ? 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                      : 'bg-stone-100 hover:bg-stone-200'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}

          {/* Sort By Toggle */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSortBy(sortBy === 'newest' ? 'likes' : 'newest')}
              className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${
                theme === 'chalkboard'
                  ? 'border-stone-700 bg-stone-800 text-stone-200 hover:bg-stone-700'
                  : 'border-stone-300 bg-white text-stone-700 hover:bg-stone-50'
              }`}
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-amber-500" />
              <span>{sortBy === 'newest' ? '최신순' : '좋아요순'}</span>
            </button>
          </div>
        </div>

        {/* Rolling Paper Sticky Notes Grid */}
        {filteredNotes.length === 0 ? (
          <div
            className={`text-center py-16 px-4 rounded-3xl border border-dashed flex flex-col items-center justify-center space-y-3 ${
              theme === 'chalkboard'
                ? 'border-stone-700 text-stone-400'
                : 'border-amber-300 text-stone-500 bg-white/40'
            }`}
          >
            <span className="text-4xl">💌</span>
            <h3 className="text-lg font-bold">
              {searchQuery ? '검색된 쪽지가 없습니다' : '아직 도착한 롤링페이퍼가 없어요'}
            </h3>
            <p className="text-xs max-w-sm">
              {searchQuery
                ? '다른 검색어를 입력하거나 필터를 해제해보세요.'
                : '선생님께 드릴 첫 번째 따뜻한 마음을 가장 먼저 붙여보세요!'}
            </p>
            <button
              onClick={onOpenWriteModal}
              className="mt-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl text-xs font-bold shadow-md cursor-pointer"
            >
              첫 쪽지 작성하기 ✨
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-2">
            {filteredNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onLike={onLikeNote}
                onReply={onReplyNote}
              />
            ))}
          </div>
        )}
      </div>

      {/* Mobile Floating Action Button (FAB) */}
      <div className="fixed bottom-6 right-6 sm:hidden z-30">
        <button
          onClick={onOpenWriteModal}
          className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-500 to-rose-500 text-white shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer border-2 border-white"
          title="쪽지 쓰기"
        >
          <Plus className="w-7 h-7" />
        </button>
      </div>
    </main>
  );
};
