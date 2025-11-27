import { Music, Plus } from 'lucide-react';
import type { Loop } from '../types/audio';

interface LoopLibraryProps {
  loops: Omit<Loop, 'buffer'>[];
  onAddLoop: (loop: Omit<Loop, 'buffer'>) => void;
}

export function LoopLibrary({ loops, onAddLoop }: LoopLibraryProps) {
  const categories = Array.from(new Set(loops.map((l) => l.category)));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Music className="h-5 w-5 text-white" />
        <h2 className="text-lg font-bold text-white">Loop Library</h2>
      </div>

      <div className="flex flex-col gap-3">
        {categories.map((category) => (
          <div key={category} className="flex flex-col gap-2">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-white/60">
              {category}
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {loops
                .filter((loop) => loop.category === category)
                .map((loop) => (
                  <button
                    key={loop.id}
                    onClick={() => onAddLoop(loop)}
                    className="group flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3 transition-all hover:scale-[1.02] hover:border-white/20 hover:bg-white/10"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="h-10 w-10 rounded-lg"
                        style={{
                          backgroundColor: loop.color + '40',
                        }}
                      />
                      <div className="text-left">
                        <p className="text-sm font-medium text-white">
                          {loop.name}
                        </p>
                        <p className="text-xs text-white/60">
                          {loop.duration}s loop
                        </p>
                      </div>
                    </div>

                    <Plus className="h-4 w-4 text-white/40 transition-transform group-hover:scale-110 group-hover:text-white" />
                  </button>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
