import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
  };

  return (
    <div className="flex items-center gap-1 p-1 rounded-lg glass bg-card/50 border border-border/30">
      <button
        onClick={() => handleThemeChange('light')}
        className={`
          flex items-center justify-center w-7 h-7 rounded-md transition-all duration-200
          ${theme === 'light'
            ? 'bg-primary text-primary-foreground shadow-lg scale-110'
            : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
          }
        `}
        title="Light mode"
      >
        <Sun className="w-4 h-4" />
      </button>

      <button
        onClick={() => handleThemeChange('dark')}
        className={`
          flex items-center justify-center w-7 h-7 rounded-md transition-all duration-200
          ${theme === 'dark'
            ? 'bg-primary text-primary-foreground shadow-lg scale-110'
            : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
          }
        `}
        title="Dark mode"
      >
        <Moon className="w-4 h-4" />
      </button>

      <button
        onClick={() => handleThemeChange('system')}
        className={`
          flex items-center justify-center w-7 h-7 rounded-md transition-all duration-200
          ${theme === 'system'
            ? 'bg-primary text-primary-foreground shadow-lg scale-110'
            : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
          }
        `}
        title="System default"
      >
        <Monitor className="w-4 h-4" />
      </button>
    </div>
  );
};

export default ThemeToggle;
