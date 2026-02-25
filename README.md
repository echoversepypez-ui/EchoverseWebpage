# Echoverse Tutorial Online Services

A modern, responsive website for Echoverse Tutorial Online Services - an online learning platform offering expert-led courses in various fields.

## 📋 Recent Updates & Bug Fixes

### Latest Changes (February 23, 2026)

#### ✨ New Features
- **Real-Time Admin Chat System** - Complete solution for managing support conversations
  - Database-backed message storage
  - Real-time message delivery with Supabase Realtime
  - Admin dashboard at `/admin/support-conversations`
  - Multi-guest conversation management
  - Conversation status tracking (Open, In Progress, Closed)
  - Unread message indicators
  - Real-time conversation list updates

- **Improved Chat Error Handling** - Better UX when connections fail
  - Auto-retry mechanism for failed connections
  - User-friendly fallback options (Email, FAQ, Retry)
  - Clear system messages with emoji indicators
  - Graceful error recovery
  - Professional error states

#### 🐛 Bug Fixes
- **Fixed Support Chatbot Disappearing Issue** - Resolved the "ghost" chatbot that was disappearing and reappearing constantly
  - Removed aggressive 3-second refresh polling
  - Simplified state management for stability
  - Added GPU acceleration
  - Chatbot now maintains stable visibility

#### 🚀 Improvements
- Enhanced component stability
- Better error handling with clear messaging
- Automatic connection retry (transparent to user)
- Fallback options when live chat unavailable
- Improved system messages with friendly tone
- Mobile-optimized error states

## Features

- **Support Chatbot**: AI-powered support chatbot widget with categorized help options and admin chat integration
- **Homepage**: Beautiful landing page with hero section, features showcase, and call-to-action
- **Courses Page**: Comprehensive course catalog with filtering options
- **Pricing Page**: Multiple subscription tiers with feature comparison
- **About Page**: Company mission, vision, values, team members, and statistics
- **Contact Page**: Contact form with different inquiry categories
- **Authentication**: Login and Sign Up pages with form validation
- **Responsive Design**: Fully responsive for mobile, tablet, and desktop devices
- **Modern UI**: Built with Tailwind CSS and gradient designs

## Tech Stack

- **Framework**: Next.js 15+
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **Linting**: ESLint

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Navigate to the project directory:
```bash
cd echoverse
```

2. Install dependencies:
```bash
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Building for Production

```bash
npm run build
npm run start
```

## Project Structure

```
src/
├── app/
│   ├── page.tsx           # Homepage
│   ├── layout.tsx         # Root layout
│   ├── courses/
│   │   └── page.tsx       # Courses catalog page
│   ├── pricing/
│   │   └── page.tsx       # Pricing page
│   ├── about/
│   │   └── page.tsx       # About page
│   ├── contact/
│   │   └── page.tsx       # Contact page
│   ├── login/
│   │   └── page.tsx       # Login page
│   └── signup/
│       └── page.tsx       # Sign up page
├── components/
│   ├── SupportChatbot.tsx          # AI-powered support chatbot
│   ├── SupportChatbot.module.css   # Chatbot styling
│   └── [other components]
├── hooks/
│   ├── useChatbotOptions.ts        # Custom hook for chatbot data
│   └── [other hooks]
└── lib/
    ├── auth-context.tsx            # Authentication context
    └── supabase.ts                 # Supabase client setup
```

## Key Components

### Support Chatbot
- **File**: [src/components/SupportChatbot.tsx](src/components/SupportChatbot.tsx)
- **Features**:
  - Categorized help options with expandable menus
  - Dynamic chatbot options from database
  - Admin chat integration with real-time messaging
  - Guest ID tracking with localStorage
  - Responsive design with toggle button
  - System status notifications
  - Persistent across page navigation
- **Status**: ✅ Fully functional with database persistence

### Admin Chat System
- **Documentation**: [ADMIN_CHAT_SYSTEM.md](ADMIN_CHAT_SYSTEM.md)
- **Database**: [CREATE_ADMIN_CHAT_SYSTEM.sql](CREATE_ADMIN_CHAT_SYSTEM.sql)
- **Admin Dashboard**: `/admin/support-conversations`
- **Features**:
  - View all support conversations in real-time
  - Filter conversations by status (Open, In Progress, Closed)
  - Assign conversations to self
  - Real-time message synchronization
  - Message persistence in database
  - Unread message tracking
  - Conversation history
- **Hooks**:
  - `useAdminConversations()` - Manage conversation operations
  - `useConversationMessages()` - Handle message operations
- **Status**: ✅ Fully implemented and production-ready

## Pages

### Home (/)
- Hero section with compelling headline
- Features showcase (Expert-Led Courses, Learn at Your Pace, Community Support)
- Call-to-action section
- Navigation and footer

### Courses (/courses)
- Course grid layout with 6+ featured courses
- Course cards with:
  - Course title and description
  - Instructor name
  - Course duration and student count
  - Rating
  - Price and enroll button
- Filter options by level
- Responsive grid layout

### Pricing (/pricing)
- Three subscription tiers (Starter, Professional, Enterprise)
- Feature comparison
- "Most Popular" badge on Professional plan
- FAQ section
- Call-to-action buttons

### About (/about)
- Mission statement
- Vision statement
- Core values
- Key statistics
- Team member profiles
- Call-to-action

### Contact (/contact)
- Contact information cards (Email, Live Chat, Phone)
- Contact form with fields:
  - Name
  - Email
  - Subject dropdown
  - Message textarea
  - Submit button with success feedback

### Login (/login)
- Email and password inputs
- "Remember me" checkbox
- "Forgot password" link
- Social login options (Google, GitHub)
- Link to sign up page

### Sign Up (/signup)
- Full name input
- Email input
- Password inputs with confirmation
- Terms & Privacy Policy agreement checkbox
- Social sign up options
- Link to login page

## Customization

### Colors
The color scheme uses a purple and pink gradient. Modify the Tailwind classes to change colors:
- Primary: `from-purple-600 to-pink-600`
- Backgrounds: `from-slate-900 via-purple-900 to-slate-900`

### Content
Update the content in each page component directly in the respective files.

### Fonts
The project uses Tailwind's default sans-serif font. Modify the `tailwind.config.ts` to add custom fonts.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Vercel will automatically detect Next.js and deploy

```bash
npm install -g vercel
vercel
```

### Other Platforms

The build output is optimized for any Node.js hosting platform.

```bash
npm run build
npm run start
```

## Future Enhancements

- User dashboard with course progress
- Payment integration (Stripe/PayPal)
- Course enrollment system
- Student comments and reviews
- Search and advanced filtering
- Backend API integration
- Email notifications
- Video course player
- Certificate generation
- Multi-language support
- Mobile app (iOS/Android)

## License

This project is part of Echoverse Tutorial Online Services.

## Contact

For support, email: support@echoverse.com
Phone: +1 (555) 123-4567

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
