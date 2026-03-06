import type { ProjectConfig } from '../types';

export function generateStorybookMainConfig(config: ProjectConfig): string {
  return `import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-onboarding',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
    '@storybook/addon-styling',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
};

export default config;
`;
}

export function generateStorybookPreviewConfig(config: ProjectConfig): string {
  return `import type { Preview } from '@storybook/react';
import '../src/styles/globals.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      element: '#root',
      config: {},
      options: {},
      manual: false,
    },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '2rem' }}>
        <Story />
      </div>
    ),
  ],
};

export default preview;
`;
}

export function generateComponentStory(config: { componentName: string; props: Record<string, any> }): string {
  const { componentName, props } = config;
  const storyName = componentName.replace(/([A-Z])/g, ' $1').trim();
  
  const propEntries = Object.entries(props);
  const argTypes = propEntries.reduce((acc, [name, prop]) => {
    acc[name] = {
      control: {
        type: getControlType(prop.type),
      },
      description: prop.description || '',
      table: {
        type: { summary: prop.type },
        defaultValue: { summary: prop.default },
      },
    };
    return acc;
  }, {} as Record<string, any>);

  const defaultArgs = propEntries.reduce((acc, [name, prop]) => {
    acc[name] = prop.default;
    return acc;
  }, {} as Record<string, any>);

  return `import type { Meta, StoryObj } from '@storybook/react';
import { ${componentName} } from './${componentName}';

const meta = {
  title: 'Components/${storyName}',
  component: ${componentName},
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: ${JSON.stringify(argTypes, null, 2)},
} satisfies Meta<typeof ${componentName}>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: ${JSON.stringify(defaultArgs, null, 2)},
};

export const WithChildren: Story = {
  args: {
    ...${JSON.stringify(defaultArgs, null, 2)},
    children: 'Click me',
  },
};
`;
}

function getControlType(type: string): string {
  const typeMap: Record<string, string> = {
    string: 'text',
    number: 'number',
    boolean: 'boolean',
    object: 'object',
    array: 'object',
  };
  return typeMap[type] || 'text';
}

export function generateStorybookPackageJson(config: ProjectConfig): string {
  return JSON.stringify(
    {
      name: `${config.projectName}-storybook`,
      private: true,
      version: '1.0.0',
      scripts: {
        storybook: 'storybook dev -p 6006',
        'build-storybook': 'storybook build',
        'test-storybook': 'test-storybook',
      },
      devDependencies: {
        '@storybook/addon-a11y': '^7.6.0',
        '@storybook/addon-essentials': '^7.6.0',
        '@storybook/addon-interactions': '^7.6.0',
        '@storybook/addon-links': '^7.6.0',
        '@storybook/addon-onboarding': '^1.0.10',
        '@storybook/addon-styling': '^1.3.7',
        '@storybook/blocks': '^7.6.0',
        '@storybook/react': '^7.6.0',
        '@storybook/react-vite': '^7.6.0',
        '@storybook/test-runner': '^0.16.0',
        '@storybook/testing-library': '^0.2.2',
        'prop-types': '^15.8.1',
        react: '^18.2.0',
        'react-dom': '^18.2.0',
        storybook: '^7.6.0',
        typescript: '^5.3.0',
      },
    },
    null,
    2
  );
}

export function generateViteStorybookConfig(config: ProjectConfig): string {
  return `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 6006,
  },
});
`;
}
