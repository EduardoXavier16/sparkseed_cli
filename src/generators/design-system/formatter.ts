import type { DesignSystem, SupportedLanguage } from '../../types';

import { DESIGN_SYSTEM_LOCALE_TEXTS, type IDesignSystemLocaleTexts } from './locales';

export function formatDesignSystem(ds: DesignSystem, language?: SupportedLanguage): string {
  const selectedLanguage: SupportedLanguage = language ?? 'en';
  const locale = DESIGN_SYSTEM_LOCALE_TEXTS[selectedLanguage];

  let markdown = `# 🎨 ${locale.headings.title}\n\n`;
  markdown += `${ds.introduction}\n\n`;

  markdown += `## 🌈 ${locale.headings.colors}\n\n`;
  markdown += `${locale.labels.colorSystemDescription}\n\n`;

  Object.entries(ds.colors.palette).forEach(([category, tokens]) => {
    markdown += `### ${capitalizeFirst(category)}\n\n`;
    markdown += `| ${locale.labels.token} | Hex | ${locale.labels.usage} |\n`;
    markdown += `|-------|-----|-----|\n`;
    tokens.forEach((token) => {
      markdown += `| \`${token.name}\` | \`${token.hex}\` | ${token.usage} |\n`;
    });
    markdown += `\n`;
  });

  markdown += `### ${locale.headings.semanticColors}\n\n`;
  markdown += `| ${locale.labels.token} | ${locale.labels.value} | ${locale.labels.usage} |\n`;
  markdown += `|-------|-------|-----|\n`;
  Object.entries(ds.colors.semantic).forEach(([key, value]) => {
    markdown += `| ${capitalizeFirst(key)} | \`${value}\` | ${getSemanticColorUsage(key, locale)} |\n`;
  });
  markdown += `\n`;

  markdown += `## 📝 ${locale.headings.typography}\n\n`;

  markdown += `### ${locale.headings.fontFamilies}\n\n`;
  markdown += `| ${locale.labels.name} | ${locale.labels.cssVariable} | ${locale.labels.usage} |\n`;
  markdown += `|------|--------------|-----|\n`;
  ds.typography.fontFamilies.forEach((font) => {
    markdown += `| ${font.name} | \`${font.variable}\` | ${font.usage} |\n`;
  });
  markdown += `\n`;

  markdown += `### ${locale.headings.fontSizes}\n\n`;
  markdown += `| ${locale.labels.name} | ${locale.labels.value} | ${locale.labels.css} |\n`;
  markdown += `|------|-------|-----|\n`;
  ds.typography.fontSizes.forEach((size) => {
    markdown += `| ${size.name} | ${size.value} | \`${size.css}\` |\n`;
  });
  markdown += `\n`;

  markdown += `### ${locale.headings.headings}\n\n`;
  markdown += `| ${locale.labels.level} | ${locale.labels.size} | ${locale.labels.weight} | ${locale.labels.lineHeight} |\n`;
  markdown += `|-------|-----------|------|-------------|\n`;
  ds.typography.headings.forEach((heading) => {
    markdown += `| ${heading.level} | ${heading.fontSize} | ${heading.fontWeight} | ${heading.lineHeight} |\n`;
  });
  markdown += `\n`;

  markdown += `## 📏 ${locale.headings.spacing}\n\n`;
  markdown += `| ${locale.labels.token} | ${locale.labels.value} | Rem |\n`;
  markdown += `|-------|-------|-----|\n`;
  ds.spacing.scale.forEach((space) => {
    markdown += `| ${space.name} | ${space.value} | \`${space.rem}\` |\n`;
  });
  markdown += `\n`;

  markdown += `## 📱 ${locale.headings.breakpoints}\n\n`;
  markdown += `| ${locale.labels.name} | ${locale.labels.value} | ${locale.labels.description} |\n`;
  markdown += `|------|-------|-------------|\n`;
  ds.breakpoints.breakpoints.forEach((bp) => {
    markdown += `| ${bp.name} | ${bp.value} | ${bp.description} |\n`;
  });
  markdown += `\n`;

  markdown += `## 🧩 ${locale.headings.components}\n\n`;
  ds.components.forEach((component) => {
    markdown += `### ${component.name}\n\n`;
    markdown += `${component.description}\n\n`;
    markdown += `**Variants:** ${component.variants.join(', ')}\n\n`;
    markdown += `**States:** ${component.states.join(', ')}\n\n`;
    markdown += `**${locale.headings.accessibility}:**\n`;
    component.accessibility.forEach((acc) => {
      markdown += `- ${acc}\n`;
    });
    markdown += `\n`;
  });

  markdown += `## 📐 ${locale.headings.designGuidelines}\n\n`;

  markdown += `### ${locale.headings.principles}\n\n`;
  ds.guidelines.principles.forEach((principle) => {
    markdown += `#### ${principle.name}\n\n`;
    markdown += `${principle.description}\n\n`;
    markdown += `**${locale.labels.examples}:**\n`;
    principle.examples.forEach((example) => {
      markdown += `- ${example}\n`;
    });
    markdown += `\n`;
  });

  markdown += `### ${locale.headings.accessibility}\n\n`;
  markdown += `| ${locale.labels.name} | Requirement | Implementation |\n`;
  markdown += `|-----------|-------------|----------------|\n`;
  ds.guidelines.accessibility.forEach((acc) => {
    markdown += `| ${acc.principle} | ${acc.requirement} | ${acc.implementation} |\n`;
  });
  markdown += `\n`;

  markdown += `### ${locale.headings.responsiveDesign}\n\n`;
  ds.guidelines.responsiveDesign.forEach((resp) => {
    markdown += `#### ${resp.breakpoint}\n\n`;
    markdown += `**${locale.labels.guideline}:** ${resp.guideline}\n\n`;
    markdown += `**${locale.labels.example}:** ${resp.example}\n\n`;
  });

  markdown += `### ${locale.headings.motion}\n\n`;
  markdown += `| ${locale.labels.type} | ${locale.labels.duration} | ${locale.labels.easing} | ${locale.labels.usage} |\n`;
  markdown += `|------|----------|--------|-------|\n`;
  ds.guidelines.motion.forEach((motion) => {
    markdown += `| ${motion.type} | ${motion.duration} | ${motion.easing} | ${motion.useCase} |\n`;
  });
  markdown += `\n`;

  markdown += `---\n\n`;
  markdown += `*${locale.labels.generatedBy}*\n`;

  return markdown;
}

function capitalizeFirst(str: string): string {
  if (str.length === 0) {
    return str;
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getSemanticColorUsage(name: string, locale: IDesignSystemLocaleTexts): string {
  const usages: Record<string, string> = {
    primary: 'Primary actions, links, CTAs',
    secondary: 'Secondary actions, supporting elements',
    accent: 'Highlights, notifications, badges',
    background: 'Page background',
    surface: 'Card, modal and surface backgrounds',
    error: 'Error messages, invalid states',
    success: 'Success messages, confirmations',
    warning: 'Alerts, important warnings',
    info: 'Informational content, tips',
  };

  const usage = usages[name];
  if (usage !== undefined) {
    return usage;
  }

  return `${locale.labels.usage}: ${name}`;
}
