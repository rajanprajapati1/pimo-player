import React, { useState, useEffect, useRef } from 'react';
import { PLAYBACK_SPEEDS } from '../types';
import type { PlaybackSpeed } from '../types';

interface SettingsMenuProps {
 isOpen: boolean;
 onClose: () => void;
 playbackSpeed: number;
 onSpeedChange: (speed: number) => void;
 quality: string;
 qualities: string[];
 onQualityChange: (quality: string) => void;
 ambientMode: boolean;
 onAmbientModeChange: (enabled: boolean) => void;
 loop: boolean;
 onLoopChange: (enabled: boolean) => void;
}

// Icons
const BackIcon = () => (
 <svg viewBox="0 0 24 24">
  <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
 </svg>
);

const SpeedIcon = () => (
 <svg viewBox="0 0 24 24">
  <path d="M10 8v8l6-4-6-4zm6.76-2.76L18 4v5h-2V5.82l-.74.74C13.9 7.9 12.5 8.5 11 8.5s-2.9-.6-4.26-1.94L6 5.82V9H4V4h5v2H5.82l.74.74C7.9 8.1 9.5 9 11 9s3.1-.9 4.26-2.24l.5-.52zM18 20h-5v-2h3.18l-.74-.74C14.1 15.9 12.5 15.3 11 15.5s-2.9.6-4.26 1.94L6 18.18V15H4v5h5v-2H5.82l.74-.74C7.9 15.9 9.5 15 11 15s3.1.9 4.26 2.24l.5.52V15h2v5z" />
 </svg>
);

const AmbientIcon = () => (
 <svg viewBox="0 0 24 24">
  <path d="M12 3a9 9 0 109 9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-3.03 0-5.5-2.47-5.5-5.5 0-1.82.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z" />
 </svg>
);

const LoopIcon = () => (
 <svg viewBox="0 0 24 24">
  <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z" />
 </svg>
);

const CheckIcon = () => (
 <svg viewBox="0 0 24 24">
  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
 </svg>
);

const ChevronRightIcon = () => (
 <svg viewBox="0 0 24 24">
  <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
 </svg>
);

type SettingsView = 'main' | 'speed' | 'quality';

export const SettingsMenu: React.FC<SettingsMenuProps> = ({
 isOpen,
 onClose,
 playbackSpeed,
 onSpeedChange,
 quality,
 qualities,
 onQualityChange,
 ambientMode,
 onAmbientModeChange,
 loop,
 onLoopChange,
}) => {
 const [view, setView] = useState<SettingsView>('main');
 const menuRef = useRef<HTMLDivElement>(null);

 // Close on click outside or Escape key
 useEffect(() => {
  const handleClickOutside = (e: MouseEvent) => {
   if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
    onClose();
    setView('main');
   }
  };

  const handleEscape = (e: KeyboardEvent) => {
   if (e.key === 'Escape') {
    onClose();
    setView('main');
   }
  };

  if (isOpen) {
   // Use setTimeout to avoid closing immediately when opening
   setTimeout(() => {
    document.addEventListener('click', handleClickOutside);
   }, 0);
   document.addEventListener('keydown', handleEscape);
  }

  return () => {
   document.removeEventListener('click', handleClickOutside);
   document.removeEventListener('keydown', handleEscape);
  };
 }, [isOpen, onClose]);

 const handleSpeedClick = (speed: PlaybackSpeed) => {
  onSpeedChange(speed);
  setView('main');
 };

 const handleQualityClick = (q: string) => {
  onQualityChange(q);
  setView('main');
 };

 const renderMainView = () => (
  <>
   {/* Loop */}
   <div className="ryp-settings-item" onClick={() => onLoopChange(!loop)}>
    <div className="ryp-settings-item-left">
     <LoopIcon />
     <span className="ryp-settings-item-label">Loop</span>
    </div>
    <div className={`ryp-toggle ${loop ? 'ryp-active' : ''}`} />
   </div>

   {/* Ambient Mode */}
   <div className="ryp-settings-item" onClick={() => onAmbientModeChange(!ambientMode)}>
    <div className="ryp-settings-item-left">
     <AmbientIcon />
     <span className="ryp-settings-item-label">Ambient mode</span>
    </div>
    <div className={`ryp-toggle ${ambientMode ? 'ryp-active' : ''}`} />
   </div>

   {/* Playback Speed */}
   <div className="ryp-settings-item" onClick={() => setView('speed')}>
    <div className="ryp-settings-item-left">
     <SpeedIcon />
     <span className="ryp-settings-item-label">Playback speed</span>
    </div>
    <div className="ryp-settings-item-value">
     {playbackSpeed === 1 ? 'Normal' : `${playbackSpeed}x`}
     <ChevronRightIcon />
    </div>
   </div>

   {/* Quality */}
   {/* <div className="ryp-settings-item" onClick={() => setView('quality')}>
    <div className="ryp-settings-item-left">
     <QualityIcon />
     <span className="ryp-settings-item-label">Quality</span>
    </div>
    <div className="ryp-settings-item-value">
     {quality}
     <ChevronRightIcon />
    </div>
   </div> */}
  </>
 );

 const renderSpeedView = () => (
  <>
   <div className="ryp-settings-header" onClick={() => setView('main')}>
    <BackIcon />
    <span className="ryp-settings-title">Playback speed</span>
   </div>
   <div className="ryp-speed-options">
    {PLAYBACK_SPEEDS.map((speed) => (
     <div
      key={speed}
      className={`ryp-speed-option ${playbackSpeed === speed ? 'ryp-active' : ''}`}
      onClick={() => handleSpeedClick(speed)}
     >
      <span>{speed === 1 ? 'Normal' : `${speed}`}</span>
      {playbackSpeed === speed && <CheckIcon />}
     </div>
    ))}
   </div>
  </>
 );

 const renderQualityView = () => (
  <>
   <div className="ryp-settings-header" onClick={() => setView('main')}>
    <BackIcon />
    <span className="ryp-settings-title">Quality</span>
   </div>
   <div className="ryp-speed-options">
    {qualities.map((q) => (
     <div
      key={q}
      className={`ryp-speed-option ${quality === q ? 'ryp-active' : ''}`}
      onClick={() => handleQualityClick(q)}
     >
      <span>{q}</span>
      {quality === q && <CheckIcon />}
     </div>
    ))}
   </div>
  </>
 );

 if (!isOpen) return null;

 return (
  <div ref={menuRef} className={`ryp-settings-menu ${isOpen ? 'ryp-open' : ''}`}>
   {view === 'main' && renderMainView()}
   {view === 'speed' && renderSpeedView()}
   {view === 'quality' && renderQualityView()}
  </div>
 );
};
