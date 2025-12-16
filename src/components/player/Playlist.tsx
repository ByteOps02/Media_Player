import React, { useMemo } from 'react';
import {
  X,
  Play,
  FileVideo,
  FileAudio,
  Trash2,
  ListMusic,
} from 'lucide-react';

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
  onClose?: () => void;
}

const Playlist: React.FC<PlaylistProps> = ({
  playlist,
  currentIndex,
  onPlay,
  onRemove,
  onClear,
  onClose,
}) => {
  return (
    <div className="h-full w-full flex flex-col rounded-2xl overflow-hidden animate-scale-in bg-transparent border border-white/20">
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary shadow-[0_0_15px_rgba(var(--primary),0.3)]">
            <ListMusic className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white tracking-wide">Playlist</h2>
            <p className="text-[10px] text-white/80 font-medium uppercase tracking-wider">
              {playlist.length} Tracks
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {playlist.length > 0 && (
            <button
              onClick={onClear}
              className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-red-400 transition-colors"
              title="Clear Playlist"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Playlist Items */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
        {playlist.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-white/60 space-y-3">
            <ListMusic className="w-12 h-12 opacity-20" />
            <p className="text-xs">Your playlist is empty</p>
          </div>
        ) : (
          playlist.map((media, index) => {
            const isActive = index === currentIndex;
            return (
              <div
                key={media.id}
                onClick={() => onPlay(index)}
                className={`
                  group relative flex items-center gap-3 p-3 rounded-xl cursor-pointer
                  transition-all duration-200 border border-transparent
                  ${
                    isActive
                      ? 'bg-white/10 border-white/10 shadow-[0_4px_20px_-5px_rgba(0,0,0,0.3)]'
                      : 'hover:bg-white/5 hover:border-white/5'
                  }
                `}
              >
                {/* Active Indicator / Icon */}
                <div
                  className={`
                    w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300
                    ${
                      isActive
                        ? 'bg-primary text-white shadow-[0_0_15px_rgba(var(--primary),0.4)] scale-105'
                        : 'bg-white/10 text-white/40 group-hover:bg-white/10 group-hover:text-white/80'
                    }
                  `}
                >
                  {isActive ? (
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  ) : media.type === 'video' ? (
                    <FileVideo className="w-5 h-5" />
                  ) : (
                    <FileAudio className="w-5 h-5" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <p
                    className={`text-sm font-medium truncate transition-colors ${
                      isActive ? 'text-white' : 'text-white/90 group-hover:text-white'
                    }`}
                  >
                    {media.name.replace(/\.[^/.]+$/, '')}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span
                      className={`
                        text-[10px] px-1.5 py-0.5 rounded-sm font-bold uppercase tracking-wider
                        ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-white/10 text-white/40 group-hover:bg-white/10'
                        }
                      `}
                    >
                      {media.type}
                    </span>
                  </div>
                </div>

                {/* Hover Actions */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(media.id);
                  }}
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200
                    ${
                      isActive
                        ? 'opacity-100 hover:bg-white/20 text-white/80 hover:text-white'
                        : 'opacity-0 group-hover:opacity-100 hover:bg-red-500/20 text-white/40 hover:text-red-400'
                    }
                  `}
                  title="Remove"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Playlist;
