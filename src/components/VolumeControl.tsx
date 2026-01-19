import React, { useState, useCallback } from 'react';

interface VolumeControlProps {
 volume: number;
 muted: boolean;
 onVolumeChange: (volume: number) => void;
 onMuteToggle: () => void;
}

// Volume Icons
const VolumeHighIcon = () => (
 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="#fff"><path d="M13 6.037c0-1.724-1.978-2.665-3.28-1.562L5.638 7.933H4c-1.105 0-2 .91-2 2.034v4.066c0 1.123.895 2.034 2 2.034h1.638l4.082 3.458c1.302 1.104 3.28.162 3.28-1.562z" /><path fill-rule="evenodd" d="M14.786 7.658a.99.99 0 0 1 1.414-.014A6.14 6.14 0 0 1 18 12c0 1.662-.655 3.17-1.715 4.27a.99.99 0 0 1-1.414.014a1.03 1.03 0 0 1-.014-1.437A4.1 4.1 0 0 0 16 12a4.1 4.1 0 0 0-1.2-2.904a1.03 1.03 0 0 1-.014-1.438" clip-rule="evenodd" /><path fill-rule="evenodd" d="M17.657 4.811a.99.99 0 0 1 1.414 0A10.22 10.22 0 0 1 22 12c0 2.807-1.12 5.35-2.929 7.189a.99.99 0 0 1-1.414 0a1.03 1.03 0 0 1 0-1.438A8.17 8.17 0 0 0 20 12a8.17 8.17 0 0 0-2.343-5.751a1.03 1.03 0 0 1 0-1.438" clip-rule="evenodd" /></g></svg>
);

const VolumeLowIcon = () => (
 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.5 8.43A5 5 0 0 1 19 12a4.98 4.98 0 0 1-1.43 3.5M14 6.135v11.73a1 1 0 0 1-1.64.768L8 15H6a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h2l4.36-3.633a1 1 0 0 1 1.64.768" /></svg>
);

const VolumeMutedIcon = () => (
 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#fff" d="M5.707 4.293a1 1 0 0 0-1.414 1.414l14 14a1 1 0 0 0 1.414-1.414l-.004-.005C21.57 16.498 22 13.938 22 12a9.97 9.97 0 0 0-2.929-7.071a1 1 0 1 0-1.414 1.414A7.97 7.97 0 0 1 20 12c0 1.752-.403 3.636-1.712 4.873l-1.433-1.433C17.616 14.37 18 13.107 18 12c0-1.678-.69-3.197-1.8-4.285a1 1 0 1 0-1.4 1.428A4 4 0 0 1 16 12c0 .606-.195 1.335-.59 1.996L13 11.586V6.135c0-1.696-1.978-2.622-3.28-1.536L7.698 6.284l-1.99-1.991ZM4 8h.586L13 16.414v1.451c0 1.696-1.978 2.622-3.28 1.536L5.638 16H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2" /></svg>
);

export const VolumeControl: React.FC<VolumeControlProps> = ({
 volume,
 muted,
 onVolumeChange,
 onMuteToggle,
}) => {
 const [previousVolume, setPreviousVolume] = useState(volume);

 const handleMuteClick = useCallback(() => {
  if (!muted && volume > 0) {
   setPreviousVolume(volume);
  }
  onMuteToggle();
 }, [muted, volume, onMuteToggle]);

 const handleSliderChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
  const newVolume = parseFloat(e.target.value);
  onVolumeChange(newVolume);
  if (newVolume > 0) {
   setPreviousVolume(newVolume);
  }
 }, [onVolumeChange]);

 const getVolumeIcon = () => {
  if (muted || volume === 0) return <VolumeMutedIcon />;
  if (volume < 0.5) return <VolumeLowIcon />;
  return <VolumeHighIcon />;
 };

 return (
  <div className="ryp-volume-container">
   <button
    className="ryp-btn"
    onClick={handleMuteClick}
    aria-label={muted ? 'Unmute' : 'Mute'}
   >
    {getVolumeIcon()}
   </button>
   <div className="ryp-volume-slider-wrapper">
    <input
     type="range"
     className="ryp-volume-slider"
     min="0"
     max="1"
     step="0.01"
     value={muted ? 0 : volume}
     onChange={handleSliderChange}
     style={{
      background: `linear-gradient(to right, #fff ${(muted ? 0 : volume) * 100}%, rgba(255,255,255,0.3) ${(muted ? 0 : volume) * 100}%)`,
     }}
     aria-label="Volume"
    />
   </div>
  </div>
 );
};
