import { useState, useCallback, useEffect } from 'react';

export interface RecentlyPlayedItem {
  id: string;
  name: string;
  type: 'video' | 'audio';
  lastPlayed: number;
  duration?: number;
  lastPosition?: number;
}

const STORAGE_KEY = 'media-player-recently-played';
const MAX_ITEMS = 50;

export const useRecentlyPlayed = () => {
  const [recentlyPlayed, setRecentlyPlayed] = useState<RecentlyPlayedItem[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as RecentlyPlayedItem[];
        setRecentlyPlayed(parsed);
      }
    } catch (err) {
      console.error('Failed to load recently played:', err);
    }
  }, []);

  // Save to localStorage
  const saveToStorage = useCallback((items: RecentlyPlayedItem[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (err) {
      console.error('Failed to save recently played:', err);
    }
  }, []);

  // Add or update item
  const addToRecent = useCallback(
    (item: Omit<RecentlyPlayedItem, 'lastPlayed'>) => {
      setRecentlyPlayed((prev) => {
        // Remove existing entry if present
        const filtered = prev.filter((i) => i.id !== item.id);
        
        // Add to beginning with current timestamp
        const updated = [
          { ...item, lastPlayed: Date.now() },
          ...filtered,
        ].slice(0, MAX_ITEMS);

        saveToStorage(updated);
        return updated;
      });
    },
    [saveToStorage]
  );

  // Update last position (for resume functionality)
  const updatePosition = useCallback(
    (id: string, position: number, duration: number) => {
      setRecentlyPlayed((prev) => {
        const updated = prev.map((item) =>
          item.id === id
            ? { ...item, lastPosition: position, duration }
            : item
        );
        saveToStorage(updated);
        return updated;
      });
    },
    [saveToStorage]
  );

  // Remove item
  const removeFromRecent = useCallback(
    (id: string) => {
      setRecentlyPlayed((prev) => {
        const updated = prev.filter((i) => i.id !== id);
        saveToStorage(updated);
        return updated;
      });
    },
    [saveToStorage]
  );

  // Clear all
  const clearHistory = useCallback(() => {
    setRecentlyPlayed([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // Get resume position for a file
  const getResumePosition = useCallback(
    (name: string): number | undefined => {
      const item = recentlyPlayed.find((i) => i.name === name);
      if (item && item.lastPosition && item.duration) {
        // Only suggest resume if not near end (>95% complete)
        if (item.lastPosition / item.duration < 0.95) {
          return item.lastPosition;
        }
      }
      return undefined;
    },
    [recentlyPlayed]
  );

  return {
    recentlyPlayed,
    addToRecent,
    updatePosition,
    removeFromRecent,
    clearHistory,
    getResumePosition,
  };
};
