import type { VideoTask, TaskFilters, TaskStats, TaskStatus, Platform } from '../types';

/**
 * Generate a unique ID for a task
 */
export function generateTaskId(): string {
  return `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Filter tasks based on provided filters
 */
export function filterTasks(tasks: VideoTask[], filters: TaskFilters): VideoTask[] {
  let filtered = [...tasks];

  if (filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase();
    filtered = filtered.filter(
      (task) =>
        task.title.toLowerCase().includes(query) ||
        task.artist.toLowerCase().includes(query) ||
        task.tag.toLowerCase().includes(query)
    );
  }

  if (filters.status && filters.status.length > 0) {
    filtered = filtered.filter((task) => filters.status!.includes(task.status));
  }

  if (filters.platform && filters.platform.length > 0) {
    filtered = filtered.filter((task) => filters.platform!.includes(task.platform));
  }

  if (filters.tag && filters.tag.length > 0) {
    filtered = filtered.filter((task) => filters.tag!.includes(task.tag));
  }

  return filtered;
}

/**
 * Sort tasks by order
 */
export function sortTasksByOrder(tasks: VideoTask[]): VideoTask[] {
  return [...tasks].sort((a, b) => a.order - b.order);
}

/**
 * Calculate task statistics
 */
export function calculateTaskStats(tasks: VideoTask[]): TaskStats {
  const now = Date.now();
  const weekAgo = now - 7 * 24 * 60 * 60 * 1000;

  const byStatus: Record<TaskStatus, number> = {
    queue: 0,
    recording: 0,
    editing: 0,
    ready: 0,
  };

  const byPlatform: Record<Platform, number> = {
    youtube: 0,
    shorts: 0,
    tiktok: 0,
  };

  let completedThisWeek = 0;

  tasks.forEach((task) => {
    byStatus[task.status]++;
    byPlatform[task.platform]++;

    if (task.status === 'ready' && task.updatedAt >= weekAgo) {
      completedThisWeek++;
    }
  });

  return {
    total: tasks.length,
    byStatus,
    byPlatform,
    completedThisWeek,
  };
}

/**
 * Get status label for display
 */
export function getStatusLabel(status: TaskStatus): string {
  const labels: Record<TaskStatus, string> = {
    queue: 'In queue',
    recording: 'Ready to record',
    editing: 'Editing timeline',
    ready: 'Ready to upload',
  };
  return labels[status];
}

/**
 * Get platform label for display
 */
export function getPlatformLabel(platform: Platform): string {
  const labels: Record<Platform, string> = {
    youtube: 'YouTube',
    shorts: 'Shorts',
    tiktok: 'TikTok',
  };
  return labels[platform];
}

/**
 * Reorder tasks after drag and drop
 */
export function reorderTasks(tasks: VideoTask[], startIndex: number, endIndex: number): VideoTask[] {
  const result = sortTasksByOrder(tasks);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  // Update order property
  return result.map((task, index) => ({
    ...task,
    order: index,
    updatedAt: Date.now(),
  }));
}
