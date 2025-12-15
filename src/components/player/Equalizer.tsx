import React from 'react';
import { X, RotateCcw, Sliders } from 'lucide-react';
import type { EqualizerBand, EqualizerPreset } from '@/hooks/useEqualizer';

interface EqualizerProps {
  bands: EqualizerBand[];
  isEnabled: boolean;
  currentPreset: string;
  presets: EqualizerPreset[];
  onBandChange: (index: number, gain: number) => void;
  onPresetChange: (preset: EqualizerPreset) => void;
  onReset: () => void;
  onToggle: () => void;
  onClose: () => void;
}

const Equalizer: React.FC<EqualizerProps> = ({
  bands,
  isEnabled,
  currentPreset,
  presets,
  onBandChange,
  onPresetChange,
  onReset,
  onToggle,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl mx-4 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <Sliders className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Equalizer</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onToggle}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isEnabled
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-muted-foreground'
              }`}
            >
              {isEnabled ? 'ON' : 'OFF'}
            </button>
            <button
              onClick={onReset}
              className="control-btn text-muted-foreground hover:text-foreground"
              title="Reset"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="control-btn text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Presets */}
        <div className="px-6 py-4 border-b border-border">
          <div className="flex flex-wrap gap-2">
            {presets.map((preset) => (
              <button
                key={preset.name}
                onClick={() => onPresetChange(preset)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  currentPreset === preset.name
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* Bands */}
        <div className="p-6">
          <div className="flex justify-between items-end gap-2 h-48">
            {bands.map((band, index) => (
              <div key={band.frequency} className="flex flex-col items-center flex-1">
                {/* Gain value */}
                <span className="text-xs text-muted-foreground mb-2">
                  {band.gain > 0 ? '+' : ''}{band.gain.toFixed(0)}dB
                </span>
                
                {/* Slider */}
                <div className="relative h-32 w-full flex justify-center">
                  <input
                    type="range"
                    min="-12"
                    max="12"
                    step="0.5"
                    value={band.gain}
                    onChange={(e) => onBandChange(index, parseFloat(e.target.value))}
                    className="absolute h-24 w-6 cursor-pointer appearance-none bg-transparent
                      [writing-mode:vertical-lr] [direction:rtl]
                      [&::-webkit-slider-runnable-track]:w-2 [&::-webkit-slider-runnable-track]:rounded-full
                      [&::-webkit-slider-runnable-track]:bg-secondary
                      [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                      [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary
                      [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-pointer
                      [&::-moz-range-track]:w-2 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-secondary
                      [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full
                      [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:border-0"
                    style={{
                      transform: 'rotate(180deg)',
                    }}
                    disabled={!isEnabled}
                  />
                </div>
                
                {/* Frequency label */}
                <span className="text-xs text-muted-foreground mt-2">{band.label}</span>
              </div>
            ))}
          </div>
          
          {/* Zero line indicator */}
          <div className="relative -mt-[5.5rem] mb-12 pointer-events-none">
            <div className="border-t border-dashed border-muted-foreground/30" />
            <span className="absolute left-0 -top-2 text-xs text-muted-foreground/50">0dB</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Equalizer;
