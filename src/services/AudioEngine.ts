// Web Audio API Engine for WaveLoop Studio

export class AudioEngine {
  private context: AudioContext;
  private masterGain: GainNode;
  private analyser: AnalyserNode;
  private trackNodes: Map<string, TrackAudioNodes>;
  private isInitialized: boolean = false;

  constructor() {
    this.context = new AudioContext();
    this.masterGain = this.context.createGain();
    this.analyser = this.context.createAnalyser();
    this.trackNodes = new Map();

    // Setup master chain
    this.masterGain.connect(this.analyser);
    this.analyser.connect(this.context.destination);

    // Configure analyser
    this.analyser.fftSize = 2048;
    this.analyser.smoothingTimeConstant = 0.8;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    if (this.context.state === 'suspended') {
      await this.context.resume();
    }

    this.isInitialized = true;
  }

  async loadLoop(url: string): Promise<AudioBuffer> {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    return await this.context.decodeAudioData(arrayBuffer);
  }

  createTrackNodes(trackId: string): TrackAudioNodes {
    const source = this.context.createBufferSource();
    const gainNode = this.context.createGain();
    const panNode = this.context.createStereoPanner();
    const filterNode = this.context.createBiquadFilter();
    const reverbNode = this.createReverbNode();
    const delayNode = this.createDelayNode();

    // Connect the chain
    source.connect(filterNode);
    filterNode.connect(gainNode);
    gainNode.connect(panNode);
    panNode.connect(reverbNode);
    reverbNode.connect(delayNode);
    delayNode.connect(this.masterGain);

    const nodes: TrackAudioNodes = {
      source,
      gainNode,
      panNode,
      filterNode,
      reverbNode,
      delayNode,
      isPlaying: false,
    };

    this.trackNodes.set(trackId, nodes);
    return nodes;
  }

  private createReverbNode(): ConvolverNode {
    const convolver = this.context.createConvolver();
    // Create simple impulse response for reverb
    const length = this.context.sampleRate * 2;
    const impulse = this.context.createBuffer(2, length, this.context.sampleRate);

    for (let channel = 0; channel < 2; channel++) {
      const channelData = impulse.getChannelData(channel);
      for (let i = 0; i < length; i++) {
        channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2);
      }
    }

    convolver.buffer = impulse;
    return convolver;
  }

  private createDelayNode(): DelayNode {
    const delay = this.context.createDelay(5.0);
    const feedback = this.context.createGain();
    const wet = this.context.createGain();

    delay.connect(feedback);
    feedback.connect(delay);
    delay.connect(wet);

    delay.delayTime.value = 0.375; // Dotted eighth note at 120 BPM
    feedback.gain.value = 0.3;
    wet.gain.value = 0;

    return delay;
  }

  playTrack(trackId: string, buffer: AudioBuffer, loop: boolean = true): void {
    const nodes = this.trackNodes.get(trackId);
    if (!nodes) return;

    // Stop existing source if playing
    if (nodes.isPlaying) {
      this.stopTrack(trackId);
    }

    // Create new source
    const source = this.context.createBufferSource();
    source.buffer = buffer;
    source.loop = loop;

    // Reconnect to existing chain
    source.connect(nodes.filterNode);

    // Update the source reference
    nodes.source = source;
    nodes.isPlaying = true;

    // Start playback
    source.start(0);
  }

  stopTrack(trackId: string): void {
    const nodes = this.trackNodes.get(trackId);
    if (!nodes || !nodes.isPlaying) return;

    try {
      nodes.source.stop();
    } catch (e) {
      // Source already stopped
    }

    nodes.isPlaying = false;
  }

  setTrackVolume(trackId: string, volume: number): void {
    const nodes = this.trackNodes.get(trackId);
    if (!nodes) return;

    nodes.gainNode.gain.setValueAtTime(volume, this.context.currentTime);
  }

  setTrackPan(trackId: string, pan: number): void {
    const nodes = this.trackNodes.get(trackId);
    if (!nodes) return;

    nodes.panNode.pan.setValueAtTime(pan, this.context.currentTime);
  }

  setTrackFilter(trackId: string, type: BiquadFilterType, frequency: number, q: number): void {
    const nodes = this.trackNodes.get(trackId);
    if (!nodes) return;

    nodes.filterNode.type = type;
    nodes.filterNode.frequency.setValueAtTime(frequency, this.context.currentTime);
    nodes.filterNode.Q.setValueAtTime(q, this.context.currentTime);
  }

  setMasterVolume(volume: number): void {
    this.masterGain.gain.setValueAtTime(volume, this.context.currentTime);
  }

  getAnalyserData(): Uint8Array {
    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(dataArray);
    return dataArray;
  }

  getTimeDomainData(): Uint8Array {
    const dataArray = new Uint8Array(this.analyser.fftSize);
    this.analyser.getByteTimeDomainData(dataArray);
    return dataArray;
  }

  getCurrentTime(): number {
    return this.context.currentTime;
  }

  dispose(): void {
    this.trackNodes.forEach((nodes) => {
      if (nodes.isPlaying) {
        try {
          nodes.source.stop();
        } catch (e) {
          // Ignore
        }
      }
    });

    this.trackNodes.clear();
    this.context.close();
  }
}

interface TrackAudioNodes {
  source: AudioBufferSourceNode;
  gainNode: GainNode;
  panNode: StereoPannerNode;
  filterNode: BiquadFilterNode;
  reverbNode: ConvolverNode;
  delayNode: DelayNode;
  isPlaying: boolean;
}
