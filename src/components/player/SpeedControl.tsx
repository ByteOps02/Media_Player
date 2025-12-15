import React, { useState, useRef, useEffect } from 'react';
import { Gauge } from 'lucide-react';

interface SpeedControlProps {
  playbackRate: number;
  onPlaybackRateChange: (rate: number) => void;
  isVideo?: boolean;
}

const SPEED_OPTIONS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

const SpeedControl: React.FC<SpeedControlProps> = ({
  playbackRate,
  onPlaybackRateChange,
  isVideo = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const formatSpeed = (speed: number) => {
    return speed === 1 ? 'Normal' : `${speed}x`;
  };

  const textColor = isVideo ? 'text-white/90 drop-shadow-md' : 'text-foreground';
  const mutedColor = isVideo ? 'text-white/70 drop-shadow-sm' : 'text-muted-foreground';


  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`btn-icon-secondary flex items-center justify-center ${textColor}`}
        title="Playback speed"
      >
        <Gauge className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute bottom-full right-0 mb-2 
          glass rounded-lg py-2 min-w-[130px] animate-scale-in shadow-xl border border-border/30 backdrop-blur-md">
          <div className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider ${mutedColor}`}>
            Playback Speed
          </div>
          {SPEED_OPTIONS.map((speed) => (
            <button
              key={speed}
              onClick={() => {
                onPlaybackRateChange(speed);
                setIsOpen(false);
              }}
              className={`
                w-full px-3 py-2 text-left text-sm transition-colors duration-150
                hover:bg-secondary/70 flex items-center justify-between font-medium
                ${playbackRate === speed ? 'text-primary bg-primary/10' : textColor}
              `}
            >
              <span>{formatSpeed(speed)}</span>
              {playbackRate === speed && (
                <div className="w-2 h-2 rounded-full bg-primary glow-accent-sm" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SpeedControl;
