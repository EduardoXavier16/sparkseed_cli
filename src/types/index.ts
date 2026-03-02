export type SupportedLanguage = 'en' | 'pt' | 'es';

export interface ProjectConfig {
  projectName: string;
  description: string;
  type: 'web' | 'mobile' | 'desktop' | 'api' | 'fullstack';
  framework: string;
  language: 'typescript' | 'javascript';
  styling: 'css' | 'scss' | 'tailwind' | 'styled-components' | 'emotion' | 'chakra-ui';
  database?: string;
  auth?: boolean;
  features: string[];
  targetAudience: string;
  mainGoal: string;
  colorPalette: ColorPalette;
  typography: Typography;
  components: string[];
  pages: string[];
  cliLanguage?: SupportedLanguage;
  apiEndpoints?: ApiEndpoint[];
}

export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  error: string;
  success: string;
  warning: string;
  text: {
    primary: string;
    secondary: string;
    disabled: string;
  };
}

export interface Typography {
  fontFamily: {
    heading: string;
    body: string;
    mono: string;
  };
  fontSizes: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
  };
  fontWeights: {
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
  };
  lineHeights: {
    tight: number;
    normal: number;
    relaxed: number;
  };
}

export interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  description: string;
  authRequired?: boolean;
}

export interface PRD {
  overview: string;
  objectives: string[];
  targetAudience: string;
  userPersonas: UserPersona[];
  userStories: UserStory[];
  functionalRequirements: FunctionalRequirement[];
  nonFunctionalRequirements: string[];
  technicalStack: TechnicalStack;
  milestones: Milestone[];
  successMetrics: string[];
}

export interface UserPersona {
  name: string;
  role: string;
  goals: string[];
  painPoints: string[];
  behaviors: string[];
}

export interface UserStory {
  id: string;
  title: string;
  description: string;
  acceptanceCriteria: string[];
  priority: 'high' | 'medium' | 'low';
}

export interface FunctionalRequirement {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

export interface TechnicalStack {
  frontend: string[];
  backend?: string[];
  database?: string;
  hosting?: string;
  tools: string[];
}

export interface Milestone {
  phase: string;
  duration: string;
  deliverables: string[];
}

export interface DesignSystem {
  introduction: string;
  colors: ColorSystem;
  typography: TypographySystem;
  spacing: SpacingSystem;
  breakpoints: BreakpointSystem;
  components: ComponentSpec[];
  guidelines: DesignGuidelines;
}

export interface ColorSystem {
  palette: Record<string, ColorToken[]>;
  semantic: SemanticColors;
  usage: ColorUsage[];
}

export interface ColorToken {
  name: string;
  value: string;
  hex: string;
  usage: string;
}

export interface SemanticColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  error: string;
  success: string;
  warning: string;
  info: string;
}

export interface ColorUsage {
  token: string;
  useCase: string;
  example: string;
}

export interface TypographySystem {
  fontFamilies: FontFamily[];
  fontSizes: FontSize[];
  fontWeights: FontWeight[];
  lineHeights: LineHeight[];
  headings: HeadingStyle[];
  bodyText: BodyTextStyle[];
}

export interface FontFamily {
  name: string;
  variable: string;
  usage: string;
}

export interface FontSize {
  name: string;
  value: string;
  css: string;
}

export interface FontWeight {
  name: string;
  value: number;
  css: string;
}

export interface LineHeight {
  name: string;
  value: number;
  css: string;
}

export interface HeadingStyle {
  level: string;
  fontSize: string;
  fontWeight: string;
  lineHeight: number;
  css: string;
}

export interface BodyTextStyle {
  variant: string;
  fontSize: string;
  fontWeight: string;
  lineHeight: number;
  css: string;
}

export interface SpacingSystem {
  scale: SpacingToken[];
  usage: SpacingUsage[];
}

export interface SpacingToken {
  name: string;
  value: string;
  rem: string;
}

export interface SpacingUsage {
  token: string;
  useCase: string;
  example: string;
}

export interface BreakpointSystem {
  breakpoints: Breakpoint[];
  mediaQueries: MediaQuery[];
}

export interface Breakpoint {
  name: string;
  value: string;
  description: string;
}

export interface MediaQuery {
  name: string;
  query: string;
  usage: string;
}

export interface ComponentSpec {
  name: string;
  description: string;
  variants: string[];
  states: string[];
  props?: ComponentProp[];
  accessibility: string[];
}

export interface ComponentProp {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

export interface DesignGuidelines {
  principles: DesignPrinciple[];
  accessibility: AccessibilityGuideline[];
  responsiveDesign: ResponsiveGuideline[];
  motion: MotionGuideline[];
}

export interface DesignPrinciple {
  name: string;
  description: string;
  examples: string[];
}

export interface AccessibilityGuideline {
  principle: string;
  requirement: string;
  implementation: string;
}

export interface ResponsiveGuideline {
  breakpoint: string;
  guideline: string;
  example: string;
}

export interface MotionGuideline {
  type: string;
  duration: string;
  easing: string;
  useCase: string;
}
