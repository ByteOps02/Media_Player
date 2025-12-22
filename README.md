# Media Player

A modern, cross-platform media player built with Electron, React, and TypeScript.

![Media Player Screenshot](https://i.imgur.com/your-screenshot.png) 
*Note: Add a real screenshot URL here.*

<p align="center">
  <a href="https://www.electronjs.org/"><img src="https://img.shields.io/badge/Electron-30+-47848F?style=for-the-badge&logo=electron&logoColor=white" alt="Electron"></a>
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React"></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"></a>
  <a href="https://vitejs.dev/"><img src="https://img.shields.io/badge/Vite-5.0+-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite"></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind-3.4+-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS"></a>
</p>

## Features

*   **Wide Format Support**: Play all your favorite video and audio formats (MP4, MKV, MP3, FLAC, etc.).
*   **High-Quality Playback**: Smooth video and audio rendering.
*   **Audio Equalizer**: Fine-tune your audio with a 10-band equalizer and presets.
*   **Customizable Subtitles**: Full support for SRT and VTT subtitle files.
*   **Playlist & Library**: Organize your media with a simple and intuitive playlist.
*   **Advanced Playback Controls**: Adjust speed, loop sections, and more.
*   **Modern UI**: A clean, modern interface with light and dark themes.
*   **Cross-Platform**: Runs on Windows, macOS, and Linux.

## How to Use

- **Opening Files**: 
    - **Drag and Drop**: Drag your media files (or folders) directly into the application window.
    - **Browse**: Click the "Open File" button to select files from your computer.
- **Playback**: Use the on-screen controls to play, pause, and seek. 
- **Volume**: Adjust the volume using the slider or your mouse wheel.
- **Playlist**: Click on a file in the playlist to switch between media.
- **Settings**: Access the equalizer, playback speed, and subtitle settings from the settings menu.

## Tech Stack

*   **Framework**: [Electron](https://www.electronjs.org/) for the desktop application shell.
*   **Frontend**: [React](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/) for the user interface.
*   **Bundler**: [Vite](https://vitejs.dev/) for fast development and builds.
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) for a utility-first styling workflow.
*   **UI Components**: [shadcn/ui](https://ui.shadcn.com/) for accessible and reusable components.

## Project Structure

```
/
├── electron/              # Electron main and preload scripts
├── public/                # Static assets
├── src/
│   ├── components/        # React components
│   │   ├── player/        # Core media player components
│   │   └── ui/            # Reusable UI elements from shadcn/ui
│   ├── context/           # React context providers
│   ├── hooks/             # Custom React hooks for business logic
│   ├── lib/               # Utility functions
│   ├── pages/             # Top-level page components
│   ├── App.tsx            # Main application component
│   └── main.tsx           # React entry point
├── package.json           # Project configuration and scripts
└── vite.config.ts         # Vite configuration
```

## Getting Started

### For Users

1.  Head over to the [**Releases**](https://github.com/your-username/your-repo/releases) page.
2.  Download the latest installer for your operating system.
3.  Run the installer and launch the application.

### For Developers

To get the project up and running on your local machine for development and testing purposes, follow these steps.

**Prerequisites:**

*   [Node.js](https://nodejs.org/) (v18 or later)
*   [Git](https://git-scm.com/)

**Installation:**

1.  Clone the repository:
    ```sh
    git clone https://github.com/ByteOps02/Media_Player.git
    cd your-repo
    ```

2.  Install the dependencies:
    ```sh
    npm install
    ```

3.  Run the development server:
    ```sh
    npm run dev
    ```
    This will start the application in development mode with hot-reloading enabled.

**Available Scripts:**

*   `npm run dev`: Starts the app in development mode.
*   `npm run build`: Builds the app for production.
*   `npm run electron:build`: Packages the app into a distributable format.
*   `npm run lint`: Lints the codebase for errors.
*   `npm test`: Runs the test suite.

## Contributing

Contributions are welcome! If you have a feature request, bug report, or want to contribute to the code, please feel free to open an issue or a pull request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request
