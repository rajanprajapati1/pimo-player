import { useEffect, useCallback } from 'react';

interface KeyboardShortcutOptions {
 enabled?: boolean;
 onPlayPause?: () => void;
 onSeekForward?: () => void;
 onSeekBackward?: () => void;
 onVolumeUp?: () => void;
 onVolumeDown?: () => void;
 onMute?: () => void;
 onFullscreen?: () => void;
 onMiniPlayer?: () => void;
 onTheaterMode?: () => void;
 onSeekToPercent?: (percent: number) => void;
}

export function useKeyboardShortcuts(
 containerRef: React.RefObject<HTMLElement | null>,
 options: KeyboardShortcutOptions
) {
 const {
  enabled = true,
  onPlayPause,
  onSeekForward,
  onSeekBackward,
  onVolumeUp,
  onVolumeDown,
  onMute,
  onFullscreen,
  onMiniPlayer,
  onTheaterMode,
  onSeekToPercent,
 } = options;

 const handleKeyDown = useCallback((e: KeyboardEvent) => {
  // Don't handle if typing in an input
  if (
   e.target instanceof HTMLInputElement ||
   e.target instanceof HTMLTextAreaElement
  ) {
   return;
  }

  switch (e.key.toLowerCase()) {
   case ' ':
   case 'k':
    e.preventDefault();
    onPlayPause?.();
    break;
   case 'arrowleft':
   case 'j':
    e.preventDefault();
    onSeekBackward?.();
    break;
   case 'arrowright':
   case 'l':
    e.preventDefault();
    onSeekForward?.();
    break;
   case 'arrowup':
    e.preventDefault();
    onVolumeUp?.();
    break;
   case 'arrowdown':
    e.preventDefault();
    onVolumeDown?.();
    break;
   case 'm':
    e.preventDefault();
    onMute?.();
    break;
   case 'f':
    e.preventDefault();
    onFullscreen?.();
    break;
   case 'i':
    e.preventDefault();
    onMiniPlayer?.();
    break;
   case 't':
    e.preventDefault();
    onTheaterMode?.();
    break;
   case '0':
   case '1':
   case '2':
   case '3':
   case '4':
   case '5':
   case '6':
   case '7':
   case '8':
   case '9':
    e.preventDefault();
    onSeekToPercent?.(parseInt(e.key) * 10);
    break;
   case 'home':
    e.preventDefault();
    onSeekToPercent?.(0);
    break;
   case 'end':
    e.preventDefault();
    onSeekToPercent?.(100);
    break;
  }
 }, [
  onPlayPause,
  onSeekForward,
  onSeekBackward,
  onVolumeUp,
  onVolumeDown,
  onMute,
  onFullscreen,
  onMiniPlayer,
  onTheaterMode,
  onSeekToPercent,
 ]);

 useEffect(() => {
  if (!enabled) return;

  const container = containerRef.current;
  if (!container) return;

  container.addEventListener('keydown', handleKeyDown);

  return () => {
   container.removeEventListener('keydown', handleKeyDown);
  };
 }, [enabled, containerRef, handleKeyDown]);
}
