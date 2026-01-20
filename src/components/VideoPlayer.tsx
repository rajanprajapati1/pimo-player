import React, { useRef, useState, useCallback, useEffect } from 'react';
import type { VideoPlayerProps } from '../types';
import { DEFAULT_QUALITIES } from '../types';
import { useVideoPlayer } from '../hooks/useVideoPlayer';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { useFullscreen } from '../hooks/useFullscreen';
import { formatTime, getUrlWithTimestamp, generateEmbedCode } from '../utils';
import { ProgressBar } from './ProgressBar';
import { VolumeControl } from './VolumeControl';
import { SettingsMenu } from './SettingsMenu';
import { ContextMenu } from './ContextMenu';
import '../styles/player.css';

// Icons - YouTube exact style
const PlayIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill="#fff" d="M14.642 6.285c1.294.777 1.294 2.653 0 3.43l-9.113 5.468c-1.333.8-3.028-.16-3.029-1.715V2.532C2.5.978 4.196.018 5.53.818z" /></svg>
);

const PauseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path fill="#fff" d="M7.25 3A3.25 3.25 0 0 0 4 6.25v18.5A3.25 3.25 0 0 0 7.25 28h3.5A3.25 3.25 0 0 0 14 24.75V6.25A3.25 3.25 0 0 0 10.75 3zm14 0A3.25 3.25 0 0 0 18 6.25v18.5A3.25 3.25 0 0 0 21.25 28h3.5A3.25 3.25 0 0 0 28 24.75V6.25A3.25 3.25 0 0 0 24.75 3z" /></svg>
);

const SkipPrevIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#fff" d="M8.09 14.647c-1.787-1.154-1.787-4.14 0-5.294l10.79-6.968c1.736-1.121 3.87.339 3.87 2.648v13.934c0 2.31-2.134 3.769-3.87 2.648zM2 5a.75.75 0 0 1 1.5 0v14A.75.75 0 0 1 2 19z" /></svg>
);

const SkipNextIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#fff" d="M16.66 14.647c1.787-1.154 1.787-4.14 0-5.294L5.87 2.385C4.135 1.264 2 2.724 2 5.033v13.934c0 2.31 2.134 3.769 3.87 2.648zM22.75 5a.75.75 0 0 0-1.5 0v14a.75.75 0 0 0 1.5 0z" /></svg>
);

const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="#fff" stroke-width="2"><path d="M3.082 13.945c-.529-.95-.793-1.426-.793-1.945s.264-.994.793-1.944L4.43 7.63l1.426-2.381c.559-.933.838-1.4 1.287-1.66c.45-.259.993-.267 2.08-.285L12 3.26l2.775.044c1.088.018 1.631.026 2.08.286s.73.726 1.288 1.659L19.57 7.63l1.35 2.426c.528.95.792 1.425.792 1.944s-.264.994-.793 1.944L19.57 16.37l-1.426 2.381c-.559.933-.838 1.4-1.287 1.66c-.45.259-.993.267-2.08.285L12 20.74l-2.775-.044c-1.088-.018-1.631-.026-2.08-.286s-.73-.726-1.288-1.659L4.43 16.37z" /><circle cx="12" cy="12" r="3" /></g></svg>
);

const MiniPlayerIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><rect width="20" height="16" x="2" y="4" rx="2" /><rect width="9" height="7" x="13" y="13" rx="2" /></g></svg>
);

const FullscreenIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" /><path fill="#fff" d="M18.5 5.5H16a1.5 1.5 0 0 1 0-3h3A2.5 2.5 0 0 1 21.5 5v3a1.5 1.5 0 0 1-3 0zM8 5.5H5.5V8a1.5 1.5 0 1 1-3 0V5A2.5 2.5 0 0 1 5 2.5h3a1.5 1.5 0 1 1 0 3m0 13H5.5V16a1.5 1.5 0 0 0-3 0v3A2.5 2.5 0 0 0 5 21.5h3a1.5 1.5 0 0 0 0-3m8 0h2.5V16a1.5 1.5 0 0 1 3 0v3a2.5 2.5 0 0 1-2.5 2.5h-3a1.5 1.5 0 0 1 0-3" /></g></svg>
);

const FullscreenExitIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#fff" d="M18 21H5a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h13a3 3 0 0 1 3 3v11a3 3 0 0 1-3 3m0-1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2zm-5-3H6v-7h1v5.29l7.15-7.14l.7.7L7.71 16H13z" /></svg>
);

const ReplayIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill="#fff" d="M14.642 6.285c1.294.777 1.294 2.653 0 3.43l-9.113 5.468c-1.333.8-3.028-.16-3.029-1.715V2.532C2.5.978 4.196.018 5.53.818z" /></svg>
);

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  poster,
  autoPlay = false,
  loop = false,
  muted: initialMuted = false,
  playlist = [],
  currentIndex: initialIndex = 0,
  previewThumbnails,
  qualities = DEFAULT_QUALITIES,
  theme = 'dark',
  keyboard = true,
  className = '',
  width = '100%',
  height = 'auto',
  aspectRatio = '16:9',
  controls = true,
  playsInline = true,
  onTimeUpdate,
  onEnded,
  onPlay,
  onPause,
  onVolumeChange,
  onQualityChange,
  onFullscreenChange,
  onPlaylistItemChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // State
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState({ isOpen: false, x: 0, y: 0 });
  const [isLooping, setIsLooping] = useState(loop);
  const [ambientMode, setAmbientMode] = useState(false);
  const [quality, setQuality] = useState(qualities[0]);
  const [controlsVisible, setControlsVisible] = useState(true);
  const controlsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Get current video source
  const currentSrc = playlist.length > 0
    ? playlist[currentIndex]?.src
    : (typeof src === 'string' ? src : src?.[0]?.src);

  // Get next video in playlist for preview
  const nextVideo = playlist.length > 1 && currentIndex < playlist.length - 1
    ? playlist[currentIndex + 1]
    : null;

  // Hooks
  const player = useVideoPlayer(videoRef);
  const { isFullscreen, toggleFullscreen } = useFullscreen(containerRef);

  // Keyboard shortcuts
  useKeyboardShortcuts(containerRef, {
    enabled: keyboard,
    onPlayPause: player.togglePlay,
    onSeekForward: () => player.seekBy(5),
    onSeekBackward: () => player.seekBy(-5),
    onVolumeUp: () => player.setVolume(player.volume + 0.1),
    onVolumeDown: () => player.setVolume(player.volume - 0.1),
    onMute: player.toggleMute,
    onFullscreen: toggleFullscreen,
    onSeekToPercent: (percent: number) => {
      player.seek((percent / 100) * player.duration);
    },
  });

  // Hide controls after inactivity
  const resetControlsTimer = useCallback(() => {
    setControlsVisible(true);
    if (controlsTimerRef.current) {
      clearTimeout(controlsTimerRef.current);
    }
    if (player.playing) {
      controlsTimerRef.current = setTimeout(() => {
        setControlsVisible(false);
      }, 3000);
    }
  }, [player.playing]);

  useEffect(() => {
    resetControlsTimer();
    return () => {
      if (controlsTimerRef.current) {
        clearTimeout(controlsTimerRef.current);
      }
    };
  }, [player.playing, resetControlsTimer]);

  // Callbacks
  useEffect(() => {
    onTimeUpdate?.(player.currentTime);
  }, [player.currentTime, onTimeUpdate]);

  useEffect(() => {
    if (player.isEnded) {
      onEnded?.();
      // Auto-play next in playlist
      if (playlist.length > 0 && currentIndex < playlist.length - 1) {
        setCurrentIndex(prev => prev + 1);
      }
    }
  }, [player.isEnded, onEnded, playlist.length, currentIndex]);

  useEffect(() => {
    if (player.playing) {
      onPlay?.();
    } else if (!player.playing && player.currentTime > 0) {
      onPause?.();
    }
  }, [player.playing, player.currentTime, onPlay, onPause]);

  useEffect(() => {
    onVolumeChange?.(player.volume, player.muted);
  }, [player.volume, player.muted, onVolumeChange]);

  useEffect(() => {
    onFullscreenChange?.(isFullscreen);
  }, [isFullscreen, onFullscreenChange]);

  // Playlist item change
  useEffect(() => {
    if (playlist.length > 0) {
      onPlaylistItemChange?.(currentIndex, playlist[currentIndex]);
    }
  }, [currentIndex, playlist, onPlaylistItemChange]);

  // Context menu handlers
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ isOpen: true, x: e.clientX, y: e.clientY });
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  const handleCopyUrlAtTime = () => {
    navigator.clipboard.writeText(
      getUrlWithTimestamp(window.location.href, player.currentTime)
    );
  };

  const handleCopyEmbedCode = () => {
    navigator.clipboard.writeText(
      generateEmbedCode(currentSrc || '')
    );
  };

  const handlePictureInPicture = async () => {
    if (videoRef.current) {
      try {
        if (document.pictureInPictureElement) {
          await document.exitPictureInPicture();
        } else {
          await videoRef.current.requestPictureInPicture();
        }
      } catch (error) {
        console.error('PiP error:', error);
      }
    }
  };

  const handleQualityChange = (q: string) => {
    setQuality(q);
    onQualityChange?.(q);
  };



  const handleNextVideoClick = () => {
    if (nextVideo) {
      setCurrentIndex(currentIndex + 1);
      setTimeout(() => player.play(), 100);
    }
  };

  // Double click to fullscreen
  const handleDoubleClick = () => {
    toggleFullscreen();
  };

  // Check if video is near ending (last 10 seconds)
  const isNearEnd = player.duration > 0 && (player.duration - player.currentTime) <= 10;

  const playerClasses = [
    'ryp-player',
    `ryp-theme-${theme}`,
    player.playing ? 'ryp-playing' : '',
    ambientMode ? 'ryp-ambient' : '',
    controlsVisible ? 'ryp-controls-visible' : '',
    isNearEnd && nextVideo ? 'ryp-near-end' : '',
    className,
  ].filter(Boolean).join(' ');

  // Convert aspect ratio from "16:9" format to CSS-compatible "16/9" format
  const cssAspectRatio = aspectRatio === 'auto' ? 'auto' : aspectRatio.replace(':', '/');

  return (
    <div
      ref={containerRef}
      className={playerClasses}
      style={{
        width,
        height: typeof height === 'number' ? `${height}px` : height,
        aspectRatio: cssAspectRatio,
      }}
      onMouseMove={resetControlsTimer}
      onContextMenu={handleContextMenu}
      tabIndex={0}
      role="application"
      aria-label="Video Player"
      data-pimo-player=""
      data-pimo-state={player.playing ? 'playing' : player.isEnded ? 'ended' : 'paused'}
      data-pimo-fullscreen={isFullscreen}
      data-pimo-muted={player.muted}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        className="ryp-video"
        src={currentSrc}
        poster={poster}
        loop={isLooping}
        muted={initialMuted}
        autoPlay={autoPlay}
        playsInline={playsInline}
        onClick={() => {
          setContextMenu({ isOpen: false, x: 0, y: 0 });
          player.togglePlay();
        }}
        onDoubleClick={handleDoubleClick}
        data-pimo-video=""
        aria-label="Video"
      />

      {/* Gradient Overlay */}
      <div className="ryp-gradient-overlay" data-pimo-gradient="" />

      {/* Loading Spinner */}
      {player.isLoading && !player.isEnded && (
        <div className="ryp-loading" data-pimo-loading="" role="status" aria-label="Loading video">
          <div className="ryp-spinner" data-pimo-spinner="" />
        </div>
      )}

      {/* Big Play Button */}
      {!player.playing && !player.isLoading && !player.isEnded && (
        <button
          className="ryp-big-play"
          onClick={player.play}
          data-pimo-big-play=""
          aria-label="Play video"
        >
          <PlayIcon />
        </button>
      )}

      {/* Ended Overlay */}
      {player.isEnded && (
        <div className="ryp-ended-overlay" data-pimo-ended-overlay="">
          <button
            className="ryp-replay-btn"
            onClick={player.replay}
            data-pimo-replay=""
            aria-label="Replay video"
          >
            <ReplayIcon />
          </button>
        </div>
      )}

      {/* Next Up Preview - YouTube "Next" thumbnail */}
      {nextVideo && (
        <div className="ryp-next-preview">
          <div className="ryp-next-preview-label">
            <span>Next</span>
            <span>SHIFT+N</span>
          </div>
          <div className="ryp-next-preview-thumb" onClick={handleNextVideoClick}>
            {nextVideo.thumbnail && (
              <img src={nextVideo.thumbnail} alt={nextVideo.title} />
            )}
            {nextVideo.duration && (
              <span className="ryp-next-preview-thumb-duration">
                {formatTime(nextVideo.duration)}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Controls */}
      {controls && (
        <div className="ryp-controls-wrapper" data-pimo-controls="" role="toolbar" aria-label="Video controls">
          {/* Progress Bar */}
          <ProgressBar
            currentTime={player.currentTime}
            duration={player.duration}
            buffered={player.buffered}
            onSeek={player.seek}
            previewThumbnails={
              typeof previewThumbnails === 'string'
                ? undefined
                : previewThumbnails
            }
          />

          {/* Controls Row */}
          <div className="ryp-controls-row" data-pimo-controls-row="">
            <div className="ryp-controls-left" data-pimo-controls-left="">
              {/* Previous (if playlist) */}
              {playlist.length > 1 && (
                <button
                  className="ryp-btn"
                  onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                  disabled={currentIndex === 0}
                  data-pimo-prev=""
                  aria-label="Previous video"
                >
                  <SkipPrevIcon />
                </button>
              )}

              {/* Play/Pause */}
              <button
                className="ryp-btn"
                onClick={player.togglePlay}
                data-pimo-play-pause=""
                aria-label={player.playing ? 'Pause' : 'Play'}
              >
                {player.playing ? <PauseIcon /> : <PlayIcon />}
              </button>

              {/* Next (if playlist) */}
              {playlist.length > 1 && (
                <button
                  className="ryp-btn"
                  onClick={() => setCurrentIndex(Math.min(playlist.length - 1, currentIndex + 1))}
                  disabled={currentIndex === playlist.length - 1}
                  data-pimo-next=""
                  aria-label="Next video"
                >
                  <SkipNextIcon />
                </button>
              )}

              {/* Volume */}
              <VolumeControl
                volume={player.volume}
                muted={player.muted}
                onVolumeChange={player.setVolume}
                onMuteToggle={player.toggleMute}
              />

              {/* Time */}
              <div className="ryp-time" data-pimo-time="" aria-label={`${formatTime(player.currentTime)} of ${formatTime(player.duration)}`}>
                <span className="ryp-time-current" data-pimo-time-current="">{formatTime(player.currentTime)}</span>
                <span className="ryp-time-separator" data-pimo-time-separator="">/</span>
                <span className="ryp-time-duration" data-pimo-time-duration="">{formatTime(player.duration)}</span>
              </div>
            </div>

            <div className="ryp-controls-right" data-pimo-controls-right="">
              {/* Settings */}
              <button
                className="ryp-btn"
                onClick={() => setSettingsOpen(!settingsOpen)}
                data-pimo-settings=""
                aria-label="Settings"
                aria-expanded={settingsOpen}
              >
                <SettingsIcon />
              </button>

              {/* Mini Player */}
              <button
                className="ryp-btn"
                onClick={handlePictureInPicture}
                data-pimo-pip=""
                aria-label="Picture in picture"
              >
                <MiniPlayerIcon />
              </button>

              {/* Fullscreen */}
              <button
                className="ryp-btn"
                onClick={toggleFullscreen}
                data-pimo-fullscreen=""
                aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              >
                {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Menu */}
      <SettingsMenu
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        playbackSpeed={player.playbackRate}
        onSpeedChange={player.setPlaybackRate}
        quality={quality}
        qualities={qualities}
        onQualityChange={handleQualityChange}
        ambientMode={ambientMode}
        onAmbientModeChange={setAmbientMode}
        loop={isLooping}
        onLoopChange={setIsLooping}
      />

      {/* Context Menu */}
      <ContextMenu
        isOpen={contextMenu.isOpen}
        position={{ x: contextMenu.x, y: contextMenu.y }}
        onClose={() => setContextMenu({ ...contextMenu, isOpen: false })}
        isLooping={isLooping}
        onToggleLoop={() => setIsLooping(!isLooping)}
        onCopyUrl={handleCopyUrl}
        onCopyUrlAtTime={handleCopyUrlAtTime}
        onCopyEmbedCode={handleCopyEmbedCode}
        onPictureInPicture={handlePictureInPicture}
      />
    </div>
  );
};
