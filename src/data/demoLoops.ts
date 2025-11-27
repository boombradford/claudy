import type { Loop } from '../types/audio';

// Demo loops - using procedurally generated audio for demonstration
// In production, these would be actual audio file URLs

export const DEMO_LOOPS: Omit<Loop, 'buffer'>[] = [
  {
    id: 'drums-1',
    name: 'Tech House Drums',
    url: 'demo://drums-kick',
    duration: 4,
    color: '#ef4444',
    category: 'drums',
  },
  {
    id: 'bass-1',
    name: 'Deep Bass',
    url: 'demo://bass-deep',
    duration: 4,
    color: '#8b5cf6',
    category: 'bass',
  },
  {
    id: 'synth-1',
    name: 'Analog Lead',
    url: 'demo://synth-lead',
    duration: 4,
    color: '#3b82f6',
    category: 'synth',
  },
  {
    id: 'melody-1',
    name: 'Piano Melody',
    url: 'demo://melody-piano',
    duration: 4,
    color: '#10b981',
    category: 'melody',
  },
  {
    id: 'perc-1',
    name: 'Hi-Hats',
    url: 'demo://perc-hats',
    duration: 4,
    color: '#f59e0b',
    category: 'percussion',
  },
  {
    id: 'fx-1',
    name: 'Riser FX',
    url: 'demo://fx-riser',
    duration: 4,
    color: '#ec4899',
    category: 'fx',
  },
  {
    id: 'ambient-1',
    name: 'Pad Wash',
    url: 'demo://ambient-pad',
    duration: 4,
    color: '#06b6d4',
    category: 'ambient',
  },
  {
    id: 'vocals-1',
    name: 'Vocal Chops',
    url: 'demo://vocals-chops',
    duration: 4,
    color: '#f43f5e',
    category: 'vocals',
  },
];

// Procedural audio generation for demo purposes
export function generateDemoAudio(
  context: AudioContext,
  type: string,
  duration: number = 4
): AudioBuffer {
  const sampleRate = context.sampleRate;
  const length = sampleRate * duration;
  const buffer = context.createBuffer(2, length, sampleRate);

  const bpm = 120;
  const beatLength = (60 / bpm) * sampleRate;

  for (let channel = 0; channel < 2; channel++) {
    const data = buffer.getChannelData(channel);

    switch (type) {
      case 'demo://drums-kick':
        generateKickDrum(data, beatLength, length);
        break;
      case 'demo://bass-deep':
        generateBass(data, beatLength, length);
        break;
      case 'demo://synth-lead':
        generateSynth(data, beatLength, length);
        break;
      case 'demo://melody-piano':
        generateMelody(data, beatLength, length);
        break;
      case 'demo://perc-hats':
        generateHiHats(data, beatLength, length);
        break;
      case 'demo://fx-riser':
        generateRiser(data, length);
        break;
      case 'demo://ambient-pad':
        generatePad(data, length);
        break;
      case 'demo://vocals-chops':
        generateVocalChops(data, beatLength, length);
        break;
      default:
        generateSilence(data);
    }
  }

  return buffer;
}

function generateKickDrum(data: Float32Array, beatLength: number, length: number): void {
  for (let i = 0; i < length; i++) {
    const posInBeat = i % beatLength;

    // Kick on every beat
    if (posInBeat < beatLength * 0.15) {
      const decay = 1 - posInBeat / (beatLength * 0.15);
      const freq = 55 + 100 * decay;
      data[i] = Math.sin((2 * Math.PI * freq * posInBeat) / 44100) * decay * 0.8;
    }
  }
}

function generateBass(data: Float32Array, beatLength: number, length: number): void {
  const notes = [55, 55, 65.4, 73.4]; // A1, A1, C2, D2
  for (let i = 0; i < length; i++) {
    const beat = Math.floor(i / beatLength) % notes.length;
    const freq = notes[beat];
    data[i] = Math.sin((2 * Math.PI * freq * i) / 44100) * 0.3;
  }
}

function generateSynth(data: Float32Array, beatLength: number, length: number): void {
  const notes = [220, 247, 277, 330]; // A3, B3, C#4, E4
  for (let i = 0; i < length; i++) {
    const beat = Math.floor((i / beatLength) * 2) % notes.length;
    const freq = notes[beat];
    const saw = (2 * ((i % (44100 / freq)) / (44100 / freq))) - 1;
    data[i] = saw * 0.2;
  }
}

function generateMelody(data: Float32Array, beatLength: number, length: number): void {
  const notes = [440, 494, 523, 587, 523, 494, 440, 392]; // A4-G4 melody
  for (let i = 0; i < length; i++) {
    const noteIndex = Math.floor((i / beatLength) * 2) % notes.length;
    const freq = notes[noteIndex];
    const posInNote = i % (beatLength / 2);
    const envelope = Math.exp(-posInNote / (beatLength / 4));
    data[i] = Math.sin((2 * Math.PI * freq * i) / 44100) * envelope * 0.25;
  }
}

function generateHiHats(data: Float32Array, beatLength: number, length: number): void {
  for (let i = 0; i < length; i++) {
    const step = i % (beatLength / 4);
    if (step < 1000) {
      const decay = 1 - step / 1000;
      data[i] = (Math.random() * 2 - 1) * decay * 0.15;
    }
  }
}

function generateRiser(data: Float32Array, length: number): void {
  for (let i = 0; i < length; i++) {
    const progress = i / length;
    data[i] = (Math.random() * 2 - 1) * progress * 0.3;
  }
}

function generatePad(data: Float32Array, length: number): void {
  const frequencies = [220, 277, 330, 415]; // Am7 chord
  for (let i = 0; i < length; i++) {
    let sample = 0;
    frequencies.forEach((freq) => {
      sample += Math.sin((2 * Math.PI * freq * i) / 44100) * 0.1;
    });
    data[i] = sample;
  }
}

function generateVocalChops(data: Float32Array, beatLength: number, length: number): void {
  for (let i = 0; i < length; i++) {
    const beat = Math.floor(i / beatLength);
    const posInBeat = i % beatLength;

    if (posInBeat < beatLength * 0.25) {
      const freq = 200 + beat * 50;
      const formant = Math.sin((2 * Math.PI * freq * 3 * i) / 44100);
      data[i] = Math.sin((2 * Math.PI * freq * i) / 44100) * formant * 0.2;
    }
  }
}

function generateSilence(data: Float32Array): void {
  data.fill(0);
}
