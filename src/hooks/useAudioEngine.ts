import { useEffect, useRef, useState, useCallback } from 'react';
import { AudioEngine } from '../services/AudioEngine';
import type { Track, Loop } from '../types/audio';

export function useAudioEngine() {
  const engineRef = useRef<AudioEngine | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [masterVolume, setMasterVolumeState] = useState(0.8);
  const [isPlaying, setIsPlaying] = useState(false);

  // Initialize audio engine
  useEffect(() => {
    engineRef.current = new AudioEngine();

    const initialize = async () => {
      await engineRef.current?.initialize();
      setIsInitialized(true);
    };

    initialize();

    return () => {
      engineRef.current?.dispose();
    };
  }, []);

  const loadLoop = useCallback(async (url: string): Promise<AudioBuffer | null> => {
    if (!engineRef.current) return null;
    try {
      return await engineRef.current.loadLoop(url);
    } catch (error) {
      console.error('Failed to load loop:', error);
      return null;
    }
  }, []);

  const createTrack = useCallback((loop: Loop): Track => {
    const trackId = `track-${Date.now()}-${Math.random()}`;

    if (engineRef.current) {
      engineRef.current.createTrackNodes(trackId);
    }

    const newTrack: Track = {
      id: trackId,
      name: loop.name,
      loop,
      volume: 0.8,
      pan: 0,
      muted: false,
      soloed: false,
      effects: {
        reverb: 0,
        delay: 0,
        filter: {
          type: 'none',
          frequency: 1000,
          q: 1,
        },
        distortion: 0,
      },
      isPlaying: false,
      color: loop.color,
    };

    setTracks((prev) => [...prev, newTrack]);
    return newTrack;
  }, []);

  const playTrack = useCallback((trackId: string) => {
    const track = tracks.find((t) => t.id === trackId);
    if (!track || !track.loop?.buffer || !engineRef.current) return;

    engineRef.current.playTrack(trackId, track.loop.buffer, true);

    setTracks((prev) =>
      prev.map((t) => (t.id === trackId ? { ...t, isPlaying: true } : t))
    );
  }, [tracks]);

  const stopTrack = useCallback((trackId: string) => {
    if (!engineRef.current) return;

    engineRef.current.stopTrack(trackId);

    setTracks((prev) =>
      prev.map((t) => (t.id === trackId ? { ...t, isPlaying: false } : t))
    );
  }, []);

  const toggleTrack = useCallback((trackId: string) => {
    const track = tracks.find((t) => t.id === trackId);
    if (!track) return;

    if (track.isPlaying) {
      stopTrack(trackId);
    } else {
      playTrack(trackId);
    }
  }, [tracks, playTrack, stopTrack]);

  const setTrackVolume = useCallback((trackId: string, volume: number) => {
    if (!engineRef.current) return;

    engineRef.current.setTrackVolume(trackId, volume);

    setTracks((prev) =>
      prev.map((t) => (t.id === trackId ? { ...t, volume } : t))
    );
  }, []);

  const setTrackPan = useCallback((trackId: string, pan: number) => {
    if (!engineRef.current) return;

    engineRef.current.setTrackPan(trackId, pan);

    setTracks((prev) =>
      prev.map((t) => (t.id === trackId ? { ...t, pan } : t))
    );
  }, []);

  const toggleMute = useCallback((trackId: string) => {
    const track = tracks.find((t) => t.id === trackId);
    if (!track || !engineRef.current) return;

    const newMutedState = !track.muted;
    engineRef.current.setTrackVolume(trackId, newMutedState ? 0 : track.volume);

    setTracks((prev) =>
      prev.map((t) => (t.id === trackId ? { ...t, muted: newMutedState } : t))
    );
  }, [tracks]);

  const setMasterVolume = useCallback((volume: number) => {
    if (!engineRef.current) return;

    engineRef.current.setMasterVolume(volume);
    setMasterVolumeState(volume);
  }, []);

  const removeTrack = useCallback((trackId: string) => {
    if (!engineRef.current) return;

    engineRef.current.stopTrack(trackId);
    setTracks((prev) => prev.filter((t) => t.id !== trackId));
  }, []);

  const getAnalyserData = useCallback(() => {
    if (!engineRef.current) return new Uint8Array();
    return engineRef.current.getAnalyserData();
  }, []);

  const getTimeDomainData = useCallback(() => {
    if (!engineRef.current) return new Uint8Array();
    return engineRef.current.getTimeDomainData();
  }, []);

  return {
    isInitialized,
    tracks,
    masterVolume,
    isPlaying,
    setIsPlaying,
    loadLoop,
    createTrack,
    playTrack,
    stopTrack,
    toggleTrack,
    setTrackVolume,
    setTrackPan,
    toggleMute,
    setMasterVolume,
    removeTrack,
    getAnalyserData,
    getTimeDomainData,
  };
}
