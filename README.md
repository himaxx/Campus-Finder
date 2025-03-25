# 🎯 CampusFinder - Next-Gen Lost & Found Portal

<div align="center">

![CampusFinder Banner](https://placehold.co/800x200)

A modern, intuitive lost & found platform built for college campuses using Next.js 14

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)

[Demo](https://campus-finder.vercel.app) · [Features](#features) · [Installation](#installation) · [Documentation](docs/README.md)

</div>

## ✨ Features

### 🗺️ Interactive Campus Map
- Real-time item tracking with location markers
- Custom campus area highlighting
- Satellite & standard map views
- Zoom and pan controls

### 🎨 Beautiful UI Components
- Responsive design that works on all devices
- Dark/Light theme support
- Smooth animations and transitions
- Modern glassmorphism effects

### 📱 Core Functionality
- Report lost/found items
- Advanced item search & filtering
- QR code & NFC tag scanning
- Real-time activity feed
- Community engagement features

### 🤖 Smart Features
- AI-powered chat assistant
- Image recognition for item matching
- Smart location suggestions
- Automated notifications

## 🚀 Quick Start
bash
Clone the repository
git clone https://github.com/yourusername/campus-finder.git
Install dependencies
cd campus-finder
npm install
Run development server
npm run dev

Open [http://localhost:3000](http://localhost:3000) to view the app.

## 📸 Screenshots

<div align="center">
  <img src="https://placehold.co/400x300" alt="Dashboard" width="400"/>
  <img src="https://placehold.co/400x300" alt="Map View" width="400"/>
</div>

## 🎯 Key Components
typescript
// Recent Items Carousel
<RecentItemsCarousel
autoSlide={true}
autoSlideInterval={3000}
/>
// Interactive Campus Map
<CampusMap
pins={mapPins}
selectedPin={selectedPin}
setSelectedPin={setSelectedPin}
/>
// Activity Feed with Real-time Updates
<ActivityFeed />


## 🌟 Core Features

### Item Management
- **Lost Item Reporting**: Easy submission with image upload
- **Found Item Registration**: Quick form with location tagging
- **Status Tracking**: Real-time updates on item status
- **Image Management**: Multiple image upload with preview

### User Experience
- **Intuitive Navigation**: Clean, modern interface
- **Quick Actions**: Frequently used features readily available
- **Real-time Updates**: Instant notifications
- **Mobile-first Design**: Responsive on all devices

### Community Features
- **User Profiles**: Track activity and reputation
- **Achievement System**: Badges for active users
- **Points System**: Rewards for helping others
- **Activity Feed**: Community engagement tracking

## 📊 Dashboard Analytics
typescript
// Sample analytics configuration
const analyticsConfig = {
metrics: {
totalItems: 1248,
claimedItems: 842,
successRate: "67.5%",
activeUsers: 3642
},
charts: {
itemTrends: true,
locationHeatmap: true,
categoryDistribution: true
}
};

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Animations**: Framer Motion
- **Maps**: Leaflet
- **State Management**: React Hooks
- **Build Tools**: Vite, ESLint, Prettier

## 📦 Project Structure

campus-finder/
├── app/ # Next.js app directory
├── components/ # React components
│ ├── dashboard/ # Dashboard components
│ ├── map/ # Map components
│ └── ui/ # UI components
├── lib/ # Utility functions
├── hooks/ # Custom React hooks
├── public/ # Static assets
└── styles/ # Global styles

## 🔧 Configuration
typescript
// Map configuration
export const MAP_CONFIG = {
center: [22.796097, 75.842441],
zoom: 17,
minZoom: 16,
maxZoom: 19
};
// Theme configuration
export const THEME_CONFIG = {
light: {
background: "0 0% 100%",
foreground: "240 10% 3.9%"
},
dark: {
background: "240 10% 3.9%",
foreground: "0 0% 98%"
}
};


## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Leaflet](https://leafletjs.com/) - Interactive maps
- [Framer Motion](https://www.framer.com/motion/) - Smooth animations
- [Lucide Icons](https://lucide.dev/) - Beautiful icons

---

<div align="center">
  <p>Made with ❤️ for campus communities everywhere</p>
  
  <a href="https://github.com/yourusername/campus-finder/stargazers">
    <img src="https://img.shields.io/github/stars/yourusername/campus-finder?style=social" alt="Stars"/>
  </a>
</div>
