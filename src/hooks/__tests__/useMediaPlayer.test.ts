
import { renderHook, act } from '@testing-library/react';
import { useMediaPlayer } from '../useMediaPlayer';
import { Howl } from 'howler';

// Mock Howler
jest.mock('howler', () => {
  const { Howl } = jest.requireActual('howler');
  return {
    ...jest.requireActual('howler'),
    Howl: jest.fn().mockImplementation((options) => {
      const howlInstance = new Howl(options);
      // Mock methods that are used in the hook
      howlInstance.play = jest.fn();
      howlInstance.pause = jest.fn();
      howlInstance.seek = jest.fn();
      howlInstance.volume = jest.fn();
      howlInstance.rate = jest.fn();
      howlInstance.mute = jest.fn();
      howlInstance.on = jest.fn();
      howlInstance.off = jest.fn();
      howlInstance.duration = jest.fn().mockReturnValue(180); // 3 minutes
      return howlInstance;
    }),
  };
});

describe('useMediaPlayer', () => {
  let mockAudioFile;

  beforeEach(() => {
    mockAudioFile = {
      path: 'path/to/mock-audio.mp3',
      name: 'mock-audio.mp3',
    };
    // Clear all mocks before each test
    (Howl as jest.Mock).mockClear();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useMediaPlayer({ currentFile: null, playlist: [] }));
    expect(result.current.isPlaying).toBe(false);
    expect(result.current.isMuted).toBe(false);
    expect(result.current.isLooping).toBe(false);
    expect(result.current.progress).toBe(0);
    expect(result.current.volume).toBe(1);
    expect(result.current.playbackRate).toBe(1);
    expect(result.current.duration).toBe(0);
    expect(result.current.currentTime).toBe(0);
    it('should create a new Howl instance when currentFile changes', () => {
      const { rerender } = renderHook(({ currentFile }) => useMediaPlayer({ currentFile, playlist: [] }), {
        initialProps: { currentFile: null },
      });
  
      expect(Howl).not.toHaveBeenCalled();
  
      rerender({ currentFile: mockAudioFile });
  
      expect(Howl).toHaveBeenCalledWith({
        src: [mockAudioFile.path],
        html5: true,
        volume: 1,
        rate: 1,
        loop: false,
      });
    });
  
    it('should play and pause the audio', () => {
      const { result, rerender } = renderHook(({ currentFile }) => useMediaPlayer({ currentFile, playlist: [] }), {
        initialProps: { currentFile: null },
      });
  
      rerender({ currentFile: mockAudioFile });
  
      act(() => {
        result.current.togglePlayPause();
      });
  
      expect(result.current.sound.play).toHaveBeenCalled();
  
      act(() => {
        result.current.togglePlayPause();
      });
  
      expect(result.current.sound.pause).toHaveBeenCalled();
    });
  
    it('should seek to a specific time', () => {
      const { result, rerender } = renderHook(({ currentFile }) => useMediaPlayer({ currentFile, playlist: [] }), {
        initialProps: { currentFile: null },
      });
  
      rerender({ currentFile: mockAudioFile });
  
      act(() => {
        result.current.seek(30);
      });
  
      expect(result.current.sound.seek).toHaveBeenCalledWith(30);
    });
  
    it('should change volume', () => {
      const { result, rerender } = renderHook(({ currentFile }) => useMediaPlayer({ currentFile, playlist: [] }), {
        initialProps: { currentFile: null },
      });
  
      rerender({ currentFile: mockAudioFile });
  
      act(() => {
        result.current.setVolume(0.5);
      });
  
      expect(result.current.sound.volume).toHaveBeenCalledWith(0.5);
    });
  });
  
  
