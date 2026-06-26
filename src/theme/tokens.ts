// ─── Colors ──────────────────────────────────────────────────────────────────

const colors = {
  // Core palette
  primary: '#000000',
  white: '#FFFFFF',
  background: '#FFFFFF',
  transparent: 'transparent',

  // Semantic surfaces
  surface: 'rgba(0,0,0,0.06)',
  secondary: 'rgba(0,0,0,0.15)',

  // Borders
  border: 'rgba(0,0,0,0.10)',
  borderMd: 'rgba(0,0,0,0.18)',

  // Text hierarchy
  textPrimary: '#000000',
  textSecondary: '#333333',
  textMuted: '#666666',
  textHint: '#999999',
  textInverse: '#FFFFFF',

  // Status
  danger: '#C0392B',
  warning: '#FFD9B2',
  success: '#27AE60',
  info: '#2471A3',

  // Badge — High priority
  badgeHighBg: '#FEE2E2',
  badgeHighText: '#991B1B',

  // Badge — Medium priority
  badgeMedBg: '#FEF3C7',
  badgeMedText: '#92400E',

  // Badge — Low priority
  badgeLowBg: '#DCFCE7',
  badgeLowText: '#166534',

  // Badge — Category
  badgeCatBg: 'rgba(0,0,0,0.15)',
  badgeCatText: '#333333',

  // Insight progress
  insightTrackMuted: '#BBBBBB',

  // Auth — Login screen
  authBackdropBase: '#F5E6D8',
  authFog1: '#FFAF96',
  authFog2: '#FF9169',
  authFog3: '#FFD282',
  authInk: '#111111',
  authBrandInk: '#1A1A1A',
  authCardSurface: '#FFFFFF',
  authLabel: '#6B7280',
  authInputBg: '#F3F4F5',
  authInputBorder: '#E0E1E3',
  authInputTextMuted: '#B0B4BA',
  authInputTextStrong: '#111111',
  authIcon: '#1E1E1E',
  authToggleTrack: '#E0E1E3',
  authThumbSurface: '#F9F9F9',

  // Navigation
  navActiveText: '#0088FF',
  navInactiveText: '#1A1A1A',
  navActiveBg: '#EDEDED',
  navCapsuleBg: 'rgba(255, 255, 255, 0.65)',
  navCapsuleGradientStart: '#F7F7F7',
  navCapsuleGradientEnd: '#DDDDDD',
} as const;

// ─── Typography ──────────────────────────────────────────────────────────────

const fontFamily = {
  heading: 'AncizarSerif-Regular',
  headingItalic: 'AncizarSerif-Italic',
  headingBold: 'AncizarSerif-Bold',
  headingBoldItalic: 'AncizarSerif-BoldItalic',
  sub: 'Inter_400Regular',
} as const;

const fontSize = {
  // Core scale (from HTML typography section)
  display: 36,
  h1: 26,
  h2: 20,
  subhead: 15,
  body: 15,
  caption: 12,
  label: 11,
  numeric: 28,

  // Component-specific font sizes
  sectionLabel: 10,
  swatchValue: 10,
  button: 13,
  buttonSm: 11,
  chip: 12,
  badge: 10,
  input: 13,
  navIcon: 24,
  navLabel: 10,
  modalTitle: 19,
  score: 52,
  miniStatNumber: 18,
  miniStatLabel: 9,
  statNumber: 32,
  taskTitle: 13,
} as const;

const fontWeight = {
  light: 300,
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

// Line-heights — pre-computed point values for React Native (fontSize × multiplier)
const lineHeight = {
  /** 36 × 1.1 = 39.6 */
  display: 39.6,
  /** 26 × 1.2 = 31.2 */
  h1: 31.2,
  /** 20 × 1.3 = 26 */
  h2: 26,
  /** 15 × 1.6 = 24 */
  body: 24,
  /** 10 × 1.2 = 12 — nav tab label */
  navLabel: 12,
} as const;

// Letter-spacing — pre-computed point values for React Native (fontSize × em)
const letterSpacing = {
  /** 36 × -0.02 = -0.72 */
  display: -0.72,
  /** 15 × 0.01 = 0.15 */
  subhead: 0.15,
  /** 11 × 0.08 = 0.88 */
  label: 0.88,
  /** 28 × -0.03 = -0.84 */
  numeric: -0.84,
  /** 10 × 0.03 = 0.3 */
  badge: 0.3,
  /** 52 × -0.03 = -1.56 */
  score: -1.56,
  /** 11 × 0.1 = 1.1 */
  scoreSub: 1.1,
  /** 10 × 0.12 = 1.2 */
  sectionLabel: 1.2,
  /** 9 × 0.06 = 0.54 */
  miniStatLabel: 0.54,
  /** 10 × -0.01 = -0.1 */
  navLabel: -0.1,
  /** 13 × 0.01 = 0.13 */
  button: 0.13,
} as const;

const typography = {
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
  letterSpacing,
} as const;

// ─── Spacing ─────────────────────────────────────────────────────────────────

const spacing = {
  /** 2px — inline badge/icon gap */
  xxs: 2,
  /** 3px — nav item inner gap */
  xxsMd: 3,
  /** 4px — tight inner padding */
  xs: 4,
  /** 5px — badge vertical padding, form label bottom margin */
  xsMd: 5,
  /** 6px — section label bottom padding, swatch meta padding, nav item gap */
  s: 6,
  /** 7px — badge horizontal padding */
  sMd: 7,
  /** 8px — small gap / mini-stat padding */
  sm: 8,
  /** 9px — button vertical padding (md) */
  smMd: 9,
  /** 10px — input vertical padding, nav item vertical padding, insight row padding */
  md: 10,
  /** 12px — standard medium gap, badge gap, chip horizontal padding, mini-stat bottom margin */
  mdLg: 12,
  /** 14px — task card vertical padding, form group bottom margin, modal footer cancel horizontal padding */
  lg: 14,
  /** 16px — standard large padding, stat card padding, section label bottom margin, insight card vertical padding */
  lgMd: 16,
  /** 18px — button horizontal padding (md), score card vertical padding, modal footer top spacing */
  xl: 18,
  /** 20px — button horizontal padding (md), nav bar horizontal padding, score card horizontal padding, modal horizontal padding, input horizontal padding, insight card horizontal padding */
  xlMd: 20,
  /** 24px — section header bottom padding */
  xxl: 24,
  /** 32px — root bottom padding, header top padding, header divider bottom spacing */
  xxlMd: 32,
  /** 48px — section bottom spacing */
  xxxl: 48,
  /** 200px — minimum width for standard buttons */
  buttonMinWidth: 200,
} as const;

// ─── Border Radius ───────────────────────────────────────────────────────────

const borderRadius = {
  sm: 6,
  md: 10,
  lg: 16,
  xl: 24,
  pill: 100,
  navCapsule: 296,
} as const;

// ─── Border Width ────────────────────────────────────────────────────────────

const borderWidth = {
  hairline: 0.5,
  thin: 1,
  thick: 1.5,
} as const;

// ─── Icon Sizes ──────────────────────────────────────────────────────────────

const iconSizes = {
  /** Tab bar icons */
  tabBar: 24,
  /** In-content icons alongside text */
  content: 16,
  /** Small inline icons (badges, labels) */
  inline: 13,
  /** Large standalone icons (empty states) */
  standalone: 40,
  /** Navigation preview icon */
  navPreview: 18,
  /** Task card meta icons (calendar, repeat) */
  taskMeta: 13,
} as const;

// ─── Button Dimensions ───────────────────────────────────────────────────────

const button = {
  sm: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    fontSize: 11,
    borderRadius: 6,
  },
  md: {
    paddingVertical: 9,
    paddingHorizontal: 18,
    fontSize: 13,
    borderRadius: 10,
  },
} as const;

// ─── Component Dimensions ────────────────────────────────────────────────────

/** Badge geometry */
const badge = {
  paddingVertical: 2,
  paddingHorizontal: 7,
  fontSize: 10,
  fontWeight: 600 as const,
} as const;

/** Chip geometry */
const chip = {
  paddingVertical: 5,
  paddingHorizontal: 12,
  fontSize: 12,
  fontWeight: 500 as const,
} as const;

/** Input geometry */
const input = {
  paddingVertical: 10,
  paddingHorizontal: 14,
  fontSize: 13,
  maxWidth: 380,
} as const;

/** Form geometry */
const form = {
  labelBottomMargin: 5,
  groupBottomMargin: 14,
} as const;

/** Task checkbox geometry */
const taskCheckbox = {
  width: 18,
  height: 18,
  borderRadius: 5,
  borderWidth: 1.5,
} as const;

/** Navigation bar geometry */
const navigation = {
  borderRadius: 296,
  paddingVertical: 16,
  paddingHorizontal: 25,
  itemGap: 1,
  itemPaddingTop: 6,
  itemPaddingBottom: 7,
  itemPaddingHorizontal: 8,
  itemBorderRadius: 100,
  height: 50,
} as const;

/** Modal card geometry */
const modal = {
  borderRadius: 24,
  padding: 20,
  titleMarginBottom: 6,
  subtitleMarginBottom: 16,
  footerTopSpacing: 18,
  footerTopPadding: 14,
  footerGap: 8,
  interactiveBadgePaddingVertical: 4,
  interactiveBadgePaddingHorizontal: 10,
  footerCancelPaddingVertical: 8,
  footerCancelPaddingHorizontal: 14,
  footerConfirmPaddingVertical: 8,
  footerConfirmPaddingHorizontal: 18,
} as const;

/** Stat card geometry */
const statCard = {
  paddingVertical: 16,
  paddingHorizontal: 20,
  miniStatGap: 8,
  miniStatPadding: 8,
  miniStatMarginTop: 12,
  miniStatLabelMarginTop: 4,
} as const;

/** Score card geometry */
const scoreCard = {
  paddingVertical: 18,
  paddingHorizontal: 20,
  subtitleMarginTop: 2,
  subtitleMarginBottom: 14,
  miniStatGap: 8,
  miniStatPadding: 8,
} as const;

/** Task card geometry */
const taskCard = {
  paddingVertical: 14,
  paddingHorizontal: 16,
  headerGap: 10,
  headerMarginBottom: 10,
  badgeGap: 5,
  metaMarginTop: 8,
  metaGap: 8,
  metaIconGap: 6,
} as const;

/** Insight card geometry */
const insight = {
  paddingVertical: 16,
  paddingHorizontal: 20,
  titleMarginBottom: 12,
  rowGap: 10,
  rowPaddingVertical: 10,
  dotSize: 8,
  trackWidth: 100,
  trackHeight: 4,
  trackBorderRadius: 2,
  barHeight: 4,
  barBorderRadius: 2,
} as const;

/** Swatch card geometry */
const swatch = {
  blockHeight: 52,
  borderRadius: 10,
  metaPaddingVertical: 6,
  metaPaddingHorizontal: 8,
  gridGap: 8,
} as const;

/** Typography row geometry */
const typographyRow = {
  gap: 16,
  paddingVertical: 10,
  metaWidth: 140,
} as const;

/** Spacing row geometry */
const spacingRow = {
  gap: 16,
  marginBottom: 8,
  labelWidth: 80,
  barHeight: 12,
  barBorderRadius: 2,
} as const;

/** Radius example geometry */
const radiusExample = {
  boxWidth: 56,
  boxHeight: 56,
  gap: 12,
} as const;

/** Design-system header geometry */
const dsHeader = {
  topPadding: 32,
  bottomPadding: 24,
  eyebrowMarginBottom: 8,
  subtitleMarginTop: 6,
  dividerMarginBottom: 32,
} as const;

/** Design-system section geometry */
const dsSection = {
  marginBottom: 40,
  labelMarginBottom: 16,
  labelBottomPadding: 6,
} as const;

// ─── Auth — Login Screen Geometry ────────────────────────────────────────────

const auth = {
  /** Layout reference width (unscaled) */
  referenceWidth: 440,
  /** Layout reference height (unscaled) */
  referenceHeight: 956,
  /** Brand area top offset (unscaled) */
  brandTop: 200,
  /** Login card top offset (unscaled) */
  cardTop: 300,
  /** Login card width (unscaled) */
  cardWidth: 400,
  /** Login card height (unscaled) */
  cardHeight: 416,
  /** Login card border radius (unscaled) */
  cardRadius: 28,
  /** Login card horizontal padding (unscaled) */
  cardPaddingHorizontal: 28,
  /** Login card vertical padding (unscaled) */
  cardPaddingVertical: 32,
  /** Card title font size (unscaled) */
  titleFontSize: 24,
  /** Card title line height (unscaled) */
  titleLineHeight: 30,
  /** Card title bottom margin (unscaled) */
  titleMarginBottom: 28,
  /** Field height (unscaled) */
  fieldHeight: 52,
  /** Field border radius (unscaled) */
  fieldRadius: 16,
  /** Field horizontal padding (unscaled) */
  fieldPaddingHorizontal: 18,
  /** Field label font size (unscaled) */
  fieldLabelFontSize: 14,
  /** Field label line height (unscaled) */
  fieldLabelLineHeight: 20,
  /** Field label bottom margin (unscaled) */
  fieldLabelMarginBottom: 7,
  /** Field input font size (unscaled) */
  fieldInputFontSize: 16,
  /** Field input line height (unscaled) */
  fieldInputLineHeight: 22,
  /** Gap between username and password fields (unscaled) */
  fieldGap: 18,
  /** Gap between password and admin row (unscaled) */
  modeGap: 14,
  /** Submit button top margin (unscaled) */
  submitMarginTop: 28,
  /** Submit button height (unscaled) */
  submitHeight: 56,
  /** Submit button border radius (unscaled) */
  submitRadius: 28,
  /** Submit button font size (unscaled) */
  submitFontSize: 17,
  /** Submit button line height (unscaled) */
  submitLineHeight: 24,
  /** Toggle track width (unscaled) */
  toggleWidth: 34,
  /** Toggle track height (unscaled) */
  toggleHeight: 20,
  /** Toggle thumb size (unscaled) */
  toggleThumbSize: 16,
  /** Toggle thumb inset from track edge (unscaled) */
  toggleThumbInset: 2,
  /** Password eye icon hit slop */
  passwordIconHitSlop: 10,
  /** Password eye icon touch target size (unscaled) */
  passwordIconBox: 31,
  /** Password eye icon visual size (unscaled) */
  passwordIconSize: 27,
  /** Footer bottom offset */
  footerBottom: 48,
  /** Logo width (unscaled) */
  logoWidth: 78,
  /** Logo height (unscaled) */
  logoHeight: 22,
} as const;

// ─── Opacities ───────────────────────────────────────────────────────────────

const opacity = {
  /** Spacing bar fill */
  spacingBar: 1,
  /** Secondary surface fill */
  secondarySurface: 0.15,
  /** Disabled state */
  disabled: 0.5,
  /** Pressed button */
  pressed: 0.82,
  /** Disabled button */
  buttonDisabled: 0.65,
} as const;

// ─── iOS Shadows ─────────────────────────────────────────────────────────────

const shadow = {
  /** Modal card elevation */
  modal: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 24,
  },
  /** Login card elevation */
  authCard: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
  },
  /** Toggle thumb elevation */
  toggleThumb: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  /** Floating navigation bar elevation */
  navCapsule: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 40,
  },
} as const;

// ─── Assembled Tokens ────────────────────────────────────────────────────────

const tokens = {
  colors,
  typography,
  spacing,
  borderRadius,
  borderWidth,
  iconSizes,
  button,
  badge,
  chip,
  input,
  form,
  auth,
  taskCheckbox,
  navigation,
  modal,
  statCard,
  scoreCard,
  taskCard,
  insight,
  swatch,
  typographyRow,
  spacingRow,
  radiusExample,
  dsHeader,
  dsSection,
  opacity,
  shadow,
} as const;

export type Tokens = typeof tokens;

export default tokens;
