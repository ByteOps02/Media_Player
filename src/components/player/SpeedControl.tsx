import React, { useState, useRef, useEffect } from 'react';
import { Gauge } from 'lucide-react';

interface SpeedControlProps {
  playbackRate: number;
  onPlaybackRateChange: (rate: number) => void;
}

const SPEED_OPTIONS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

const SpeedControl: React.FC<SpeedControlProps> = ({
  playbackRate,
  onPlaybackRateChange,
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

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="control-btn flex items-center gap-1.5 text-foreground hover:text-primary"
        title="Playback speed"
      >
        <Gauge className="w-5 h-5" />
        <span className="text-xs font-medium">
          {playbackRate === 1 ? '1x' : `${playbackRate}x`}
        </span>
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 
          glass rounded-lg py-2 min-w-[120px] animate-scale-in shadow-xl">
          <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Speed
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
                hover:bg-secondary flex items-center justify-between
                ${playbackRate === speed ? 'text-primary' : 'text-foreground'}
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
