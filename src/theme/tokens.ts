const tokens = {
  colors: {
    primary: '#000000',
    white: '#FFFFFF',
    surface: '#F9F9F9',
    border: 'rgba(0,0,0,0.10)',
    borderMd: 'rgba(0,0,0,0.18)',
    textPrimary: '#000000',
    textMuted: '#666666',
    textHint: '#999999',
    danger: '#C0392B',
    warning: '#E67E22',
    success: '#27AE60',
    info: '#2471A3',
    badgeHighBg: 'rgba(192,57,43,0.10)',
    badgeHighText: '#C0392B',
    badgeMedBg: 'rgba(230,126,34,0.10)',
    badgeMedText: '#E67E22',
    badgeLowBg: 'rgba(39,174,96,0.10)',
    badgeLowText: '#27AE60',
    badgeCatBg: 'rgba(0,0,0,0.06)',
    badgeCatText: '#333333',
  },
  typography: {
    fontSize: {
      display: 36,
      h1: 26,
      h2: 20,
      subhead: 15,
      body: 15,
      caption: 12,
      label: 11,
      numeric: 28,
    },
  },
  fonts: {
    heading: 'AncizarSerif-Regular',
    headingItalic: 'AncizarSerif-Italic',
    headingBold: 'AncizarSerif-Bold',
    headingBoldItalic: 'AncizarSerif-BoldItalic',
    sub: 'Inter_400Regular',
    body: 'SF Pro',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
    xxxl: 48,
  },
  borderRadius: {
    sm: 6,
    md: 10,
    lg: 16,
    xl: 24,
    pill: 100,
  },
  borderWidth: {
    hairline: 0.5,
    thin: 1,
  },
  button: {
    md: {
      paddingVertical: 10,
      paddingHorizontal: 18,
      fontSize: 14,
    },
    sm: {
      paddingVertical: 6,
      paddingHorizontal: 12,
      fontSize: 13,
    },
  },
} as const;

export type Tokens = typeof tokens;

export default tokens;
