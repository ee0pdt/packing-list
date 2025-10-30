# PackApp - Remix v3 Experimental

A packing list application built with the experimental Remix v3 framework (@remix-run/dom).

## ⚠️ Warning

This uses **experimental, pre-release** Remix v3 packages that are marked "do not use in production". This is NOT React - it's a completely different rendering engine.

## ✨ Features

- Add, check, and delete packing items
- Track packed vs unpacked items
- Clean, minimal interface
- Built with experimental @remix-run/dom (NOT React!)

## 🚀 Getting Started

### Prerequisites

- Node.js (v20 or later recommended)
- npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ee0pdt/packing-list.git
cd packing-list
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Building for Production

To create a production build:
```bash
npm run build
```

To preview the production build locally:
```bash
npm run preview
```

Or start the production server:
```bash
npm start
```

## 🧪 Testing

```bash
npm test           # Run tests in watch mode
npm run test:run   # Run tests once
npm run test:ui    # Open Vitest UI
```

## 🛠️ Tech Stack

- **Framework**: @remix-run/dom v0.0.0-experimental-remix-jam.6 (NOT React!)
- **Events**: @remix-run/events v0.0.0-experimental-remix-jam.5
- **Build Tool**: Vite 6
- **Testing**: Vitest with happy-dom
- **Styling**: Inline CSS with css prop
- **Language**: TypeScript

## 🚀 Deployment

### Railway

This app is configured for Railway deployment:

1. Push to GitHub
2. Connect your repo to Railway
3. Railway will automatically:
   - Run `npm install && npm run build`
   - Start with `npm start`
   - Bind to `$PORT` environment variable

The app serves from the root path `/`.

### Other Platforms

For other platforms, use:
- **Build command**: `npm install && npm run build`
- **Start command**: `npm start`
- **Output directory**: `dist/`

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/ee0pdt/packing-list/issues).

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
