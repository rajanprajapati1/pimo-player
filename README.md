# Pimo Player

A pixel-perfect, YouTube-inspired video player for React and TypeScript. Pimo is designed to be lightweight, highly customizable, and visually stunning with built-in glassmorphism effects and modern controls.

![Pimo Player Demo](https://raw.githubusercontent.com/rajanprajapati1/pimo-player/refs/heads/main/public/demo.png)

## Features

- 🎨 **YouTube Aesthetics**: Pixel-perfect replica of the YouTube UI.
- 🧪 **Glassmorphism**: Modern glass effects on overlays and big play button.
- 📱 **Fully Responsive**: Works seamlessly across all screen sizes.
- ⌨️ **Keyboard Shortcuts**: Familiar controls (Space for play/pause, J/K/L for seeking, etc.).
- 🛠️ **Customizable**: Easy to theme and extend with your own logic.
- 📦 **Lightweight**: Zero heavy dependencies, optimized for performance.

## Installation

```bash
# Documentation for installation coming soon
npm install pimo-player
```

## Quick Start

```tsx
import { VideoPlayer } from 'pimo-player';
import 'pimo-player/dist/index.css';

const App = () => {
  return (
    <div className="container">
      <VideoPlayer 
        src="https://example.com/video.mp4"
        poster="https://example.com/poster.jpg"
        theme="dark"
      />
    </div>
  );
};
```

## License

MIT © [Rajan Prajapati](https://github.com/rajanprajapati1)

