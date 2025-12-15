import React from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Maximize,
  Minimize,
  PictureInPicture,
  Shuffle,
  Repeat,
  Repeat1,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Clock,
} from 'lucide-react';
import VolumeControl from './VolumeControl';
import SpeedControl from './SpeedControl';
import ProgressBar from './ProgressBar';
import SettingsMenu from './SettingsMenu';
import type { PlayerState } from '@/hooks/useMediaPlayer';
import type { ABLoopState, SleepTimerState } from '@/hooks/useAdvancedFeatures';

interface PlayerControlsProps {
  state: PlayerState;
  isVideo: boolean;
  onTogglePlay: () => void;
  onSeek: (time: number) => void;
  onSkip: (seconds: number) => void;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
  onPlaybackRateChange: (rate: number) => void;
  onToggleFullscreen: () => void;
  onTogglePiP: () => void;
  onPlayNext: () => void;
  onPlayPrevious: () => void;
  onToggleShuffle: () => void;
  onToggleRepeat: () => void;
  hasPlaylist: boolean;
  // Advanced features
  thumbnailGetter?: (time: number) => string | null;
  abLoop: ABLoopState;
  sleepTimer: SleepTimerState;
  bookmarks: number[];
  hasSubtitles: boolean;
  subtitlesEnabled: boolean;
  onOpenEqualizer: () => void;
  onOpenSubtitleSettings: () => void;
  onLoadSubtitle: () => void;
  onToggleSubtitles: () => void;
  onClearSubtitles: () => void;
  onCaptureScreenshot: () => void;
  onSetPointA: () => void;
  onSetPointB: () => void;
  onClearABLoop: () => void;
  onStartSleepTimer: (minutes: number) => void;
  onCancelSleepTimer: () => void;
  onAddBookmark: () => void;
  onOpenBookmarks: () => void;
  onOpenRecentlyPlayed: () => void;
}

const PlayerControls: React.FC<PlayerControlsProps> = ({
  state,
  isVideo,
  onTogglePlay,
  onSeek,
  onSkip,
  onVolumeChange,
  onToggleMute,
  onPlaybackRateChange,
  onToggleFullscreen,
  onTogglePiP,
  onPlayNext,
  onPlayPrevious,
  onToggleShuffle,
  onToggleRepeat,
  hasPlaylist,
  thumbnailGetter,
  abLoop,
  sleepTimer,
  bookmarks,
  hasSubtitles,
  subtitlesEnabled,
  onOpenEqualizer,
  onOpenSubtitleSettings,
  onLoadSubtitle,
  onToggleSubtitles,
  onClearSubtitles,
  onCaptureScreenshot,
  onSetPointA,
  onSetPointB,
  onClearABLoop,
  onStartSleepTimer,
  onCancelSleepTimer,
  onAddBookmark,
  onOpenBookmarks,
  onOpenRecentlyPlayed,
}) => {
  const RepeatIcon = state.repeat === 'one' ? Repeat1 : Repeat;

  return (
    <div className={`
      w-full px-4 py-4 transition-all duration-300
      ${isVideo ? 'glass-strong' : 'bg-card border-t border-border'}
    `}>
      {/* Progress bar */}
      <div className="mb-4">
        <ProgressBar
          currentTime={state.currentTime}
          duration={state.duration}
          buffered={state.buffered}
          onSeek={onSeek}
          thumbnailGetter={thumbnailGetter}
          abLoopPointA={abLoop.pointA}
          abLoopPointB={abLoop.pointB}
          bookmarks={bookmarks}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-4">
        {/* Left controls */}
        <div className="flex items-center gap-2">
          <VolumeControl
            volume={state.volume}
            isMuted={state.isMuted}
            onVolumeChange={onVolumeChange}
            onToggleMute={onToggleMute}
          />
          
          {/* Recently Played button */}
          <button
            onClick={onOpenRecentlyPlayed}
            className="control-btn text-foreground hover:text-primary"
            title="Recently Played"
          >
            <Clock className="w-5 h-5" />
          </button>
        </div>

        {/* Center controls */}
        <div className="flex items-center gap-2">
          {/* Shuffle */}
          {hasPlaylist && (
            <button
              onClick={onToggleShuffle}
              className={`control-btn ${state.shuffle ? 'text-primary' : 'text-foreground hover:text-primary'}`}
              title="Shuffle"
            >
              <Shuffle className="w-5 h-5" />
            </button>
          )}

          {/* Previous */}
          <button
            onClick={onPlayPrevious}
            className="control-btn text-foreground hover:text-primary"
            title="Previous (B)"
          >
            <SkipBack className="w-6 h-6" />
          </button>

          {/* Skip backward */}
          <button
            onClick={() => onSkip(-10)}
            className="control-btn text-foreground hover:text-primary"
            title="Skip backward 10s (←)"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-xs font-medium">10</span>
          </button>

          {/* Play/Pause */}
          <button
            onClick={onTogglePlay}
            className="control-btn-primary relative"
            title={state.isPlaying ? 'Pause (Space)' : 'Play (Space)'}
          >
            {state.isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : state.isPlaying ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6 ml-0.5" />
            )}
          </button>

          {/* Skip forward */}
          <button
            onClick={() => onSkip(10)}
            className="control-btn text-foreground hover:text-primary"
            title="Skip forward 10s (→)"
          >
            <span className="text-xs font-medium">10</span>
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Next */}
          <button
            onClick={onPlayNext}
            className="control-btn text-foreground hover:text-primary"
            title="Next (N)"
          >
            <SkipForward className="w-6 h-6" />
          </button>

          {/* Repeat */}
          {hasPlaylist && (
            <button
              onClick={onToggleRepeat}
              className={`control-btn ${state.repeat !== 'none' ? 'text-primary' : 'text-foreground hover:text-primary'}`}
              title={`Repeat: ${state.repeat}`}
            >
              <RepeatIcon className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          <SpeedControl
            playbackRate={state.playbackRate}
            onPlaybackRateChange={onPlaybackRateChange}
          />

          {/* Settings Menu */}
          <SettingsMenu
            isVideo={isVideo}
            hasSubtitles={hasSubtitles}
            subtitlesEnabled={subtitlesEnabled}
            abLoopEnabled={abLoop.isEnabled}
            sleepTimerEnabled={sleepTimer.isEnabled}
            sleepTimerRemaining={sleepTimer.remainingTime}
            onOpenEqualizer={onOpenEqualizer}
            onOpenSubtitleSettings={onOpenSubtitleSettings}
            onLoadSubtitle={onLoadSubtitle}
            onToggleSubtitles={onToggleSubtitles}
            onClearSubtitles={onClearSubtitles}
            onCaptureScreenshot={onCaptureScreenshot}
            onSetABPoint={(point) => point === 'A' ? onSetPointA() : onSetPointB()}
            onClearABLoop={onClearABLoop}
            onStartSleepTimer={onStartSleepTimer}
            onCancelSleepTimer={onCancelSleepTimer}
            onAddBookmark={onAddBookmark}
            onOpenBookmarks={onOpenBookmarks}
          />

          {isVideo && (
            <>
              <button
                onClick={onTogglePiP}
                className={`control-btn ${state.isPiP ? 'text-primary' : 'text-foreground hover:text-primary'}`}
                title="Picture-in-Picture (Shift+P)"
              >
                <PictureInPicture className="w-5 h-5" />
              </button>

              <button
                onClick={onToggleFullscreen}
                className="control-btn text-foreground hover:text-primary"
                title="Fullscreen (F)"
              >
                {state.isFullscreen ? (
                  <Minimize className="w-5 h-5" />
                ) : (
                  <Maximize className="w-5 h-5" />
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerControls;
