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
  Plus,
  ListMusic,
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
  onAddFiles: () => void;
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
  onOpenPlaylist: () => void;
  onSettingsOpenChange?: (isOpen: boolean) => void;
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
  onAddFiles,
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
  onOpenPlaylist,
  onSettingsOpenChange,
}) => {
  const RepeatIcon = state.repeat === 'one' ? Repeat1 : Repeat;
  const textColor = isVideo ? 'text-white/90 drop-shadow-md' : 'text-foreground';

  return (
    <div className={`
      w-full px-3 sm:px-4 py-2 transition-all duration-300
      ${isVideo ? 'glass-strong' : 'glass'}
    `}>
      {/* Progress bar */}
      <div className="mb-2">
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
      <div className="flex items-center justify-between gap-2 sm:gap-4 flex-wrap">
        {/* Left controls */}
        <div className="flex items-center gap-1 order-1">
          <VolumeControl
            volume={state.volume}
            isMuted={state.isMuted}
            onVolumeChange={onVolumeChange}
            onToggleMute={onToggleMute}
            isVideo={isVideo}
          />
          
          {/* Add Files button */}
          <button
            onClick={onAddFiles}
            className={`control-btn ${textColor} hover:text-primary transition-colors`}
            title="Add Files"
          >
            <Plus className="w-4 h-4" />
          </button>

          {/* Playlist button */}
          <button
            onClick={onOpenPlaylist}
            className={`control-btn ${textColor} hover:text-primary transition-colors`}
            title="Playlist"
          >
            <ListMusic className="w-4 h-4" />
          </button>

          {/* Recently Played button */}
          <button
            onClick={onOpenRecentlyPlayed}
            className={`control-btn ${textColor} hover:text-primary transition-colors`}
            title="Recently Played"
          >
            <Clock className="w-4 h-4" />
          </button>
        </div>

        {/* Center controls */}
        <div className="flex items-center gap-1 sm:gap-2 order-2 sm:order-2">
          {/* Previous */}
          <button
            onClick={onPlayPrevious}
            className={`control-btn ${textColor} hover:text-primary transition-colors`}
            title="Previous (B)"
          >
            <SkipBack className="w-5 h-5" />
          </button>

          {/* Shuffle */}
          {hasPlaylist && (
            <button
              onClick={onToggleShuffle}
              className={`control-btn transition-all hidden sm:flex ${state.shuffle ? 'text-primary scale-110 glow-accent-sm' : `${textColor} hover:text-primary`}`}
              title="Shuffle"
            >
              <Shuffle className="w-4 h-4" />
            </button>
          )}

          {/* Skip backward */}
          <button
            onClick={() => onSkip(-10)}
            className={`control-btn ${textColor} hover:text-primary transition-colors hidden sm:flex gap-0.5`}
            title="Skip backward 10s (←)"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="text-xs font-medium">10</span>
          </button>

          {/* Play/Pause */}
          <button
            onClick={onTogglePlay}
            className="control-btn-primary relative animate-scale-in"
            title={state.isPlaying ? 'Pause (Space)' : 'Play (Space)'}
          >
            {state.isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : state.isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5 ml-0.5" />
            )}
          </button>

          {/* Skip forward */}
          <button
            onClick={() => onSkip(10)}
            className={`control-btn ${textColor} hover:text-primary transition-colors hidden sm:flex gap-0.5`}
            title="Skip forward 10s (→)"
          >
            <span className="text-xs font-medium">10</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Next */}
          <button
            onClick={onPlayNext}
            className={`control-btn ${textColor} hover:text-primary transition-colors`}
            title="Next (N)"
          >
            <SkipForward className="w-5 h-5" />
          </button>

          {/* Repeat */}
          {hasPlaylist && (
            <button
              onClick={onToggleRepeat}
              className={`control-btn transition-all hidden sm:flex ${state.repeat !== 'none' ? 'text-primary scale-110 glow-accent-sm' : `${textColor} hover:text-primary`}`}
              title={`Repeat: ${state.repeat}`}
            >
              <RepeatIcon className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-1 order-3 sm:order-3">
          <SpeedControl
            playbackRate={state.playbackRate}
            onPlaybackRateChange={onPlaybackRateChange}
            isVideo={isVideo}
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
            onMenuToggle={onSettingsOpenChange}
          />

          {isVideo && (
            <>
              <button
                onClick={onTogglePiP}
                className={`control-btn transition-all hidden sm:flex ${state.isPiP ? 'text-primary scale-110' : `${textColor} hover:text-primary`}`}
                title="Picture-in-Picture (Shift+P)"
              >
                <PictureInPicture className="w-4 h-4" />
              </button>

              <button
                onClick={onToggleFullscreen}
                className={`control-btn ${textColor} hover:text-primary transition-colors`}
                title="Fullscreen (F)"
              >
                {state.isFullscreen ? (
                  <Minimize className="w-4 h-4" />
                ) : (
                  <Maximize className="w-4 h-4" />
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
