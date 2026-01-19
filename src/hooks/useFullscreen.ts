import { useState, useCallback, useEffect } from 'react';

export function useFullscreen(elementRef: React.RefObject<HTMLElement | null>) {
 const [isFullscreen, setIsFullscreen] = useState(false);

 const enterFullscreen = useCallback(async () => {
  const element = elementRef.current;
  if (!element) return;

  try {
   if (element.requestFullscreen) {
    await element.requestFullscreen();
   } else if ((element as HTMLElement & { webkitRequestFullscreen?: () => Promise<void> }).webkitRequestFullscreen) {
    await (element as HTMLElement & { webkitRequestFullscreen: () => Promise<void> }).webkitRequestFullscreen();
   } else if ((element as HTMLElement & { msRequestFullscreen?: () => Promise<void> }).msRequestFullscreen) {
    await (element as HTMLElement & { msRequestFullscreen: () => Promise<void> }).msRequestFullscreen();
   }
  } catch (error) {
   console.error('Failed to enter fullscreen:', error);
  }
 }, [elementRef]);

 const exitFullscreen = useCallback(async () => {
  try {
   if (document.exitFullscreen) {
    await document.exitFullscreen();
   } else if ((document as Document & { webkitExitFullscreen?: () => Promise<void> }).webkitExitFullscreen) {
    await (document as Document & { webkitExitFullscreen: () => Promise<void> }).webkitExitFullscreen();
   } else if ((document as Document & { msExitFullscreen?: () => Promise<void> }).msExitFullscreen) {
    await (document as Document & { msExitFullscreen: () => Promise<void> }).msExitFullscreen();
   }
  } catch (error) {
   console.error('Failed to exit fullscreen:', error);
  }
 }, []);

 const toggleFullscreen = useCallback(() => {
  if (isFullscreen) {
   exitFullscreen();
  } else {
   enterFullscreen();
  }
 }, [isFullscreen, enterFullscreen, exitFullscreen]);

 useEffect(() => {
  const handleFullscreenChange = () => {
   setIsFullscreen(
    !!document.fullscreenElement ||
    !!(document as Document & { webkitFullscreenElement?: Element }).webkitFullscreenElement ||
    !!(document as Document & { msFullscreenElement?: Element }).msFullscreenElement
   );
  };

  document.addEventListener('fullscreenchange', handleFullscreenChange);
  document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
  document.addEventListener('msfullscreenchange', handleFullscreenChange);

  return () => {
   document.removeEventListener('fullscreenchange', handleFullscreenChange);
   document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
   document.removeEventListener('msfullscreenchange', handleFullscreenChange);
  };
 }, []);

 return {
  isFullscreen,
  enterFullscreen,
  exitFullscreen,
  toggleFullscreen,
 };
}
