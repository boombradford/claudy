import React from 'react';
import { Download, Upload, Trash2 } from 'lucide-react';
import { GlassCard } from './GlassCard';
import type { VideoTask } from '../types';

interface SettingsViewProps {
  tasks: VideoTask[];
  onImportTasks?: (tasks: VideoTask[]) => void;
  onClearAllTasks?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  tasks,
  onImportTasks,
  onClearAllTasks,
}) => {
  const handleExport = () => {
    try {
      const dataStr = JSON.stringify(tasks, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `wavereact-tasks-${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export tasks:', error);
      alert('Failed to export tasks. Please try again.');
    }
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const importedTasks = JSON.parse(event.target?.result as string);
            if (Array.isArray(importedTasks) && onImportTasks) {
              onImportTasks(importedTasks);
              alert(`Successfully imported ${importedTasks.length} tasks!`);
            } else {
              alert('Invalid file format. Expected an array of tasks.');
            }
          } catch (error) {
            console.error('Import error:', error);
            alert('Failed to import tasks. Please check the file format.');
          }
        };
        reader.onerror = () => {
          console.error('File reading error');
          alert('Failed to read file. Please try again.');
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleClearAll = () => {
    if (
      window.confirm(
        'Are you sure you want to delete all tasks? This action cannot be undone.'
      )
    ) {
      onClearAllTasks?.();
    }
  };

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-white tracking-tight mb-2">
        Studio Settings
      </h2>

      <GlassCard className="p-6 space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-slate-200 mb-3">
            Data Management
          </h3>
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleExport}
              className="w-full flex items-center gap-3 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors text-left"
            >
              <div className="p-2 bg-cyan-500/20 rounded-lg">
                <Download size={18} className="text-cyan-400" />
              </div>
              <div>
                <div className="text-sm font-medium text-slate-200">
                  Export Tasks
                </div>
                <div className="text-xs text-slate-400">
                  Download all tasks as JSON
                </div>
              </div>
            </button>

            {onImportTasks && (
              <button
                type="button"
                onClick={handleImport}
                className="w-full flex items-center gap-3 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors text-left"
              >
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Upload size={18} className="text-purple-400" />
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-200">
                    Import Tasks
                  </div>
                  <div className="text-xs text-slate-400">
                    Restore from a JSON file
                  </div>
                </div>
              </button>
            )}
          </div>
        </div>

        {onClearAllTasks && (
          <div>
            <h3 className="text-sm font-semibold text-slate-200 mb-3">
              Danger Zone
            </h3>
            <button
              type="button"
              onClick={handleClearAll}
              className="w-full flex items-center gap-3 px-4 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-xl transition-colors text-left"
            >
              <div className="p-2 bg-red-500/20 rounded-lg">
                <Trash2 size={18} className="text-red-400" />
              </div>
              <div>
                <div className="text-sm font-medium text-red-300">
                  Clear All Tasks
                </div>
                <div className="text-xs text-red-400/70">
                  Permanently delete all tasks
                </div>
              </div>
            </button>
          </div>
        )}
      </GlassCard>

      <GlassCard className="p-6">
        <h3 className="text-sm font-semibold text-slate-200 mb-3">
          Keyboard Shortcuts
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-slate-300">Quick Capture</span>
            <kbd className="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs text-slate-400">
              ⌘K or Ctrl+K
            </kbd>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-300">Drag to Reorder</span>
            <span className="text-xs text-slate-400">Hover & drag tasks</span>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-6">
        <div className="text-xs text-slate-400 space-y-1">
          <p>WaveReact Studio v1.0.0</p>
          <p>All data is stored locally in your browser</p>
        </div>
      </GlassCard>
    </section>
  );
};
