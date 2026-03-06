import React from 'react';
import { Box, Text } from 'ink';
import gradient from 'gradient-string';

interface Task {
  id: string;
  label: string;
  status: 'pending' | 'running' | 'completed' | 'error';
}

interface TaskListProps {
  tasks: Task[];
}

export const TaskList: React.FC<TaskListProps> = ({ tasks }) => {
  const greenGradient = gradient(['#00ff00', '#00ff88']);

  return (
    <Box flexDirection="column">
      {tasks.map((task) => (
        <Box key={task.id} marginBottom={0}>
          {task.status === 'pending' && <Text color="gray">  ○ </Text>}
          {task.status === 'running' && (
            <Text color="green">⠋ </Text>
          )}
          {task.status === 'completed' && (
            <Text color="greenBright">✓ </Text>
          )}
          {task.status === 'error' && <Text color="red">✗ </Text>}
          
          <Text
            color={
              task.status === 'completed'
                ? 'greenBright'
                : task.status === 'running'
                ? 'green'
                : task.status === 'error'
                ? 'red'
                : 'white'
            }
          >
            {task.status === 'completed' ? greenGradient(task.label) : task.label}
          </Text>
        </Box>
      ))}
    </Box>
  );
};

interface StatusBoxProps {
  title: string;
  status: 'success' | 'error' | 'warning' | 'info';
  message?: string;
}

export const StatusBox: React.FC<StatusBoxProps> = ({
  title,
  status,
  message,
}) => {
  const icons = {
    success: '✓',
    error: '✗',
    warning: '⚠',
    info: 'ℹ',
  };

  const colors = {
    success: 'greenBright',
    error: 'red',
    warning: 'yellow',
    info: 'cyan',
  };

  return (
    <Box
      flexDirection="column"
      borderStyle="round"
      borderColor={colors[status]}
      padding={1}
      marginTop={1}
    >
      <Box>
        <Text color={colors[status]} bold>
          {icons[status]} {title}
        </Text>
      </Box>
      {message && (
        <Box marginTop={0}>
          <Text color="gray">{message}</Text>
        </Box>
      )}
    </Box>
  );
};
