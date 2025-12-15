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
import { PanelLeftOpen, PanelLeftClose, Image } from 'lucide-react';
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
  const [showEqualizer, setShowEqualizer] = useState(false);

  // Recently Played
  const recentlyPlayed = useRecentlyPlayed();
  const [showRecentlyPlayed, setShowRecentlyPlayed] = useState(false);

  // Video Thumbnails
  const thumbnails = useVideoThumbnails(
    currentMedia?.type === 'video' ? currentMedia.url : undefined,
    state.duration
  );

  // Advanced Features
  const advancedFeatures = useAdvancedFeatures(mediaRef, state.currentTime, togglePlay);
  const [showBookmarks, setShowBookmarks] = useState(false);

  const [showPlaylist, setShowPlaylist] = useState(true);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [controlsTimeout, setControlsTimeout] = useState<NodeJS.Timeout | null>(null);

  const isVideo = currentMedia?.type === 'video';

  // Initialize equalizer when media is loaded
  useEffect(() => {
    if (mediaRef.current && currentMedia) {
      equalizer.initializeEqualizer(mediaRef.current);
    }
  }, [currentMedia, mediaRef]);

  // Generate thumbnails for video
  useEffect(() => {
    if (isVideo && state.duration > 0 && !thumbnails.hasThumbnails && !thumbnails.isGenerating) {
      thumbnails.generateThumbnails();
    }
  }, [isVideo, state.duration, thumbnails]);

  // Clear thumbnails when media changes
  useEffect(() => {
    thumbnails.clearThumbnails();
  }, [currentMedia?.id]);

  // Add to recently played
  useEffect(() => {
    if (currentMedia && state.duration > 0) {
      recentlyPlayed.addToRecent({
        id: currentMedia.id,
        name: currentMedia.name,
        type: currentMedia.type,
        duration: state.duration,
      });
    }
  }, [currentMedia?.id, state.duration]);

  // Update position for resume feature
  useEffect(() => {
    if (currentMedia && state.currentTime > 0 && state.duration > 0) {
      const debounce = setTimeout(() => {
        recentlyPlayed.updatePosition(currentMedia.id, state.currentTime, state.duration);
      }, 5000);
      return () => clearTimeout(debounce);
    }
  }, [currentMedia?.id, state.currentTime, state.duration]);

  // Auto-hide controls for video
  useEffect(() => {
    if (!isVideo || !state.isPlaying) {
      setControlsVisible(true);
      return;
    }

    const hideControls = () => {
      if (controlsTimeout) clearTimeout(controlsTimeout);
      const timeout = setTimeout(() => {
        setControlsVisible(false);
      }, 3000);
      setControlsTimeout(timeout);
    };

    hideControls();

    return () => {
      if (controlsTimeout) clearTimeout(controlsTimeout);
    };
  }, [isVideo, state.isPlaying]);

  const handleMouseMove = () => {
    if (isVideo) {
      setControlsVisible(true);
      if (controlsTimeout) clearTimeout(controlsTimeout);
      if (state.isPlaying) {
        const timeout = setTimeout(() => {
          setControlsVisible(false);
        }, 3000);
        setControlsTimeout(timeout);
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
      className="flex h-screen bg-background overflow-hidden"
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
          <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <span className="text-primary font-bold text-lg">▶</span>
              </div>
              <div>
                <h1 className="font-semibold text-foreground">Media Player</h1>
                <p className="text-xs text-muted-foreground">
                  {currentMedia ? currentMedia.name : 'No media loaded'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Thumbnail generation indicator */}
              {thumbnails.isGenerating && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Image className="w-4 h-4 animate-pulse" />
                  <span>Generating previews...</span>
                </div>
              )}

              <button
                onClick={() => setShowPlaylist(!showPlaylist)}
                className="control-btn text-foreground lg:hidden"
                title="Toggle playlist"
              >
                {showPlaylist ? (
                  <PanelLeftClose className="w-5 h-5" />
                ) : (
                  <PanelLeftOpen className="w-5 h-5" />
                )}
              </button>
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
                className="w-full h-full object-contain"
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
            ${isVideo && !controlsVisible ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}
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
              hasPlaylist={playlist.length > 1}
              thumbnailGetter={isVideo ? thumbnails.getThumbnail : undefined}
              abLoop={advancedFeatures.abLoop}
              sleepTimer={advancedFeatures.sleepTimer}
              bookmarks={advancedFeatures.bookmarks}
              hasSubtitles={subtitles.subtitles.length > 0}
              subtitlesEnabled={subtitles.isEnabled}
              onOpenEqualizer={() => setShowEqualizer(true)}
              onOpenSubtitleSettings={() => {}}
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
            />
          </div>
        )}
      </div>

      {/* Playlist sidebar */}
      <aside className={`
        w-80 border-l border-border bg-card flex-shrink-0
        transition-all duration-300 ease-out
        ${showPlaylist ? 'translate-x-0' : 'translate-x-full'}
        ${state.isFullscreen ? 'hidden' : ''}
        hidden lg:block
      `}>
        <Playlist
          playlist={playlist}
          currentIndex={currentIndex}
          onPlay={playIndex}
          onRemove={removeFromPlaylist}
          onClear={clearPlaylist}
          onAddMore={handleAddMore}
        />
      </aside>

      {/* Mobile playlist overlay */}
      {showPlaylist && !state.isFullscreen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setShowPlaylist(false)}
          />
          <aside className="absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-card border-l border-border animate-slide-in-right">
            <Playlist
              playlist={playlist}
              currentIndex={currentIndex}
              onPlay={(index) => {
                playIndex(index);
                setShowPlaylist(false);
              }}
              onRemove={removeFromPlaylist}
              onClear={clearPlaylist}
              onAddMore={handleAddMore}
            />
          </aside>
        </div>
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
    </div>
  );
};

export default MediaPlayer;
