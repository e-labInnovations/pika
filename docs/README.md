# Pika Documentation Site

This is the documentation site for Pika, built with [Docusaurus](https://docusaurus.io/).

## 🚀 Quick Start

### Prerequisites

- Node.js 18.0 or later
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm start
```

This will start the development server at `http://localhost:3000`.

### Build

```bash
npm run build
```

### Deploy

```bash
npm run deploy
```

## 📁 Project Structure

```
docs/
├── src/
│   ├── components/     # Reusable components
│   ├── css/           # Global styles
│   ├── pages/         # Landing page and other pages
│   └── components/    # Homepage features
├── static/
│   ├── img/           # Images and screenshots
│   └── icons/         # Icon assets
├── docusaurus.config.ts # Main configuration
└── sidebars.ts        # Documentation sidebar
```

## 🎨 Customization

### Colors and Theme

The site uses a custom color scheme defined in `src/css/custom.css`:

- Primary: `#6366f1` (Indigo)
- Accent: `#06b6d4` (Cyan)
- Gradients: Linear gradients from primary to accent

### Screenshots

The landing page showcases screenshots from the Pika application located in `static/img/screenshots/`.

### Logo

The Pika logo is defined in `static/img/logo.svg` and uses the brand gradient.

## 📱 Features

- **Responsive Design**: Works on all devices
- **Dark/Light Mode**: Automatic theme switching
- **Modern UI**: Glassmorphism effects and smooth animations
- **SEO Optimized**: Meta tags and social media cards
- **Fast Loading**: Optimized images and code splitting

## 🔧 Configuration

Key configuration options in `docusaurus.config.ts`:

- Site title and description
- Navigation menu
- Footer links
- Social media integration
- GitHub repository links

## 📚 Documentation

- **Getting Started**: `/docs/intro`
- **API Reference**: `/docs/api`
- **Deployment**: `/docs/deployment`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
