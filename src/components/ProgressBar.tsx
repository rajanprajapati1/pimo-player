import React, { useRef, useState, useCallback } from 'react';
import { formatTime, getBufferedPercentage } from '../utils';

interface ProgressBarProps {
 currentTime: number;
 duration: number;
 buffered: TimeRanges | null;
 onSeek: (time: number) => void;
 previewThumbnails?: string[];
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
 currentTime,
 duration,
 buffered,
 onSeek,
 previewThumbnails,
}) => {
 const progressRef = useRef<HTMLDivElement>(null);
 const [hoverTime, setHoverTime] = useState<number | null>(null);
 const [hoverPosition, setHoverPosition] = useState(0);
 const [isDragging, setIsDragging] = useState(false);

 const playedPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
 const bufferedPercent = getBufferedPercentage(buffered, currentTime, duration);

 const getTimeFromPosition = useCallback((clientX: number) => {
  const rect = progressRef.current?.getBoundingClientRect();
  if (!rect || !duration) return 0;
  const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  return percent * duration;
 }, [duration]);

 const handleMouseMove = useCallback((e: React.MouseEvent) => {
  const time = getTimeFromPosition(e.clientX);
  setHoverTime(time);
  const rect = progressRef.current?.getBoundingClientRect();
  if (rect) {
   setHoverPosition(Math.max(80, Math.min(rect.width - 80, e.clientX - rect.left)));
  }
  if (isDragging) {
   onSeek(time);
  }
 }, [getTimeFromPosition, isDragging, onSeek]);

 const handleMouseDown = useCallback((e: React.MouseEvent) => {
  setIsDragging(true);
  const time = getTimeFromPosition(e.clientX);
  onSeek(time);

  const handleMouseUp = () => {
   setIsDragging(false);
   document.removeEventListener('mouseup', handleMouseUp);
  };
  document.addEventListener('mouseup', handleMouseUp);
 }, [getTimeFromPosition, onSeek]);

 const handleMouseLeave = useCallback(() => {
  if (!isDragging) {
   setHoverTime(null);
  }
 }, [isDragging]);

 // Get preview thumbnail based on hover time
 const getPreviewThumbnail = () => {
  if (!previewThumbnails?.length || hoverTime === null) return null;
  const index = Math.floor((hoverTime / duration) * previewThumbnails.length);
  return previewThumbnails[Math.min(index, previewThumbnails.length - 1)];
 };

 const previewThumbnail = getPreviewThumbnail();

 return (
  <div
   className="ryp-progress-container"
   ref={progressRef}
   onMouseMove={handleMouseMove}
   onMouseDown={handleMouseDown}
   onMouseLeave={handleMouseLeave}
   data-pimo-progress=""
   role="slider"
   aria-label="Video progress"
   aria-valuemin={0}
   aria-valuemax={Math.round(duration)}
   aria-valuenow={Math.round(currentTime)}
  >
   {/* Preview Thumbnail */}
   {hoverTime !== null && (
    <div
     className="ryp-preview-thumbnail"
     style={{ left: hoverPosition }}
     data-pimo-preview=""
    >
     {previewThumbnail && (
      <img src={previewThumbnail} alt="Preview" data-pimo-preview-image="" />
     )}
     <div className="ryp-preview-time" data-pimo-preview-time="">{formatTime(hoverTime)}</div>
    </div>
   )}

   <div className="ryp-progress-bar" data-pimo-progress-bar="">
    {/* Buffered */}
    <div
     className="ryp-progress-buffered"
     style={{ width: `${bufferedPercent}%` }}
     data-pimo-buffered=""
    />

    {/* Played */}
    <div
     className="ryp-progress-played"
     style={{ width: `${playedPercent}%` }}
     data-pimo-played=""
    />

    {/* Handle */}
    <div
     className="ryp-progress-handle"
     style={{ left: `${playedPercent}%` }}
     data-pimo-handle=""
    />
   </div>
  </div>
 );
};
