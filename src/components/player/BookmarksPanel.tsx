import React from 'react';
import { X, Bookmark, Trash2, Play } from 'lucide-react';
import { formatTime } from '@/hooks/useMediaPlayer';

interface BookmarksPanelProps {
  bookmarks: number[];
  onJump: (time: number) => void;
  onRemove: (time: number) => void;
  onClear: () => void;
  onClose: () => void;
}

const BookmarksPanel: React.FC<BookmarksPanelProps> = ({
  bookmarks,
  onJump,
  onRemove,
  onClear,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-sm mx-4 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <Bookmark className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Bookmarks</h2>
          </div>
          <div className="flex items-center gap-2">
            {bookmarks.length > 0 && (
              <button
                onClick={onClear}
                className="control-btn text-muted-foreground hover:text-destructive"
                title="Clear all"
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
        <div className="max-h-80 overflow-y-auto p-2">
          {bookmarks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bookmark className="w-12 h-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">No bookmarks yet</p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                Press the bookmark button to save positions
              </p>
            </div>
          ) : (
            bookmarks.map((time, index) => (
              <div
                key={time}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary/80 transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary text-sm font-medium">{index + 1}</span>
                </div>
                
                <span className="flex-1 font-medium text-foreground">
                  {formatTime(time)}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onJump(time)}
                    className="control-btn text-primary hover:bg-primary/10"
                    title="Jump to bookmark"
                  >
                    <Play className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onRemove(time)}
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

export default BookmarksPanel;
