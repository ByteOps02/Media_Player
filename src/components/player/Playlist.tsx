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
  onAddMore: () => void;
}

const Playlist: React.FC<PlaylistProps> = ({
  playlist,
  currentIndex,
  onPlay,
  onRemove,
  onClear,
  onAddMore,
}) => {
  if (playlist.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <ListMusic className="w-12 h-12 text-muted-foreground/50 mb-4" />
        <p className="text-muted-foreground">No media in playlist</p>
        <button
          onClick={onAddMore}
          className="mt-4 text-sm text-primary hover:underline"
        >
          Add files
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <ListMusic className="w-5 h-5 text-primary" />
          <h2 className="font-semibold text-foreground">Playlist</h2>
          <span className="text-xs text-muted-foreground">
            ({playlist.length} {playlist.length === 1 ? 'item' : 'items'})
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onAddMore}
            className="text-xs text-primary hover:underline"
          >
            Add more
          </button>
          <button
            onClick={onClear}
            className="control-btn text-muted-foreground hover:text-destructive"
            title="Clear playlist"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Playlist items */}
      <div className="flex-1 overflow-y-auto p-2">
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
              w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
              ${index === currentIndex ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}
            `}>
              {index === currentIndex ? (
                <Play className="w-4 h-4" />
              ) : media.type === 'video' ? (
                <FileVideo className="w-4 h-4" />
              ) : (
                <FileAudio className="w-4 h-4" />
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className={`
                text-sm font-medium truncate
                ${index === currentIndex ? 'text-primary' : 'text-foreground'}
              `}>
                {media.name.replace(/\.[^/.]+$/, '')}
              </p>
              <p className="text-xs text-muted-foreground capitalize">
                {media.type}
              </p>
            </div>

            {/* Remove button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove(media.id);
              }}
              className="opacity-0 group-hover:opacity-100 control-btn text-muted-foreground hover:text-destructive"
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
