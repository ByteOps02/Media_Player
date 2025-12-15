import React, { useState, useCallback } from 'react';
import { Upload, FileVideo, FileAudio, FolderOpen } from 'lucide-react';

interface DropZoneProps {
  onFilesAdded: (files: FileList | File[]) => void;
  hasMedia: boolean;
}

const DropZone: React.FC<DropZoneProps> = ({ onFilesAdded, hasMedia }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onFilesAdded(files);
    }
  }, [onFilesAdded]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFilesAdded(files);
    }
    // Reset input
    e.target.value = '';
  }, [onFilesAdded]);

  const handleClick = () => {
    document.getElementById('file-input')?.click();
  };

  if (hasMedia) {
    return (
      <>
        <input
          id="file-input"
          type="file"
          accept="video/*,audio/*,.mp4,.webm,.mkv,.avi,.mp3,.wav,.flac,.aac,.ogg"
          multiple
          onChange={handleFileInput}
          className="hidden"
        />
        {/* Compact add button for when media is loaded */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            absolute inset-0 z-50 flex items-center justify-center
            transition-all duration-300 pointer-events-none
            ${isDragOver ? 'opacity-100 pointer-events-auto' : 'opacity-0'}
          `}
        >
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
          <div className="relative z-10 flex flex-col items-center gap-2 sm:gap-4 text-center p-4 sm:p-8">
            <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-full bg-primary/20 flex items-center justify-center glow-accent">
              <Upload className="w-8 sm:w-10 h-8 sm:h-10 text-primary" />
            </div>
            <div>
              <p className="text-lg sm:text-xl font-semibold text-foreground">Drop to add to playlist</p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">Release to add files</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      className={`
        drop-zone flex flex-col items-center justify-center gap-3 sm:gap-6 p-6 sm:p-12 cursor-pointer
        min-h-[300px] sm:min-h-[400px] transition-all duration-300
        ${isDragOver ? 'drop-zone-active' : 'hover:border-muted-foreground/50'}
      `}
    >
      <input
        id="file-input"
        type="file"
        accept="video/*,audio/*,.mp4,.webm,.mkv,.avi,.mp3,.wav,.flac,.aac,.ogg"
        multiple
        onChange={handleFileInput}
        className="hidden"
      />

      <div className={`
        w-16 sm:w-24 h-16 sm:h-24 rounded-full flex items-center justify-center
        transition-all duration-300
        ${isDragOver ? 'bg-primary/20 glow-accent scale-110' : 'bg-secondary'}
      `}>
        <Upload className={`
          w-8 sm:w-12 h-8 sm:h-12 transition-colors duration-300
          ${isDragOver ? 'text-primary' : 'text-muted-foreground'}
        `} />
      </div>

      <div className="text-center">
        <h3 className="text-base sm:text-xl font-semibold text-foreground mb-1 sm:mb-2">
          {isDragOver ? 'Drop files here' : 'Drop media files or click to browse'}
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-md px-2">
          Supports MP4, WebM, MKV, AVI, MP3, WAV, FLAC, AAC, OGG and more
        </p>
      </div>

      <div className="hidden sm:flex items-center gap-6 mt-2 sm:mt-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <FileVideo className="w-5 h-5" />
          <span className="text-sm">Video</span>
        </div>
        <div className="w-px h-6 bg-border" />
        <div className="flex items-center gap-2 text-muted-foreground">
          <FileAudio className="w-5 h-5" />
          <span className="text-sm">Audio</span>
        </div>
        <div className="w-px h-6 bg-border" />
        <div className="flex items-center gap-2 text-muted-foreground">
          <FolderOpen className="w-5 h-5" />
          <span className="text-sm">Multiple files</span>
        </div>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          handleClick();
        }}
        className="mt-4 sm:mt-6 px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base font-semibold flex items-center gap-2 rounded-lg transition-all duration-200 ease-out bg-primary text-primary-foreground hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-lg hover:shadow-primary/40"
      >
        <FolderOpen className="w-4 sm:w-5 h-4 sm:h-5" />
        Browse Files
      </button>
    </div>
  );
};

export default DropZone;
