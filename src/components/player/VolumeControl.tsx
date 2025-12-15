import React, { useState } from 'react';
import { Volume2, Volume1, VolumeX } from 'lucide-react';

interface VolumeControlProps {
  volume: number;
  isMuted: boolean;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
  isVideo?: boolean;
}

const VolumeControl: React.FC<VolumeControlProps> = ({
  volume,
  isMuted,
  onVolumeChange,
  onToggleMute,
  isVideo = false,
}) => {
  const [isHovering, setIsHovering] = useState(false);

  const displayVolume = isMuted ? 0 : volume;

  const VolumeIcon = () => {
    if (isMuted || volume === 0) {
      return <VolumeX className="w-5 h-5" />;
    } else if (volume < 0.5) {
      return <Volume1 className="w-5 h-5" />;
    }
    return <Volume2 className="w-5 h-5" />;
  };

  const textColor = isVideo ? 'text-white/90 drop-shadow-md' : 'text-foreground';
  const mutedColor = isVideo ? 'text-white/80 drop-shadow-md' : 'text-muted-foreground';

  return (
    <div
      className="flex items-center gap-1.5 sm:gap-2 group"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <button
        onClick={onToggleMute}
        className={`btn-icon-secondary flex-shrink-0 ${textColor}`}
        title={isMuted ? 'Unmute' : 'Mute'}
      >
        <VolumeIcon />
      </button>

      <div
        className={`
          hidden sm:block overflow-hidden transition-all duration-300 ease-out
          ${isHovering ? 'w-20 sm:w-24 opacity-100' : 'w-0 opacity-0'}
        `}
      >
        <div className="relative w-20 sm:w-24 h-1 rounded-full bg-player-progress-bg group-hover:h-1.5 transition-all">
          {/* Volume level */}
          <div
            className="absolute top-0 left-0 h-full rounded-full bg-primary transition-all"
            style={{ width: `${displayVolume * 100}%` }}
          />
          
          {/* Slider input */}
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={displayVolume}
            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />

          {/* Thumb */}
          <div
            className={`
              absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary
              shadow-lg transition-all duration-200
              ${isHovering ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}
            `}
            style={{
              left: `calc(${displayVolume * 100}% - 6px)`,
              pointerEvents: 'none',
            }}
          />
        </div>
      </div>

      {/* Volume percentage - only show on hover on desktop */}
      <span
        className={`
          hidden sm:inline text-xs font-medium min-w-[32px]
          transition-all duration-300 ${mutedColor}
          ${isHovering ? 'opacity-100' : 'opacity-0'}
        `}
      >
        {Math.round(displayVolume * 100)}%
      </span>
    </div>
  );
};

export default VolumeControl;
