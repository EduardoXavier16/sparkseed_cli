import gradient from 'gradient-string';
import { Box, Text, useApp } from 'ink';
import React, { useEffect, useState } from 'react';
import { ProgressBar } from '../components/progress';
import { StatusBox, TaskList } from '../components/task-list';
import { Welcome } from '../components/welcome';

interface CreateProjectProps {
  projectName: string;
  onProgress?: (progress: number) => void;
}

interface Task {
  id: string;
  label: string;
  status: 'pending' | 'running' | 'completed' | 'error';
}

export const CreateProject: React.FC<CreateProjectProps> = ({
  projectName,
  onProgress,
}) => {
  const { exit } = useApp();
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const tasks: Task[] = [
    { id: '1', label: 'Generating PRD...', status: currentStep > 0 ? 'completed' : currentStep === 0 ? 'running' : 'pending' },
    { id: '2', label: 'Creating Design System...', status: currentStep > 1 ? 'completed' : currentStep === 1 ? 'running' : 'pending' },
    { id: '3', label: 'Building project structure...', status: currentStep > 2 ? 'completed' : currentStep === 2 ? 'running' : 'pending' },
    { id: '4', label: 'Writing files to disk...', status: currentStep > 3 ? 'completed' : currentStep === 3 ? 'running' : 'pending' },
    { id: '5', label: 'Installing dependencies...', status: currentStep > 4 ? 'completed' : currentStep === 4 ? 'running' : 'pending' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((step) => {
        if (step >= tasks.length - 1) {
          clearInterval(timer);
          setTimeout(() => exit(), 1000);
          return step;
        }
        const newStep = step + 1;
        setProgress((newStep / tasks.length) * 100);
        onProgress?.((newStep / tasks.length) * 100);
        return newStep;
      });
    }, 800);

    return () => clearInterval(timer);
  }, []);

  const greenGradient = gradient(['#00ff00', '#00ff88', '#00aa00']);

  return (
    <Box flexDirection="column" padding={1}>
      <Welcome projectName={projectName} />
      
      <Box marginTop={1} flexDirection="column">
        <ProgressBar progress={progress} label="Progress" />
      </Box>

      <Box marginTop={1} flexDirection="column">
        <TaskList tasks={tasks} />
      </Box>

      {currentStep >= tasks.length - 1 && (
        <StatusBox
          title="Project created successfully!"
          status="success"
          message={`🌱 ${projectName} is ready!`}
        />
      )}

      <Box marginTop={1}>
        <Text color="gray">
          {greenGradient('Press Ctrl+C to exit')}
        </Text>
      </Box>
    </Box>
  );
};
