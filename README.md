# 🎬 Aura Media Player

<div align="center">

**A modern, feature-rich desktop media player built with React, TypeScript, and Electron**

A beautifully designed, fully-responsive media player that combines native desktop capabilities with web technology. Experience seamless playback of your local video and audio files with professional-grade features.

[![Electron](https://img.shields.io/badge/Electron-30+-47848F?style=for-the-badge&logo=electron&logoColor=white)](https://www.electronjs.org/)
[![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0+-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4+-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

[Features](#-features) • [Getting Started](#-getting-started) • [Documentation](#-documentation) • [Contributing](#-contributing)

</div>

---

## 📋 Table of Contents

- [Features](#-features)
- [System Requirements](#-system-requirements)
- [Getting Started](#-getting-started)
- [Usage & Keyboard Shortcuts](#-usage--keyboard-shortcuts)
- [Project Architecture](#-project-architecture)
- [Technology Stack](#-technology-stack)
- [Documentation](#-documentation)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🖥️ Desktop Experience
- **Native Application** - Standalone executable for Windows (macOS/Linux coming soon)
- **System Integration** - Native file dialogs and file explorer integration
- **Drag & Drop** - Seamlessly drag media files from your file explorer
- **Offline Ready** - Full functionality without internet connection
- **Multi-window Support** - Open multiple instances for side-by-side playback

### 🎵 Playback & Media Support

**Format Support:**
- **Video:** MP4, WebM, MKV, AVI, MOV, M4V
- **Audio:** MP3, WAV, FLAC, AAC, OGG, M4A, WMA
- **Subtitles:** SRT, VTT (with customizable rendering)

**Playback Controls:**
- Play/Pause, Next, Previous, Seek
- 8 Speed Options (0.25x - 2x)
- Shuffle & Repeat modes
- Volume control with mute
- Real-time buffering indicator

### 🎚️ Advanced Audio Features

| Feature | Details |
|---------|---------|
| **10-Band Equalizer** | Professional audio shaping (32Hz - 16kHz) |
| **Presets** | 10 curated presets (Bass Boost, Rock, Pop, Jazz, Classical, Electronic, Vocal, etc.) |
| **Real-time Processing** | Web Audio API integration for live adjustments |
| **Audio Visualizer** | Dynamic waveform visualization during playback |

### 📺 Video & Visual Features

| Feature | Details |
|---------|---------|
| **Fullscreen Mode** | True fullscreen with floating playlist overlay |
| **Picture-in-Picture** | Compact floating window for multitasking |
| **Video Thumbnails** | Auto-generated previews on hover (seek bar) |
| **Screenshot Capture** | Save video frames as PNG images |
| **Subtitle Support** | SRT/VTT files with size & position customization |
| **Dark/Light Theme** | Toggle between modes or follow system preference |

### 🛠️ Productivity Features

| Feature | Benefit |
|---------|---------|
| **A-B Loop** | Perfect for musicians, dancers, language learners |
| **Sleep Timer** | Auto-stop after 15, 30, 45, 60, 90, or 120 minutes |
| **Bookmarks** | Save favorite timestamps for quick navigation |
| **Recently Played** | Auto-tracked history with resume functionality |
| **Playlist Management** | Organize, remove, or clear media files |

### 🎨 User Interface

- **Glassmorphism Design** - Modern frosted glass aesthetic with backdrop blur
- **Responsive Layout** - Mobile-optimized UI (works on tablets too)
- **Dark/Light Modes** - System-aware theme switching with persistent storage
- **Smooth Animations** - Polished transitions and micro-interactions
- **Accessibility** - Keyboard navigation and screen reader support

---

## 🖥️ System Requirements

### Minimum
- **Windows:** Windows 10 or later (64-bit)
- **RAM:** 2GB
- **Disk Space:** 250MB for installation

### Recommended
- **Windows:** Windows 11 (latest build)
- **RAM:** 4GB or more
- **SSD:** For faster file access

### Development
- **Node.js:** 18.0 or higher
- **npm:** 9.0 or higher
- **Git:** Latest version

---

## 🚀 Getting Started

### Installation (Desktop Users)

1. Download the latest installer from [Releases](https://github.com/ByteOps02/Media_Player/releases)
2. Run `Media Player Setup x.x.x.exe`
3. Follow the installation wizard
4. Launch from Start Menu or Desktop shortcut

### Development Setup (Developers)

#### Clone Repository
```bash
git clone https://github.com/ByteOps02/Media_Player.git
cd Media_Player
```

#### Install Dependencies
```bash
npm install
```

#### Start Development
```bash
npm run dev
```
This launches the app with hot-reload enabled. Perfect for development and testing.

#### Build Production Release
```bash
npm run build              # Build web assets
npm run electron:build     # Create Windows installer
```

**Output:** Find your installer in `build-release/[version]/`

---

## 🎮 Usage & Keyboard Shortcuts

### Opening Media Files

**Method 1: Drag & Drop**
- Simply drag video or audio files into the player window
- Or drag entire folders to load all compatible media

**Method 2: File Browser**
- Click "Browse Files" button in the player
- Select one or more files
- Files are added to the playlist

**Method 3: Command Line** (Dev mode)
```bash
npm run dev -- path/to/media.mp4
```

### Keyboard Shortcuts

#### Playback Control
| Shortcut | Action |
|----------|--------|
| **Space** | Play/Pause |
| **Ctrl+N** | Next Track |
| **Ctrl+B** | Previous Track |
| **→** | Seek forward 10s |
| **←** | Seek backward 10s |

#### Volume & Audio
| Shortcut | Action |
|----------|--------|
| **M** | Mute/Unmute |
| **↑** | Volume up (+5%) |
| **↓** | Volume down (-5%) |
| **+** | Speed up (+0.25x) |
| **-** | Speed down (-0.25x) |

#### Video Control
| Shortcut | Action |
|----------|--------|
| **F** | Fullscreen |
| **Shift+P** | Picture-in-Picture |
| **Esc** | Exit Fullscreen |
| **T** | Toggle Theme |

#### Features
| Shortcut | Action |
|----------|--------|
| **E** | Toggle Equalizer |
| **S** | Toggle Subtitles |
| **H** | Show/Hide This Help |

---

## 🏗️ Project Architecture

### Directory Structure

```
Media_Player/
├── electron/                          # Electron main process
│   ├── main.ts                        # App entry point
│   └── preload.ts                     # IPC bridge
├── src/
│   ├── components/
│   │   ├── player/                    # Player components
│   │   │   ├── MediaPlayer.tsx        # Main orchestrator
│   │   │   ├── PlayerControls.tsx     # Control bar
│   │   │   ├── Playlist.tsx           # Playlist sidebar
│   │   │   ├── ProgressBar.tsx        # Seek bar w/ preview
│   │   │   ├── VolumeControl.tsx      # Volume slider
│   │   │   ├── SpeedControl.tsx       # Speed selector
│   │   │   ├── Equalizer.tsx          # 10-band EQ
│   │   │   ├── SettingsMenu.tsx       # Advanced options
│   │   │   ├── SubtitleDisplay.tsx    # Subtitle renderer
│   │   │   ├── BookmarksPanel.tsx     # Bookmarks modal
│   │   │   ├── RecentlyPlayedPanel.tsx# History modal
│   │   │   └── AudioVisualizer.tsx    # Waveform display
│   │   ├── ThemeToggle.tsx            # Theme switcher
│   │   ├── NavLink.tsx                # Navigation component
│   │   └── ui/                        # shadcn/ui library
│   │       ├── button.tsx, card.tsx, dialog.tsx...
│   │       └── ... (30+ components)
│   ├── hooks/                         # Custom React hooks
│   │   ├── useMediaPlayer.ts          # Core playback logic
│   │   ├── useEqualizer.ts            # Audio processing
│   │   ├── useSubtitles.ts            # Subtitle parsing
│   │   ├── useAdvancedFeatures.ts     # A-B loop, timer, bookmarks
│   │   ├── useRecentlyPlayed.ts       # History tracking
│   │   ├── useVideoThumbnails.ts      # Thumbnail generation
│   │   ├── use-mobile.tsx             # Responsive detection
│   │   └── use-toast.ts               # Notifications
│   ├── context/
│   │   └── ThemeContext.tsx           # Global theme state
│   ├── pages/
│   │   ├── Index.tsx                  # Main player page
│   │   └── NotFound.tsx               # 404 page
│   ├── lib/
│   │   └── utils.ts                   # Helper utilities
│   ├── App.tsx                        # Root component
│   ├── App.css                        # Component styles
│   ├── index.css                      # Global styles + themes
│   └── main.tsx                       # React entry point
├── public/                            # Static assets
│   └── robots.txt
├── dist/                              # Built assets (generated)
├── dist-electron/                     # Built main process (generated)
├── build-release/                     # Final installers (generated)
├── vite.config.ts                     # Vite configuration
├── tsconfig.json                      # TypeScript config
├── tailwind.config.ts                 # Tailwind theme
├── eslint.config.js                   # Code quality rules
├── package.json                       # Dependencies & scripts
└── README.md                          # This file
```

### Architecture Diagram

```
Electron Main Process
├── Window Management
├── File System Access
└── Native APIs
        ↓
    IPC Bridge
        ↓
React Renderer (Vite)
├── Components (TSX)
├── State (Hooks)
├── Styling (Tailwind)
└── Web APIs (Audio, Video)
```

---

## 🛠️ Technology Stack

### Frontend Framework
- **React 18+** - Component-based UI with hooks
- **TypeScript 5.0+** - Type-safe development
- **Vite 5.4+** - Lightning-fast bundler and dev server

### Styling & UI
- **Tailwind CSS 3.4+** - Utility-first CSS framework
- **PostCSS 8+** - CSS processing
- **shadcn/ui** - 30+ pre-built, accessible components
- **Lucide React** - 1000+ beautiful icons

### Media & Audio
- **Web Audio API** - Real-time audio processing
- **HTML5 Media Elements** - Native video/audio support
- **Canvas API** - Thumbnail generation and visualizer

### Desktop
- **Electron 30+** - Cross-platform desktop framework
- **electron-builder** - Installer creation

### State & Utilities
- **React Router** - Client-side routing
- **Sonner** - Toast notifications
- **Custom Hooks** - Encapsulated business logic

---

## 📚 Documentation

### For Users

#### Getting Started
1. **Installation:** See [Getting Started](#-getting-started) section above
2. **First Run:** Drag and drop a media file to start playing
3. **Keyboard Shortcuts:** See [Keyboard Shortcuts](#-usage--keyboard-shortcuts) section

#### Features Guide

**Playing Media:**
- Use drag-and-drop or the "Browse Files" button
- Files are added to the playlist (right sidebar)
- Click a file to play it

**Adjusting Audio:**
- Use volume slider on bottom left
- Open equalizer for 10-band EQ adjustments
- Select from 10 presets or customize manually

**Video Options:**
- **Fullscreen:** Press F or click fullscreen button
- **Thumbnails:** Hover over seek bar to preview
- **Subtitles:** Load SRT/VTT files via settings menu

**Advanced:**
- **A-B Loop:** Set start and end points (great for learning)
- **Sleep Timer:** Auto-stop after a set duration
- **Bookmarks:** Save timestamps for favorite moments

### For Developers

#### Setting Up Dev Environment

```bash
# Install Node.js 18+
# Clone and install
git clone https://github.com/ByteOps02/Media_Player.git
cd Media_Player
npm install

# Start development
npm run dev
```

#### Running Tests & Linting

```bash
# Check code quality
npm run lint

# Fix formatting issues
npm run lint -- --fix
```

#### Building & Distribution

```bash
# Production build
npm run build
npm run electron:build

# Clean build
rm -rf dist dist-electron
npm run build
npm run electron:build
```

#### Key Technologies to Understand

1. **Electron** - Main & Renderer process communication
2. **React Hooks** - State management (useState, useEffect, useContext)
3. **Web Audio API** - For equalizer and visualizer
4. **TypeScript** - Type definitions for safety
5. **Tailwind CSS** - Utility classes for responsive design

#### Adding New Features

**Example: Adding a new audio preset**

1. Edit `src/hooks/useEqualizer.ts`
2. Add to `EQUALIZER_PRESETS` array
3. Preset automatically appears in Equalizer UI

**Example: Adding a keyboard shortcut**

1. Edit `src/components/player/MediaPlayer.tsx`
2. Add listener in `useEffect`
3. Call appropriate handler function

---

## 🐛 Troubleshooting

### Common Issues

#### **App Won't Launch**
```
Error: Cannot find module...
```
**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

#### **Build Fails on Windows**
```
Error: editbin not found...
```
**Solution:** Ensure Visual C++ Build Tools are installed. If already installed:
```bash
npm run electron:build --verbose
```

#### **White Screen on Launch**
**Solution:**
1. Open DevTools: `Ctrl+Shift+I`
2. Check Console for errors
3. Ensure `vite.config.ts` has `base: './'`
4. Verify `electron/main.ts` points to correct dist path

#### **Media Files Not Loading**
**Solution:**
- Check file format is supported (see [Features](#-features))
- Ensure file path contains no special characters
- Try different file to isolate the issue

#### **Equalizer Not Working**
**Solution:**
1. Toggle equalizer OFF then ON
2. Check browser console for Web Audio API errors
3. Ensure audio context is initialized

### Getting Help

- **GitHub Issues:** [Report a bug](https://github.com/ByteOps02/Media_Player/issues)
- **Discussions:** [Ask a question](https://github.com/ByteOps02/Media_Player/discussions)
- **Documentation:** Check relevant section above

---

## 🤝 Contributing

We love contributions! Here's how to help:

### Report Bugs
1. Check if issue already exists
2. Describe the bug clearly with steps to reproduce
3. Include OS, Node version, and error messages
4. Provide screenshots if applicable

### Suggest Features
1. Describe the feature and use case
2. Explain why it would be useful
3. Provide mockups or examples if possible

### Submit Code
1. Fork the repository
2. Create a feature branch:
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. Make your changes and commit:
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. Push to branch:
   ```bash
   git push origin feature/amazing-feature
   ```
5. Open a Pull Request with description

### Code Guidelines
- Follow existing code style
- Use TypeScript for all code
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation if needed

---

## 📄 License

This project is licensed under the **MIT License** - see [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 Media Player Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

## 📞 Support

- **Issues & Bug Reports:** [GitHub Issues](https://github.com/ByteOps02/Media_Player/issues)
- **Feature Requests:** [GitHub Discussions](https://github.com/ByteOps02/Media_Player/discussions)
- **Email:** [user@example.com](mailto:user@example.com)

---

## 🎉 Acknowledgments

Built with modern web technologies by the community:

- [React](https://react.dev) - UI Framework
- [TypeScript](https://www.typescriptlang.org/) - Type Safety
- [Vite](https://vitejs.dev) - Build Tool
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [shadcn/ui](https://ui.shadcn.com) - Components
- [Electron](https://www.electronjs.org/) - Desktop Framework

---

<div align="center">

### ⭐ If you find this project helpful, please consider giving it a star!

**Built with ❤️ for better media experience**

Last Updated: December 2025 | Version: 0.0.0

</div>
