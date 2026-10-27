import { RollingNote, TeacherInfo } from '../types';

export const INITIAL_TEACHER_INFO: TeacherInfo = {
  name: '이지은 선생님',
  subject: '국어과 교육실습생',
  gradeClass: '햇살중학교 2학년 3반',
  schoolName: '햇살중학교',
  practicumPeriod: '2026.04.06 ~ 2026.05.01 (4주간의 소중한 시간)',
  profileImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80',
  welcomeMessage: '4주 동안 2학년 3반 친구들과 함께해서 매일매일이 선물 같았어요. 여러분이 써준 따뜻한 한마디 마음 깊이 간직할게요! 🌸',
  teacherFarewellLetter: '사랑하는 2-3반 친구들에게 💌\n처음 교탁 앞에 섰을 때 손이 떨릴 정도로 긴장했던 첫날이 엊그제 같은데, 벌써 마지막 인사를 전하게 되었네요.\n수업 시간에 눈을 반짝이며 들어주던 모습, 쉬는 시간마다 조르르 달려와 과자를 쥐어주던 따뜻한 마음들 모두 평생 잊지 못할 거예요. 여러분 덕분에 진짜 좋은 국어 선생님이 되고 싶다는 꿈이 훨씬 더 단단해졌어요. 언제나 여러분의 찬란한 꿈을 응원할게요! 사랑합니다 ❤️'
};

export const INITIAL_DEMO_NOTES: RollingNote[] = [
  {
    id: 'demo-1',
    authorName: '강민우',
    studentNo: '14번',
    content: '선생님! 첫 수업 때 저희 긴장 풀어주시려고 재미있는 퀴즈 준비해주신 거 아직도 기억나요! 국어 수업이 이렇게 재밌는 줄 몰랐어요. 선생님 꼭 멋진 정교사 되셔서 다시 우리 학교로 와주세요!! 🌟',
    cardColor: 'yellow',
    emoji: '🌟',
    fontStyle: 'gaegu',
    rotation: -2,
    timestamp: '2026-05-01 10:15',
    likes: 8,
    isPinned: true,
    teacherReply: '민우야, 첫날 퀴즈 때 제일 먼저 손들고 맞춰줘서 선생님이 얼마나 든든했는지 몰라! 고마워 😊'
  },
  {
    id: 'demo-2',
    authorName: '반장 서연이',
    studentNo: '2번 / 반장',
    content: '지은 쌤~ 4주 동안 2-3반 신경 써주시고 매일 아침마다 밝게 웃으며 인사해주셔서 아침마다 등교하는 게 즐거웠어요. 선생님은 이미 최고의 선생님이세요! 항상 건강하시고 행복하세요 💖',
    cardColor: 'pink',
    emoji: '💖',
    fontStyle: 'nanum',
    rotation: 3,
    timestamp: '2026-05-01 10:22',
    likes: 12,
    teacherReply: '서연아~ 든든한 반장 서연이가 있어서 선생님이 실습 내내 큰 힘을 얻었어. 정말 고마워!'
  },
  {
    id: 'demo-3',
    authorName: '김도현',
    studentNo: '7번',
    content: '선생님 체육대회 때 저희 반 피구 경기 열심히 응원해주셔서 감사했습니다! 그때 목소리 쉬실 정도로 소리 질러주신 거 감동이었어요 ㅋㅋ 임용고시 한 번에 찰떡같이 붙으실 거예요! 🍀',
    cardColor: 'green',
    emoji: '🍀',
    fontStyle: 'nanum',
    rotation: -3,
    timestamp: '2026-05-01 10:45',
    likes: 6
  },
  {
    id: 'demo-4',
    authorName: '박하은',
    studentNo: '11번',
    content: '선생님이 가르쳐주신 윤동주 시인의 시가 마음에 깊이 남았어요. 선생님 말씀처럼 별을 노래하는 마음으로 하루하루 소중하게 보낼게요. 선생님 교생 마지막 날 울지 마세요 ㅠㅠ 벌써 보고 싶어요 🌸',
    cardColor: 'peach',
    emoji: '🌸',
    fontStyle: 'gaegu',
    rotation: 1,
    timestamp: '2026-05-01 11:02',
    likes: 9,
    teacherReply: '하은이의 예쁜 감수성을 보며 선생님도 수업 시간에 큰 울림을 받았단다. 언제나 응원해!'
  },
  {
    id: 'demo-5',
    authorName: '최준영',
    studentNo: '23번',
    content: '교생선생님! 매일 점심시간마다 급식실에서 맛있는 거 많이 챙겨주시고 상담도 진심으로 들어주셔서 감사했습니다. 선생님 덕분에 고민이 많이 해결됐어요. 나중에 꼭 찾아뵐게요! 🍎',
    cardColor: 'blue',
    emoji: '🍎',
    fontStyle: 'sans',
    rotation: -1,
    timestamp: '2026-05-01 11:15',
    likes: 5
  },
  {
    id: 'demo-6',
    authorName: '이유나 & 송채원',
    studentNo: '18, 19번',
    content: '선생님 세상에서 제일 예쁘고 천사 같으신 지은 쌤! 교생 실습 기간이 왜 4주밖에 안 되는 걸까요 1년 내내 계셨으면 좋겠어요 ㅠㅠ 선생님 사랑해요 쌤 팬클럽 1기 유나&채원 올림 🧸💌',
    cardColor: 'purple',
    emoji: '🧸',
    fontStyle: 'gaegu',
    rotation: 2,
    timestamp: '2026-05-01 11:30',
    likes: 15
  }
];
