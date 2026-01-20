import { VideoPlayer } from './components/VideoPlayer';
import type { PlaylistItem } from './types';
import { mediaJSON } from './constants/list';
import './index.css';

// Convert media JSON to playlist format
const samplePlaylist: PlaylistItem[] = mediaJSON.categories[0].videos.map((video, idx) => ({
  id: String(idx + 1),
  src: video.sources[0],
  title: video.title,
  thumbnail: `https://storage.googleapis.com/gtv-videos-bucket/sample/${video.thumb}`,
  channel: video.subtitle,
  duration: 0,
}));

function App() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f0f0f',
      padding: '20px',
    }}>
      {/* Header */}
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto 30px',
        color: '#fff',
        fontFamily: 'Roboto, Arial, sans-serif'
      }}>
        <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>Pimo Player Demo</h1>
        <p style={{ color: '#aaa', fontSize: '14px' }}>
          A React video player with support for multiple aspect ratios
        </p>
      </div>

      {/* 16:9 - Standard YouTube/Desktop */}
      <div style={{ maxWidth: '800px', margin: '0 auto 40px' }}>
        <h2 style={{ color: '#fff', fontSize: '18px', marginBottom: '12px', fontFamily: 'Roboto, sans-serif' }}>
          📺 16:9 - YouTube / Standard (Default)
        </h2>
        <VideoPlayer
          src={samplePlaylist[0].src}
          poster={samplePlaylist[0].thumbnail}
          aspectRatio="16:9"
          keyboard={true}
        />
      </div>

      {/* Grid for different aspect ratios */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '30px',
      }}>

        {/* 9:16 - TikTok/Reels */}
        <div>
          <h2 style={{ color: '#fff', fontSize: '16px', marginBottom: '12px', fontFamily: 'Roboto, sans-serif' }}>
            📱 9:16 - TikTok / Reels
          </h2>
          <div style={{ maxWidth: '280px' }}>
            <VideoPlayer
              src={samplePlaylist[1].src}
              poster={samplePlaylist[1].thumbnail}
              aspectRatio="9:16"
              controls={true}
              muted={true}
              loop={true}
            />
          </div>
        </div>

        {/* 1:1 - Instagram Square */}
        <div>
          <h2 style={{ color: '#fff', fontSize: '16px', marginBottom: '12px', fontFamily: 'Roboto, sans-serif' }}>
            📷 1:1 - Instagram Square
          </h2>
          <div style={{ maxWidth: '350px' }}>
            <VideoPlayer
              src={samplePlaylist[2].src}
              poster={samplePlaylist[2].thumbnail}
              aspectRatio="1:1"
              controls={true}
              muted={true}
            />
          </div>
        </div>

        {/* 4:5 - Instagram Portrait */}
        <div>
          <h2 style={{ color: '#fff', fontSize: '16px', marginBottom: '12px', fontFamily: 'Roboto, sans-serif' }}>
            🖼️ 4:5 - Instagram Portrait
          </h2>
          <div style={{ maxWidth: '320px' }}>
            <VideoPlayer
              src={samplePlaylist[3]?.src || samplePlaylist[0].src}
              poster={samplePlaylist[3]?.thumbnail || samplePlaylist[0].thumbnail}
              aspectRatio="4:5"
              controls={true}
              muted={true}
            />
          </div>
        </div>

        {/* 4:3 - Classic TV */}
        <div>
          <h2 style={{ color: '#fff', fontSize: '16px', marginBottom: '12px', fontFamily: 'Roboto, sans-serif' }}>
            📺 4:3 - Classic TV
          </h2>
          <div style={{ maxWidth: '400px' }}>
            <VideoPlayer
              src={samplePlaylist[4]?.src || samplePlaylist[0].src}
              poster={samplePlaylist[4]?.thumbnail || samplePlaylist[0].thumbnail}
              aspectRatio="4:3"
              controls={true}
              muted={true}
            />
          </div>
        </div>
      </div>

      {/* 21:9 - Ultrawide Cinema */}
      <div style={{ maxWidth: '900px', margin: '40px auto 0' }}>
        <h2 style={{ color: '#fff', fontSize: '18px', marginBottom: '12px', fontFamily: 'Roboto, sans-serif' }}>
          🎬 21:9 - Ultrawide Cinema
        </h2>
        <VideoPlayer
          src={samplePlaylist[0].src}
          poster={samplePlaylist[0].thumbnail}
          aspectRatio="21:9"
          controls={true}
        />
      </div>

      {/* Usage info */}
      <div style={{
        maxWidth: '800px',
        margin: '50px auto',
        padding: '24px',
        background: '#1a1a1a',
        borderRadius: '12px',
        color: '#fff',
        fontFamily: 'monospace',
      }}>
        <h3 style={{ marginBottom: '16px', fontFamily: 'Roboto, sans-serif' }}>Usage Example:</h3>
        <pre style={{
          background: '#0d0d0d',
          padding: '16px',
          borderRadius: '8px',
          overflow: 'auto',
          fontSize: '13px',
          lineHeight: '1.5',
        }}>
          {`import { VideoPlayer } from 'pimo';

// YouTube style (16:9)
<VideoPlayer src="video.mp4" aspectRatio="16:9" />

// TikTok / Reels style (9:16)
<VideoPlayer src="video.mp4" aspectRatio="9:16" />

// Instagram Square (1:1)
<VideoPlayer src="video.mp4" aspectRatio="1:1" />

// Instagram Portrait (4:5)
<VideoPlayer src="video.mp4" aspectRatio="4:5" />

// Ultrawide Cinema (21:9)
<VideoPlayer src="video.mp4" aspectRatio="21:9" />

// Props available:
<VideoPlayer
  src="video.mp4"
  poster="thumbnail.jpg"
  aspectRatio="16:9"    // Any ratio: "16:9", "9:16", "1:1", etc.
  controls={true}       // Show/hide controls
  muted={false}         // Start muted
  autoPlay={false}      // Auto-play on load
  loop={false}          // Loop video
  playsInline={true}    // Inline on mobile
  onPlay={() => {}}
  onPause={() => {}}
  onEnded={() => {}}
/>`}
        </pre>
      </div>
    </div>
  );
}

export default App;
