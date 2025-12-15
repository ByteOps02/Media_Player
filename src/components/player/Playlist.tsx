import React from 'react';
import { X, Play, FileVideo, FileAudio, Trash2, ListMusic } from 'lucide-react';
import type { MediaFile } from '@/hooks/useMediaPlayer';

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
      <div className="flex items-center justify-between px-3 py-2 gap-2 border-b border-white/5 bg-transparent sticky top-0 z-10">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md flex-shrink-0">
            <ListMusic className="w-3.5 h-3.5 text-primary-foreground" />
          </div>
          <div className="min-w-0">
            <h2 className="font-bold text-sm text-foreground tracking-tight">Playlist</h2>
            <span className="text-[10px] text-muted-foreground block -mt-0.5">
              {playlist.length} {playlist.length === 1 ? 'item' : 'items'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={onClear}
            className="btn-icon-secondary w-7 h-7"
            title="Clear playlist"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Playlist items */}
      <div className="flex-1 overflow-y-auto p-1">
        {playlist.map((media, index) => (
          <div
            key={media.id}
            onClick={() => onPlay(index)}
            className={`
              playlist-item group rounded-md p-2 mb-1 last:mb-0 cursor-pointer flex items-center
              ${index === currentIndex ? 'bg-primary/10 border-l-2 border-primary' : 'hover:bg-secondary/40'}
            `}
          >
            {/* Icon */}
            <div className={`
              w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 transition-all
              ${index === currentIndex ? 'bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-md' : 'bg-secondary/40 text-muted-foreground group-hover:bg-secondary/60'}
            `}>
              {index === currentIndex ? (
                <Play className="w-3.5 h-3.5" />
              ) : media.type === 'video' ? (
                <FileVideo className="w-3.5 h-3.5" />
              ) : (
                <FileAudio className="w-3.5 h-3.5" />
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 ml-2">
              <p className={`
                text-xs font-semibold truncate transition-colors leading-tight
                ${index === currentIndex ? 'text-primary' : 'text-foreground group-hover:text-primary'}
              `}>
                {media.name.replace(/\.[^/.]+$/, '')}
              </p>
              <p className="text-[10px] text-muted-foreground capitalize mt-0.5">
                {media.type}
              </p>
            </div>

            {/* Remove button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove(media.id);
              }}
              className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all flex-shrink-0 ml-1"
              title="Remove from playlist"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Playlist;