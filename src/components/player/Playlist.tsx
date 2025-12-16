import React from 'react';
import { X, Play, FileVideo, FileAudio, Trash2, ListMusic } from 'lucide-react';

export interface MediaFile {
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
  onAddFiles?: () => void; // Optional prop if we want to add "Add" button support later, or just remove the button
}

const Playlist: React.FC<PlaylistProps> = ({
  playlist,
  currentIndex,
  onPlay,
  onRemove,
  onClear,
  onClose,
  // onAddFiles
}) => {
  return (
    <div className="h-full w-full flex flex-col relative overflow-hidden bg-background/40 backdrop-blur-3xl border-l border-white/10">
      
      {/* Ambient Background Effects */}
      <div className="absolute top-[-20%] right-[-20%] w-[80%] h-[50%] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] left-[-20%] w-[80%] h-[50%] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Header */}
      <div className="px-5 py-6 flex flex-col gap-4 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20 backdrop-blur-xl border border-white/10 flex items-center justify-center shadow-lg">
              <ListMusic className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground tracking-tight">Playlist</h2>
              <p className="text-xs text-muted-foreground font-medium">
                {playlist.length} {playlist.length === 1 ? 'Track' : 'Tracks'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {playlist.length > 0 && (
              <button
                onClick={onClear}
                className="p-2 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-colors border border-transparent hover:border-red-500/20"
                title="Clear Playlist"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors border border-transparent hover:border-white/10"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
        
        {/* Optional Add Button - Placeholder if we want to add functionality later */}
        {/* <button className="w-full py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-sm font-medium transition-colors border border-primary/20 flex items-center justify-center gap-2">
          <Upload className="w-4 h-4" />
          Add Tracks
        </button> */}
      </div>

      {/* Scrollable List */}
      <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-2 relative z-10 custom-scrollbar">
        {playlist.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-4 opacity-60">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center">
              <ListMusic className="w-8 h-8 opacity-50" />
            </div>
            <p className="text-sm">Your playlist is empty</p>
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
                  transition-all duration-300 border
                  ${
                    isActive
                      ? 'bg-primary/10 border-primary/20 shadow-[0_0_20px_-5px_rgba(var(--primary),0.3)]'
                      : 'bg-transparent border-transparent hover:bg-white/5 hover:border-white/10'
                  }
                `}
              >
                {/* Status Icon */}
                <div
                  className={`
                    w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300
                    ${
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                        : 'bg-white/5 text-muted-foreground group-hover:bg-white/10 group-hover:text-foreground'
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
                <div className="flex-1 min-w-0 flex flex-col">
                  <span className={`text-sm font-medium truncate ${isActive ? 'text-foreground' : 'text-foreground/80 group-hover:text-foreground'}`}>
                    {media.name.replace(/\.[^/.]+$/, '')}
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                     <span className={`
                        text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded
                        ${isActive ? 'bg-background/50 text-foreground/70' : 'bg-white/5 text-muted-foreground'}
                     `}>
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
                    w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200
                    ${
                      isActive
                        ? 'opacity-100 hover:bg-background/20 text-foreground/70 hover:text-red-400'
                        : 'opacity-0 group-hover:opacity-100 hover:bg-red-500/10 text-muted-foreground hover:text-red-400'
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

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
};

export default Playlist;
