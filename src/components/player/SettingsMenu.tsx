import React, { useState, useRef, useEffect } from 'react';
import {
  Settings,
  Subtitles,
  Sliders,
  Clock,
  Camera,
  Timer,
  Repeat,
  Bookmark,
  ChevronRight,
  Upload,
  X,
  Moon,
} from 'lucide-react';

interface SettingsMenuProps {
  isVideo: boolean;
  hasSubtitles: boolean;
  subtitlesEnabled: boolean;
  abLoopEnabled: boolean;
  sleepTimerEnabled: boolean;
  sleepTimerRemaining: number;
  onOpenEqualizer: () => void;
  onOpenSubtitleSettings: () => void;
  onLoadSubtitle: () => void;
  onToggleSubtitles: () => void;
  onClearSubtitles: () => void;
  onCaptureScreenshot: () => void;
  onSetABPoint: (point: 'A' | 'B') => void;
  onClearABLoop: () => void;
  onStartSleepTimer: (minutes: number) => void;
  onCancelSleepTimer: () => void;
  onAddBookmark: () => void;
  onOpenBookmarks: () => void;
  onMenuToggle?: (isOpen: boolean) => void;
}

const SLEEP_TIMER_OPTIONS = [15, 30, 45, 60, 90, 120];

const formatSleepTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const SettingsMenu: React.FC<SettingsMenuProps> = ({
  isVideo,
  hasSubtitles,
  subtitlesEnabled,
  abLoopEnabled,
  sleepTimerEnabled,
  sleepTimerRemaining,
  onOpenEqualizer,
  onOpenSubtitleSettings,
  onLoadSubtitle,
  onToggleSubtitles,
  onClearSubtitles,
  onCaptureScreenshot,
  onSetABPoint,
  onClearABLoop,
  onStartSleepTimer,
  onCancelSleepTimer,
  onAddBookmark,
  onOpenBookmarks,
  onMenuToggle,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [subMenu, setSubMenu] = useState<'main' | 'subtitles' | 'sleepTimer' | 'abLoop' | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (onMenuToggle) {
      onMenuToggle(isOpen);
    }
  }, [isOpen, onMenuToggle]);

  const textColor = isVideo ? 'text-white/90 drop-shadow-md' : 'text-foreground';
  const mutedColor = isVideo ? 'text-white/70 drop-shadow-sm' : 'text-muted-foreground';

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSubMenu(null);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClick);
      return () => document.removeEventListener('mousedown', handleClick);
    }
  }, [isOpen]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    setSubMenu(null);
  };

  const MenuItem: React.FC<{
    icon: React.ReactNode;
    label: string;
    onClick?: () => void;
    hasSubmenu?: boolean;
    active?: boolean;
    badge?: string;
  }> = ({ icon, label, onClick, hasSubmenu, active, badge }) => (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      className={`w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm hover:bg-secondary/80 transition-colors cursor-pointer
        ${active ? 'text-primary' : textColor}`}
    >
      {icon}
      <span className="flex-1 text-left truncate">{label}</span>
      {badge && (
        <span className="px-1.5 sm:px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs whitespace-nowrap flex-shrink-0">
          {badge}
        </span>
      )}
      {hasSubmenu && <ChevronRight className={`w-3.5 sm:w-4 h-3.5 sm:h-4 ${mutedColor} flex-shrink-0`} />}
    </button>
  );

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={toggleMenu}
        className={`control-btn ${textColor} hover:text-primary`}
        title="Settings"
      >
        <Settings className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute bottom-full right-0 mb-2 w-56 sm:w-64 glass-strong rounded-xl shadow-2xl overflow-hidden animate-scale-in max-h-[80vh] overflow-y-auto z-50">
          {/* Main Menu */}
          {(subMenu === null || subMenu === 'main') && (
            <>
              <MenuItem
                icon={<Sliders className="w-3.5 sm:w-4 h-3.5 sm:h-4" />}
                label="Equalizer"
                onClick={() => {
                  onOpenEqualizer();
                  setIsOpen(false);
                }}
              />
              
              {isVideo && (
                <>
                  <MenuItem
                    icon={<Subtitles className="w-4 h-4" />}
                    label="Subtitles"
                    hasSubmenu
                    active={hasSubtitles}
                    onClick={() => setSubMenu('subtitles')}
                  />
                  <MenuItem
                    icon={<Camera className="w-4 h-4" />}
                    label="Screenshot"
                    onClick={() => {
                      onCaptureScreenshot();
                      setIsOpen(false);
                    }}
                  />
                </>
              )}
              
              <MenuItem
                icon={<Repeat className="w-4 h-4" />}
                label="A-B Loop"
                hasSubmenu
                active={abLoopEnabled}
                onClick={() => setSubMenu('abLoop')}
              />
              
              <MenuItem
                icon={<Timer className="w-4 h-4" />}
                label="Sleep Timer"
                hasSubmenu
                active={sleepTimerEnabled}
                badge={sleepTimerEnabled ? formatSleepTime(sleepTimerRemaining) : undefined}
                onClick={() => setSubMenu('sleepTimer')}
              />
              
              <MenuItem
                icon={<Bookmark className="w-4 h-4" />}
                label="Add Bookmark"
                onClick={() => {
                  onAddBookmark();
                  setIsOpen(false);
                }}
              />
              
              <MenuItem
                icon={<Clock className="w-4 h-4" />}
                label="View Bookmarks"
                onClick={() => {
                  onOpenBookmarks();
                  setIsOpen(false);
                }}
              />
            </>
          )}

          {/* Subtitles Submenu */}
          {subMenu === 'subtitles' && (
            <>
              <div className="flex items-center gap-2 px-4 py-2 border-b border-border">
                <button
                  onClick={() => setSubMenu('main')}
                  className={`control-btn ${mutedColor}`}
                >
                  <ChevronRight className="w-4 h-4 rotate-180" />
                </button>
                <span className={`font-medium ${textColor}`}>Subtitles</span>
              </div>
              
              <MenuItem
                icon={<Upload className="w-4 h-4" />}
                label="Load SRT/VTT file"
                onClick={() => {
                  onLoadSubtitle();
                  setIsOpen(false);
                }}
              />
              
              {hasSubtitles && (
                <>
                  <MenuItem
                    icon={<Subtitles className="w-4 h-4" />}
                    label={subtitlesEnabled ? 'Hide subtitles' : 'Show subtitles'}
                    onClick={() => onToggleSubtitles()}
                    active={subtitlesEnabled}
                  />
                  <MenuItem
                    icon={<Settings className="w-4 h-4" />}
                    label="Subtitle settings"
                    onClick={() => {
                      onOpenSubtitleSettings();
                      setIsOpen(false);
                    }}
                  />
                  <MenuItem
                    icon={<X className="w-4 h-4" />}
                    label="Clear subtitles"
                    onClick={() => {
                      onClearSubtitles();
                      setSubMenu('main');
                    }}
                  />
                </>
              )}
            </>
          )}

          {/* A-B Loop Submenu */}
          {subMenu === 'abLoop' && (
            <>
              <div className="flex items-center gap-2 px-4 py-2 border-b border-border">
                <button
                  onClick={() => setSubMenu('main')}
                  className={`control-btn ${mutedColor}`}
                >
                  <ChevronRight className="w-4 h-4 rotate-180" />
                </button>
                <span className={`font-medium ${textColor}`}>A-B Loop</span>
              </div>
              
              <MenuItem
                icon={<span className={`w-4 h-4 flex items-center justify-center font-bold ${textColor}`}>A</span>}
                label="Set Point A"
                onClick={() => onSetABPoint('A')}
              />
              <MenuItem
                icon={<span className={`w-4 h-4 flex items-center justify-center font-bold ${textColor}`}>B</span>}
                label="Set Point B"
                onClick={() => onSetABPoint('B')}
              />
              {abLoopEnabled && (
                <MenuItem
                  icon={<X className="w-4 h-4" />}
                  label="Clear Loop"
                  onClick={() => {
                    onClearABLoop();
                    setSubMenu('main');
                  }}
                />
              )}
            </>
          )}

          {/* Sleep Timer Submenu */}
          {subMenu === 'sleepTimer' && (
            <>
              <div className="flex items-center gap-2 px-4 py-2 border-b border-border">
                <button
                  onClick={() => setSubMenu('main')}
                  className={`control-btn ${mutedColor}`}
                >
                  <ChevronRight className="w-4 h-4 rotate-180" />
                </button>
                <span className={`font-medium ${textColor}`}>Sleep Timer</span>
              </div>
              
              {sleepTimerEnabled ? (
                <MenuItem
                  icon={<X className="w-4 h-4" />}
                  label={`Cancel (${formatSleepTime(sleepTimerRemaining)} left)`}
                  onClick={() => {
                    onCancelSleepTimer();
                    setSubMenu('main');
                  }}
                />
              ) : (
                SLEEP_TIMER_OPTIONS.map((mins) => (
                  <MenuItem
                    key={mins}
                    icon={<Moon className="w-4 h-4" />}
                    label={`${mins} minutes`}
                    onClick={() => {
                      onStartSleepTimer(mins);
                      setIsOpen(false);
                    }}
                  />
                ))
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SettingsMenu;
