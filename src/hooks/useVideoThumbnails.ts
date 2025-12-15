import { useState, useCallback, useRef, useEffect } from 'react';

interface ThumbnailCache {
  [time: number]: string;
}

export const useVideoThumbnails = (videoSrc: string | undefined, duration: number) => {
  const [thumbnails, setThumbnails] = useState<ThumbnailCache>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const abortRef = useRef(false);

  // Create hidden video and canvas elements
  useEffect(() => {
    if (!videoSrc || duration <= 0) return;

    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.width = 160;
    canvas.height = 90;
    canvasRef.current = canvas;

    // Create hidden video
    const video = document.createElement('video');
    video.src = videoSrc;
    video.crossOrigin = 'anonymous';
    video.muted = true;
    video.preload = 'metadata';
    videoRef.current = video;

    return () => {
      if (videoRef.current) {
        videoRef.current.src = '';
        videoRef.current = null;
      }
      canvasRef.current = null;
    };
  }, [videoSrc, duration]);

  // Generate thumbnails at intervals
  const generateThumbnails = useCallback(async () => {
    if (!videoSrc || duration <= 0 || !videoRef.current || !canvasRef.current) return;
    if (isGenerating) return;

    setIsGenerating(true);
    abortRef.current = false;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Generate thumbnails every 10 seconds
    const interval = Math.max(5, Math.min(10, duration / 20));
    const times: number[] = [];
    for (let t = 0; t <= duration; t += interval) {
      times.push(t);
    }

    const newThumbnails: ThumbnailCache = {};

    for (const time of times) {
      if (abortRef.current) break;

      try {
        await new Promise<void>((resolve, reject) => {
          const onSeeked = () => {
            video.removeEventListener('seeked', onSeeked);
            video.removeEventListener('error', onError);
            
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            newThumbnails[Math.floor(time)] = canvas.toDataURL('image/jpeg', 0.6);
            resolve();
          };

          const onError = () => {
            video.removeEventListener('seeked', onSeeked);
            video.removeEventListener('error', onError);
            resolve();
          };

          video.addEventListener('seeked', onSeeked);
          video.addEventListener('error', onError);
          video.currentTime = time;
        });
      } catch (err) {
        console.error('Thumbnail generation error:', err);
      }
    }

    if (!abortRef.current) {
      setThumbnails(newThumbnails);
    }
    setIsGenerating(false);
  }, [videoSrc, duration, isGenerating]);

  // Get thumbnail for a specific time
  const getThumbnail = useCallback(
    (time: number): string | null => {
      // Find nearest thumbnail
      const times = Object.keys(thumbnails).map(Number).sort((a, b) => a - b);
      if (times.length === 0) return null;

      let nearest = times[0];
      for (const t of times) {
        if (Math.abs(t - time) < Math.abs(nearest - time)) {
          nearest = t;
        }
      }

      return thumbnails[nearest] || null;
    },
    [thumbnails]
  );

  // Stop generation
  const stopGeneration = useCallback(() => {
    abortRef.current = true;
  }, []);

  // Clear thumbnails
  const clearThumbnails = useCallback(() => {
    abortRef.current = true;
    setThumbnails({});
    setIsGenerating(false);
  }, []);

  return {
    thumbnails,
    isGenerating,
    hasThumbnails: Object.keys(thumbnails).length > 0,
    generateThumbnails,
    getThumbnail,
    stopGeneration,
    clearThumbnails,
  };
};
