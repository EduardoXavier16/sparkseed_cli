import { generatePRD as buildPrd, formatPRD as renderPrd } from '.';
import type { PRD, ProjectConfig, SupportedLanguage } from '../../types';

export function generatePRD(config: ProjectConfig): PRD {
  return buildPrd(config);
}

export function formatPRD(prd: PRD, language?: SupportedLanguage): string {
  return renderPrd(prd, language);
}
