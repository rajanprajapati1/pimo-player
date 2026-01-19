import React from 'react';
import type { PlaylistItem } from '../types';
import { formatTime } from '../utils';

interface PlaylistPanelProps {
 isOpen: boolean;
 onClose: () => void;
 items: PlaylistItem[];
 currentIndex: number;
 onItemClick: (index: number) => void;
 title?: string;
 autoPlay: boolean;
 onAutoPlayChange: (enabled: boolean) => void;
}

// Icons
const CloseIcon = () => (
 <svg viewBox="0 0 24 24">
  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
 </svg>
);

export const PlaylistPanel: React.FC<PlaylistPanelProps> = ({
 isOpen,
 onClose,
 items,
 currentIndex,
 onItemClick,
 title = 'Playlist',
 autoPlay,
 onAutoPlayChange,
}) => {
 if (items.length === 0) return null;

 return (
  <div className={`ryp-playlist-panel ${isOpen ? 'ryp-open' : ''}`}>
   <div className="ryp-playlist-header">
    <div>
     <div className="ryp-playlist-title">{title}</div>
     <div className="ryp-playlist-subtitle">
      {currentIndex + 1} / {items.length}
     </div>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
     <div
      className={`ryp-toggle ${autoPlay ? 'ryp-active' : ''}`}
      onClick={() => onAutoPlayChange(!autoPlay)}
      title="Autoplay"
     />
     <div className="ryp-playlist-close" onClick={onClose}>
      <CloseIcon />
     </div>
    </div>
   </div>

   <div className="ryp-playlist-items">
    {items.map((item, index) => (
     <div
      key={item.id || index}
      className={`ryp-playlist-item ${index === currentIndex ? 'ryp-active' : ''}`}
      onClick={() => onItemClick(index)}
     >
      <div className="ryp-playlist-thumb">
       {item.thumbnail ? (
        <img src={item.thumbnail} alt={item.title} />
       ) : (
        <div style={{
         width: '100%',
         height: '100%',
         background: '#333',
         display: 'flex',
         alignItems: 'center',
         justifyContent: 'center',
         fontSize: '12px',
         color: '#888'
        }}>
         No Thumb
        </div>
       )}
       {item.duration && (
        <span className="ryp-playlist-thumb-duration">
         {formatTime(item.duration)}
        </span>
       )}
      </div>
      <div className="ryp-playlist-info">
       <div className="ryp-playlist-item-title">{item.title}</div>
       {item.channel && (
        <div className="ryp-playlist-item-channel">{item.channel}</div>
       )}
      </div>
     </div>
    ))}
   </div>
  </div>
 );
};
