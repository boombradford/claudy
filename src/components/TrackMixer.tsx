import { Volume2, VolumeX, Play, Square, X } from 'lucide-react';
import type { Track } from '../types/audio';
import { Waveform } from './Waveform';

interface TrackMixerProps {
  track: Track;
  onTogglePlay: (trackId: string) => void;
  onVolumeChange: (trackId: string, volume: number) => void;
  onPanChange: (trackId: string, pan: number) => void;
  onToggleMute: (trackId: string) => void;
  onRemove: (trackId: string) => void;
  getTimeDomainData: () => Uint8Array;
}

export function TrackMixer({
  track,
  onTogglePlay,
  onVolumeChange,
  onPanChange,
  onToggleMute,
  onRemove,
  getTimeDomainData,
}: TrackMixerProps) {
  return (
    <div
      className="relative flex flex-col gap-3 rounded-xl border p-4 backdrop-blur-sm transition-all hover:scale-[1.02]"
      style={{
        borderColor: track.color + '60',
        backgroundColor: track.color + '10',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onTogglePlay(track.id)}
            className="rounded-lg p-2 transition-all hover:scale-110"
            style={{
              backgroundColor: track.isPlaying ? track.color : track.color + '40',
            }}
          >
            {track.isPlaying ? (
              <Square className="h-5 w-5 text-white" fill="white" />
            ) : (
              <Play className="h-5 w-5 text-white" fill="white" />
            )}
          </button>

          <div>
            <h3 className="font-semibold text-white">{track.name}</h3>
            <p className="text-xs text-white/60">{track.loop?.category}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleMute(track.id)}
            className="rounded-lg p-2 transition-colors hover:bg-white/10"
          >
            {track.muted ? (
              <VolumeX className="h-4 w-4 text-red-400" />
            ) : (
              <Volume2 className="h-4 w-4 text-white/60" />
            )}
          </button>

          <button
            onClick={() => onRemove(track.id)}
            className="rounded-lg p-2 transition-colors hover:bg-red-500/20"
          >
            <X className="h-4 w-4 text-red-400" />
          </button>
        </div>
      </div>

      {/* Waveform */}
      <div className="flex justify-center">
        <Waveform
          getTimeDomainData={getTimeDomainData}
          width={300}
          height={60}
          color={track.color}
          isPlaying={track.isPlaying}
        />
      </div>

      {/* Controls */}
      <div className="grid grid-cols-2 gap-4">
        {/* Volume */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-white/80">Volume</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={track.volume}
            onChange={(e) => onVolumeChange(track.id, parseFloat(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-white/10"
            style={{
              accentColor: track.color,
            }}
          />
          <span className="text-xs text-white/60">{Math.round(track.volume * 100)}%</span>
        </div>

        {/* Pan */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-white/80">Pan</label>
          <input
            type="range"
            min="-1"
            max="1"
            step="0.01"
            value={track.pan}
            onChange={(e) => onPanChange(track.id, parseFloat(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-white/10"
            style={{
              accentColor: track.color,
            }}
          />
          <span className="text-xs text-white/60">
            {track.pan < 0 ? `L ${Math.abs(Math.round(track.pan * 100))}` : track.pan > 0 ? `R ${Math.round(track.pan * 100)}` : 'C'}
          </span>
        </div>
      </div>
    </div>
  );
}
