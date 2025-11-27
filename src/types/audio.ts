// Audio Engine Types for WaveLoop Studio

export interface Loop {
  id: string;
  name: string;
  url: string;
  buffer: AudioBuffer | null;
  duration: number;
  color: string;
  category: 'drums' | 'bass' | 'synth' | 'melody' | 'vocals' | 'fx' | 'percussion' | 'ambient';
}

export interface Track {
  id: string;
  name: string;
  loop: Loop | null;
  volume: number;
  pan: number;
  muted: boolean;
  soloed: boolean;
  effects: TrackEffects;
  isPlaying: boolean;
  color: string;
}

export interface TrackEffects {
  reverb: number;
  delay: number;
  filter: FilterSettings;
  distortion: number;
}

export interface FilterSettings {
  type: 'lowpass' | 'highpass' | 'bandpass' | 'none';
  frequency: number;
  q: number;
}

export interface Scene {
  id: string;
  name: string;
  tracks: Record<string, Partial<Track>>;
  bpm: number;
}

export interface AudioEngineState {
  isPlaying: boolean;
  bpm: number;
  masterVolume: number;
  currentTime: number;
}
