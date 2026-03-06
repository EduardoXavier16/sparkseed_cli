import React from 'react';
import { Box, Text } from 'ink';
import gradient from 'gradient-string';

interface ProgressBarProps {
  progress: number;
  label?: string;
  width?: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  label,
  width = 40,
}) => {
  const filled = Math.round((progress / 100) * width);
  const empty = width - filled;

  const greenGradient = gradient(['#00ff00', '#00aa00']);

  return (
    <Box flexDirection="column">
      {label && (
        <Box marginBottom={0}>
          <Text color="green">{label}</Text>
          <Text color="gray"> ({progress}%)</Text>
        </Box>
      )}
      <Box>
        <Text color="green">
          {greenGradient('[')}
        </Text>
        <Text color="greenBright">
          {greenGradient('█'.repeat(filled))}
        </Text>
        <Text color="gray">{'░'.repeat(empty)}</Text>
        <Text color="green">
          {greenGradient(']')}
        </Text>
      </Box>
    </Box>
  );
};

interface SpinnerProps {
  label?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ label }) => {
  const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
  const [frame, setFrame] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setFrame((f) => (f + 1) % frames.length);
    }, 80);
    return () => clearInterval(timer);
  }, []);

  return (
    <Box>
      <Text color="green">{frames[frame]}</Text>
      {label && (
        <Box margin={1}>
          <Text color="green">{label}</Text>
        </Box>
      )}
    </Box>
  );
};
