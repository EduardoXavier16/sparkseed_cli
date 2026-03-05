import type { ComponentConfig } from './types';

export function generateComponentTemplate(config: ComponentConfig): string {
  const { componentName, language, withStyles, description } = config;
  const isTs = language === 'typescript';
  const ext = isTs ? 'tsx' : 'jsx';

  const interfaceName = `${componentName}Props`;

  if (isTs) {
    return `import type { FC } from 'react';
import styles from './${componentName}.styles';

export interface ${interfaceName} {
  className?: string;
  children?: React.ReactNode;
}

/**
 * ${description || `The ${componentName} component`}
 */
export const ${componentName}: FC<${interfaceName}> = ({ className = '', children }) => {
  return (
    <div className={\`\${styles.root} \${className}\`}>
      {children}
    </div>
  );
};

${componentName}.displayName = '${componentName}';
`;
  }

  return `import { PropTypes } from 'prop-types';
import styles from './${componentName}.styles';

/**
 * ${description || `The ${componentName} component`}
 */
export const ${componentName} = ({ className = '', children }) => {
  return (
    <div className={\`\${styles.root} \${className}\`}>
      {children}
    </div>
  );
};

${componentName}.displayName = '${componentName}';

${componentName}.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};
`;
}

export function generateComponentStyles(config: ComponentConfig): string {
  const { componentName, styling } = config;

  const styleName = componentName.replace(/([A-Z])/g, '-$1').toLowerCase().slice(1);

  if (styling === 'tailwind') {
    return `import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function ${componentName}Styles({ className = '' }: { className?: string } = {}) {
  return twMerge(clsx(
    'flex flex-col gap-2 p-4 rounded-lg bg-white shadow-sm border border-gray-100',
    className
  ));
}

export const ${componentName}StylesDefault = {
  root: ${componentName}Styles(),
};
`;
  }

  if (styling === 'styled-components') {
    return `import styled from 'styled-components';

export const ${componentName}Root = styled.div\`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  border-radius: 0.5rem;
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
\`;
`;
  }

  return `.root {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  border-radius: 0.5rem;
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}
`;
}

export function generateComponentTest(config: ComponentConfig): string {
  const { componentName, language } = config;
  const isTs = language === 'typescript';
  const ext = isTs ? 'tsx' : 'jsx';

  return `import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ${componentName} } from './${componentName}';

describe('${componentName}', () => {
  it('renders children correctly', () => {
    const testChild = 'Test Content';
    render(<${componentName}>{testChild}</${componentName}>);
    
    expect(screen.getByText(testChild)).toBeInTheDocument();
  });

  it('applies custom className when provided', () => {
    const customClass = 'custom-class';
    render(<${componentName} className={customClass}>Test</${componentName}>);
    
    expect(screen.getByText('Test')).toHaveClass(customClass);
  });

  it('has correct displayName', () => {
    expect(${componentName}.displayName).toBe('${componentName}');
  });
});
`;
}

export function generatePageTemplate(config: {
  pageName: string;
  language: 'typescript' | 'javascript';
  description?: string;
}): string {
  const { pageName, language, description } = config;
  const isTs = language === 'typescript';

  if (isTs) {
    return `import type { FC } from 'react';

interface ${pageName}Props {
  // Add props as needed
}

/**
 * ${description || `The ${pageName} page`}
 */
export const ${pageName}: FC<${pageName}Props> = () => {
  return (
    <main>
      <h1>${pageName}</h1>
      <p>Welcome to the ${pageName} page</p>
    </main>
  );
};

${pageName}.displayName = '${pageName}';
`;
  }

  return `import { PropTypes } from 'prop-types';

/**
 * ${description || `The ${pageName} page`}
 */
export const ${pageName} = () => {
  return (
    <main>
      <h1>${pageName}</h1>
      <p>Welcome to the ${pageName} page</p>
    </main>
  );
};

${pageName}.displayName = '${pageName}';

${pageName}.propTypes = {
  // Add prop types as needed
};
`;
}

export function generatePageTest(config: {
  pageName: string;
  language: 'typescript' | 'javascript';
}): string {
  const { pageName } = config;

  return `import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ${pageName} } from './${pageName}';

describe('${pageName}', () => {
  it('renders the page heading', () => {
    render(<${pageName} />);
    
    expect(screen.getByRole('heading', { name: '${pageName}' })).toBeInTheDocument();
  });

  it('has correct displayName', () => {
    expect(${pageName}.displayName).toBe('${pageName}');
  });
});
`;
}
