import { useState, useCallback, useRef, useEffect } from 'react';

interface VideoPlayerState {
 playing: boolean;
 currentTime: number;
 duration: number;
 volume: number;
 muted: boolean;
 buffered: TimeRanges | null;
 playbackRate: number;
 isLoading: boolean;
 isEnded: boolean;
 error: string | null;
}

interface VideoPlayerActions {
 play: () => Promise<void>;
 pause: () => void;
 togglePlay: () => void;
 seek: (time: number) => void;
 seekBy: (seconds: number) => void;
 setVolume: (volume: number) => void;
 toggleMute: () => void;
 setPlaybackRate: (rate: number) => void;
 replay: () => void;
}

export function useVideoPlayer(videoRef: React.RefObject<HTMLVideoElement | null>) {
 const [state, setState] = useState<VideoPlayerState>({
  playing: false,
  currentTime: 0,
  duration: 0,
  volume: 1,
  muted: false,
  buffered: null,
  playbackRate: 1,
  isLoading: true,
  isEnded: false,
  error: null,
 });

 const animationRef = useRef<number | null>(null);

 const updateTime = useCallback(() => {
  const video = videoRef.current;
  if (video) {
   setState(prev => ({
    ...prev,
    currentTime: video.currentTime,
    buffered: video.buffered,
   }));
  }
  animationRef.current = requestAnimationFrame(updateTime);
 }, [videoRef]);

 const play = useCallback(async () => {
  const video = videoRef.current;
  if (video) {
   try {
    await video.play();
    setState(prev => ({ ...prev, playing: true, isEnded: false }));
    animationRef.current = requestAnimationFrame(updateTime);
   } catch (error) {
    console.error('Failed to play:', error);
   }
  }
 }, [videoRef, updateTime]);

 const pause = useCallback(() => {
  const video = videoRef.current;
  if (video) {
   video.pause();
   setState(prev => ({ ...prev, playing: false }));
   if (animationRef.current) {
    cancelAnimationFrame(animationRef.current);
   }
  }
 }, [videoRef]);

 const togglePlay = useCallback(() => {
  if (state.playing) {
   pause();
  } else {
   play();
  }
 }, [state.playing, play, pause]);

 const seek = useCallback((time: number) => {
  const video = videoRef.current;
  if (video) {
   video.currentTime = Math.max(0, Math.min(time, video.duration || 0));
   setState(prev => ({ ...prev, currentTime: video.currentTime }));
  }
 }, [videoRef]);

 const seekBy = useCallback((seconds: number) => {
  const video = videoRef.current;
  if (video) {
   seek(video.currentTime + seconds);
  }
 }, [videoRef, seek]);

 const setVolume = useCallback((volume: number) => {
  const video = videoRef.current;
  const clampedVolume = Math.max(0, Math.min(1, volume));
  if (video) {
   video.volume = clampedVolume;
   video.muted = clampedVolume === 0;
   setState(prev => ({
    ...prev,
    volume: clampedVolume,
    muted: clampedVolume === 0,
   }));
  }
 }, [videoRef]);

 const toggleMute = useCallback(() => {
  const video = videoRef.current;
  if (video) {
   video.muted = !video.muted;
   setState(prev => ({ ...prev, muted: video.muted }));
  }
 }, [videoRef]);

 const setPlaybackRate = useCallback((rate: number) => {
  const video = videoRef.current;
  if (video) {
   video.playbackRate = rate;
   setState(prev => ({ ...prev, playbackRate: rate }));
  }
 }, [videoRef]);

 const replay = useCallback(() => {
  const video = videoRef.current;
  if (video) {
   video.currentTime = 0;
   play();
  }
 }, [videoRef, play]);

 // Event handlers
 useEffect(() => {
  const video = videoRef.current;
  if (!video) return;

  const handleLoadedMetadata = () => {
   setState(prev => ({
    ...prev,
    duration: video.duration,
    isLoading: false,
   }));
  };

  const handleWaiting = () => {
   setState(prev => ({ ...prev, isLoading: true }));
  };

  const handleCanPlay = () => {
   setState(prev => ({ ...prev, isLoading: false }));
  };

  const handleEnded = () => {
   setState(prev => ({ ...prev, playing: false, isEnded: true }));
   if (animationRef.current) {
    cancelAnimationFrame(animationRef.current);
   }
  };

  const handleError = () => {
   setState(prev => ({
    ...prev,
    error: 'Failed to load video',
    isLoading: false,
   }));
  };

  const handlePlay = () => {
   setState(prev => ({ ...prev, playing: true }));
  };

  const handlePause = () => {
   setState(prev => ({ ...prev, playing: false }));
  };

  video.addEventListener('loadedmetadata', handleLoadedMetadata);
  video.addEventListener('waiting', handleWaiting);
  video.addEventListener('canplay', handleCanPlay);
  video.addEventListener('ended', handleEnded);
  video.addEventListener('error', handleError);
  video.addEventListener('play', handlePlay);
  video.addEventListener('pause', handlePause);

  return () => {
   video.removeEventListener('loadedmetadata', handleLoadedMetadata);
   video.removeEventListener('waiting', handleWaiting);
   video.removeEventListener('canplay', handleCanPlay);
   video.removeEventListener('ended', handleEnded);
   video.removeEventListener('error', handleError);
   video.removeEventListener('play', handlePlay);
   video.removeEventListener('pause', handlePause);
   if (animationRef.current) {
    cancelAnimationFrame(animationRef.current);
   }
  };
 }, [videoRef]);

 const actions: VideoPlayerActions = {
  play,
  pause,
  togglePlay,
  seek,
  seekBy,
  setVolume,
  toggleMute,
  setPlaybackRate,
  replay,
 };

 return { ...state, ...actions };
}
