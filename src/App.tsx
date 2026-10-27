import React, { useState, useEffect, useCallback } from 'react';
import { RollingNote, TeacherInfo, BoardTheme, SheetConfig } from './types';
import { INITIAL_TEACHER_INFO, INITIAL_DEMO_NOTES } from './constants/initialData';
import { SheetService } from './services/sheetService';
import { Header } from './components/Header';
import { RollingBoard } from './components/RollingBoard';
import { WriteNoteModal } from './components/WriteNoteModal';
import { QRCodeModal } from './components/QRCodeModal';
import { GoogleSheetModal } from './components/GoogleSheetModal';
import { SlideshowModal } from './components/SlideshowModal';
import { PrdModal } from './components/PrdModal';
import { TeacherProfileModal } from './components/TeacherProfileModal';

const LOCAL_TEACHER_KEY = 'rolling_paper_teacher_v1';
const LOCAL_THEME_KEY = 'rolling_paper_theme_v1';

export default function App() {
  const [notes, setNotes] = useState<RollingNote[]>(() => SheetService.getLocalNotes());
  const [theme, setTheme] = useState<BoardTheme>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_THEME_KEY);
      if (saved) return saved as BoardTheme;
    } catch {}
    return 'cork';
  });

  const [teacherInfo, setTeacherInfo] = useState<TeacherInfo>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_TEACHER_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_TEACHER_INFO;
  });

  const [sheetConfig, setSheetConfig] = useState<SheetConfig>(() => SheetService.getConfig());
  const [isSyncing, setIsSyncing] = useState(false);

  // Modals
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isSheetModalOpen, setIsSheetModalOpen] = useState(false);
  const [isSlideshowOpen, setIsSlideshowOpen] = useState(false);
  const [isPrdModalOpen, setIsPrdModalOpen] = useState(false);
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);

  // Sync / Fetch notes from Sheet or Local
  const refreshNotes = useCallback(async (customUrl?: string) => {
    const urlToUse = customUrl !== undefined ? customUrl : sheetConfig.webAppUrl;
    setIsSyncing(true);
    try {
      const result = await SheetService.fetchNotes(urlToUse);
      if (result.success && result.notes) {
        setNotes(result.notes);
        setSheetConfig(prev => {
          const updated = {
            ...prev,
            isConnected: !result.isDemo,
            isDemoMode: Boolean(result.isDemo),
            lastSyncedAt: new Date().toLocaleTimeString('ko-KR')
          };
          SheetService.saveConfig(updated);
          return updated;
        });
      }
    } finally {
      setIsSyncing(false);
    }
  }, [sheetConfig.webAppUrl]);

  // Initial URL query param check & initial data loading
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlSheet = params.get('sheetUrl');
      const action = params.get('action');

      if (urlSheet) {
        setSheetConfig(prev => {
          const updated = {
            ...prev,
            webAppUrl: urlSheet,
            isConnected: true,
            isDemoMode: false
          };
          SheetService.saveConfig(updated);
          return updated;
        });
        refreshNotes(urlSheet);
      } else {
        refreshNotes();
      }

      if (action === 'write') {
        setIsWriteModalOpen(true);
      }
    }
  }, [refreshNotes]);

  // Handle Theme change
  const handleThemeChange = (newTheme: BoardTheme) => {
    setTheme(newTheme);
    try {
      localStorage.setItem(LOCAL_THEME_KEY, newTheme);
    } catch {}
  };

  // Handle Teacher info save
  const handleSaveTeacherInfo = (info: TeacherInfo) => {
    setTeacherInfo(info);
    try {
      localStorage.setItem(LOCAL_TEACHER_KEY, JSON.stringify(info));
    } catch {}
  };

  // Handle New Note Submission
  const handleAddNote = async (newNoteData: Omit<RollingNote, 'id' | 'timestamp' | 'likes'>) => {
    const now = new Date();
    const formattedDate = `${now.getMonth() + 1}월 ${now.getDate()}일 ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const newNote: RollingNote = {
      ...newNoteData,
      id: `note_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: formattedDate,
      likes: 0
    };

    // Update state immediately for instant feedback
    setNotes(prev => [newNote, ...prev]);

    // Persist to Sheet & LocalStorage
    await SheetService.addNote(sheetConfig.webAppUrl, newNote);
  };

  // Handle Like Note
  const handleLikeNote = (id: string) => {
    setNotes(prev =>
      prev.map(n => (n.id === id ? { ...n, likes: (n.likes || 0) + 1 } : n))
    );
    SheetService.likeNote(sheetConfig.webAppUrl, id);
  };

  // Handle Teacher Reply Note
  const handleReplyNote = (id: string, replyText: string) => {
    setNotes(prev =>
      prev.map(n => (n.id === id ? { ...n, teacherReply: replyText } : n))
    );
    SheetService.replyNote(sheetConfig.webAppUrl, id, replyText);
  };

  // Save new Sheet URL
  const handleSaveSheetUrl = (newUrl: string) => {
    const updated = {
      webAppUrl: newUrl,
      isConnected: Boolean(newUrl && newUrl.trim().startsWith('http')),
      isDemoMode: !newUrl || !newUrl.trim().startsWith('http'),
      lastSyncedAt: new Date().toLocaleTimeString('ko-KR')
    };
    setSheetConfig(updated);
    SheetService.saveConfig(updated);
    refreshNotes(newUrl);
  };

  // Reset to Demo Data
  const handleResetDemo = () => {
    if (window.confirm('체험용 데모 쪽지들로 초기화하시겠습니까?')) {
      setNotes(INITIAL_DEMO_NOTES);
      SheetService.saveLocalNotes(INITIAL_DEMO_NOTES);
      const updated = {
        webAppUrl: '',
        isConnected: false,
        isDemoMode: true
      };
      setSheetConfig(updated);
      SheetService.saveConfig(updated);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans-kr bg-stone-100 text-stone-800">
      {/* Top Header */}
      <Header
        teacherInfo={teacherInfo}
        noteCount={notes.length}
        theme={theme}
        onThemeChange={handleThemeChange}
        onOpenWriteModal={() => setIsWriteModalOpen(true)}
        onOpenQRModal={() => setIsQRModalOpen(true)}
        onOpenSheetModal={() => setIsSheetModalOpen(true)}
        onOpenSlideshow={() => setIsSlideshowOpen(true)}
        onOpenPrdModal={() => setIsPrdModalOpen(true)}
        onOpenTeacherModal={() => setIsTeacherModalOpen(true)}
        onRefresh={() => refreshNotes()}
        isSyncing={isSyncing}
        isDemoMode={sheetConfig.isDemoMode}
      />

      {/* Main Board View */}
      <RollingBoard
        notes={notes}
        teacherInfo={teacherInfo}
        theme={theme}
        onLikeNote={handleLikeNote}
        onReplyNote={handleReplyNote}
        onOpenWriteModal={() => setIsWriteModalOpen(true)}
        onOpenTeacherModal={() => setIsTeacherModalOpen(true)}
      />

      {/* Modals */}
      <WriteNoteModal
        isOpen={isWriteModalOpen}
        onClose={() => setIsWriteModalOpen(false)}
        onSubmit={handleAddNote}
        teacherName={teacherInfo.name}
      />

      <QRCodeModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        teacherInfo={teacherInfo}
        sheetUrl={sheetConfig.webAppUrl}
      />

      <GoogleSheetModal
        isOpen={isSheetModalOpen}
        onClose={() => setIsSheetModalOpen(false)}
        webAppUrl={sheetConfig.webAppUrl}
        onSaveUrl={handleSaveSheetUrl}
        onRefreshNotes={() => refreshNotes()}
        onResetDemo={handleResetDemo}
        isDemoMode={sheetConfig.isDemoMode}
      />

      <SlideshowModal
        isOpen={isSlideshowOpen}
        onClose={() => setIsSlideshowOpen(false)}
        notes={notes}
        teacherInfo={teacherInfo}
      />

      <PrdModal
        isOpen={isPrdModalOpen}
        onClose={() => setIsPrdModalOpen(false)}
      />

      <TeacherProfileModal
        isOpen={isTeacherModalOpen}
        onClose={() => setIsTeacherModalOpen(false)}
        teacherInfo={teacherInfo}
        onSave={handleSaveTeacherInfo}
      />
    </div>
  );
}
