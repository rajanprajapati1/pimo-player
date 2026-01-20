// Import styles so they are bundled with the library
import '../styles/player.css';

// Main exports
export { VideoPlayer } from '../components/VideoPlayer';
export { ProgressBar } from '../components/ProgressBar';
export { VolumeControl } from '../components/VolumeControl';
export { SettingsMenu } from '../components/SettingsMenu';
export { ContextMenu } from '../components/ContextMenu';
export { PlaylistPanel } from '../components/PlaylistPanel';

// Hooks
export { useVideoPlayer } from '../hooks/useVideoPlayer';
export { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
export { useFullscreen } from '../hooks/useFullscreen';

// Types
export type {
 VideoPlayerProps,
 VideoSource,
 PlaylistItem,
 ControlsConfig,
 SettingsMenuProps,
 ContextMenuProps,
 ProgressBarProps,
 VolumeControlProps,
 PlaylistPanelProps,
 Chapter,
} from '../types';

export { PLAYBACK_SPEEDS, DEFAULT_QUALITIES } from '../types';

// Utils
export { formatTime, parseTime, getBufferedPercentage } from '../utils';
