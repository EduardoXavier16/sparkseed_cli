import React, { useEffect, useState } from 'react';
import { Box, Text, useApp, useInput } from 'ink';
import gradient from 'gradient-string';

interface WelcomeProps {
  projectName?: string;
}

export const Welcome: React.FC<WelcomeProps> = ({ projectName }) => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPhase((p) => (p + 1) % 3);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const greenGradient = gradient(['#00ff00', '#00aa00', '#00ff88']);

  return (
    <Box flexDirection="column" alignItems="center" padding={1}>
      <Box marginBottom={1}>
        <Text color="green">
          {greenGradient(`
  ███████╗██╗  ██╗██████╗  ██████╗ ███████╗
  ██╔════╝╚██╗██╔╝██╔══██╗██╔═══██╗██╔════╝
  █████╗   ╚███╔╝ ██████╔╝██║   ██║███████╗
  ██╔══╝   ██╔██╗ ██╔═══╝ ██║   ██║╚════██║
  ███████╗██╔╝ ██╗██║     ╚██████╔╝███████║
  ╚══════╝╚═╝  ╚═╝╚═╝      ╚═════╝ ╚══════╝
  
  🌱 Project Boilerplate Generator
  `)}
        </Text>
      </Box>
      
      {projectName && (
        <Box marginTop={1}>
          <Text color="green">🌱 Creating: </Text>
          <Text color="greenBright" bold>{projectName}</Text>
        </Box>
      )}

      <Box marginTop={1}>
        {phase === 0 && <Text color="green">⠋ Initializing...</Text>}
        {phase === 1 && <Text color="green">⠙ Loading...</Text>}
        {phase === 2 && <Text color="green">⠹ Ready!</Text>}
      </Box>
    </Box>
  );
};
