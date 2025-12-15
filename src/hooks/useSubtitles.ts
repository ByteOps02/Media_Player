import { useState, useCallback, useEffect, useRef } from 'react';

export interface Subtitle {
  id: number;
  start: number;
  end: number;
  text: string;
}

export interface SubtitleState {
  subtitles: Subtitle[];
  currentSubtitle: Subtitle | null;
  isEnabled: boolean;
  fontSize: 'small' | 'medium' | 'large';
  position: 'bottom' | 'top';
}

// Parse SRT format
const parseSRT = (content: string): Subtitle[] => {
  const subtitles: Subtitle[] = [];
  const blocks = content.trim().split(/\n\n+/);

  blocks.forEach((block) => {
    const lines = block.split('\n');
    if (lines.length >= 3) {
      const idLine = lines[0].trim();
      const timeLine = lines[1].trim();
      const textLines = lines.slice(2).join('\n');

      const timeMatch = timeLine.match(
        /(\d{2}):(\d{2}):(\d{2}),(\d{3})\s*-->\s*(\d{2}):(\d{2}):(\d{2}),(\d{3})/
      );

      if (timeMatch) {
        const start =
          parseInt(timeMatch[1]) * 3600 +
          parseInt(timeMatch[2]) * 60 +
          parseInt(timeMatch[3]) +
          parseInt(timeMatch[4]) / 1000;

        const end =
          parseInt(timeMatch[5]) * 3600 +
          parseInt(timeMatch[6]) * 60 +
          parseInt(timeMatch[7]) +
          parseInt(timeMatch[8]) / 1000;

        subtitles.push({
          id: parseInt(idLine) || subtitles.length + 1,
          start,
          end,
          text: textLines.replace(/<[^>]*>/g, ''), // Strip HTML tags
        });
      }
    }
  });

  return subtitles;
};

// Parse VTT format
const parseVTT = (content: string): Subtitle[] => {
  const subtitles: Subtitle[] = [];
  const lines = content.trim().split('\n');
  
  let i = 0;
  // Skip WEBVTT header
  while (i < lines.length && !lines[i].includes('-->')) {
    i++;
  }

  let id = 1;
  while (i < lines.length) {
    const timeLine = lines[i].trim();
    const timeMatch = timeLine.match(
      /(\d{2}):(\d{2}):(\d{2})\.(\d{3})\s*-->\s*(\d{2}):(\d{2}):(\d{2})\.(\d{3})/
    ) || timeLine.match(
      /(\d{2}):(\d{2})\.(\d{3})\s*-->\s*(\d{2}):(\d{2})\.(\d{3})/
    );

    if (timeMatch) {
      let start: number, end: number;
      
      if (timeMatch.length === 9) {
        start = parseInt(timeMatch[1]) * 3600 + parseInt(timeMatch[2]) * 60 + parseInt(timeMatch[3]) + parseInt(timeMatch[4]) / 1000;
        end = parseInt(timeMatch[5]) * 3600 + parseInt(timeMatch[6]) * 60 + parseInt(timeMatch[7]) + parseInt(timeMatch[8]) / 1000;
      } else {
        start = parseInt(timeMatch[1]) * 60 + parseInt(timeMatch[2]) + parseInt(timeMatch[3]) / 1000;
        end = parseInt(timeMatch[4]) * 60 + parseInt(timeMatch[5]) + parseInt(timeMatch[6]) / 1000;
      }

      i++;
      const textLines: string[] = [];
      while (i < lines.length && lines[i].trim() !== '' && !lines[i].includes('-->')) {
        textLines.push(lines[i].trim());
        i++;
      }

      if (textLines.length > 0) {
        subtitles.push({
          id: id++,
          start,
          end,
          text: textLines.join('\n').replace(/<[^>]*>/g, ''),
        });
      }
    } else {
      i++;
    }
  }

  return subtitles;
};

export const useSubtitles = (currentTime: number) => {
  const [state, setState] = useState<SubtitleState>({
    subtitles: [],
    currentSubtitle: null,
    isEnabled: true,
    fontSize: 'medium',
    position: 'bottom',
  });

  // Load subtitle file
  const loadSubtitle = useCallback(async (file: File) => {
    const content = await file.text();
    const ext = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
    
    let subtitles: Subtitle[] = [];
    
    if (ext === '.srt') {
      subtitles = parseSRT(content);
    } else if (ext === '.vtt') {
      subtitles = parseVTT(content);
    }

    setState((prev) => ({
      ...prev,
      subtitles,
      currentSubtitle: null,
    }));
  }, []);

  // Clear subtitles
  const clearSubtitles = useCallback(() => {
    setState((prev) => ({
      ...prev,
      subtitles: [],
      currentSubtitle: null,
    }));
  }, []);

  // Toggle subtitle visibility
  const toggleSubtitles = useCallback(() => {
    setState((prev) => ({ ...prev, isEnabled: !prev.isEnabled }));
  }, []);

  // Set font size
  const setFontSize = useCallback((fontSize: 'small' | 'medium' | 'large') => {
    setState((prev) => ({ ...prev, fontSize }));
  }, []);

  // Set position
  const setPosition = useCallback((position: 'bottom' | 'top') => {
    setState((prev) => ({ ...prev, position }));
  }, []);

  // Update current subtitle based on time
  useEffect(() => {
    if (state.subtitles.length === 0) {
      if (state.currentSubtitle !== null) {
        setState((prev) => ({ ...prev, currentSubtitle: null }));
      }
      return;
    }

    const current = state.subtitles.find(
      (sub) => currentTime >= sub.start && currentTime <= sub.end
    );

    if (current?.id !== state.currentSubtitle?.id) {
      setState((prev) => ({ ...prev, currentSubtitle: current || null }));
    }
  }, [currentTime, state.subtitles, state.currentSubtitle?.id]);

  return {
    ...state,
    loadSubtitle,
    clearSubtitles,
    toggleSubtitles,
    setFontSize,
    setPosition,
  };
};
