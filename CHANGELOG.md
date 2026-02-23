# Changelog

All notable changes to the Echoverse project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.1] - 2026-02-23

### 🐛 Bug Fixes
- **Support Chatbot Disappearing Issue (Critical)** - Fixed the "ghost chatbot" that was disappearing and reappearing constantly
  - Removed aggressive 3-second refresh polling in `useChatbotOptions` hook
  - Simplified state management to prevent unnecessary component remounting
  - Added GPU acceleration with `will-change` CSS property
  - Component now maintains stable visibility throughout user session
  - Settings are checked on initial load only, not continuously

### ✨ Features
- Support Chatbot component fully functional and stable

### 📚 Documentation
- Updated README.md with recent bug fixes and improvements
- Updated CHATBOT_SETUP.md with stability documentation
- Created CHANGELOG.md for version tracking

### 🚀 Performance
- Optimized component rendering to reduce unnecessary re-renders
- Enhanced animation performance with CSS performance hints

## [1.0.0] - 2026-02-20

### ✨ Initial Release
- Homepage with hero section and features showcase
- Course catalog page with filtering
- Pricing page with subscription tiers
- About page with team and statistics
- Contact page with inquiry form
- User authentication (Login/Sign Up)
- Support chatbot widget
- Fully responsive design
- Tailwind CSS styling
- TypeScript support
- ESLint configuration

### 📱 Features
- Mobile-first responsive design
- Purple and pink gradient theme
- Modern UI components
- Admin dashboard
- Database integration with Supabase

---

## Planned for Future Releases

### Version 1.1.0
- [ ] User dashboard with course progress tracking
- [ ] Payment integration (Stripe/PayPal)
- [ ] Course enrollment system
- [ ] Advanced search and filtering

### Version 1.2.0
- [ ] Student reviews and ratings
- [ ] Email notifications system
- [ ] Multi-language support
- [ ] Video course player

### Version 2.0.0
- [ ] Mobile app (iOS/Android)
- [ ] Certificate generation
- [ ] Advanced analytics dashboard
- [ ] API documentation

---

## How to Report Issues

If you find a bug or have a feature request, please report it through the admin contact form or directly to: support@echoverse.com
