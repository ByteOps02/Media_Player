import React from 'react';
import { Music2 } from 'lucide-react';

interface AudioVisualizerProps {
  isPlaying: boolean;
  fileName: string;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ isPlaying, fileName }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-8 py-16">
      {/* Album art placeholder with animation */}
      <div className="relative">
        <div className={`
          w-48 h-48 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary
          flex items-center justify-center shadow-2xl
          transition-transform duration-500
          ${isPlaying ? 'scale-100' : 'scale-95'}
        `}
        style={{
          boxShadow: isPlaying ? '0 0 60px hsl(var(--player-glow))' : 'none',
        }}
        >
          <Music2 className="w-20 h-20 text-primary" />
        </div>

        {/* Rotating ring animation */}
        {isPlaying && (
          <div className="absolute inset-0 -m-4">
            <div className="w-full h-full rounded-2xl border-2 border-primary/30 animate-pulse" />
          </div>
        )}
      </div>

      {/* Waveform visualization */}
      <div className="flex items-end gap-1 h-16">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className={`
              w-1.5 rounded-full bg-primary/60 transition-all duration-150
              ${isPlaying ? '' : 'h-2'}
            `}
            style={{
              height: isPlaying ? `${Math.random() * 60 + 10}%` : '8px',
              animationDelay: `${i * 50}ms`,
              animation: isPlaying ? `waveform ${0.3 + Math.random() * 0.4}s ease-in-out infinite alternate` : 'none',
            }}
          />
        ))}
      </div>

      {/* File name */}
      <div className="text-center max-w-md">
        <h3 className="text-lg font-semibold text-foreground truncate">
          {fileName.replace(/\.[^/.]+$/, '')}
        </h3>
        <p className="text-sm text-muted-foreground mt-1">Now Playing</p>
      </div>
    </div>
  );
};

export default AudioVisualizer;
