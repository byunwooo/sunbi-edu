export const COLORS = {
  primary: '#8b1a1a',
  primaryDark: '#5c1010',
  primaryLight: '#a82828',
  primaryGlow: 'rgba(139, 26, 26, 0.10)',
  primarySoft: 'rgba(139, 26, 26, 0.05)',

  background: '#f7f2ec',
  backgroundWarm: '#f0e8de',
  surface: '#ffffff',
  surfaceElevated: '#fefcfa',

  text: '#1a1a1a',
  textSecondary: '#4a4a4a',
  textTertiary: '#8a8a8a',
  textOnPrimary: '#ffffff',
  textOnPrimaryMuted: 'rgba(255,255,255,0.72)',

  success: '#1a7a3a',
  successBg: '#e8f5e9',
  danger: '#c62828',
  dangerBg: '#fde8e8',
  warning: '#e65100',
  warningBg: '#fff3e0',

  border: '#e0d8d0',
  borderLight: '#ede6dd',
  divider: '#ede6dd',
};

export const SPACING = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 28, xxxl: 40 };
export const RADIUS = { sm: 8, md: 12, lg: 16, xl: 20, full: 999 };

export const SHADOW = {
  sm: { shadowColor: '#3d1a0a', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  md: { shadowColor: '#3d1a0a', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 4 },
  lg: { shadowColor: '#3d1a0a', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.12, shadowRadius: 24, elevation: 8 },
};

export const CURRICULUM_STEPS = [
  { id: 1, label: '1단계 - 브랜드 & 메뉴 이해', short: '브랜드·메뉴', icon: 'book-open' },
  { id: 2, label: '2단계 - 주방 공간 적응 & 동선', short: '주방 동선', icon: 'home' },
  { id: 3, label: '3단계 - 주방기물 세팅', short: '기물 세팅', icon: 'tool' },
  { id: 4, label: '4단계 - 조리 실습', short: '조리 실습', icon: 'thermometer' },
  { id: 5, label: '5단계 - 음식 세팅', short: '음식 세팅', icon: 'coffee' },
  { id: 6, label: '6단계 - 홀 & 고객 응대', short: '홀·응대', icon: 'users' },
  { id: 7, label: '7단계 - 포스 & 정산', short: '포스·정산', icon: 'credit-card' },
  { id: 8, label: '8단계 - 최종 테스트', short: '최종 테스트', icon: 'check-circle' },
];
