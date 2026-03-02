"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateDesignSystem = generateDesignSystem;
exports.formatDesignSystem = formatDesignSystem;
function generateDesignSystem(config) {
    const colorPalette = config.colorPalette;
    const colorSystem = {
        palette: {
            primary: [
                { name: 'primary-50', value: '50', hex: lightenColor(colorPalette.primary, 40), usage: 'Subtle backgrounds, hover states' },
                { name: 'primary-100', value: '100', hex: lightenColor(colorPalette.primary, 30), usage: 'Backgrounds, borders' },
                { name: 'primary-200', value: '200', hex: lightenColor(colorPalette.primary, 20), usage: 'Secondary elements' },
                { name: 'primary-300', value: '300', hex: lightenColor(colorPalette.primary, 10), usage: 'Soft highlight elements' },
                { name: 'primary-400', value: '400', hex: lightenColor(colorPalette.primary, 5), usage: 'Primary button hover' },
                { name: 'primary-500', value: '500', hex: colorPalette.primary, usage: 'Main primary color' },
                { name: 'primary-600', value: '600', hex: darkenColor(colorPalette.primary, 5), usage: 'Primary button active' },
                { name: 'primary-700', value: '700', hex: darkenColor(colorPalette.primary, 10), usage: 'Focused elements' },
                { name: 'primary-800', value: '800', hex: darkenColor(colorPalette.primary, 20), usage: 'Highlighted text' },
                { name: 'primary-900', value: '900', hex: darkenColor(colorPalette.primary, 30), usage: 'Primary text' },
            ],
            secondary: [
                { name: 'secondary-50', value: '50', hex: lightenColor(colorPalette.secondary, 40), usage: 'Subtle backgrounds' },
                { name: 'secondary-100', value: '100', hex: lightenColor(colorPalette.secondary, 30), usage: 'Backgrounds' },
                { name: 'secondary-200', value: '200', hex: lightenColor(colorPalette.secondary, 20), usage: 'Secondary elements' },
                { name: 'secondary-300', value: '300', hex: lightenColor(colorPalette.secondary, 10), usage: 'Soft highlights' },
                { name: 'secondary-400', value: '400', hex: lightenColor(colorPalette.secondary, 5), usage: 'Secondary hover' },
                { name: 'secondary-500', value: '500', hex: colorPalette.secondary, usage: 'Main secondary color' },
                { name: 'secondary-600', value: '600', hex: darkenColor(colorPalette.secondary, 5), usage: 'Secondary active' },
                { name: 'secondary-700', value: '700', hex: darkenColor(colorPalette.secondary, 10), usage: 'Secondary focus' },
                { name: 'secondary-800', value: '800', hex: darkenColor(colorPalette.secondary, 20), usage: 'Secondary text' },
                { name: 'secondary-900', value: '900', hex: darkenColor(colorPalette.secondary, 30), usage: 'Highlighted secondary text' },
            ],
            accent: [
                { name: 'accent-50', value: '50', hex: lightenColor(colorPalette.accent, 40), usage: 'Subtle accent backgrounds' },
                { name: 'accent-100', value: '100', hex: lightenColor(colorPalette.accent, 30), usage: 'Accent backgrounds' },
                { name: 'accent-200', value: '200', hex: lightenColor(colorPalette.accent, 20), usage: 'Accent elements' },
                { name: 'accent-300', value: '300', hex: lightenColor(colorPalette.accent, 10), usage: 'Accents' },
                { name: 'accent-400', value: '400', hex: lightenColor(colorPalette.accent, 5), usage: 'Accent hover' },
                { name: 'accent-500', value: '500', hex: colorPalette.accent, usage: 'Main accent color' },
                { name: 'accent-600', value: '600', hex: darkenColor(colorPalette.accent, 5), usage: 'Accent active' },
                { name: 'accent-700', value: '700', hex: darkenColor(colorPalette.accent, 10), usage: 'Accent focus' },
                { name: 'accent-800', value: '800', hex: darkenColor(colorPalette.accent, 20), usage: 'Accent text' },
                { name: 'accent-900', value: '900', hex: darkenColor(colorPalette.accent, 30), usage: 'Important accent text' },
            ],
            neutral: [
                { name: 'neutral-50', value: '50', hex: '#F9FAFB', usage: 'Page backgrounds' },
                { name: 'neutral-100', value: '100', hex: '#F3F4F6', usage: 'Card backgrounds' },
                { name: 'neutral-200', value: '200', hex: '#E5E7EB', usage: 'Subtle borders' },
                { name: 'neutral-300', value: '300', hex: '#D1D5DB', usage: 'Borders' },
                { name: 'neutral-400', value: '400', hex: '#9CA3AF', usage: 'Disabled text' },
                { name: 'neutral-500', value: '500', hex: '#6B7280', usage: 'Secondary text' },
                { name: 'neutral-600', value: '600', hex: '#4B5563', usage: 'Body text' },
                { name: 'neutral-700', value: '700', hex: '#374151', usage: 'Primary text' },
                { name: 'neutral-800', value: '800', hex: '#1F2937', usage: 'Headings' },
                { name: 'neutral-900', value: '900', hex: '#111827', usage: 'Emphasis text' },
            ],
        },
        semantic: {
            primary: 'primary-500',
            secondary: 'secondary-500',
            accent: 'accent-500',
            background: 'neutral-50',
            surface: 'neutral-0',
            error: 'red-500',
            success: 'green-500',
            warning: 'amber-500',
            info: 'blue-500',
        },
        usage: [
            { token: 'primary-500', useCase: 'Primary buttons, links, CTAs', example: 'bg-primary-500 hover:bg-primary-600' },
            { token: 'secondary-500', useCase: 'Secondary buttons, alternative actions', example: 'bg-secondary-500 hover:bg-secondary-600' },
            { token: 'accent-500', useCase: 'Highlights, badges, notifications', example: 'text-accent-500' },
            { token: 'neutral-50', useCase: 'Page background', example: 'bg-neutral-50' },
            { token: 'neutral-100', useCase: 'Card and surface backgrounds', example: 'bg-neutral-100' },
            { token: 'neutral-700', useCase: 'Heading text', example: 'text-neutral-700' },
            { token: 'neutral-500', useCase: 'Body text and descriptions', example: 'text-neutral-500' },
        ],
    };
    const typographySystem = {
        fontFamilies: [
            { name: config.typography.fontFamily.heading, variable: '--font-heading', usage: 'Headings and titles' },
            { name: config.typography.fontFamily.body, variable: '--font-body', usage: 'Body text and paragraphs' },
            { name: config.typography.fontFamily.mono, variable: '--font-mono', usage: 'Code and technical data' },
        ],
        fontSizes: [
            { name: 'xs', value: '12px', css: '0.75rem' },
            { name: 'sm', value: '14px', css: '0.875rem' },
            { name: 'base', value: '16px', css: '1rem' },
            { name: 'lg', value: '18px', css: '1.125rem' },
            { name: 'xl', value: '20px', css: '1.25rem' },
            { name: '2xl', value: '24px', css: '1.5rem' },
            { name: '3xl', value: '30px', css: '1.875rem' },
            { name: '4xl', value: '36px', css: '2.25rem' },
            { name: '5xl', value: '48px', css: '3rem' },
            { name: '6xl', value: '60px', css: '3.75rem' },
        ],
        fontWeights: [
            { name: 'normal', value: 400, css: '400' },
            { name: 'medium', value: 500, css: '500' },
            { name: 'semibold', value: 600, css: '600' },
            { name: 'bold', value: 700, css: '700' },
            { name: 'extrabold', value: 800, css: '800' },
        ],
        lineHeights: [
            { name: 'tight', value: 1.25, css: '1.25' },
            { name: 'snug', value: 1.375, css: '1.375' },
            { name: 'normal', value: 1.5, css: '1.5' },
            { name: 'relaxed', value: 1.625, css: '1.625' },
            { name: 'loose', value: 2, css: '2' },
        ],
        headings: [
            { level: 'h1', fontSize: '4xl', fontWeight: 'bold', lineHeight: 1.1, css: 'font-size: 2.25rem; font-weight: 700; line-height: 1.1;' },
            { level: 'h2', fontSize: '3xl', fontWeight: 'bold', lineHeight: 1.2, css: 'font-size: 1.875rem; font-weight: 700; line-height: 1.2;' },
            { level: 'h3', fontSize: '2xl', fontWeight: 'semibold', lineHeight: 1.25, css: 'font-size: 1.5rem; font-weight: 600; line-height: 1.25;' },
            { level: 'h4', fontSize: 'xl', fontWeight: 'semibold', lineHeight: 1.3, css: 'font-size: 1.25rem; font-weight: 600; line-height: 1.3;' },
            { level: 'h5', fontSize: 'lg', fontWeight: 'medium', lineHeight: 1.4, css: 'font-size: 1.125rem; font-weight: 500; line-height: 1.4;' },
            { level: 'h6', fontSize: 'base', fontWeight: 'medium', lineHeight: 1.5, css: 'font-size: 1rem; font-weight: 500; line-height: 1.5;' },
        ],
        bodyText: [
            { variant: 'large', fontSize: 'lg', fontWeight: 'normal', lineHeight: 1.625, css: 'font-size: 1.125rem; font-weight: 400; line-height: 1.625;' },
            { variant: 'base', fontSize: 'base', fontWeight: 'normal', lineHeight: 1.5, css: 'font-size: 1rem; font-weight: 400; line-height: 1.5;' },
            { variant: 'small', fontSize: 'sm', fontWeight: 'normal', lineHeight: 1.5, css: 'font-size: 0.875rem; font-weight: 400; line-height: 1.5;' },
            { variant: 'caption', fontSize: 'xs', fontWeight: 'normal', lineHeight: 1.4, css: 'font-size: 0.75rem; font-weight: 400; line-height: 1.4;' },
        ],
    };
    const spacingSystem = {
        scale: [
            { name: '0', value: '0px', rem: '0' },
            { name: '1', value: '4px', rem: '0.25rem' },
            { name: '2', value: '8px', rem: '0.5rem' },
            { name: '3', value: '12px', rem: '0.75rem' },
            { name: '4', value: '16px', rem: '1rem' },
            { name: '5', value: '20px', rem: '1.25rem' },
            { name: '6', value: '24px', rem: '1.5rem' },
            { name: '8', value: '32px', rem: '2rem' },
            { name: '10', value: '40px', rem: '2.5rem' },
            { name: '12', value: '48px', rem: '3rem' },
            { name: '16', value: '64px', rem: '4rem' },
            { name: '20', value: '80px', rem: '5rem' },
            { name: '24', value: '96px', rem: '6rem' },
        ],
        usage: [
            { token: 'spacing-1', useCase: 'Minimum spacing between related elements', example: 'gap-1, m-1, p-1' },
            { token: 'spacing-2', useCase: 'Spacing between icons and text', example: 'gap-2, m-2, p-2' },
            { token: 'spacing-4', useCase: 'Default spacing between components', example: 'gap-4, m-4, p-4' },
            { token: 'spacing-6', useCase: 'Spacing between sections', example: 'gap-6, m-6, p-6' },
            { token: 'spacing-8', useCase: 'Spacing between content blocks', example: 'gap-8, m-8, p-8' },
            { token: 'spacing-12', useCase: 'Spacing between main sections', example: 'gap-12, my-12' },
        ],
    };
    const breakpointSystem = {
        breakpoints: [
            { name: 'sm', value: '640px', description: 'Smartphones in landscape' },
            { name: 'md', value: '768px', description: 'Tablets' },
            { name: 'lg', value: '1024px', description: 'Laptops' },
            { name: 'xl', value: '1280px', description: 'Desktops' },
            { name: '2xl', value: '1536px', description: 'Large screens' },
        ],
        mediaQueries: [
            { name: 'sm', query: '@media (min-width: 640px)', usage: 'md:style' },
            { name: 'md', query: '@media (min-width: 768px)', usage: 'lg:style' },
            { name: 'lg', query: '@media (min-width: 1024px)', usage: 'xl:style' },
            { name: 'xl', query: '@media (min-width: 1280px)', usage: '2xl:style' },
            { name: '2xl', query: '@media (min-width: 1536px)', usage: 'only 2xl:style' },
        ],
    };
    const componentSpecs = config.components.map((component) => ({
        name: component,
        description: `${component} component that is reusable and accessible`,
        variants: ['default', 'outline', 'ghost', 'link'],
        states: ['default', 'hover', 'active', 'focus', 'disabled', 'loading'],
        accessibility: [
            'Keyboard navigation support',
            'Appropriate ARIA attributes',
            'Visible focus state',
            'WCAG AA color contrast',
        ],
    }));
    const designGuidelines = {
        principles: [
            {
                name: 'Clarity',
                description: 'The interface should be clear and easy to understand, minimizing cognitive load for the user',
                examples: [
                    'Use simple and direct language',
                    'Use labels alongside icons when needed',
                    'Avoid unnecessary technical jargon',
                ],
            },
            {
                name: 'Consistency',
                description: 'Keep visual and interaction patterns consistent across the entire application',
                examples: [
                    'Use the same components for similar actions',
                    'Maintain the same visual hierarchy on similar pages',
                    'Standardize spacing and colors',
                ],
            },
            {
                name: 'Efficiency',
                description: 'Allow users to complete tasks with minimal effort',
                examples: [
                    'Keyboard shortcuts for frequent actions',
                    'Automatic form filling',
                    'Search history and suggestions in search fields',
                ],
            },
            {
                name: 'Feedback',
                description: 'Provide clear, immediate feedback for all user actions',
                examples: [
                    'Loading states during async operations',
                    'Success/error messages after actions',
                    'Visual progress indicators',
                ],
            },
        ],
        accessibility: [
            {
                principle: 'Perceivable',
                requirement: 'Provide text alternatives for non-text content',
                implementation: 'Always use alt text on images and aria-label on icons',
            },
            {
                principle: 'Operable',
                requirement: 'All functionality must be accessible via keyboard',
                implementation: 'Implement tabindex, focus management and keyboard shortcuts',
            },
            {
                principle: 'Understandable',
                requirement: 'Text must be readable and understandable',
                implementation: 'Use plain language and provide definitions for uncommon terms',
            },
            {
                principle: 'Robust',
                requirement: 'Content must be interpretable by assistive technologies',
                implementation: 'Use semantic HTML and appropriate ARIA roles',
            },
        ],
        responsiveDesign: [
            {
                breakpoint: 'Mobile (< 640px)',
                guideline: 'Mobile-first design, single-column content, simplified navigation',
                example: 'Hamburger menu, buttons with a minimum touch target of 44x44px',
            },
            {
                breakpoint: 'Tablet (640px - 1024px)',
                guideline: 'Two-column layout, expanded navigation, more space for content',
                example: 'Optional sidebar, 2-3 column grids',
            },
            {
                breakpoint: 'Desktop (> 1024px)',
                guideline: 'Full layout, complete navigation, maximum use of available space',
                example: 'Fixed sidebar, 3-4 column grids, additional information visible',
            },
        ],
        motion: [
            {
                type: 'Fade',
                duration: '200ms',
                easing: 'ease-in-out',
                useCase: 'Opacity transitions, modals, dropdowns',
            },
            {
                type: 'Slide',
                duration: '300ms',
                easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
                useCase: 'Page transitions, drawers, notifications',
            },
            {
                type: 'Scale',
                duration: '150ms',
                easing: 'ease-out',
                useCase: 'Hover states on buttons, cards and interactive elements',
            },
            {
                type: 'Bounce',
                duration: '500ms',
                easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                useCase: 'Success feedback and important notifications',
            },
        ],
    };
    return {
        introduction: `# Design System - ${config.projectName}\n\nThis Design System defines the visual and interaction patterns for the **${config.projectName}** project. It ensures consistency, accessibility and efficiency when developing the user interface.`,
        colors: colorSystem,
        typography: typographySystem,
        spacing: spacingSystem,
        breakpoints: breakpointSystem,
        components: componentSpecs,
        guidelines: designGuidelines,
    };
}
function formatDesignSystem(ds) {
    let markdown = `# 🎨 Design System\n\n`;
    markdown += `${ds.introduction}\n\n`;
    // Colors
    markdown += `## 🌈 Colors\n\n`;
    markdown += `The color system is based on a semantic palette that makes maintenance easier and ensures visual consistency.\n\n`;
    Object.entries(ds.colors.palette).forEach(([category, tokens]) => {
        markdown += `### ${capitalizeFirst(category)}\n\n`;
        markdown += `| Token | Hex | Usage |\n`;
        markdown += `|-------|-----|-----|\n`;
        tokens.forEach((token) => {
            markdown += `| \`${token.name}\` | \`${token.hex}\` | ${token.usage} |\n`;
        });
        markdown += `\n`;
    });
    markdown += `### Semantic Colors\n\n`;
    markdown += `| Token | Value | Usage |\n`;
    markdown += `|-------|-------|-----|\n`;
    Object.entries(ds.colors.semantic).forEach(([key, value]) => {
        markdown += `| ${capitalizeFirst(key)} | \`${value}\` | ${getSemanticColorUsage(key)} |\n`;
    });
    markdown += `\n`;
    // Typography
    markdown += `## 📝 Typography\n\n`;
    markdown += `### Font Families\n\n`;
    markdown += `| Name | CSS Variable | Usage |\n`;
    markdown += `|------|--------------|-----|\n`;
    ds.typography.fontFamilies.forEach((font) => {
        markdown += `| ${font.name} | \`${font.variable}\` | ${font.usage} |\n`;
    });
    markdown += `\n`;
    markdown += `### Font Sizes\n\n`;
    markdown += `| Name | Value | CSS |\n`;
    markdown += `|------|-------|-----|\n`;
    ds.typography.fontSizes.forEach((size) => {
        markdown += `| ${size.name} | ${size.value} | \`${size.css}\` |\n`;
    });
    markdown += `\n`;
    markdown += `### Headings\n\n`;
    markdown += `| Level | Size | Weight | Line Height |\n`;
    markdown += `|-------|-----------|------|-------------|\n`;
    ds.typography.headings.forEach((heading) => {
        markdown += `| ${heading.level} | ${heading.fontSize} | ${heading.fontWeight} | ${heading.lineHeight} |\n`;
    });
    markdown += `\n`;
    // Spacing
    markdown += `## 📏 Spacing\n\n`;
    markdown += `| Token | Value | Rem |\n`;
    markdown += `|-------|-------|-----|\n`;
    ds.spacing.scale.forEach((space) => {
        markdown += `| ${space.name} | ${space.value} | \`${space.rem}\` |\n`;
    });
    markdown += `\n`;
    // Breakpoints
    markdown += `## 📱 Breakpoints\n\n`;
    markdown += `| Name | Value | Description |\n`;
    markdown += `|------|-------|-------------|\n`;
    ds.breakpoints.breakpoints.forEach((bp) => {
        markdown += `| ${bp.name} | ${bp.value} | ${bp.description} |\n`;
    });
    markdown += `\n`;
    // Components
    markdown += `## 🧩 Components\n\n`;
    ds.components.forEach((component) => {
        markdown += `### ${component.name}\n\n`;
        markdown += `${component.description}\n\n`;
        markdown += `**Variants:** ${component.variants.join(', ')}\n\n`;
        markdown += `**States:** ${component.states.join(', ')}\n\n`;
        markdown += `**Accessibility:**\n`;
        component.accessibility.forEach((acc) => {
            markdown += `- ${acc}\n`;
        });
        markdown += `\n`;
    });
    // Guidelines
    markdown += `## 📐 Design Guidelines\n\n`;
    markdown += `### Principles\n\n`;
    ds.guidelines.principles.forEach((principle) => {
        markdown += `#### ${principle.name}\n\n`;
        markdown += `${principle.description}\n\n`;
        markdown += `**Examples:**\n`;
        principle.examples.forEach((example) => {
            markdown += `- ${example}\n`;
        });
        markdown += `\n`;
    });
    markdown += `### Accessibility\n\n`;
    markdown += `| Principle | Requirement | Implementation |\n`;
    markdown += `|-----------|-------------|----------------|\n`;
    ds.guidelines.accessibility.forEach((acc) => {
        markdown += `| ${acc.principle} | ${acc.requirement} | ${acc.implementation} |\n`;
    });
    markdown += `\n`;
    markdown += `### Responsive Design\n\n`;
    ds.guidelines.responsiveDesign.forEach((resp) => {
        markdown += `#### ${resp.breakpoint}\n\n`;
        markdown += `**Guideline:** ${resp.guideline}\n\n`;
        markdown += `**Example:** ${resp.example}\n\n`;
    });
    markdown += `### Motion\n\n`;
    markdown += `| Type | Duration | Easing | Usage |\n`;
    markdown += `|------|----------|--------|-------|\n`;
    ds.guidelines.motion.forEach((motion) => {
        markdown += `| ${motion.type} | ${motion.duration} | ${motion.easing} | ${motion.useCase} |\n`;
    });
    markdown += `\n`;
    markdown += `---\n\n`;
    markdown += `*Design System automatically generated by the sparkseed CLI*\n`;
    return markdown;
}
// Helper functions
function lightenColor(hex, percent) {
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.min(255, (num >> 16) + amt);
    const G = Math.min(255, ((num >> 8) & 0x00ff) + amt);
    const B = Math.min(255, (num & 0x0000ff) + amt);
    return `#${((1 << 24) + (R << 16) + (G << 8) + B).toString(16).slice(1)}`;
}
function darkenColor(hex, percent) {
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.max(0, (num >> 16) - amt);
    const G = Math.max(0, ((num >> 8) & 0x00ff) - amt);
    const B = Math.max(0, (num & 0x0000ff) - amt);
    return `#${((1 << 24) + (R << 16) + (G << 8) + B).toString(16).slice(1)}`;
}
function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
function getSemanticColorUsage(name) {
    const usages = {
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
    return usages[name] || name;
}
//# sourceMappingURL=design-system-generator.js.map