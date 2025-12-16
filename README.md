# 🎬 Aura Media Player

A modern, feature-rich media player built with React and TypeScript. Play video and audio files with advanced controls, playlist management, and a beautiful glassmorphism UI design. Fully responsive across desktop, tablet, and mobile devices.

![React](https://img.shields.io/badge/React-18+-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4+-blue?logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-5.4+-blue?logo=vite)
![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ Features

### 🎵 Core Playback
- **Multi-Format Support** - MP4, WebM, MKV, AVI, MOV, MP3, WAV, FLAC, AAC, OGG, M4A, WMA
- **Playlist Management** - Add, remove, clear, and organize multiple files seamlessly
- **Play/Pause & Navigation** - Play, pause, next, previous, skip controls
- **Shuffle & Repeat** - Shuffle playlist or repeat single/all tracks
- **Adjustable Speed** - 8 playback speed options (0.25x, 0.5x, 0.75x, 1x, 1.25x, 1.5x, 1.75x, 2x)
- **Volume Control** - Adjustable volume with mute toggle and visual feedback
- **Progress Tracking** - Seek bar with current/total time display and buffering indicator

### 🎚️ Advanced Audio Features
- **10-Band Equalizer** - Professional audio equalization with 10 frequency bands (32Hz-16kHz)
- **Audio Presets** - 10 preset selections: Flat, Bass Boost, Treble Boost, Rock, Pop, Jazz, Classical, Electronic, Vocal, Bass Only
- **Real-time Audio Processing** - Web Audio API integration for live EQ adjustments
- **Independent EQ Control** - Toggle equalizer on/off without affecting playback

### 📺 Video-Specific Features
- **Fullscreen Mode** - True fullscreen playback with floating playlist overlay
- **Picture-in-Picture** - Floating window mode for multitasking
- **Video Thumbnails** - Auto-generated preview thumbnails on seek bar hover
- **Screenshot Capture** - Capture video frames as PNG images
- **Subtitle Support** - Load and display SRT and VTT subtitle files with customization:
  - Font size adjustment (small, medium, large)
  - Position toggle (top/bottom)
  - Enable/disable subtitles on-the-fly

### ⏱️ Time & Loop Control
- **A-B Loop** - Set loop points A and B for repeated section playback
- **Sleep Timer** - Auto-stop playback after 15, 30, 45, 60, 90, or 120 minutes
- **Time Tracking** - Display remaining sleep timer duration

### 🔖 User Organization
- **Bookmarks** - Create bookmarks at specific timestamps for quick navigation
- **Recently Played** - Automatic tracking of recently played media with resume functionality
- **Persistent Storage** - Save playback position and history across sessions

### 🎨 User Interface & Experience
- **Glassmorphism Design** - Modern frosted glass effect with backdrop blur on all surfaces
- **Theme System** - Light/Dark/System modes with smooth transitions
- **Persistent Theme** - Theme preference saved to localStorage
- **Responsive Design** - Fully optimized for:
  - Mobile phones (320px+)
  - Tablets (641px - 1024px)
  - Desktop (1025px+)
- **Touch-Friendly** - Optimized touch targets and mobile-first layout
- **Keyboard Shortcuts** - Extensive keyboard support for power users
- **Smooth Animations** - Polished transitions and micro-interactions throughout

### 📦 Playlist Features
- **Drag & Drop** - Drag files directly into the player
- **File Browser** - Browse and select files from your system
- **Current Track Highlight** - Visual indicator for the playing track
- **Remove/Clear Options** - Remove individual tracks or clear entire playlist

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18 or higher
- **npm** 9+ or **yarn** 4+

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ByteOps02/Media_Player.git
   cd Media_Player
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   The player will be available at `http://localhost:8080`

### Build for Production

```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview

# Build as Electron app (Windows installer)
npm run electron:build
```

---

## 🎮 Keyboard Shortcuts

| Key | Action |
|-----|--------|
| **Space** | Play/Pause |
| **F** | Fullscreen (video) |
| **Shift+P** | Picture-in-Picture (video) |
| **→** | Skip forward 10 seconds |
| **←** | Skip backward 10 seconds |
| **N** | Next track |
| **B** | Previous track |
| **M** | Mute/Unmute |
| **↑/↓** | Increase/Decrease volume |

---

## 🏗️ Project Architecture

### Directory Structure

```
src/
├── components/
│   ├── player/                      # Main player components
│   │   ├── MediaPlayer.tsx          # Main player orchestrator
│   │   ├── PlayerControls.tsx       # Control bar with all buttons
│   │   ├── Playlist.tsx             # Playlist sidebar management
│   │   ├── ProgressBar.tsx          # Seek bar with thumbnails
│   │   ├── VolumeControl.tsx        # Volume slider
│   │   ├── SpeedControl.tsx         # Playback speed selector
│   │   ├── Equalizer.tsx            # 10-band equalizer UI
│   │   ├── SettingsMenu.tsx         # Advanced settings menu
│   │   ├── DropZone.tsx             # File upload & drag-drop area
│   │   ├── AudioVisualizer.tsx      # Audio waveform visualization
│   │   ├── SubtitleDisplay.tsx      # Subtitle rendering
│   │   ├── BookmarksPanel.tsx       # Bookmarks management modal
│   │   ├── RecentlyPlayedPanel.tsx  # Recently played files modal
│   │   └── ... (other components)
│   ├── ThemeToggle.tsx              # Light/Dark/System theme switcher
│   ├── NavLink.tsx                  # Navigation component
│   └── ui/                          # shadcn/ui component library
│       ├── button.tsx, card.tsx, dialog.tsx, etc.
│       └── ... (30+ pre-built UI components)
├── hooks/                           # Custom React hooks
│   ├── useMediaPlayer.ts            # Core media playback logic
│   │                                 # - File management
│   │                                 # - Playback state
│   │                                 # - Format detection
│   ├── useEqualizer.ts              # Audio equalizer logic
│   │                                 # - Web Audio API integration
│   │                                 # - 10 preset configurations
│   ├── useSubtitles.ts              # Subtitle parsing & display
│   │                                 # - SRT/VTT format support
│   │                                 # - Time synchronization
│   ├── useAdvancedFeatures.ts       # A-B loop, sleep timer, bookmarks
│   ├── useRecentlyPlayed.ts         # Recently played tracking
│   ├── useVideoThumbnails.ts        # Thumbnail generation
│   ├── use-mobile.tsx               # Mobile detection hook
│   └── use-toast.ts                 # Toast notification hook
├── context/
│   └── ThemeContext.tsx             # Global theme management
├── pages/
│   ├── Index.tsx                    # Main player page
│   └── NotFound.tsx                 # 404 page
├── lib/
│   └── utils.ts                     # Utility functions
├── App.tsx                          # Root component with theme provider
├── App.css                          # Component-specific styles
├── index.css                        # Global styles with theme variables
└── main.tsx                         # React entry point
```

### Component Hierarchy

```
App (with ThemeContext)
└── MediaPlayer
    ├── Header
    │   ├── Logo & Title
    │   ├── ThemeToggle
    │   └── Mobile Playlist Toggle
    ├── Media Display Area
    │   ├── Video Element / Audio Visualizer
    │   ├── DropZone (overlay)
    │   └── SubtitleDisplay
    ├── PlayerControls
    │   ├── ProgressBar
    │   ├── Control Buttons (Play, Skip, etc)
    │   ├── VolumeControl
    │   ├── SpeedControl
    │   └── SettingsMenu
    └── Sidebars
        ├── Desktop Playlist (lg:flex, desktop)
        ├── Mobile Playlist Overlay (mobile overlay)
        ├── Fullscreen Playlist Overlay (floating)
        ├── Equalizer Modal
        ├── BookmarksPanel Modal
        └── RecentlyPlayedPanel Modal
```

---

## 🛠️ Technology Stack

| Category | Technology | Purpose |
|----------|-----------|---------|
| **Framework** | React 18+ | UI component framework |
| **Language** | TypeScript 5.0+ | Type-safe development |
| **Build Tool** | Vite 5.4+ | Fast bundling & dev server |
| **Styling** | Tailwind CSS 3.4+ | Utility-first CSS framework |
| **UI Library** | shadcn/ui | High-quality React components |
| **Icons** | Lucide React | Modern icon library |
| **Notifications** | Sonner | Toast notifications |
| **Routing** | React Router | Client-side routing |
| **State Management** | React Hooks (useState, useContext) | Built-in state management |
| **Audio API** | Web Audio API | Audio equalizer & processing |

---

## 🎨 Design System

### Theme Implementation
- **CSS Variables** - Dynamic theming using CSS custom properties
- **Light Mode** - Light blue palette with proper contrast ratios
- **Dark Mode** - Navy blue palette (default) with cyan/blue accents
- **System Detection** - Respects system preference via `prefers-color-scheme`
- **Persistent Storage** - Theme preference saved to localStorage

### Visual Design
- **Glassmorphism** - Frosted glass effect with `backdrop-blur` and semi-transparent backgrounds
- **Gradient Accents** - Smooth linear and radial gradients throughout
- **Color Palette**:
  - Primary: Cyan/Blue (`hsl(210, 100%, 55%)`)
  - Secondary: Navy (`hsl(210, 20%, 16%)`)
  - Accent: Purple (`hsl(275, 100%, 55%)`)
  - Background: Very Dark Blue (`hsl(210, 25%, 4%)`)
- **Responsive Typography** - Scales from mobile to desktop
- **Smooth Animations** - Fade, scale, and slide transitions

### Responsive Breakpoints
- **Mobile**: 0-640px
- **Tablet**: 641px-1024px
- **Desktop**: 1025px+

---

## 📱 Browser Support

| Browser | Version | Status |
|---------|---------|--------|
| Chrome/Chromium | 90+ | ✅ Full Support |
| Edge | 90+ | ✅ Full Support |
| Firefox | 88+ | ✅ Full Support |
| Safari | 14+ | ✅ Full Support |
| Mobile Chrome | Latest | ✅ Full Support |
| Mobile Safari (iOS) | 14+ | ✅ Full Support |

---

## 🔧 Development

### Available Scripts

```bash
npm run dev        # Start Vite dev server with hot reload
npm run build      # Build optimized production bundle
npm run build:dev  # Build for development (debugging)
npm run preview    # Preview production build locally
npm run lint       # Run ESLint code quality checks
npm run electron:build  # Build as Windows executable
```

### Configuration Files

- **`vite.config.ts`** - Vite build configuration
- **`tsconfig.json`** - TypeScript compiler options
- **`tailwind.config.ts`** - Tailwind CSS theme customization
- **`eslint.config.js`** - Code quality rules
- **`postcss.config.js`** - PostCSS plugins for Tailwind
- **`components.json`** - shadcn/ui component registry

### Environment

- **Node Modules** - Dependencies managed via npm
- **Source Maps** - Debug-friendly production builds
- **Tree Shaking** - Unused code elimination
- **Lazy Loading** - Code splitting for optimal performance

---

## 🎯 Key Features Implementation

### Media Format Detection
```typescript
// Supports both video and audio formats
const VIDEO_EXTENSIONS = ['.mp4', '.webm', '.mkv', '.avi', '.mov', '.m4v'];
const AUDIO_EXTENSIONS = ['.mp3', '.wav', '.flac', '.aac', '.ogg', '.m4a', '.wma'];
```

### State Management
```typescript
// Core player state
PlayerState: {
  isPlaying, currentTime, duration, volume, isMuted,
  playbackRate, isFullscreen, isPiP, isLoading,
  buffered, shuffle, repeat
}
```

### Advanced Features
- **Equalizer**: 10-band peaking filters with Web Audio API
- **A-B Loop**: Automatic looping between two timestamps
- **Sleep Timer**: Countdown with auto-pause functionality
- **Bookmarks**: Array of timestamps for quick navigation
- **Subtitles**: SRT/VTT parsing with HTML tag stripping
- **Thumbnails**: Canvas-based frame capture and caching

---

## 📄 File Formats Supported

### Video
- **MP4** (.mp4, .m4v)
- **WebM** (.webm)
- **Matroska** (.mkv)
- **AVI** (.avi)
- **MOV** (.mov)

### Audio
- **MP3** (.mp3)
- **WAV** (.wav)
- **FLAC** (.flac)
- **AAC** (.aac)
- **OGG** (.ogg)
- **M4A** (.m4a)
- **WMA** (.wma)

### Subtitles
- **SRT** (.srt)
- **WebVTT** (.vtt)

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

Please ensure:
- Code follows the existing style
- TypeScript types are properly defined
- Components are responsive
- Features work across browsers

---

## 📄 License

This project is licensed under the **MIT License** - see the LICENSE file for details.

```
MIT License

Copyright © 2025 Media Player

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software...
```

---

## 📞 Support & Feedback

- **Issues**: Open an issue on GitHub for bugs and feature requests
- **Discussions**: Share ideas and discuss improvements
- **Email**: user@example.com

---

## 🎉 Acknowledgments

- Built with [React](https://react.dev)
- Styled with [Tailwind CSS](https://tailwindcss.com)
- Components from [shadcn/ui](https://ui.shadcn.com)
- Icons from [Lucide React](https://lucide.dev)
- Bundled with [Vite](https://vitejs.dev)

---

## 🚀 Performance Metrics

- **Build Size**: ~250KB (gzipped)
- **Load Time**: <1s on modern connections
- **Audio Processing**: Real-time Web Audio API
- **Video Playback**: Hardware-accelerated when available
- **Memory**: Efficient thumbnail caching
- **Responsive**: Touch-optimized for mobile

---

**Built with ❤️ for a better media experience**

Last Updated: December 2025
