import {
  generateDesignSystem as buildDesignSystem,
  formatDesignSystem as renderDesignSystem,
} from '.';
import type { DesignSystem, ProjectConfig, SupportedLanguage } from '../../types';

export function generateDesignSystem(config: ProjectConfig): DesignSystem {
  return buildDesignSystem(config);
}

export function formatDesignSystem(ds: DesignSystem, language?: SupportedLanguage): string {
  return renderDesignSystem(ds, language);
}
