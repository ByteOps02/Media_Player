import React, { useEffect, useState, useRef } from 'react';
import { useMediaPlayer } from '@/hooks/useMediaPlayer';
import { useSubtitles } from '@/hooks/useSubtitles';
import { useEqualizer } from '@/hooks/useEqualizer';
import { useRecentlyPlayed } from '@/hooks/useRecentlyPlayed';
import { useVideoThumbnails } from '@/hooks/useVideoThumbnails';
import { useAdvancedFeatures } from '@/hooks/useAdvancedFeatures';
import DropZone from './DropZone';
import PlayerControls from './PlayerControls';
import Playlist from './Playlist';
import AudioVisualizer from './AudioVisualizer';
import SubtitleDisplay from './SubtitleDisplay';
import Equalizer from './Equalizer';
import RecentlyPlayedPanel from './RecentlyPlayedPanel';
import BookmarksPanel from './BookmarksPanel';
import SubtitleSettings from './SubtitleSettings';
import ThemeToggle from '@/components/ThemeToggle';
import { Image, X } from 'lucide-react';
import { toast } from 'sonner';

const MediaPlayer: React.FC = () => {
  const {
    mediaRef,
    containerRef,
    playlist,
    currentIndex,
    currentMedia,
    state,
    addFiles,
    playIndex,
    togglePlay,
    seek,
    skip,
    setVolume,
    toggleMute,
    setPlaybackRate,
    toggleFullscreen,
    togglePiP,
    playNext,
    playPrevious,
    toggleShuffle,
    toggleRepeat,
    removeFromPlaylist,
    clearPlaylist,
  } = useMediaPlayer();

  // Subtitles
  const subtitles = useSubtitles(state.currentTime);
  const subtitleInputRef = useRef<HTMLInputElement>(null);

  // Equalizer
  const equalizer = useEqualizer();
  const { initializeEqualizer } = equalizer;
  const [showEqualizer, setShowEqualizer] = useState(false);

  // Recently Played
  const recentlyPlayed = useRecentlyPlayed();
  const { addToRecent, updatePosition } = recentlyPlayed;
  const [showRecentlyPlayed, setShowRecentlyPlayed] = useState(false);

  // Video Thumbnails
  const thumbnails = useVideoThumbnails(
    currentMedia?.type === 'video' ? currentMedia.url : undefined,
    state.duration
  );
  const { generateThumbnails, hasThumbnails, isGenerating, clearThumbnails } = thumbnails;

  // Advanced Features
  const advancedFeatures = useAdvancedFeatures(mediaRef, state.currentTime, togglePlay);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [showSubtitleSettings, setShowSubtitleSettings] = useState(false);

  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isVideo = currentMedia?.type === 'video';

  // Initialize equalizer when media is loaded
  useEffect(() => {
    if (mediaRef.current && currentMedia) {
      initializeEqualizer(mediaRef.current);
    }
  }, [currentMedia, mediaRef, initializeEqualizer]);

  // Generate thumbnails for video
  useEffect(() => {
    if (isVideo && state.duration > 0 && !hasThumbnails && !isGenerating) {
      generateThumbnails();
    }
  }, [isVideo, state.duration, hasThumbnails, isGenerating, generateThumbnails]);

  // Clear thumbnails when media changes
  useEffect(() => {
    clearThumbnails();
  }, [currentMedia?.id, clearThumbnails]);

  // Add to recently played
  useEffect(() => {
    if (currentMedia && state.duration > 0) {
      addToRecent({
        id: currentMedia.id,
        name: currentMedia.name,
        type: currentMedia.type,
        duration: state.duration,
      });
    }
  }, [currentMedia, state.duration, addToRecent]);

  // Update position for resume feature
  useEffect(() => {
    if (currentMedia && state.currentTime > 0 && state.duration > 0) {
      const debounce = setTimeout(() => {
        updatePosition(currentMedia.id, state.currentTime, state.duration);
      }, 5000);
      return () => clearTimeout(debounce);
    }
  }, [currentMedia, state.currentTime, state.duration, updatePosition]);

  // Auto-hide controls for video
  useEffect(() => {
    if (!isVideo || !state.isPlaying || showPlaylistModal || showEqualizer || showRecentlyPlayed || showBookmarks || isSettingsOpen) {
      setControlsVisible(true);
      return;
    }

    const hideControls = () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
      controlsTimeoutRef.current = setTimeout(() => {
        setControlsVisible(false);
      }, 3000);
    };

    hideControls();

    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [isVideo, state.isPlaying, showPlaylistModal, showEqualizer, showRecentlyPlayed, showBookmarks, isSettingsOpen]);

  const handleMouseMove = () => {
    if (isVideo) {
      setControlsVisible(true);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
      if (state.isPlaying) {
        controlsTimeoutRef.current = setTimeout(() => {
          setControlsVisible(false);
        }, 3000);
      }
    }
  };

  // Auto-play when media is loaded
  useEffect(() => {
    if (currentMedia && mediaRef.current) {
      mediaRef.current.play().catch(() => {
        // Auto-play might be blocked by browser
      });
    }
  }, [currentMedia, mediaRef]);

  const handleAddMore = () => {
    document.getElementById('file-input')?.click();
  };

  const handleLoadSubtitle = () => {
    subtitleInputRef.current?.click();
  };

  const handleSubtitleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      subtitles.loadSubtitle(file);
      toast.success(`Loaded subtitles: ${file.name}`);
    }
    e.target.value = '';
  };

  const handleCaptureScreenshot = () => {
    const result = advancedFeatures.captureScreenshot();
    if (result) {
      toast.success('Screenshot saved!');
    } else {
      toast.error('Failed to capture screenshot');
    }
  };

  const handleAddBookmark = () => {
    advancedFeatures.addBookmark();
    toast.success(`Bookmark added at ${Math.floor(state.currentTime)}s`);
  };

  return (
    <div 
      ref={containerRef}
      className={`flex bg-background overflow-hidden relative ${state.isFullscreen ? 'w-screen h-screen fixed inset-0 z-[999]' : 'h-screen'}`}
      onMouseMove={handleMouseMove}
    >
      {/* Hidden file input for subtitles */}
      <input
        ref={subtitleInputRef}
        type="file"
        accept=".srt,.vtt"
        className="hidden"
        onChange={handleSubtitleFileChange}
      />

      {/* Main player area */}
      <div className="flex-1 flex flex-col relative min-w-0">
        {/* Header */}
        {!state.isFullscreen && (
          <header className="flex items-center justify-between px-4 py-2 glass-strong z-10 gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md flex-shrink-0">
                <span className="text-primary-foreground font-bold text-sm">▶</span>
              </div>
              <div className="min-w-0">
                <h1 className="font-bold text-sm text-foreground tracking-tight">Media Player</h1>
                <p className="text-[10px] text-muted-foreground truncate max-w-[200px]">
                  {currentMedia ? currentMedia.name : 'No media loaded'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              {/* Thumbnail generation indicator */}
              {thumbnails.isGenerating && (
                <div className="hidden sm:flex items-center gap-2 text-xs text-primary animate-bounce-subtle">
                  <Image className="w-4 h-4" />
                  <span>Generating previews...</span>
                </div>
              )}

              {/* Theme Toggle */}
              <ThemeToggle />
            </div>
          </header>
        )}

        {/* Media display area */}
        <div className="flex-1 relative flex items-center justify-center bg-player-surface overflow-hidden">
          {!currentMedia ? (
            <DropZone onFilesAdded={addFiles} hasMedia={false} />
          ) : isVideo ? (
            <>
              <video
                ref={mediaRef as React.RefObject<HTMLVideoElement>}
                src={currentMedia.url}
                className={`w-full h-full ${state.isFullscreen ? 'object-cover' : 'object-contain'}`}
                onClick={togglePlay}
                onDoubleClick={toggleFullscreen}
              />
              
              {/* Subtitle display */}
              <SubtitleDisplay
                subtitle={subtitles.currentSubtitle}
                isEnabled={subtitles.isEnabled}
                fontSize={subtitles.fontSize}
                position={subtitles.position}
              />
              
              {/* Video overlay for drag & drop */}
              <DropZone onFilesAdded={addFiles} hasMedia={true} />
            </>
          ) : (
            <>
              <audio
                ref={mediaRef as React.RefObject<HTMLAudioElement>}
                src={currentMedia.url}
                className="hidden"
              />
              <AudioVisualizer
                isPlaying={state.isPlaying}
                fileName={currentMedia.name}
              />
              {/* Audio overlay for drag & drop */}
              <DropZone onFilesAdded={addFiles} hasMedia={true} />
            </>
          )}
        </div>

        {/* Controls */}
        {currentMedia && (
          <div className={`
            ${isVideo ? 'absolute bottom-0 left-0 right-0' : 'relative'}
            transition-all duration-300
            ${isVideo && !controlsVisible ? 'opacity-0 translate-y-4 pointer-events-none' : 'opacity-100 translate-y-0 pointer-events-auto'}
          `}>
            <PlayerControls
              state={state}
              isVideo={isVideo}
              onTogglePlay={togglePlay}
              onSeek={seek}
              onSkip={skip}
              onVolumeChange={setVolume}
              onToggleMute={toggleMute}
              onPlaybackRateChange={setPlaybackRate}
              onToggleFullscreen={toggleFullscreen}
              onTogglePiP={togglePiP}
              onPlayNext={playNext}
              onPlayPrevious={playPrevious}
              onToggleShuffle={toggleShuffle}
              onToggleRepeat={toggleRepeat}
              onAddFiles={handleAddMore}
              onOpenPlaylist={() => setShowPlaylistModal(true)}
              hasPlaylist={playlist.length > 1}
              thumbnailGetter={isVideo ? thumbnails.getThumbnail : undefined}
              abLoop={advancedFeatures.abLoop}
              sleepTimer={advancedFeatures.sleepTimer}
              bookmarks={advancedFeatures.bookmarks}
              hasSubtitles={subtitles.subtitles.length > 0}
              subtitlesEnabled={subtitles.isEnabled}
              onOpenEqualizer={() => setShowEqualizer(true)}
              onOpenSubtitleSettings={() => setShowSubtitleSettings(true)}
              onLoadSubtitle={handleLoadSubtitle}
              onToggleSubtitles={subtitles.toggleSubtitles}
              onClearSubtitles={subtitles.clearSubtitles}
              onCaptureScreenshot={handleCaptureScreenshot}
              onSetPointA={advancedFeatures.setPointA}
              onSetPointB={advancedFeatures.setPointB}
              onClearABLoop={advancedFeatures.clearABLoop}
              onStartSleepTimer={advancedFeatures.startSleepTimer}
              onCancelSleepTimer={advancedFeatures.cancelSleepTimer}
              onAddBookmark={handleAddBookmark}
              onOpenBookmarks={() => setShowBookmarks(true)}
              onOpenRecentlyPlayed={() => setShowRecentlyPlayed(true)}
              onSettingsOpenChange={setIsSettingsOpen}
            />
          </div>
        )}
      </div>

      {/* Playlist Sidebar */}
      {showPlaylistModal && (
        <aside className="w-80 h-full flex-shrink-0 relative z-40 animate-in slide-in-from-right-5 fade-in duration-200">
          <Playlist
            playlist={playlist}
            currentIndex={currentIndex}
            onPlay={(index) => {
              playIndex(index);
              setShowPlaylistModal(false);
            }}
            onRemove={removeFromPlaylist}
            onClear={clearPlaylist}
            onClose={() => setShowPlaylistModal(false)}
          />
        </aside>
      )}

      {/* Equalizer Modal */}
      {showEqualizer && (
        <Equalizer
          bands={equalizer.bands}
          isEnabled={equalizer.isEnabled}
          currentPreset={equalizer.currentPreset}
          presets={equalizer.presets}
          onBandChange={equalizer.setBandGain}
          onPresetChange={equalizer.applyPreset}
          onReset={equalizer.resetEqualizer}
          onToggle={equalizer.toggleEqualizer}
          onClose={() => setShowEqualizer(false)}
        />
      )}

      {/* Recently Played Modal */}
      {showRecentlyPlayed && (
        <RecentlyPlayedPanel
          items={recentlyPlayed.recentlyPlayed}
          onPlay={(item) => {
            // Note: In a real app, you'd need to re-open the file
            // For now, just close the panel
            setShowRecentlyPlayed(false);
            toast.info(`To play "${item.name}", please add it to the playlist`);
          }}
          onRemove={recentlyPlayed.removeFromRecent}
          onClear={recentlyPlayed.clearHistory}
          onClose={() => setShowRecentlyPlayed(false)}
        />
      )}

      {/* Bookmarks Modal */}
      {showBookmarks && (
        <BookmarksPanel
          bookmarks={advancedFeatures.bookmarks}
          onJump={(time) => {
            advancedFeatures.jumpToBookmark(time);
            setShowBookmarks(false);
          }}
          onRemove={advancedFeatures.removeBookmark}
          onClear={advancedFeatures.clearBookmarks}
          onClose={() => setShowBookmarks(false)}
        />
      )}

      {/* Subtitle Settings Modal */}
      {showSubtitleSettings && (
        <SubtitleSettings
          fontSize={subtitles.fontSize}
          position={subtitles.position}
          onFontSizeChange={subtitles.setFontSize}
          onPositionChange={subtitles.setPosition}
          onClose={() => setShowSubtitleSettings(false)}
        />
      )}
    </div>
  );
};

export default MediaPlayer;
