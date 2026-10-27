export interface RollingNote {
  id: string;
  authorName: string;
  studentNo?: string; // e.g. "7번", "반장"
  content: string;
  cardColor: CardColor;
  emoji: string;
  fontStyle: FontStyle;
  rotation?: number; // degree for natural sticky note look
  timestamp: string; // ISO or formatted date
  likes: number;
  photoUrl?: string;
  isPinned?: boolean;
  teacherReply?: string;
}

export type CardColor = 
  | 'yellow' 
  | 'pink' 
  | 'green' 
  | 'blue' 
  | 'purple' 
  | 'peach'
  | 'white';

export type FontStyle = 'nanum' | 'gaegu' | 'sans';

export type BoardTheme = 'cork' | 'chalkboard' | 'pastel' | 'paper';

export interface TeacherInfo {
  name: string;
  subject: string;
  gradeClass: string;
  schoolName: string;
  practicumPeriod: string;
  profileImage: string;
  welcomeMessage: string;
  teacherFarewellLetter: string;
}

export interface SheetConfig {
  webAppUrl: string;
  lastSyncedAt?: string;
  isConnected: boolean;
  isDemoMode: boolean;
}
