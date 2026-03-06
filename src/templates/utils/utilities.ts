import type { ProjectConfig } from '../types';

export function generateCnUtility(): string {
  return [
    "import type { ClassValue } from 'clsx';",
    "import { clsx } from 'clsx';",
    "import { twMerge } from 'tailwind-merge';",
    '',
    'export function cn(...inputs: ClassValue[]): string {',
    '  return twMerge(clsx(inputs));',
    '}',
    '',
  ].join('\n');
}

export function generateFormatUtility(config: ProjectConfig): string {
  const defaultLocale = config.primaryLocale ?? 'en-US';
  const defaultCurrency =
    config.database === 'postgresql' ? 'BRL' : config.database === 'mysql' ? 'USD' : 'USD';

  return [
    `const DEFAULT_LOCALE = '${defaultLocale}';`,
    `const DEFAULT_CURRENCY = '${defaultCurrency}';`,
    '',
    'export function formatDate(date: Date): string {',
    '  return new Intl.DateTimeFormat(DEFAULT_LOCALE).format(date);',
    '}',
    '',
    'export function formatCurrency(value: number, currency: string = DEFAULT_CURRENCY): string {',
    '  return new Intl.NumberFormat(DEFAULT_LOCALE, {',
    "    style: 'currency',",
    '    currency,',
    '  }).format(value);',
    '}',
    '',
  ].join('\n');
}

export function generateTypesIndex(): string {
  return ['export interface ApiResponse<T> {', '  data: T;', '  error?: string;', '}', ''].join(
    '\n'
  );
}
