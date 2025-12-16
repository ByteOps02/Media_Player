import { useState, useRef, useCallback, useEffect } from 'react';

export interface MediaFile {
  id: string;
  file: File;
  name: string;
  type: 'video' | 'audio';
  url: string;
  duration?: number;
}

export interface PlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  playbackRate: number;
  isFullscreen: boolean;
  isPiP: boolean;
  isLoading: boolean;
  buffered: number;
  shuffle: boolean;
  repeat: 'none' | 'one' | 'all';
}

const VIDEO_EXTENSIONS = ['.mp4', '.webm', '.mkv', '.avi', '.mov', '.m4v'];
const AUDIO_EXTENSIONS = ['.mp3', '.wav', '.flac', '.aac', '.ogg', '.m4a', '.wma'];
const SKIP_SECONDS = 10;
const VOLUME_STEP = 0.1;
const RESTART_THRESHOLD = 3;

export const getMediaType = (filename: string): 'video' | 'audio' | null => {
  const ext = filename.toLowerCase().slice(filename.lastIndexOf('.'));
  if (VIDEO_EXTENSIONS.includes(ext)) return 'video';
  if (AUDIO_EXTENSIONS.includes(ext)) return 'audio';
  return null;
};

export const formatTime = (seconds: number): string => {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const useMediaPlayer = () => {
  const mediaRef = useRef<HTMLVideoElement | HTMLAudioElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  
  const [playlist, setPlaylist] = useState<MediaFile[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [state, setState] = useState<PlayerState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    isMuted: false,
    playbackRate: 1,
    isFullscreen: false,
    isPiP: false,
    isLoading: false,
    buffered: 0,
    shuffle: false,
    repeat: 'none',
  });

  const currentMedia = currentIndex >= 0 ? playlist[currentIndex] : null;
  const playlistRef = useRef(playlist);
  playlistRef.current = playlist;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      playlistRef.current.forEach((m) => URL.revokeObjectURL(m.url));
    };
  }, []);

  // Add files to playlist
  const addFiles = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const newMediaFiles: MediaFile[] = [];

    fileArray.forEach((file) => {
      const type = getMediaType(file.name);
      if (type) {
        newMediaFiles.push({
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          file,
          name: file.name,
          type,
          url: URL.createObjectURL(file),
        });
      }
    });

    if (newMediaFiles.length > 0) {
      setPlaylist((prev) => {
        const updated = [...prev, ...newMediaFiles];
        if (currentIndex === -1) {
          setCurrentIndex(0);
        }
        return updated;
      });
    }
  }, [currentIndex]);

  // Play specific index
  const playIndex = useCallback((index: number) => {
    if (index >= 0 && index < playlist.length) {
      setCurrentIndex(index);
    }
  }, [playlist.length]);

  // Play/Pause toggle
  const togglePlay = useCallback(() => {
    if (!mediaRef.current) return;
    
    if (state.isPlaying) {
      mediaRef.current.pause();
    } else {
      mediaRef.current.play();
    }
  }, [state.isPlaying]);

  // Seek
  const seek = useCallback((time: number) => {
    if (mediaRef.current) {
      mediaRef.current.currentTime = Math.max(0, Math.min(time, state.duration));
    }
  }, [state.duration]);

  // Skip forward/backward
  const skip = useCallback((seconds: number) => {
    if (mediaRef.current) {
      seek(mediaRef.current.currentTime + seconds);
    }
  }, [seek]);

  // Volume control
  const setVolume = useCallback((volume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    if (mediaRef.current) {
      mediaRef.current.volume = clampedVolume;
    }
    setState((prev) => ({ ...prev, volume: clampedVolume, isMuted: clampedVolume === 0 }));
  }, []);

  // Toggle mute
  const toggleMute = useCallback(() => {
    if (mediaRef.current) {
      mediaRef.current.muted = !state.isMuted;
    }
    setState((prev) => ({ ...prev, isMuted: !prev.isMuted }));
  }, [state.isMuted]);

  // Playback rate
  const setPlaybackRate = useCallback((rate: number) => {
    if (mediaRef.current) {
      mediaRef.current.playbackRate = rate;
    }
    setState((prev) => ({ ...prev, playbackRate: rate }));
  }, []);

  // Fullscreen
  const toggleFullscreen = useCallback(async () => {
    if (!containerRef.current) return;

    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
        setState((prev) => ({ ...prev, isFullscreen: true }));
      } else {
        await document.exitFullscreen();
        setState((prev) => ({ ...prev, isFullscreen: false }));
      }
    } catch (err) {
      console.error('Fullscreen error:', err);
    }
  }, []);

  // Picture-in-Picture
  const togglePiP = useCallback(async () => {
    if (!mediaRef.current || !(mediaRef.current instanceof HTMLVideoElement)) return;

    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
        setState((prev) => ({ ...prev, isPiP: false }));
      } else {
        await mediaRef.current.requestPictureInPicture();
        setState((prev) => ({ ...prev, isPiP: true }));
      }
    } catch (err) {
      console.error('PiP error:', err);
    }
  }, []);

  // Next track
  const playNext = useCallback(() => {
    if (playlist.length === 0) return;
    
    if (state.shuffle) {
      const randomIndex = Math.floor(Math.random() * playlist.length);
      setCurrentIndex(randomIndex);
    } else {
      const nextIndex = (currentIndex + 1) % playlist.length;
      if (nextIndex === 0 && state.repeat === 'none') {
        setState((prev) => ({ ...prev, isPlaying: false }));
        return;
      }
      setCurrentIndex(nextIndex);
    }
  }, [playlist.length, currentIndex, state.shuffle, state.repeat]);

  // Previous track
  const playPrevious = useCallback(() => {
    if (playlist.length === 0) return;
    
    // If more than 3 seconds in, restart current track
    if (state.currentTime > RESTART_THRESHOLD) {
      seek(0);
      return;
    }
    
    const prevIndex = currentIndex - 1 < 0 ? playlist.length - 1 : currentIndex - 1;
    setCurrentIndex(prevIndex);
  }, [playlist.length, currentIndex, state.currentTime, seek]);

  // Toggle shuffle

  // Toggle shuffle
  const toggleShuffle = useCallback(() => {
    setState((prev) => ({ ...prev, shuffle: !prev.shuffle }));
  }, []);

  // Toggle repeat
  const toggleRepeat = useCallback(() => {
    setState((prev) => ({
      ...prev,
      repeat: prev.repeat === 'none' ? 'all' : prev.repeat === 'all' ? 'one' : 'none',
    }));
  }, []);

  // Remove from playlist
  const removeFromPlaylist = useCallback((id: string) => {
    setPlaylist((prev) => {
      const index = prev.findIndex((m) => m.id === id);
      const newPlaylist = prev.filter((m) => m.id !== id);
      
      // Clean up URL
      const removed = prev[index];
      if (removed) URL.revokeObjectURL(removed.url);
      
      // Adjust current index
      if (index < currentIndex) {
        setCurrentIndex((i) => i - 1);
      } else if (index === currentIndex) {
        if (newPlaylist.length === 0) {
          setCurrentIndex(-1);
        } else if (currentIndex >= newPlaylist.length) {
          setCurrentIndex(newPlaylist.length - 1);
        }
      }
      
      return newPlaylist;
    });
  }, [currentIndex]);

  // Clear playlist
  const clearPlaylist = useCallback(() => {
    playlist.forEach((m) => URL.revokeObjectURL(m.url));
    setPlaylist([]);
    setCurrentIndex(-1);
    setState((prev) => ({ ...prev, isPlaying: false, currentTime: 0, duration: 0 }));
  }, [playlist]);

  // Media event handlers
  useEffect(() => {
    const media = mediaRef.current;
    if (!media) return;

    const handleTimeUpdate = () => {
      setState((prev) => ({ ...prev, currentTime: media.currentTime }));
    };

    const handleDurationChange = () => {
      setState((prev) => ({ ...prev, duration: media.duration || 0 }));
    };

    const handlePlay = () => {
      setState((prev) => ({ ...prev, isPlaying: true }));
    };

    const handlePause = () => {
      setState((prev) => ({ ...prev, isPlaying: false }));
    };

    const handleWaiting = () => {
      setState((prev) => ({ ...prev, isLoading: true }));
    };

    const handleCanPlay = () => {
      setState((prev) => ({ ...prev, isLoading: false }));
    };

    const handleProgress = () => {
      if (media.buffered.length > 0) {
        const bufferedEnd = media.buffered.end(media.buffered.length - 1);
        setState((prev) => ({ ...prev, buffered: bufferedEnd }));
      }
    };

    const handleEnded = () => {
      if (state.repeat === 'one') {
        media.currentTime = 0;
        media.play();
      } else {
        playNext();
      }
    };

    const handleVolumeChange = () => {
      setState((prev) => ({ 
        ...prev, 
        volume: media.volume,
        isMuted: media.muted 
      }));
    };

    media.addEventListener('timeupdate', handleTimeUpdate);
    media.addEventListener('durationchange', handleDurationChange);
    media.addEventListener('play', handlePlay);
    media.addEventListener('pause', handlePause);
    media.addEventListener('waiting', handleWaiting);
    media.addEventListener('canplay', handleCanPlay);
    media.addEventListener('progress', handleProgress);
    media.addEventListener('ended', handleEnded);
    media.addEventListener('volumechange', handleVolumeChange);

    return () => {
      media.removeEventListener('timeupdate', handleTimeUpdate);
      media.removeEventListener('durationchange', handleDurationChange);
      media.removeEventListener('play', handlePlay);
      media.removeEventListener('pause', handlePause);
      media.removeEventListener('waiting', handleWaiting);
      media.removeEventListener('canplay', handleCanPlay);
      media.removeEventListener('progress', handleProgress);
      media.removeEventListener('ended', handleEnded);
      media.removeEventListener('volumechange', handleVolumeChange);
    };
  }, [state.repeat, playNext]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          skip(-SKIP_SECONDS);
          break;
        case 'ArrowRight':
          e.preventDefault();
          skip(SKIP_SECONDS);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setVolume(state.volume + VOLUME_STEP);
          break;
        case 'ArrowDown':
          e.preventDefault();
          setVolume(state.volume - VOLUME_STEP);
          break;
        case 'KeyM':
          toggleMute();
          break;
        case 'KeyF':
          toggleFullscreen();
          break;
        case 'KeyP':
          if (e.shiftKey) togglePiP();
          break;
        case 'KeyN':
          playNext();
          break;
        case 'KeyB':
          playPrevious();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, skip, setVolume, state.volume, toggleMute, toggleFullscreen, togglePiP, playNext, playPrevious]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setState((prev) => ({ ...prev, isFullscreen: !!document.fullscreenElement }));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Media Session API
  useEffect(() => {
    if (!('mediaSession' in navigator) || !currentMedia) return;

    navigator.mediaSession.metadata = new MediaMetadata({
      title: currentMedia.name,
      artist: 'Media Player',
    });

    navigator.mediaSession.setActionHandler('play', togglePlay);
    navigator.mediaSession.setActionHandler('pause', togglePlay);
    navigator.mediaSession.setActionHandler('previoustrack', playPrevious);
    navigator.mediaSession.setActionHandler('nexttrack', playNext);
    navigator.mediaSession.setActionHandler('seekbackward', () => skip(-SKIP_SECONDS));
    navigator.mediaSession.setActionHandler('seekforward', () => skip(SKIP_SECONDS));
  }, [currentMedia, togglePlay, playPrevious, playNext, skip]);

  return {
    mediaRef,
    containerRef,
    playlist,
    currentIndex,
    currentMedia,
    state,
    addFiles,
    playIndex,
    togglePlay,
    seek,
    skip,
    setVolume,
    toggleMute,
    setPlaybackRate,
    toggleFullscreen,
    togglePiP,
    playNext,
    playPrevious,
    toggleShuffle,
    toggleRepeat,
    removeFromPlaylist,
    clearPlaylist,
  };
};
