import { useCallback } from 'react';
import type { VideoTask, TaskStatus } from '../types';
import { useLocalStorage } from './useLocalStorage';
import { INITIAL_TASKS } from '../data/initialTasks';
import { generateTaskId, sortTasksByOrder } from '../utils/tasks';

export function useTasks() {
  const [tasks, setTasks] = useLocalStorage<VideoTask[]>('wavereact-tasks', INITIAL_TASKS);

  const addTask = useCallback(
    (taskData: Partial<VideoTask>) => {
      const newTask: VideoTask = {
        id: generateTaskId(),
        title: taskData.title || 'Untitled',
        artist: taskData.artist || 'Unknown',
        tag: taskData.tag || 'Record',
        status: taskData.status || 'queue',
        platform: taskData.platform || 'youtube',
        color: taskData.color || 'bg-slate-500',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        order: tasks.length,
        notes: taskData.notes,
        dueDate: taskData.dueDate,
      };

      setTasks((prev) => [...prev, newTask]);
      return newTask;
    },
    [tasks.length, setTasks]
  );

  const updateTask = useCallback(
    (id: string, updates: Partial<VideoTask>) => {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id
            ? { ...task, ...updates, updatedAt: Date.now() }
            : task
        )
      );
    },
    [setTasks]
  );

  const deleteTask = useCallback(
    (id: string) => {
      setTasks((prev) => {
        const filtered = prev.filter((task) => task.id !== id);
        // Reorder remaining tasks
        return filtered.map((task, index) => ({
          ...task,
          order: index,
        }));
      });
    },
    [setTasks]
  );

  const reorderTasks = useCallback(
    (startIndex: number, endIndex: number) => {
      setTasks((prev) => {
        const sorted = sortTasksByOrder(prev);
        const [removed] = sorted.splice(startIndex, 1);
        sorted.splice(endIndex, 0, removed);

        return sorted.map((task, index) => ({
          ...task,
          order: index,
          updatedAt: Date.now(),
        }));
      });
    },
    [setTasks]
  );

  const updateTaskStatus = useCallback(
    (id: string, status: TaskStatus) => {
      updateTask(id, { status });
    },
    [updateTask]
  );

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    reorderTasks,
    updateTaskStatus,
  };
}
