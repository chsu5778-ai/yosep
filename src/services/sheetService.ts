import { RollingNote } from '../types';
import { INITIAL_DEMO_NOTES } from '../constants/initialData';

const LOCAL_STORAGE_KEY_NOTES = 'rolling_paper_notes_v1';
const LOCAL_STORAGE_KEY_CONFIG = 'rolling_paper_sheet_config_v1';

export interface SheetFetchResult {
  success: boolean;
  notes: RollingNote[];
  error?: string;
  isDemo?: boolean;
}

export const SheetService = {
  // 로컬 스토리지에 저장된 설정 가져오기
  getConfig: () => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_CONFIG);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return {
      webAppUrl: '',
      isConnected: false,
      isDemoMode: true,
      lastSyncedAt: undefined
    };
  },

  // 설정 저장
  saveConfig: (config: { webAppUrl: string; isConnected: boolean; isDemoMode: boolean; lastSyncedAt?: string }) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_CONFIG, JSON.stringify(config));
    } catch (e) {
      console.error('Failed to save config to localStorage', e);
    }
  },

  // 로컬 스토리지에서 쪽지 목록 가져오기
  getLocalNotes: (): RollingNote[] => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_NOTES);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to read notes from localStorage', e);
    }
    return INITIAL_DEMO_NOTES;
  },

  // 로컬 스토리지에 쪽지 목록 저장하기
  saveLocalNotes: (notes: RollingNote[]) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_NOTES, JSON.stringify(notes));
    } catch (e) {
      console.error('Failed to save notes to localStorage', e);
    }
  },

  // 구글 시트 연동 테스트
  testConnection: async (webAppUrl: string): Promise<{ success: boolean; message: string; count?: number }> => {
    if (!webAppUrl || !webAppUrl.startsWith('http')) {
      return { success: false, message: '올바른 웹 앱 URL(https://script.google.com/...)을 입력해주세요.' };
    }

    try {
      // GAS Web Apps redirect, so use standard fetch
      const testUrl = webAppUrl.includes('?') 
        ? `${webAppUrl}&action=getNotes&_t=${Date.now()}` 
        : `${webAppUrl}?action=getNotes&_t=${Date.now()}`;
      
      const response = await fetch(testUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        return { 
          success: false, 
          message: `구글 서버 응답 오류 (${response.status}): 웹 앱 배포 시 '액세스 권한: 모든 사용자(Anyone)'로 설정되었는지 확인하세요.` 
        };
      }

      const json = await response.json();
      if (json && json.success) {
        return { 
          success: true, 
          message: `구글 시트 연동 성공! (현재 저장된 쪽지: ${json.notes ? json.notes.length : 0}개)`,
          count: json.notes ? json.notes.length : 0
        };
      }

      return { success: false, message: json.error || '구글 시트 스크립트 실행 오류' };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      return { 
        success: false, 
        message: `연동 실패: ${errorMsg}. 구글 Apps Script 배포 시 '모든 사용자(Anyone)' 접근 권한을 주었는지 확인해주세요.` 
      };
    }
  },

  // 쪽지 목록 불러오기 (구글 시트 우선, 없으면 로컬 캐시)
  fetchNotes: async (webAppUrl?: string): Promise<SheetFetchResult> => {
    // URL이 없는 경우 로컬/데모 반환
    if (!webAppUrl || !webAppUrl.trim()) {
      const local = SheetService.getLocalNotes();
      return {
        success: true,
        notes: local,
        isDemo: true
      };
    }

    try {
      const fetchUrl = webAppUrl.includes('?') 
        ? `${webAppUrl}&action=getNotes&_t=${Date.now()}` 
        : `${webAppUrl}?action=getNotes&_t=${Date.now()}`;

      const res = await fetch(fetchUrl, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      if (data && data.success && Array.isArray(data.notes)) {
        // 쪽지에 랜덤 각도 없으면 부여
        const formattedNotes: RollingNote[] = data.notes.map((n: RollingNote, idx: number) => ({
          ...n,
          rotation: n.rotation !== undefined ? n.rotation : (((idx % 5) - 2) * 1.5)
        }));

        // 로컬에도 백업
        SheetService.saveLocalNotes(formattedNotes);
        return {
          success: true,
          notes: formattedNotes,
          isDemo: false
        };
      } else {
        throw new Error(data.error || '시트 응답 형식 오류');
      }
    } catch (err: unknown) {
      console.warn('Google Sheet fetch error, falling back to local storage:', err);
      const fallback = SheetService.getLocalNotes();
      return {
        success: false,
        notes: fallback,
        error: err instanceof Error ? err.message : '구글 시트 연결 실패',
        isDemo: true
      };
    }
  },

  // 새 쪽지 추가
  addNote: async (webAppUrl: string | undefined, note: RollingNote): Promise<{ success: boolean; error?: string }> => {
    // 1. 로컬에 즉시 추가하여 UI 반응성 극대화
    const current = SheetService.getLocalNotes();
    const updated = [note, ...current];
    SheetService.saveLocalNotes(updated);

    // 2. 구글 시트 URL이 있으면 원격 시트에도 동기화
    if (webAppUrl && webAppUrl.trim().startsWith('http')) {
      try {
        const payload = {
          action: 'addNote',
          note: {
            id: note.id,
            timestamp: note.timestamp,
            authorName: note.authorName,
            studentNo: note.studentNo || '',
            content: note.content,
            cardColor: note.cardColor,
            emoji: note.emoji,
            fontStyle: note.fontStyle,
            likes: note.likes || 0,
            photoUrl: note.photoUrl || '',
            teacherReply: note.teacherReply || '',
            isPinned: Boolean(note.isPinned)
          }
        };

        // Note: Google Apps Script handles text/plain without CORS preflight failures
        await fetch(webAppUrl, {
          method: 'POST',
          mode: 'no-cors', // Standard way to post to Apps Script without CORS blockage
          headers: {
            'Content-Type': 'text/plain;charset=utf-8'
          },
          body: JSON.stringify(payload)
        });

        return { success: true };
      } catch (err: unknown) {
        console.error('Remote sheet sync error:', err);
        return { success: true }; // 로컬에 이미 저장되었으므로 사용자는 계속 진행 가능
      }
    }

    return { success: true };
  },

  // 좋아요 증가
  likeNote: async (webAppUrl: string | undefined, noteId: string): Promise<void> => {
    // 로컬 업데이트
    const current = SheetService.getLocalNotes();
    const updated = current.map(n => n.id === noteId ? { ...n, likes: n.likes + 1 } : n);
    SheetService.saveLocalNotes(updated);

    // 원격 시트 업데이트 (비동기 처리)
    if (webAppUrl && webAppUrl.trim().startsWith('http')) {
      try {
        await fetch(webAppUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({ action: 'likeNote', id: noteId })
        });
      } catch (err) {
        console.warn('Failed to like on remote sheet:', err);
      }
    }
  },

  // 교생선생님 답장 추가
  replyNote: async (webAppUrl: string | undefined, noteId: string, replyText: string): Promise<void> => {
    // 로컬 업데이트
    const current = SheetService.getLocalNotes();
    const updated = current.map(n => n.id === noteId ? { ...n, teacherReply: replyText } : n);
    SheetService.saveLocalNotes(updated);

    // 원격 시트 업데이트
    if (webAppUrl && webAppUrl.trim().startsWith('http')) {
      try {
        await fetch(webAppUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({ action: 'replyNote', id: noteId, reply: replyText })
        });
      } catch (err) {
        console.warn('Failed to reply on remote sheet:', err);
      }
    }
  }
};
