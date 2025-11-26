import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Header } from './components/Header';
import { NavigationDock } from './components/NavigationDock';
import { DashboardView } from './components/DashboardView';
import { TasksView } from './components/TasksView';
import { CalendarView } from './components/CalendarView';
import { SettingsView } from './components/SettingsView';
import { useTasks } from './hooks/useTasks';
import type { TabId } from './types';

function App() {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const { tasks, addTask, updateTask, deleteTask, reorderTasks } = useTasks();

  const handleImportTasks = (importedTasks: any[]) => {
    // Validate and import tasks
    importedTasks.forEach((task) => {
      if (task.title && task.artist) {
        addTask(task);
      }
    });
  };

  const handleClearAllTasks = () => {
    tasks.forEach((task) => deleteTask(task.id));
  };

  return (
    <ErrorBoundary>
      <div className="relative min-h-screen bg-[#020617] text-slate-200 overflow-x-hidden selection:bg-cyan-500/30">
        {/* Noise texture */}
        <div
          className="fixed inset-0 z-0 pointer-events-none opacity-20 mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Aurora background */}
        <div className="fixed inset-0 z-0 overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px]" />
          <div className="absolute top-[40%] left-[40%] w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[100px]" />
        </div>

        {/* Main content */}
        <main className="relative z-10 max-w-md mx-auto min-h-screen pb-32 sm:max-w-xl md:max-w-4xl p-6">
          <Header />

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="space-y-8"
            >
              {activeTab === 'dashboard' && (
                <DashboardView
                  tasks={tasks}
                  onAddTask={addTask}
                  onUpdateTask={updateTask}
                  onDeleteTask={deleteTask}
                />
              )}
              {activeTab === 'tasks' && (
                <TasksView
                  tasks={tasks}
                  onUpdateTask={updateTask}
                  onDeleteTask={deleteTask}
                  onReorderTasks={reorderTasks}
                />
              )}
              {activeTab === 'calendar' && <CalendarView tasks={tasks} />}
              {activeTab === 'settings' && (
                <SettingsView
                  tasks={tasks}
                  onImportTasks={handleImportTasks}
                  onClearAllTasks={handleClearAllTasks}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        <NavigationDock activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </ErrorBoundary>
  );
}

export default App;
