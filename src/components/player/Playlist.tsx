import React, { useState } from 'react';
import { X, Play, FileVideo, FileAudio, Trash2, ListMusic, Upload } from 'lucide-react';

interface MediaFile {
  id: string;
  name: string;
  type: 'video' | 'audio';
  url: string;
}

const AppleGlassPlaylist = () => {
  const [playlist, setPlaylist] = useState<MediaFile[]>([
    { id: '1', name: 'Summer Vibes.mp4', type: 'video', url: '#' },
    { id: '2', name: 'Morning Acoustic.mp3', type: 'audio', url: '#' },
    { id: '3', name: 'City Lights.mp4', type: 'video', url: '#' },
    { id: '4', name: 'Jazz Lounge.mp3', type: 'audio', url: '#' },
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePlay = (index: number) => {
    setCurrentIndex(index);
  };

  const handleRemove = (id: string) => {
    const newPlaylist = playlist.filter(item => item.id !== id);
    setPlaylist(newPlaylist);
    if (currentIndex >= newPlaylist.length) {
      setCurrentIndex(Math.max(0, newPlaylist.length - 1));
    }
  };

  const handleClear = () => {
    setPlaylist([]);
    setCurrentIndex(0);
  };

  const handleAddMedia = () => {
    const newMedia: MediaFile = {
      id: Date.now().toString(),
      name: `New Track ${playlist.length + 1}.mp3`,
      type: Math.random() > 0.5 ? 'audio' : 'video',
      url: '#'
    };
    setPlaylist([...playlist, newMedia]);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-8 relative overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 opacity-80"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
      
      {/* Floating Elements for Depth */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

      {/* Main Playlist Container */}
      <div className="relative w-full max-w-md h-[400px]">
        <div className="absolute inset-0 bg-white/5 backdrop-blur-3xl rounded-3xl border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]"></div>
        
        <div className="relative h-full flex flex-col rounded-3xl overflow-hidden">
          {/* Header with Glassmorphism */}
          <div className="px-4 py-3 backdrop-blur-xl bg-white/2 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500/30 to-pink-500/30 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-lg">
                <ListMusic className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white tracking-tight">My Playlist</h2>
                <p className="text-[10px] text-white/70 font-medium">
                  {playlist.length} {playlist.length === 1 ? 'Track' : 'Tracks'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleAddMedia}
                className="p-2 rounded-lg backdrop-blur-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white hover:scale-105 transition-all duration-200 shadow-lg"
                title="Add Track"
              >
                <Upload className="w-3.5 h-3.5" />
              </button>
              {playlist.length > 0 && (
                <button
                  onClick={handleClear}
                  className="p-2 rounded-lg backdrop-blur-xl bg-white/10 hover:bg-red-500/30 border border-white/20 text-white hover:text-red-300 hover:scale-105 transition-all duration-200 shadow-lg"
                  title="Clear Playlist"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Playlist Items */}
          <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
            {playlist.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-white/70 space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center">
                  <ListMusic className="w-7 h-7 opacity-40" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">Your playlist is empty</p>
                  <p className="text-xs text-white/50 mt-1">Add tracks to get started</p>
                </div>
              </div>
            ) : (
              playlist.map((media, index) => {
                const isActive = index === currentIndex;
                return (
                  <div
                    key={media.id}
                    onClick={() => handlePlay(index)}
                    className={`
                      group relative flex items-center gap-2.5 p-2.5 rounded-xl cursor-pointer
                      transition-all duration-300 backdrop-blur-xl
                      ${
                        isActive
                          ? 'bg-white/10 border border-white/15 shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] scale-[1.02]'
                          : 'bg-white/2 border border-white/5 hover:bg-white/5 hover:border-white/10 hover:scale-[1.01]'
                      }
                    `}
                  >
                    {/* Icon Container */}
                    <div
                      className={`
                        w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300
                        backdrop-blur-xl border
                        ${
                          isActive
                            ? 'bg-gradient-to-br from-purple-500/50 to-pink-500/50 border-white/20 shadow-[0_0_20px_rgba(168,85,247,0.4)]'
                            : 'bg-white/5 border-white/10 group-hover:bg-white/10'
                        }
                      `}
                    >
                      {isActive ? (
                        <Play className="w-3.5 h-3.5 fill-white text-white ml-0.5" />
                      ) : media.type === 'video' ? (
                        <FileVideo className="w-4 h-4 text-white/80" />
                      ) : (
                        <FileAudio className="w-4 h-4 text-white/80" />
                      )}
                    </div>

                    {/* Track Info */}
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-xs font-semibold truncate transition-colors ${
                          isActive ? 'text-white' : 'text-white/90 group-hover:text-white'
                        }`}
                      >
                        {media.name.replace(/\.[^/.]+$/, '')}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span
                          className={`
                            text-[9px] px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider
                            backdrop-blur-xl border
                            ${
                              isActive
                                ? 'bg-white/10 border-white/20 text-white'
                                : 'bg-white/5 border-white/10 text-white/60'
                            }
                          `}
                        >
                          {media.type}
                        </span>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(media.id);
                      }}
                      className={`
                        w-7 h-7 rounded-lg backdrop-blur-xl flex items-center justify-center transition-all duration-200
                        border shadow-lg
                        ${
                          isActive
                            ? 'opacity-100 bg-white/5 border-white/10 hover:bg-red-500/10 hover:border-red-500/10 text-white'
                            : 'opacity-0 group-hover:opacity-100 bg-white/5 border-white/10 hover:bg-red-500/10 hover:border-red-500/10 text-white/70 hover:text-red-300'
                        }
                      `}
                      title="Remove"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Bottom Blur Effect */}
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        
        .animate-pulse {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        .delay-1000 {
          animation-delay: 1s;
        }

        /* Custom Scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
};

export default AppleGlassPlaylist;