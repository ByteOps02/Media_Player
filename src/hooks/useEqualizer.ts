import { useState, useCallback, useRef, useEffect } from 'react';

export interface EqualizerBand {
  frequency: number;
  gain: number;
  label: string;
}

export interface EqualizerPreset {
  name: string;
  gains: number[];
}

const DEFAULT_BANDS: EqualizerBand[] = [
  { frequency: 32, gain: 0, label: '32Hz' },
  { frequency: 64, gain: 0, label: '64Hz' },
  { frequency: 125, gain: 0, label: '125Hz' },
  { frequency: 250, gain: 0, label: '250Hz' },
  { frequency: 500, gain: 0, label: '500Hz' },
  { frequency: 1000, gain: 0, label: '1kHz' },
  { frequency: 2000, gain: 0, label: '2kHz' },
  { frequency: 4000, gain: 0, label: '4kHz' },
  { frequency: 8000, gain: 0, label: '8kHz' },
  { frequency: 16000, gain: 0, label: '16kHz' },
];

export const EQUALIZER_PRESETS: EqualizerPreset[] = [
  { name: 'Flat', gains: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
  { name: 'Bass Boost', gains: [6, 5, 4, 2, 0, 0, 0, 0, 0, 0] },
  { name: 'Treble Boost', gains: [0, 0, 0, 0, 0, 0, 2, 4, 5, 6] },
  { name: 'Rock', gains: [5, 4, 2, 0, -1, -1, 0, 2, 4, 5] },
  { name: 'Pop', gains: [-1, 0, 2, 4, 5, 4, 2, 0, -1, -1] },
  { name: 'Jazz', gains: [3, 2, 1, 2, -2, -2, 0, 2, 3, 4] },
  { name: 'Classical', gains: [4, 3, 2, 1, -1, -1, 0, 2, 3, 4] },
  { name: 'Electronic', gains: [5, 4, 1, 0, -2, 1, 0, 2, 4, 5] },
  { name: 'Vocal', gains: [-2, -1, 0, 3, 5, 5, 3, 0, -1, -2] },
  { name: 'Bass Only', gains: [8, 6, 4, 1, -3, -5, -5, -5, -5, -5] },
];

export const useEqualizer = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const filtersRef = useRef<BiquadFilterNode[]>([]);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const connectedMediaRef = useRef<HTMLMediaElement | null>(null);

  const [bands, setBands] = useState<EqualizerBand[]>(DEFAULT_BANDS);
  const [isEnabled, setIsEnabled] = useState(false);
  const [currentPreset, setCurrentPreset] = useState<string>('Flat');

  // Initialize Web Audio API
  const initializeEqualizer = useCallback((mediaElement: HTMLMediaElement) => {
    // Prevent re-initialization on same element
    if (connectedMediaRef.current === mediaElement && audioContextRef.current) {
      return;
    }

    // Clean up previous context
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;

      // Create source
      const source = audioContext.createMediaElementSource(mediaElement);
      sourceRef.current = source;
      connectedMediaRef.current = mediaElement;

      // Create filters
      const filters = DEFAULT_BANDS.map((band) => {
        const filter = audioContext.createBiquadFilter();
        filter.type = 'peaking';
        filter.frequency.value = band.frequency;
        filter.Q.value = 1.4;
        filter.gain.value = 0;
        return filter;
      });

      // Connect filters in series
      filters.reduce((prev, curr) => {
        prev.connect(curr);
        return curr;
      }, source as unknown as BiquadFilterNode);

      // Connect last filter to destination
      filters[filters.length - 1].connect(audioContext.destination);

      filtersRef.current = filters;
      setIsEnabled(true);
    } catch (err) {
      console.error('Failed to initialize equalizer:', err);
    }
  }, []);

  // Update band gain
  const setBandGain = useCallback((index: number, gain: number) => {
    if (filtersRef.current[index]) {
      filtersRef.current[index].gain.value = gain;
    }
    setBands((prev) =>
      prev.map((band, i) => (i === index ? { ...band, gain } : band))
    );
    setCurrentPreset('Custom');
  }, []);

  // Apply preset
  const applyPreset = useCallback((preset: EqualizerPreset) => {
    preset.gains.forEach((gain, index) => {
      if (filtersRef.current[index]) {
        filtersRef.current[index].gain.value = gain;
      }
    });
    setBands((prev) =>
      prev.map((band, i) => ({ ...band, gain: preset.gains[i] }))
    );
    setCurrentPreset(preset.name);
  }, []);

  // Reset all bands
  const resetEqualizer = useCallback(() => {
    const flatPreset = EQUALIZER_PRESETS.find((p) => p.name === 'Flat')!;
    applyPreset(flatPreset);
  }, [applyPreset]);

  // Toggle equalizer on/off
  const toggleEqualizer = useCallback(() => {
    if (!audioContextRef.current || !sourceRef.current) return;

    if (isEnabled) {
      // Bypass: connect source directly to destination
      sourceRef.current.disconnect();
      sourceRef.current.connect(audioContextRef.current.destination);
    } else {
      // Enable: reconnect through filters
      sourceRef.current.disconnect();
      if (filtersRef.current.length > 0) {
        sourceRef.current.connect(filtersRef.current[0]);
      }
    }
    setIsEnabled((prev) => !prev);
  }, [isEnabled]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return {
    bands,
    isEnabled,
    currentPreset,
    presets: EQUALIZER_PRESETS,
    initializeEqualizer,
    setBandGain,
    applyPreset,
    resetEqualizer,
    toggleEqualizer,
  };
};
