import React from 'react';
import type { Subtitle } from '@/hooks/useSubtitles';

interface SubtitleDisplayProps {
  subtitle: Subtitle | null;
  isEnabled: boolean;
  fontSize: 'small' | 'medium' | 'large';
  position: 'bottom' | 'top';
}

const fontSizeMap: Record<SubtitleDisplayProps['fontSize'], string> = {
  small: 'text-sm md:text-base',
  medium: 'text-base md:text-xl',
  large: 'text-xl md:text-2xl',
};

const SubtitleDisplay: React.FC<SubtitleDisplayProps> = ({
  subtitle,
  isEnabled,
  fontSize,
  position,
}) => {
  if (!subtitle || !isEnabled) return null;

  return (
    <div
      className={`
        absolute left-1/2 -translate-x-1/2 px-4 py-2 max-w-[90%]
        text-center pointer-events-none transition-all duration-200
        ${position === 'bottom' ? 'bottom-20' : 'top-4'}
      `}
    >
      <div
        className={`
          inline-block px-4 py-2 rounded-lg
          bg-background/90 backdrop-blur-sm
          ${fontSizeMap[fontSize]}
          font-medium text-foreground
          shadow-lg
        `}
        style={{
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)',
        }}
      >
        {subtitle.text.split('\n').map((line, i) => (
          <React.Fragment key={i}>
            {line}
            {i < subtitle.text.split('\n').length - 1 && <br />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default SubtitleDisplay;
