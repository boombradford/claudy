export type TabId = 'dashboard' | 'tasks' | 'calendar' | 'settings';

export type TaskStatus = 'queue' | 'recording' | 'editing' | 'ready';

export type Platform = 'youtube' | 'shorts' | 'tiktok';

export type TaskTag = 'Record' | 'Edit' | 'Editing' | 'Thumbnail' | 'Upload' | 'Review';

export interface VideoTask {
  id: string;
  title: string;
  artist: string;
  tag: TaskTag;
  status: TaskStatus;
  platform: Platform;
  color: string;
  createdAt: number;
  updatedAt: number;
  notes?: string;
  dueDate?: number;
  order: number;
}

export interface TabConfig {
  id: TabId;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
}

export interface TaskFilters {
  status?: TaskStatus[];
  platform?: Platform[];
  tag?: TaskTag[];
  searchQuery?: string;
}

export interface TaskStats {
  total: number;
  byStatus: Record<TaskStatus, number>;
  byPlatform: Record<Platform, number>;
  completedThisWeek: number;
}
