# NYT Chronicle

A modern, minimalist React application for searching The New York Times articles with a sleek
black-and-white design.

## ✨ Features

- **Real-time Search**: Search NYT articles with debounced input for optimal performance
- **Modern Design**: Clean, monochrome interface inspired by quality journalism
- **Responsive Layout**: Works beautifully on desktop, tablet, and mobile devices
- **Smooth Animations**: Powered by Framer Motion for delightful user interactions
- **Type Safety**: Built with TypeScript for robust development experience
- **State Management**: Redux Toolkit for efficient data handling

## 🚀 Tech Stack

- **React 18** with TypeScript
- **Redux Toolkit** + React Redux for state management
- **Framer Motion** for animations
- **Tailwind CSS** for styling
- **Axios** for API calls
- **React Router DOM** for navigation
- **Inter Font** for typography
- **Vite** for fast development and building

## 📦 Getting Started

### Prerequisites

- Node.js 16.x or later
- pnpm or yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd nyt-chronicle
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Start the development server**

   ```bash
   pnpm run dev
   ```

4. **Open your browser** Navigate to `http://localhost:8080` to see the application.

## 🎨 Design System

NYT Chronicle uses a carefully crafted monochrome design system:

- **Colors**: Pure blacks (#000), whites (#fff), and neutral grays
- **Typography**: Inter font family for clean, readable text
- **Spacing**: Consistent spacing scale for visual harmony
- **Animations**: Subtle, purposeful motion that enhances UX

## 🔍 API Integration

This app integrates with The New York Times Article Search API:

- **Endpoint**: `https://api.nytimes.com/svc/search/v2/articlesearch.json`
- **Features**: Real-time article search with metadata
- **Error Handling**: Graceful error states and loading indicators
- **Rate Limiting**: Built-in protection against API rate limits

## 📱 Key Components

### `SearchInput`

- Debounced search input (500ms delay)
- Loading states and clear functionality
- Auto-submits on Enter key

### `ArticleCard`

- Displays article metadata (headline, author, date, snippet)
- Hover animations and responsive design
- Direct links to full articles

### `ArticlePage`

- Detailed article view with full metadata
- Social sharing functionality
- Responsive image handling

## 🛠️ Development

### Project Structure

```
src/
├── components/          # Reusable UI components
├── hooks/              # Custom React hooks
├── pages/              # Page components
├── services/           # API services
├── store/              # Redux store and slices
└── index.css           # Global styles and design system
```

### Available Scripts

- `pnpm run dev` - Start development server
- `pnpm run build` - Build for production
- `pnpm run preview` - Preview production build
- `pnpm run lint` - Run ESLint

### Design System Usage

The app uses a comprehensive design system defined in `src/index.css`:

```css
/* Use semantic color tokens */
.my-component {
  @apply bg-card text-card-foreground border-border;
}

/* Pre-built component classes */
.btn-primary,
.btn-secondary .article-card,
.search-input .headline-primary,
.body-large;
```

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Deploy automatically on every push
3. Custom domain support available

### Netlify

1. Build command: `pnpm run build`
2. Publish directory: `dist`
3. Auto-deploy from Git

### Other Platforms

The app builds to a static `dist/` folder that can be served by any static hosting service.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built with ❤️ using React, TypeScript, and modern web technologies.
