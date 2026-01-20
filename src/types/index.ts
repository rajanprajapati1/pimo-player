// Video Player Types

export interface VideoSource {
 src: string;
 type?: string;
 quality?: string;
}

export interface PlaylistItem {
 id: string;
 src: string;
 title: string;
 thumbnail?: string;
 duration?: number;
 channel?: string;
}

export interface VideoPlayerProps {
 /** Video source URL or array of sources for quality switching */
 src: string | VideoSource[];
 /** Poster image URL */
 poster?: string;
 /** Auto-play video on load */
 autoPlay?: boolean;
 /** Loop video playback */
 loop?: boolean;
 /** Start muted */
 muted?: boolean;
 /** Playlist items for queue panel */
 playlist?: PlaylistItem[];
 /** Current playlist index */
 currentIndex?: number;
 /** Preview thumbnails VTT file or array */
 previewThumbnails?: string | string[];
 /** Available quality options */
 qualities?: string[];
 /** Theme: 'dark' | 'light' */
 theme?: 'dark' | 'light';
 /** Enable keyboard shortcuts */
 keyboard?: boolean;
 /** Custom class name */
 className?: string;
 /** Width of player */
 width?: string | number;
 /** Height of player */
 height?: string | number;
 /** 
  * Aspect ratio of the player. Supports:
  * - '16:9' (YouTube, standard)
  * - '9:16' (TikTok, Instagram Reels, vertical)
  * - '1:1' (Instagram square)
  * - '4:5' (Instagram portrait)
  * - '4:3' (Traditional TV)
  * - '21:9' (Ultrawide/Cinema)
  * - 'auto' (Natural video aspect ratio)
  * - Custom string like '3:2'
  */
 aspectRatio?: '16:9' | '9:16' | '1:1' | '4:5' | '4:3' | '21:9' | 'auto' | string;
 /** Show controls */
 controls?: boolean;
 /** Play inline on mobile (prevents fullscreen on iOS) */
 playsInline?: boolean;
 /** Control visibility options */
 controlsConfig?: ControlsConfig;
 /** Callback when time updates */
 onTimeUpdate?: (currentTime: number) => void;
 /** Callback when video ends */
 onEnded?: () => void;
 /** Callback when video plays */
 onPlay?: () => void;
 /** Callback when video pauses */
 onPause?: () => void;
 /** Callback when volume changes */
 onVolumeChange?: (volume: number, muted: boolean) => void;
 /** Callback when quality changes */
 onQualityChange?: (quality: string) => void;
 /** Callback when fullscreen changes */
 onFullscreenChange?: (isFullscreen: boolean) => void;
 /** Callback when playlist item changes */
 onPlaylistItemChange?: (index: number, item: PlaylistItem) => void;
}

export interface ControlsConfig {
 playPause?: boolean;
 progress?: boolean;
 volume?: boolean;
 time?: boolean;
 settings?: boolean;
 fullscreen?: boolean;
 pictureInPicture?: boolean;
 playbackSpeed?: boolean;
 quality?: boolean;
 ambient?: boolean;
 annotations?: boolean;
 sleepTimer?: boolean;
 playlist?: boolean;
 miniPlayer?: boolean;
 theaterMode?: boolean;
}

export interface SettingsMenuProps {
 isOpen: boolean;
 onClose: () => void;
 playbackSpeed: number;
 onSpeedChange: (speed: number) => void;
 quality: string;
 qualities: string[];
 onQualityChange: (quality: string) => void;
 ambientMode: boolean;
 onAmbientModeChange: (enabled: boolean) => void;
 annotations: boolean;
 onAnnotationsChange: (enabled: boolean) => void;
 sleepTimer: number | null;
 onSleepTimerChange: (minutes: number | null) => void;
}

export interface ContextMenuProps {
 isOpen: boolean;
 position: { x: number; y: number };
 onClose: () => void;
 isLooping: boolean;
 onToggleLoop: () => void;
 onCopyUrl: () => void;
 onCopyUrlAtTime: () => void;
 onCopyEmbedCode: () => void;
 onPictureInPicture: () => void;
 onStats: () => void;
}

export interface ProgressBarProps {
 currentTime: number;
 duration: number;
 buffered: TimeRanges | null;
 previewThumbnails?: string | string[];
 onSeek: (time: number) => void;
 chapters?: Chapter[];
}

export interface Chapter {
 title: string;
 startTime: number;
 endTime: number;
}

export interface VolumeControlProps {
 volume: number;
 muted: boolean;
 onVolumeChange: (volume: number) => void;
 onMuteToggle: () => void;
}

export interface PlaylistPanelProps {
 isOpen: boolean;
 onClose: () => void;
 items: PlaylistItem[];
 currentIndex: number;
 onItemClick: (index: number) => void;
 autoPlay: boolean;
 onAutoPlayChange: (enabled: boolean) => void;
}

export type PlaybackSpeed = 0.25 | 0.5 | 0.75 | 1 | 1.25 | 1.5 | 1.75 | 2;

export const PLAYBACK_SPEEDS: PlaybackSpeed[] = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

export const DEFAULT_QUALITIES = ['Auto', '1080p', '720p', '480p', '360p', '240p', '144p'];
