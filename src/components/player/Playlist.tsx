import React from 'react';
import { X, Play, FileVideo, FileAudio, Trash2, ListMusic } from 'lucide-react';

interface MediaFile {
  id: string;
  name: string;
  type: 'video' | 'audio';
  url: string;
}

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
      <div className="flex items-center justify-between px-4 py-3 gap-2 border-b border-transparent bg-transparent sticky top-0 z-10">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg flex-shrink-0">
            <ListMusic className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0">
            <h2 className="font-semibold text-base text-foreground tracking-tight">Playlist</h2>
            <span className="text-xs text-muted-foreground/80 block -mt-0.5">
              {playlist.length} {playlist.length === 1 ? 'item' : 'items'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0 mr-9">
          <button
            onClick={onClear}
            className="control-btn text-white/90 drop-shadow-md hover:text-primary transition-all duration-200 flex items-center justify-center shadow-sm"
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
              group rounded-lg p-2 mb-1.5 last:mb-0 cursor-pointer flex items-center transition-all duration-200
              backdrop-blur-md border shadow-sm
              ${index === currentIndex 
                ? 'bg-transparent border-transparent' 
                : 'bg-transparent border-transparent hover:bg-white/5 hover:border-white/10'
              }
            `}
          >
            {/* Icon */}
            <div className={`
              w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200
              ${index === currentIndex 
                ? 'bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white shadow-lg scale-105' 
                : 'bg-white/5 text-muted-foreground group-hover:bg-white/10 group-hover:scale-105'
              }
            `}>
              {index === currentIndex ? (
                <Play className="w-3.5 h-3.5 fill-current" />
              ) : media.type === 'video' ? (
                <FileVideo className="w-3.5 h-3.5" />
              ) : (
                <FileAudio className="w-3.5 h-3.5" />
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 ml-2.5">
              <p className={`
                text-xs font-medium truncate transition-colors leading-tight
                ${index === currentIndex ? 'text-white' : 'text-foreground group-hover:text-white'}
              `}>
                {media.name.replace(/\.[^/.]+$/, '')}
              </p>
              <p className="text-[10px] text-muted-foreground/70 capitalize mt-0.5">
                {media.type}
              </p>
            </div>

            {/* Remove button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove(media.id);
              }}
              className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md bg-transparent hover:bg-red-500/20 text-white/90 drop-shadow-md hover:text-red-400 border border-transparent hover:border-red-500/30 transition-all duration-200 flex-shrink-0 ml-4"
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