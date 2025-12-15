# 🎬 Aura Media Player

A modern, feature-rich media player built with React and TypeScript. Play video and audio files with advanced controls, playlist management, and a beautiful glassmorphism UI design.

![React](https://img.shields.io/badge/React-18+-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4+-blue?logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ Features

### Core Playback
- **Video & Audio Support** - Play MP4, WebM, MKV, AVI, MP3, WAV, FLAC, AAC, OGG and more
- **Playlist Management** - Add, remove, and organize multiple files
- **Playback Controls** - Play, pause, skip, shuffle, and repeat modes
- **Variable Speed Control** - 8 playback speed options (0.25x - 2x)
- **Volume Control** - Adjustable volume with mute functionality
- **Progress Tracking** - Seek bar with current/total time display

### Advanced Features
- **A-B Loop** - Loop specific sections for repeated playback
- **Sleep Timer** - Auto-stop playback after specified time (15-120 minutes)
- **Bookmarks** - Create and jump to bookmarked timestamps
- **Equalizer** - 10-band audio equalizer with preset selections
- **Video Subtitles** - Load and display SRT/VTT subtitle files
- **Screenshots** - Capture video frames as PNG images
- **Picture-in-Picture** - Floating window mode for videos

### User Experience
- **Fullscreen Mode** - Immersive fullscreen viewing with floating playlist
- **Recently Played** - Track and resume previously played media
- **Theme Switching** - Light/Dark/System modes with persistent storage
- **Responsive Design** - Fully optimized for mobile, tablet, and desktop
- **Keyboard Shortcuts** - Extensive keyboard controls for power users
- **Video Thumbnails** - Auto-generated preview thumbnails on hover

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
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

4. **Open in browser**
   Navigate to `http://localhost:8080`

### Build for Production

```bash
npm run build
npm run preview
```

---

## 🎮 Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Play/Pause |
| `F` | Fullscreen |
| `Shift+P` | Picture-in-Picture |
| `→` | Skip forward 10s |
| `←` | Skip backward 10s |
| `N` | Next track |
| `B` | Previous track |
| `M` | Mute/Unmute |
| `Up/Down` | Volume up/down |

---

## 🏗️ Project Structure

```
src/
├── components/
│   ├── player/
│   │   ├── MediaPlayer.tsx          # Main player component
│   │   ├── PlayerControls.tsx       # Control bar
│   │   ├── Playlist.tsx             # Playlist sidebar
│   │   ├── ProgressBar.tsx          # Seek bar with preview
│   │   ├── VolumeControl.tsx        # Volume slider
│   │   ├── SpeedControl.tsx         # Playback speed selector
│   │   ├── Equalizer.tsx            # Audio equalizer
│   │   ├── SettingsMenu.tsx         # Advanced settings
│   │   ├── DropZone.tsx             # File upload area
│   │   └── ... (other components)
│   ├── ThemeToggle.tsx              # Theme switcher
│   └── ui/                          # shadcn UI components
├── hooks/
│   ├── useMediaPlayer.ts            # Core player logic
│   ├── useEqualizer.ts              # Audio equalizer state
│   ├── useSubtitles.ts              # Subtitle management
│   └── ... (other hooks)
├── context/
│   └── ThemeContext.tsx             # Theme management
└── lib/
    └── utils.ts                     # Utility functions
```

---

## 🛠️ Technology Stack

| Technology | Purpose |
|-----------|---------|
| **React 18** | UI framework |
| **TypeScript** | Type safety |
| **Vite** | Build tool & dev server |
| **Tailwind CSS** | Styling framework |
| **shadcn/ui** | UI component library |
| **Lucide React** | Icon library |
| **Sonner** | Toast notifications |

---

## 🎨 Design Highlights

- **Glassmorphism UI** - Modern frosted glass effect with backdrop blur
- **Dark/Light Modes** - System-aware theme switching with localStorage persistence
- **Gradient Accents** - Smooth color gradients throughout the interface
- **Responsive Layout** - Mobile-first design that scales from 320px to 4K displays
- **Smooth Animations** - Polished transitions and micro-interactions
- **Accessibility** - Proper semantic HTML and keyboard navigation

---

## 📱 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## 🔧 Development

### Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

### Project Configuration

- **Vite Config** - `vite.config.ts`
- **TypeScript Config** - `tsconfig.json`
- **Tailwind Config** - `tailwind.config.ts`
- **ESLint Config** - `eslint.config.js`

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues or pull requests to improve the player.

---

## 📞 Support

For issues, questions, or suggestions, please open an issue on the repository.

---

**Built with ❤️ for a better media experience**
