import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { SearchBar } from './SearchBar';
import { TaskCard } from './TaskCard';
import { filterTasks, sortTasksByOrder } from '../utils/tasks';
import type { VideoTask } from '../types';

interface SortableTaskItemProps {
  task: VideoTask;
  index: number;
  onUpdate: (id: string, updates: Partial<VideoTask>) => void;
  onDelete: (id: string) => void;
}

const SortableTaskItem: React.FC<SortableTaskItemProps> = ({
  task,
  index,
  onUpdate,
  onDelete,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      <div className="absolute left-2 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          className="p-1.5 bg-slate-800/90 backdrop-blur-sm rounded-lg border border-white/10 cursor-grab active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical size={16} className="text-slate-400" />
        </button>
      </div>
      <div className="pl-0 group-hover:pl-10 transition-all duration-200">
        <TaskCard
          task={task}
          delay={index * 0.05}
          onUpdate={onUpdate}
          onDelete={onDelete}
          compact
        />
      </div>
    </div>
  );
};

interface TasksViewProps {
  tasks: VideoTask[];
  onUpdateTask: (id: string, updates: Partial<VideoTask>) => void;
  onDeleteTask: (id: string) => void;
  onReorderTasks: (startIndex: number, endIndex: number) => void;
}

export const TasksView: React.FC<TasksViewProps> = ({
  tasks,
  onUpdateTask,
  onDeleteTask,
  onReorderTasks,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const sortedTasks = sortTasksByOrder(tasks);
  const filteredTasks = filterTasks(sortedTasks, { searchQuery });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sortedTasks.findIndex((t) => t.id === active.id);
      const newIndex = sortedTasks.findIndex((t) => t.id === over.id);
      onReorderTasks(oldIndex, newIndex);
    }
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold text-white tracking-tight">
          Video Pipeline
        </h2>
        <span className="text-sm text-slate-400">{filteredTasks.length} tasks</span>
      </div>

      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search by title, artist, or tag..."
      />

      {filteredTasks.length > 0 ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={filteredTasks.map((t) => t.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {filteredTasks.map((task, index) => (
                <SortableTaskItem
                  key={task.id}
                  task={task}
                  index={index}
                  onUpdate={onUpdateTask}
                  onDelete={onDeleteTask}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <div className="py-12 text-center text-slate-400">
          <p>No tasks found</p>
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="mt-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Clear search
            </button>
          )}
        </div>
      )}
    </section>
  );
};
