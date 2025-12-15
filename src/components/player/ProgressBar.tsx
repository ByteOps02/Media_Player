import React, { useState, useRef, useCallback } from 'react';
import { formatTime } from '@/hooks/useMediaPlayer';

interface ProgressBarProps {
  currentTime: number;
  duration: number;
  buffered: number;
  onSeek: (time: number) => void;
  thumbnailGetter?: (time: number) => string | null;
  abLoopPointA?: number | null;
  abLoopPointB?: number | null;
  bookmarks?: number[];
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  currentTime,
  duration,
  buffered,
  onSeek,
  thumbnailGetter,
  abLoopPointA,
  abLoopPointB,
  bookmarks = [],
}) => {
  const progressRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [hoverTime, setHoverTime] = useState(0);
  const [hoverX, setHoverX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [thumbnail, setThumbnail] = useState<string | null>(null);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const bufferedProgress = duration > 0 ? (buffered / duration) * 100 : 0;
  const loopAPosition = abLoopPointA !== null && duration > 0 ? (abLoopPointA / duration) * 100 : null;
  const loopBPosition = abLoopPointB !== null && duration > 0 ? (abLoopPointB / duration) * 100 : null;

  const calculateTime = useCallback((e: React.MouseEvent | MouseEvent) => {
    if (!progressRef.current || duration <= 0) return 0;
    
    const rect = progressRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percent = x / rect.width;
    return percent * duration;
  }, [duration]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!progressRef.current) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const time = calculateTime(e);
    
    setHoverX(x);
    setHoverTime(time);

    // Get thumbnail if available
    if (thumbnailGetter) {
      const thumb = thumbnailGetter(time);
      setThumbnail(thumb);
    }

    if (isDragging) {
      onSeek(time);
    }
  }, [calculateTime, isDragging, onSeek, thumbnailGetter]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    onSeek(calculateTime(e));
  }, [calculateTime, onSeek]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => {
    setIsHovering(false);
    setIsDragging(false);
    setThumbnail(null);
  };

  // Global mouse up listener for dragging
  React.useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseUp = () => setIsDragging(false);
      window.addEventListener('mouseup', handleGlobalMouseUp);
      return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
    }
  }, [isDragging]);

  return (
    <div className="w-full group">
      <div
        ref={progressRef}
        className={`
          relative w-full cursor-pointer rounded-full
          transition-all duration-200
          ${isHovering || isDragging ? 'h-2' : 'h-1'}
        `}
        style={{ background: 'hsl(var(--player-progress-bg))' }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        {/* A-B Loop region highlight */}
        {loopAPosition !== null && loopBPosition !== null && (
          <div
            className="absolute top-0 h-full bg-primary/20 rounded-full"
            style={{
              left: `${loopAPosition}%`,
              width: `${loopBPosition - loopAPosition}%`,
            }}
          />
        )}

        {/* Buffered progress */}
        <div
          className="absolute top-0 left-0 h-full rounded-full transition-all duration-150"
          style={{
            width: `${bufferedProgress}%`,
            background: 'hsl(var(--player-progress-buffer))',
          }}
        />

        {/* Active progress */}
        <div
          className="absolute top-0 left-0 h-full rounded-full transition-[width] duration-75"
          style={{
            width: `${progress}%`,
            background: 'hsl(var(--player-progress-active))',
          }}
        />

        {/* A-B Loop markers */}
        {loopAPosition !== null && (
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary border-2 border-background z-10"
            style={{ left: `calc(${loopAPosition}% - 6px)` }}
            title="Loop Point A"
          />
        )}
        {loopBPosition !== null && (
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary border-2 border-background z-10"
            style={{ left: `calc(${loopBPosition}% - 6px)` }}
            title="Loop Point B"
          />
        )}

        {/* Bookmark markers */}
        {bookmarks.map((time, index) => {
          const position = duration > 0 ? (time / duration) * 100 : 0;
          return (
            <div
              key={index}
              className="absolute top-0 w-0.5 h-full bg-yellow-400 z-10"
              style={{ left: `${position}%` }}
              title={`Bookmark: ${formatTime(time)}`}
            />
          );
        })}

        {/* Thumb */}
        <div
          className={`
            absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full
            bg-primary shadow-lg transition-all duration-200
            ${isHovering || isDragging ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}
          `}
          style={{
            left: `calc(${progress}% - 8px)`,
            boxShadow: '0 0 10px hsl(var(--player-glow))',
          }}
        />

        {/* Hover preview with thumbnail */}
        {(isHovering || isDragging) && (
          <div
            className="absolute bottom-6 -translate-x-1/2 flex flex-col items-center animate-fade-up pointer-events-none"
            style={{ left: hoverX }}
          >
            {/* Thumbnail preview */}
            {thumbnail && (
              <div className="mb-2 rounded-lg overflow-hidden shadow-lg border border-border bg-background">
                <img
                  src={thumbnail}
                  alt="Preview"
                  className="w-40 h-auto"
                />
              </div>
            )}
            
            {/* Time display */}
            <div className="px-2 py-1 rounded bg-popover text-xs font-medium text-popover-foreground shadow-lg">
              {formatTime(hoverTime)}
            </div>
          </div>
        )}
      </div>

      {/* Time display */}
      <div className="flex justify-between mt-2 text-xs text-muted-foreground">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
};

export default ProgressBar;
