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
  duration: 0, // Duration will be detected from video
}));

function App() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f0f0f',
      padding: '0',
    }}>
      {/* Full Width Player - YouTube Style */}
      <div style={{
        width: '100%',
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '20px',
      }}>
        <VideoPlayer
          src={samplePlaylist[0].src}
          playlist={samplePlaylist}
          poster={samplePlaylist[0].thumbnail}
          keyboard={true}
          onTimeUpdate={(time) => console.log('Time:', time)}
          onPlay={() => console.log('Playing')}
          onPause={() => console.log('Paused')}
          onEnded={() => console.log('Video ended')}
          onPlaylistItemChange={(_index, item) => console.log('Now playing:', item.title)}
        />

        {/* Video Info - YouTube Style */}
        <div style={{
          marginTop: '12px',
          color: '#fff',
          fontFamily: 'Roboto, Arial, sans-serif'
        }}>
          <h1 style={{
            fontSize: '20px',
            fontWeight: '600',
            lineHeight: '28px',
            marginBottom: '8px'
          }}>
            {samplePlaylist[0].title}
          </h1>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#aaa',
            fontSize: '14px'
          }}>
            <span>{samplePlaylist[0].channel}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
