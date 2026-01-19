/**
 * Format seconds to MM:SS or HH:MM:SS
 */
export function formatTime(seconds: number): string {
 if (isNaN(seconds) || !isFinite(seconds)) {
  return '0:00';
 }

 const hrs = Math.floor(seconds / 3600);
 const mins = Math.floor((seconds % 3600) / 60);
 const secs = Math.floor(seconds % 60);

 if (hrs > 0) {
  return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
 }
 return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Parse time string to seconds
 */
export function parseTime(timeStr: string): number {
 const parts = timeStr.split(':').map(Number);
 if (parts.length === 3) {
  return parts[0] * 3600 + parts[1] * 60 + parts[2];
 }
 if (parts.length === 2) {
  return parts[0] * 60 + parts[1];
 }
 return parts[0] || 0;
}

/**
 * Get buffered percentage
 */
export function getBufferedPercentage(buffered: TimeRanges | null, currentTime: number, duration: number): number {
 if (!buffered || buffered.length === 0 || !duration) return 0;

 for (let i = 0; i < buffered.length; i++) {
  if (buffered.start(i) <= currentTime && currentTime <= buffered.end(i)) {
   return (buffered.end(i) / duration) * 100;
  }
 }
 return 0;
}

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
 return Math.min(Math.max(value, min), max);
}

/**
 * Generate video URL with timestamp
 */
export function getUrlWithTimestamp(url: string, currentTime: number): string {
 const urlObj = new URL(url, window.location.origin);
 urlObj.searchParams.set('t', Math.floor(currentTime).toString());
 return urlObj.toString();
}

/**
 * Generate embed code
 */
export function generateEmbedCode(src: string, width = 560, height = 315): string {
 return `<iframe width="${width}" height="${height}" src="${src}" frameborder="0" allowfullscreen></iframe>`;
}

/**
 * Throttle function calls
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
 fn: T,
 delay: number
): (...args: Parameters<T>) => void {
 let lastCall = 0;
 return (...args: Parameters<T>) => {
  const now = Date.now();
  if (now - lastCall >= delay) {
   lastCall = now;
   fn(...args);
  }
 };
}

/**
 * Debounce function calls
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
 fn: T,
 delay: number
): (...args: Parameters<T>) => void {
 let timeoutId: ReturnType<typeof setTimeout>;
 return (...args: Parameters<T>) => {
  clearTimeout(timeoutId);
  timeoutId = setTimeout(() => fn(...args), delay);
 };
}
