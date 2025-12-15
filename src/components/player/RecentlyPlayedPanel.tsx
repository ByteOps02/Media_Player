import React from 'react';
import { X, Clock, Play, FileVideo, FileAudio, Trash2 } from 'lucide-react';
import { formatTime } from '@/hooks/useMediaPlayer';
import type { RecentlyPlayedItem } from '@/hooks/useRecentlyPlayed';

interface RecentlyPlayedPanelProps {
  items: RecentlyPlayedItem[];
  onPlay: (item: RecentlyPlayedItem) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
  onClose: () => void;
}

const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - timestamp;
  
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
  
  return date.toLocaleDateString();
};

const RecentlyPlayedPanel: React.FC<RecentlyPlayedPanelProps> = ({
  items,
  onPlay,
  onRemove,
  onClear,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md mx-4 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Recently Played</h2>
          </div>
          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                onClick={onClear}
                className="control-btn text-muted-foreground hover:text-destructive"
                title="Clear history"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="control-btn text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="max-h-96 overflow-y-auto p-2">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Clock className="w-12 h-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">No recently played media</p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="playlist-item group"
              >
                {/* Icon */}
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                  {item.type === 'video' ? (
                    <FileVideo className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <FileAudio className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {item.name.replace(/\.[^/.]+$/, '')}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{formatDate(item.lastPlayed)}</span>
                    {item.lastPosition && item.duration && (
                      <>
                        <span>•</span>
                        <span>
                          Resume at {formatTime(item.lastPosition)}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onPlay(item)}
                    className="control-btn text-primary hover:bg-primary/10"
                    title="Play"
                  >
                    <Play className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(item.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 control-btn text-muted-foreground hover:text-destructive"
                    title="Remove"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentlyPlayedPanel;
