import React from 'react';
import { X, Type, ArrowUp } from 'lucide-react';

interface SubtitleSettingsProps {
  fontSize: 'small' | 'medium' | 'large';
  position: 'bottom' | 'top';
  onFontSizeChange: (size: 'small' | 'medium' | 'large') => void;
  onPositionChange: (position: 'bottom' | 'top') => void;
  onClose: () => void;
}

const SubtitleSettings: React.FC<SubtitleSettingsProps> = ({
  fontSize,
  position,
  onFontSizeChange,
  onPositionChange,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-fade-in p-4">
      <div className="w-full max-w-sm bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <Type className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Subtitle Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="control-btn text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Font Size */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Font Size
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['small', 'medium', 'large'].map((size) => (
                <button
                  key={size}
                  onClick={() => onFontSizeChange(size as 'small' | 'medium' | 'large')}
                  className={`px-3 py-2 rounded-lg font-medium transition-all text-sm capitalize ${
                    fontSize === size
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                >
                  {size === 'small' ? 'S' : size === 'medium' ? 'M' : 'L'}
                </button>
              ))}
            </div>
          </div>

          {/* Position */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Position
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['bottom', 'top'].map((pos) => (
                <button
                  key={pos}
                  onClick={() => onPositionChange(pos as 'bottom' | 'top')}
                  className={`px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 capitalize ${
                    position === pos
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                >
                  {pos === 'bottom' ? (
                    <>
                      <ArrowUp className={`w-4 h-4 rotate-180`} />
                      {pos}
                    </>
                  ) : (
                    <>
                      <ArrowUp className="w-4 h-4" />
                      {pos}
                    </>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium transition-all hover:bg-primary/90"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubtitleSettings;
