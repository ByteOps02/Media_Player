import React from 'react';
import { X, Play, FileVideo, FileAudio, Trash2, ListMusic } from 'lucide-react';
import type { MediaFile } from '@/hooks/useMediaPlayer';
import { formatTime } from '@/hooks/useMediaPlayer';

interface PlaylistProps {
  playlist: MediaFile[];
  currentIndex: number;
  onPlay: (index: number) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
}

const Playlist: React.FC<PlaylistProps> = ({
  playlist,
  currentIndex,
  onPlay,
  onRemove,
  onClear,
}) => {
  if (playlist.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <ListMusic className="w-12 h-12 text-muted-foreground/50 mb-4" />
        <p className="text-muted-foreground">No media in playlist</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full">
      {/* Header */}
      <div className="flex items-center justify-between px-3 sm:p-4 py-3 gap-2 border-b border-border/40 bg-gradient-to-r from-card/60 to-secondary/30 backdrop-blur-md glass sticky top-0 z-10 flex-wrap">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0\">
          <div className="w-7 sm:w-8 h-7 sm:h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg flex-shrink-0">
            <ListMusic className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-primary-foreground" />
          </div>
          <div className="min-w-0">
            <h2 className="font-bold text-sm sm:text-base text-foreground tracking-tight\">Playlist</h2>
            <span className="text-xs text-muted-foreground\">
              {playlist.length} {playlist.length === 1 ? 'item' : 'items'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
          <button
            onClick={onClear}
            className="btn-icon-secondary w-7 sm:w-8 h-7 sm:h-8"
            title="Clear playlist"
          >
            <Trash2 className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
          </button>
        </div>
      </div>

      {/* Playlist items */}
      <div className="flex-1 overflow-y-auto p-1.5 sm:p-2">
        {playlist.map((media, index) => (
          <div
            key={media.id}
            onClick={() => onPlay(index)}
            className={`
              playlist-item group
              ${index === currentIndex ? 'playlist-item-active' : ''}
            `}
          >
            {/* Icon */}
            <div className={`
              w-8 sm:w-10 h-8 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-all
              ${index === currentIndex ? 'bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-lg' : 'bg-secondary/60 text-muted-foreground group-hover:bg-secondary'}
            `}>
              {index === currentIndex ? (
                <Play className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
              ) : media.type === 'video' ? (
                <FileVideo className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
              ) : (
                <FileAudio className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className={`
                text-xs sm:text-sm font-semibold truncate transition-colors
                ${index === currentIndex ? 'text-primary' : 'text-foreground group-hover:text-primary'}
              `}>
                {media.name.replace(/\.[^/.]+$/, '')}
              </p>
              <p className="text-xs text-muted-foreground capitalize\">
                {media.type}
              </p>
            </div>

            {/* Remove button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove(media.id);
              }}
              className="opacity-0 group-hover:opacity-100 control-btn text-muted-foreground hover:text-destructive transition-opacity flex-shrink-0"
              title="Remove from playlist"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Playlist;
