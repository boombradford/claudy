import { Volume2 } from 'lucide-react';

interface MasterMixerProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
}

export function MasterMixer({ volume, onVolumeChange }: MasterMixerProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-white/20 bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-6 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <Volume2 className="h-5 w-5 text-white" />
        <h3 className="font-semibold text-white">Master Output</h3>
      </div>

      <div className="flex flex-col gap-2">
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
          className="h-3 w-full cursor-pointer appearance-none rounded-lg bg-white/10"
          style={{
            accentColor: '#a855f7',
          }}
        />
        <div className="flex items-center justify-between">
          <span className="text-sm text-white/60">Volume</span>
          <span className="text-sm font-semibold text-white">
            {Math.round(volume * 100)}%
          </span>
        </div>
      </div>

      {/* VU Meter visualization */}
      <div className="mt-2 flex h-2 gap-1 overflow-hidden rounded-full bg-black/30">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 rounded-full transition-all duration-100"
            style={{
              backgroundColor:
                i < volume * 20
                  ? i < 14
                    ? '#10b981'
                    : i < 18
                      ? '#f59e0b'
                      : '#ef4444'
                  : 'transparent',
            }}
          />
        ))}
      </div>
    </div>
  );
}
