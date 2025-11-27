import { Save, Folder, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { Scene } from '../types/audio';

interface SceneManagerProps {
  scenes: Scene[];
  currentScene: Scene | null;
  onSaveScene: (name: string) => void;
  onLoadScene: (scene: Scene) => void;
  onDeleteScene: (sceneId: string) => void;
}

export function SceneManager({
  scenes,
  currentScene,
  onSaveScene,
  onLoadScene,
  onDeleteScene,
}: SceneManagerProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newSceneName, setNewSceneName] = useState('');

  const handleSave = () => {
    if (newSceneName.trim()) {
      onSaveScene(newSceneName.trim());
      setNewSceneName('');
      setIsCreating(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-white/20 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Folder className="h-5 w-5 text-white" />
          <h3 className="font-semibold text-white">Scenes</h3>
        </div>

        <button
          onClick={() => setIsCreating(!isCreating)}
          className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-white/20"
        >
          <Save className="inline h-3 w-3 mr-1" />
          Save Current
        </button>
      </div>

      {isCreating && (
        <div className="flex gap-2">
          <input
            type="text"
            value={newSceneName}
            onChange={(e) => setNewSceneName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            placeholder="Scene name..."
            className="flex-1 rounded-lg border border-white/20 bg-black/30 px-3 py-2 text-sm text-white placeholder-white/40 focus:border-white/40 focus:outline-none"
            autoFocus
          />
          <button
            onClick={handleSave}
            className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-600"
          >
            Save
          </button>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {scenes.length === 0 ? (
          <p className="text-center text-sm text-white/40">No saved scenes</p>
        ) : (
          scenes.map((scene) => (
            <div
              key={scene.id}
              className={`flex items-center justify-between rounded-lg border p-3 transition-all ${
                currentScene?.id === scene.id
                  ? 'border-indigo-500 bg-indigo-500/20'
                  : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
              }`}
            >
              <button
                onClick={() => onLoadScene(scene)}
                className="flex-1 text-left"
              >
                <p className="text-sm font-medium text-white">{scene.name}</p>
                <p className="text-xs text-white/60">
                  {Object.keys(scene.tracks).length} tracks • {scene.bpm} BPM
                </p>
              </button>

              <button
                onClick={() => onDeleteScene(scene.id)}
                className="rounded-lg p-2 transition-colors hover:bg-red-500/20"
              >
                <Trash2 className="h-4 w-4 text-red-400" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
