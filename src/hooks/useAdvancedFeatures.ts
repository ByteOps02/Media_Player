import { useState, useCallback, useRef, useEffect } from 'react';

export interface ABLoopState {
  isEnabled: boolean;
  pointA: number | null;
  pointB: number | null;
}

export interface SleepTimerState {
  isEnabled: boolean;
  remainingTime: number; // in seconds
  endTime: number | null;
}

export const useAdvancedFeatures = (
  mediaRef: React.RefObject<HTMLMediaElement | null>,
  currentTime: number,
  togglePlay: () => void
) => {
  // A-B Loop
  const [abLoop, setABLoop] = useState<ABLoopState>({
    isEnabled: false,
    pointA: null,
    pointB: null,
  });

  // Sleep Timer
  const [sleepTimer, setSleepTimer] = useState<SleepTimerState>({
    isEnabled: false,
    remainingTime: 0,
    endTime: null,
  });
  const sleepIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Screenshot
  const [lastScreenshot, setLastScreenshot] = useState<string | null>(null);

  // Bookmarks
  const [bookmarks, setBookmarks] = useState<number[]>([]);

  // ============ A-B Loop ============
  const setPointA = useCallback(() => {
    setABLoop((prev) => ({
      ...prev,
      pointA: currentTime,
      isEnabled: prev.pointB !== null,
    }));
  }, [currentTime]);

  const setPointB = useCallback(() => {
    if (abLoop.pointA !== null && currentTime > abLoop.pointA) {
      setABLoop((prev) => ({
        ...prev,
        pointB: currentTime,
        isEnabled: true,
      }));
    }
  }, [currentTime, abLoop.pointA]);

  const clearABLoop = useCallback(() => {
    setABLoop({ isEnabled: false, pointA: null, pointB: null });
  }, []);

  // Check A-B loop during playback
  useEffect(() => {
    if (!abLoop.isEnabled || abLoop.pointA === null || abLoop.pointB === null) return;
    if (!mediaRef.current) return;

    if (currentTime >= abLoop.pointB) {
      mediaRef.current.currentTime = abLoop.pointA;
    }
  }, [currentTime, abLoop, mediaRef]);

  // ============ Sleep Timer ============
  const startSleepTimer = useCallback((minutes: number) => {
    if (sleepIntervalRef.current) {
      clearInterval(sleepIntervalRef.current);
    }

    const endTime = Date.now() + minutes * 60 * 1000;
    setSleepTimer({
      isEnabled: true,
      remainingTime: minutes * 60,
      endTime,
    });

    sleepIntervalRef.current = setInterval(() => {
      setSleepTimer((prev) => {
        const remaining = Math.max(0, Math.floor((prev.endTime! - Date.now()) / 1000));
        
        if (remaining <= 0) {
          if (sleepIntervalRef.current) {
            clearInterval(sleepIntervalRef.current);
          }
          // Pause playback
          if (mediaRef.current && !mediaRef.current.paused) {
            togglePlay();
          }
          return { isEnabled: false, remainingTime: 0, endTime: null };
        }
        
        return { ...prev, remainingTime: remaining };
      });
    }, 1000);
  }, [mediaRef, togglePlay]);

  const cancelSleepTimer = useCallback(() => {
    if (sleepIntervalRef.current) {
      clearInterval(sleepIntervalRef.current);
    }
    setSleepTimer({ isEnabled: false, remainingTime: 0, endTime: null });
  }, []);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (sleepIntervalRef.current) {
        clearInterval(sleepIntervalRef.current);
      }
    };
  }, []);

  // ============ Screenshot ============
  const captureScreenshot = useCallback((): string | null => {
    if (!mediaRef.current || !(mediaRef.current instanceof HTMLVideoElement)) return null;

    const video = mediaRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL('image/png');
    setLastScreenshot(dataUrl);

    // Trigger download
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `screenshot-${Date.now()}.png`;
    link.click();

    return dataUrl;
  }, [mediaRef]);

  // ============ Bookmarks ============
  const addBookmark = useCallback(() => {
    setBookmarks((prev) => {
      if (prev.includes(currentTime)) return prev;
      return [...prev, currentTime].sort((a, b) => a - b);
    });
  }, [currentTime]);

  const removeBookmark = useCallback((time: number) => {
    setBookmarks((prev) => prev.filter((t) => t !== time));
  }, []);

  const jumpToBookmark = useCallback((time: number) => {
    if (mediaRef.current) {
      mediaRef.current.currentTime = time;
    }
  }, [mediaRef]);

  const clearBookmarks = useCallback(() => {
    setBookmarks([]);
  }, []);

  return {
    // A-B Loop
    abLoop,
    setPointA,
    setPointB,
    clearABLoop,
    
    // Sleep Timer
    sleepTimer,
    startSleepTimer,
    cancelSleepTimer,
    
    // Screenshot
    lastScreenshot,
    captureScreenshot,
    
    // Bookmarks
    bookmarks,
    addBookmark,
    removeBookmark,
    jumpToBookmark,
    clearBookmarks,
  };
};
