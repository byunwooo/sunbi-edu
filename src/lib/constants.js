export const COLORS = {
  // Primary - 전통 옻칠 빨강
  primary: '#8b1a1a',
  primaryDark: '#5c1010',
  primaryLight: '#a82828',
  primaryGlow: 'rgba(139, 26, 26, 0.12)',
  primarySoft: 'rgba(139, 26, 26, 0.06)',

  // Neutrals - 한지(韓紙) 느낌
  background: '#f7f2ec',
  backgroundWarm: '#f0e8de',
  surface: '#ffffff',
  surfaceElevated: '#fefcfa',

  // Text
  text: '#1a1a1a',
  textSecondary: '#4a4a4a',
  textTertiary: '#8a8a8a',
  textOnPrimary: '#ffffff',
  textOnPrimaryMuted: 'rgba(255,255,255,0.72)',

  // Accents
  success: '#1a7a3a',
  successBg: '#e8f5e9',
  danger: '#c62828',
  dangerBg: '#fde8e8',
  warning: '#e65100',
  warningBg: '#fff3e0',
  info: '#1565c0',

  // Borders & Dividers
  border: '#e8e0d8',
  borderLight: '#f0ebe4',
  divider: '#ede6dd',

  // Shadows
  shadowColor: 'rgba(80, 30, 20, 0.08)',
  shadowColorStrong: 'rgba(80, 30, 20, 0.16)',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  xxxl: 40,
};

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 999,
};

export const SHADOW = {
  sm: {
    shadowColor: COLORS.shadowColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: COLORS.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },
  lg: {
    shadowColor: COLORS.shadowColorStrong,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 8,
  },
};

export const CURRICULUM_STEPS = [
  { id: 1, label: '1단계 - 브랜드 & 메뉴 이해', short: '브랜드·메뉴', icon: '📖' },
  { id: 2, label: '2단계 - 주방 공간 적응 & 동선', short: '주방 동선', icon: '🏠' },
  { id: 3, label: '3단계 - 주방기물 세팅', short: '기물 세팅', icon: '🍳' },
  { id: 4, label: '4단계 - 조리 실습', short: '조리 실습', icon: '👨‍🍳' },
  { id: 5, label: '5단계 - 음식 세팅', short: '음식 세팅', icon: '🍜' },
  { id: 6, label: '6단계 - 홀 & 고객 응대', short: '홀·응대', icon: '🙋' },
  { id: 7, label: '7단계 - 포스 & 정산', short: '포스·정산', icon: '💳' },
  { id: 8, label: '8단계 - 최종 테스트', short: '최종 테스트', icon: '✅' },
];
