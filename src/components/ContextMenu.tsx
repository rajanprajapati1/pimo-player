import React, { useEffect, useRef } from 'react';

interface ContextMenuProps {
 isOpen: boolean;
 position: { x: number; y: number };
 onClose: () => void;
 isLooping: boolean;
 onToggleLoop: () => void;
 onCopyUrl: () => void;
 onCopyUrlAtTime: () => void;
 onCopyEmbedCode: () => void;
 onPictureInPicture: () => void;
}

// Icons - Exact YouTube style
const LoopIcon = () => (
 <svg viewBox="0 0 24 24">
  <path d="M21 13c0 4.97-4.03 9-9 9-1.5 0-2.91-.37-4.15-1.02l1.26-1.79C10.02 19.71 10.99 20 12 20c3.87 0 7-3.13 7-7h-3l4-5 4 5h-3zM3 11c0-4.97 4.03-9 9-9 1.5 0 2.91.37 4.15 1.02l-1.26 1.79C13.98 4.29 13.01 4 12 4c-3.87 0-7 3.13-7 7h3l-4 5-4-5h3z" />
 </svg>
);

const CheckIcon = () => (
 <svg viewBox="0 0 24 24">
  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
 </svg>
);

const MiniPlayerIcon = () => (
 <svg viewBox="0 0 24 24">
  <path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zm-10-7h9v6h-9z" />
 </svg>
);

const LinkIcon = () => (
 <svg viewBox="0 0 24 24">
  <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" />
 </svg>
);

const CodeIcon = () => (
 <svg viewBox="0 0 24 24">
  <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z" />
 </svg>
);

const CopyDebugIcon = () => (
 <svg viewBox="0 0 24 24">
  <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
 </svg>
);

const TroubleshootIcon = () => (
 <svg viewBox="0 0 24 24">
  <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z" />
 </svg>
);

const StatsIcon = () => (
 <svg viewBox="0 0 24 24">
  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
 </svg>
);

export const ContextMenu: React.FC<ContextMenuProps> = ({
 isOpen,
 position,
 onClose,
 isLooping,
 onToggleLoop,
 onCopyUrl,
 onCopyUrlAtTime,
 onCopyEmbedCode,
 onPictureInPicture,
}) => {
 const menuRef = useRef<HTMLDivElement>(null);

 useEffect(() => {
  const handleClickOutside = (e: MouseEvent) => {
   if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
    onClose();
   }
  };

  const handleEscape = (e: KeyboardEvent) => {
   if (e.key === 'Escape') {
    onClose();
   }
  };

  if (isOpen) {
   document.addEventListener('click', handleClickOutside);
   document.addEventListener('keydown', handleEscape);
  }

  return () => {
   document.removeEventListener('click', handleClickOutside);
   document.removeEventListener('keydown', handleEscape);
  };
 }, [isOpen, onClose]);

 if (!isOpen) return null;

 // Calculate position to keep menu in viewport
 const menuStyle = {
  left: Math.min(position.x, window.innerWidth - 200),
  top: Math.min(position.y, window.innerHeight - 350),
 };

 return (
  <div
   ref={menuRef}
   className={`ryp-context-menu ${isOpen ? 'ryp-open' : ''}`}
   style={menuStyle}
  >
   {/* Loop */}
   <div className="ryp-context-item" onClick={() => { onToggleLoop(); onClose(); }}>
    {isLooping ? <CheckIcon /> : <LoopIcon />}
    <span>Loop</span>
   </div>

   <div className="ryp-context-divider" />

   {/* Miniplayer */}
   <div className="ryp-context-item" onClick={() => { onPictureInPicture(); onClose(); }}>
    <MiniPlayerIcon />
    <span>Miniplayer</span>
   </div>

   <div className="ryp-context-divider" />

   {/* Copy video URL */}
   <div className="ryp-context-item" onClick={() => { onCopyUrl(); onClose(); }}>
    <LinkIcon />
    <span>Copy video URL</span>
   </div>

   {/* Copy video URL at current time */}
   <div className="ryp-context-item" onClick={() => { onCopyUrlAtTime(); onClose(); }}>
    <LinkIcon />
    <span>Copy video URL at current time</span>
   </div>

   {/* Copy embed code */}
   <div className="ryp-context-item" onClick={() => { onCopyEmbedCode(); onClose(); }}>
    <CodeIcon />
    <span>Copy embed code</span>
   </div>

   <div className="ryp-context-divider" />

   {/* Copy debug info */}
   <div className="ryp-context-item" onClick={onClose}>
    <CopyDebugIcon />
    <span>Copy debug info</span>
   </div>

   {/* Troubleshoot playback issue */}
   <div className="ryp-context-item" onClick={onClose}>
    <TroubleshootIcon />
    <span>Troubleshoot playback issue</span>
   </div>

   {/* Stats for nerds */}
   <div className="ryp-context-item" onClick={onClose}>
    <StatsIcon />
    <span>Stats for nerds</span>
   </div>
  </div>
 );
};
