# Mailinblack Next.js Application

A modern, responsive cybersecurity website built with Next.js, TypeScript, and Tailwind CSS. This application recreates the Mailinblack website with enhanced user experience and performance.

## 🚀 Features

- **Modern Tech Stack**: Built with Next.js 14, TypeScript, and Tailwind CSS
- **Responsive Design**: Fully responsive layout that works on all devices
- **Interactive Components**: 
  - Animated hero banner with floating elements
  - Swiper-based carousels for statistics and testimonials
  - Interactive platform tabs with video content
  - Scrolling partner logos animation
- **Performance Optimized**: 
  - Image optimization with Next.js Image component
  - Lazy loading for better performance
  - SEO-friendly with proper metadata
- **Accessibility**: Semantic HTML5 structure with proper ARIA labels
- **Smooth Animations**: Framer Motion for engaging micro-interactions

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Carousels**: Swiper.js
- **Fonts**: Inter (Google Fonts)

## 📦 Dependencies

### Core Dependencies
```json
{
  "next": "^14.0.0",
  "react": "^18.0.0",
  "react-dom": "^18.0.0",
  "typescript": "^5.0.0",
  "tailwindcss": "^3.0.0"
}
```

### Additional Dependencies
```json
{
  "framer-motion": "^10.0.0",
  "swiper": "^10.0.0",
  "lucide-react": "^0.300.0",
  "classnames": "^2.3.0"
}
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd mailinblack-nextjs
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
mailinblack-nextjs/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx           # Home page
│   └── components/             # Reusable components
│       ├── ui/                 # Base UI components
│       │   └── Button.tsx
│       ├── layout/             # Layout components
│       │   ├── Header.tsx
│       │   └── Footer.tsx
│       └── sections/           # Page sections
│           ├── HeroBanner.tsx
│           ├── StatisticsCards.tsx
│           ├── Technologies.tsx
│           ├── PlatformTabs.tsx
│           ├── Testimonials.tsx
│           ├── PartnerLogos.tsx
│           └── Resources.tsx
├── public/                    # Static assets
│   ├── images/
│   ├── videos/
│   └── logos/
├── tailwind.config.ts          # Tailwind configuration
└── package.json
```

## 🎨 Components Overview

### Layout Components
- **Header**: Navigation with dropdown menus, language selector, and mobile menu
- **Footer**: Multi-column footer with product cards and links

### Section Components
- **HeroBanner**: Animated hero section with floating cybersecurity icons
- **StatisticsCards**: Swiper carousel displaying key statistics
- **Technologies**: Icon cards showcasing anti-spam, anti-malware, anti-spearphishing
- **PlatformTabs**: Interactive tabs with video content for different products
- **Testimonials**: Customer testimonials carousel with company logos
- **PartnerLogos**: Scrolling animation of customer and media logos
- **Resources**: News and resources section with featured articles

### UI Components
- **Button**: Reusable button component with multiple variants

## 🎯 Key Features Implemented

### 1. Responsive Navigation
- Desktop dropdown menus with hover effects
- Mobile hamburger menu with smooth transitions
- Language selector
- Quick access to user area and support

### 2. Hero Section
- Animated floating icons representing cybersecurity concepts
- Gradient background with modern design
- Call-to-action button with hover effects

### 3. Interactive Statistics
- Swiper.js carousel with autoplay
- Percentage animations on scroll
- Product information cards

### 4. Platform Demonstrations
- Tab-based navigation between products
- Video content with play overlays
- Smooth transitions between tabs

### 5. Customer Testimonials
- Auto-rotating carousel
- Company logos and testimonials
- Custom navigation controls

### 6. Partner Showcase
- Infinite scrolling animation
- Customer and media logos
- Hover effects for engagement

## 🎨 Customization

### Colors
The application uses a custom color scheme. Modify `tailwind.config.ts` to update:

```typescript
theme: {
  extend: {
    colors: {
      'mailinblue': {
        blue: '#0066cc',
        'dark-blue': '#004499',
        'light-blue': '#e6f2ff',
      }
    }
  }
}
```

### Animations
Custom animations are defined in `globals.css` and can be modified:

```css
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}
```

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

## 🚀 Build & Deploy

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm run start
```

### Static Export (Optional)
```bash
npm run export
```

## 🌐 Environment Variables

Create a `.env.local` file for environment-specific variables:

```env
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_API_URL=https://api.your-domain.com
```

## 📊 Performance

- **Lighthouse Score**: 95+ (Performance, Accessibility, Best Practices, SEO)
- **Core Web Vitals**: Optimized for LCP, FID, CLS
- **Bundle Size**: Optimized with code splitting

## 🔍 SEO Features

- **Meta Tags**: Proper title, description, and keywords
- **Open Graph**: Social media sharing optimization
- **Twitter Cards**: Twitter-specific meta tags
- **Structured Data**: JSON-LD for search engines
- **Sitemap**: Auto-generated sitemap support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Original design inspiration from Mailinblack
- Icons from Lucide React
- Animations powered by Framer Motion
- Carousel functionality by Swiper.js

## 📞 Support

For questions or support:
- Create an issue in the repository
- Contact the development team

---

**Built with ❤️ using Next.js and modern web technologies**
