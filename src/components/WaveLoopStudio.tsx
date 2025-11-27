import { useState, useCallback, useEffect } from 'react';
import { Play, Pause, Layers, Grid3x3, ListMusic } from 'lucide-react';
import { useAudioEngine } from '../hooks/useAudioEngine';
import { DEMO_LOOPS, generateDemoAudio } from '../data/demoLoops';
import { SpectrumAnalyzer } from './SpectrumAnalyzer';
import { TrackMixer } from './TrackMixer';
import { MasterMixer } from './MasterMixer';
import { PadLauncher } from './PadLauncher';
import { LoopLibrary } from './LoopLibrary';
import { SceneManager } from './SceneManager';
import type { Loop, Scene } from '../types/audio';

type ViewMode = 'mixer' | 'pads' | 'library';

export function WaveLoopStudio() {
  const {
    isInitialized,
    tracks,
    masterVolume,
    isPlaying,
    setIsPlaying,
    createTrack,
    toggleTrack,
    setTrackVolume,
    setTrackPan,
    toggleMute,
    setMasterVolume,
    removeTrack,
    getAnalyserData,
    getTimeDomainData,
  } = useAudioEngine();

  const [viewMode, setViewMode] = useState<ViewMode>('mixer');
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [currentScene, setCurrentScene] = useState<Scene | null>(null);
  const [bpm] = useState(120);

  // Initialize demo loops with generated audio
  const [demoLoopsWithBuffer, setDemoLoopsWithBuffer] = useState<Loop[]>([]);

  useEffect(() => {
    if (!isInitialized) return;

    const initLoops = async () => {
      const audioContext = new AudioContext();
      const loopsWithAudio = DEMO_LOOPS.map((loop) => ({
        ...loop,
        buffer: generateDemoAudio(audioContext, loop.url, loop.duration),
      }));
      setDemoLoopsWithBuffer(loopsWithAudio);
    };

    initLoops();
  }, [isInitialized]);

  const handleAddLoop = useCallback(
    async (loop: Omit<Loop, 'buffer'>) => {
      const fullLoop = demoLoopsWithBuffer.find((l) => l.id === loop.id);
      if (!fullLoop) return;

      createTrack(fullLoop);
    },
    [demoLoopsWithBuffer, createTrack]
  );

  const handlePadClick = useCallback(
    async (loop: Omit<Loop, 'buffer'>) => {
      const existingTrack = tracks.find((t) => t.loop?.id === loop.id);

      if (existingTrack) {
        toggleTrack(existingTrack.id);
      } else {
        const fullLoop = demoLoopsWithBuffer.find((l) => l.id === loop.id);
        if (!fullLoop) return;

        const newTrack = createTrack(fullLoop);
        // Auto-play when launched from pad
        setTimeout(() => toggleTrack(newTrack.id), 100);
      }
    },
    [tracks, demoLoopsWithBuffer, createTrack, toggleTrack]
  );

  const handleSaveScene = useCallback(
    (name: string) => {
      const newScene: Scene = {
        id: `scene-${Date.now()}`,
        name,
        tracks: tracks.reduce(
          (acc, track) => ({
            ...acc,
            [track.id]: {
              loop: track.loop,
              volume: track.volume,
              pan: track.pan,
              muted: track.muted,
              effects: track.effects,
            },
          }),
          {}
        ),
        bpm,
      };

      setScenes((prev) => [...prev, newScene]);
      setCurrentScene(newScene);
    },
    [tracks, bpm]
  );

  const handleLoadScene = useCallback(
    (scene: Scene) => {
      // Clear existing tracks
      tracks.forEach((track) => removeTrack(track.id));

      // Load scene tracks
      Object.entries(scene.tracks).forEach(([_, trackData]) => {
        if (trackData.loop) {
          const newTrack = createTrack(trackData.loop);
          if (trackData.volume !== undefined) {
            setTrackVolume(newTrack.id, trackData.volume);
          }
          if (trackData.pan !== undefined) {
            setTrackPan(newTrack.id, trackData.pan);
          }
        }
      });

      setCurrentScene(scene);
    },
    [tracks, removeTrack, createTrack, setTrackVolume, setTrackPan]
  );

  const handleDeleteScene = useCallback((sceneId: string) => {
    setScenes((prev) => prev.filter((s) => s.id !== sceneId));
    setCurrentScene((prev) => (prev?.id === sceneId ? null : prev));
  }, []);

  const handleGlobalPlayPause = () => {
    if (isPlaying) {
      tracks.forEach((track) => {
        if (track.isPlaying) {
          toggleTrack(track.id);
        }
      });
    } else {
      tracks.forEach((track) => {
        if (!track.isPlaying && track.loop) {
          toggleTrack(track.id);
        }
      });
    }
    setIsPlaying(!isPlaying);
  };

  if (!isInitialized) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
        <div className="text-center">
          <div className="mb-4 h-16 w-16 animate-spin rounded-full border-4 border-purple-500 border-t-transparent mx-auto" />
          <p className="text-white/60">Initializing Audio Engine...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-2xl font-bold text-white">WaveLoop Studio</h1>
            <p className="text-sm text-white/60">
              Professional Loop Mixer & Beat Creator
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 p-1">
              <button
                onClick={() => setViewMode('mixer')}
                className={`rounded px-3 py-1.5 text-sm font-medium transition-colors ${
                  viewMode === 'mixer'
                    ? 'bg-white/20 text-white'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <Layers className="inline h-4 w-4 mr-1" />
                Mixer
              </button>
              <button
                onClick={() => setViewMode('pads')}
                className={`rounded px-3 py-1.5 text-sm font-medium transition-colors ${
                  viewMode === 'pads'
                    ? 'bg-white/20 text-white'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <Grid3x3 className="inline h-4 w-4 mr-1" />
                Pads
              </button>
              <button
                onClick={() => setViewMode('library')}
                className={`rounded px-3 py-1.5 text-sm font-medium transition-colors ${
                  viewMode === 'library'
                    ? 'bg-white/20 text-white'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <ListMusic className="inline h-4 w-4 mr-1" />
                Library
              </button>
            </div>

            <button
              onClick={handleGlobalPlayPause}
              className="rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-2 font-semibold text-white transition-transform hover:scale-105"
            >
              {isPlaying ? (
                <>
                  <Pause className="inline h-5 w-5 mr-2" />
                  Stop All
                </>
              ) : (
                <>
                  <Play className="inline h-5 w-5 mr-2" />
                  Play All
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column - Main View */}
          <div className="lg:col-span-2">
            <div className="flex flex-col gap-6">
              {/* Spectrum Analyzer */}
              <div className="rounded-xl border border-white/20 bg-black/20 p-6 backdrop-blur-sm">
                <h2 className="mb-4 text-lg font-semibold text-white">
                  Spectrum Analyzer
                </h2>
                <SpectrumAnalyzer
                  getAnalyserData={getAnalyserData}
                  width={800}
                  height={150}
                  barColor="#a855f7"
                />
              </div>

              {/* Dynamic Content Based on View Mode */}
              {viewMode === 'mixer' && (
                <div className="flex flex-col gap-4">
                  <h2 className="text-lg font-semibold text-white">
                    Active Tracks ({tracks.length})
                  </h2>
                  {tracks.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-white/20 bg-white/5 p-12 text-center backdrop-blur-sm">
                      <p className="text-white/60">
                        No tracks loaded. Add loops from the library or use the
                        pad launcher.
                      </p>
                    </div>
                  ) : (
                    tracks.map((track) => (
                      <TrackMixer
                        key={track.id}
                        track={track}
                        onTogglePlay={toggleTrack}
                        onVolumeChange={setTrackVolume}
                        onPanChange={setTrackPan}
                        onToggleMute={toggleMute}
                        onRemove={removeTrack}
                        getTimeDomainData={getTimeDomainData}
                      />
                    ))
                  )}
                </div>
              )}

              {viewMode === 'pads' && (
                <div className="rounded-xl border border-white/20 bg-black/20 backdrop-blur-sm">
                  <h2 className="p-6 pb-0 text-lg font-semibold text-white">
                    Pad Launcher
                  </h2>
                  <PadLauncher loops={DEMO_LOOPS} onPadClick={handlePadClick} />
                </div>
              )}

              {viewMode === 'library' && (
                <div className="rounded-xl border border-white/20 bg-black/20 p-6 backdrop-blur-sm">
                  <LoopLibrary loops={DEMO_LOOPS} onAddLoop={handleAddLoop} />
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Controls & Scenes */}
          <div className="flex flex-col gap-6">
            <MasterMixer
              volume={masterVolume}
              onVolumeChange={setMasterVolume}
            />

            <SceneManager
              scenes={scenes}
              currentScene={currentScene}
              onSaveScene={handleSaveScene}
              onLoadScene={handleLoadScene}
              onDeleteScene={handleDeleteScene}
            />

            {/* BPM Display */}
            <div className="rounded-xl border border-white/20 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 p-6 backdrop-blur-sm">
              <div className="text-center">
                <p className="text-sm text-white/60">Tempo</p>
                <p className="text-4xl font-bold text-white">{bpm}</p>
                <p className="text-sm text-white/60">BPM</p>
              </div>
            </div>

            {/* Stats */}
            <div className="rounded-xl border border-white/20 bg-white/5 p-6 backdrop-blur-sm">
              <h3 className="mb-3 font-semibold text-white">Session Stats</h3>
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/60">Active Tracks:</span>
                  <span className="font-semibold text-white">
                    {tracks.filter((t) => t.isPlaying).length} / {tracks.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Saved Scenes:</span>
                  <span className="font-semibold text-white">
                    {scenes.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Available Loops:</span>
                  <span className="font-semibold text-white">
                    {DEMO_LOOPS.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
