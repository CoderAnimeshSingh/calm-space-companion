# 🧠 Mental Wellness - Your Personal Wellness Companion

> A comprehensive mental health platform combining AI-powered conversations, mood tracking, journaling, and progress analytics to support your wellness journey.

[![Built with Lovable](https://img.shields.io/badge/Built%20with-Lovable-blue)](https://lovable.dev)
[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-green.svg)](https://supabase.com/)

## ✨ Features

### 🤖 AI Wellness Companion
- **Intelligent Conversations**: Chat with an AI companion trained in wellness support
- **Personalized Responses**: Adaptive AI personality (Zen, Friendly, Professional)
- **24/7 Availability**: Always there when you need emotional support
- **Context-Aware**: Remembers your conversation history for continuity

### 📊 Advanced Mood Tracking
- **Rich Emotion Mapping**: Track 7 different mood types with intensity levels
- **Visual Analytics**: Beautiful charts showing mood trends over time
- **Pattern Recognition**: Identify triggers and patterns in your emotional states
- **Historical Data**: Complete mood history with notes and context

### 📖 Digital Journaling
- **Rich Text Editor**: Write detailed journal entries with mood associations
- **Search & Filter**: Find past entries by mood, date, or keywords
- **Private & Secure**: All entries are encrypted and privately stored
- **Export Capability**: Download your journaling history anytime

### 📈 Progress Analytics
- **Wellness Dashboard**: Comprehensive overview of your mental health journey
- **Trend Analysis**: See improvement patterns and identify areas for growth
- **Achievement System**: Unlock milestones as you maintain healthy habits
- **Data Export**: Complete analytics export for personal review

### 🔒 Privacy & Security
- **End-to-End Encryption**: All personal data is securely encrypted
- **User-Controlled Data**: Full control over your data with export/delete options
- **GDPR Compliant**: Built with privacy-first principles
- **Secure Authentication**: Powered by Supabase Auth

## 🚀 Technology Stack

### Frontend
- **React 18.3.1** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development with excellent IDE support
- **Tailwind CSS** - Utility-first CSS framework with custom design system
- **Framer Motion** - Smooth animations and micro-interactions
- **shadcn/ui** - High-quality, accessible UI components
- **React Query** - Server state management and caching
- **React Router** - Client-side routing with nested routes

### Backend & Infrastructure
- **Supabase** - Backend-as-a-Service with PostgreSQL database
- **Row Level Security (RLS)** - Database-level security policies
- **Edge Functions** - Serverless functions for AI integration
- **Real-time Subscriptions** - Live data updates
- **Supabase Auth** - Complete authentication system

### AI & Integrations
- **OpenAI GPT-4** - Advanced AI for wellness conversations
- **Custom Prompting** - Specialized prompts for mental health support
- **Streaming Responses** - Real-time AI response delivery
- **Context Management** - Conversation memory and personalization

## 🎨 Design Philosophy

### Emotional Design System
- **Calming Color Palette**: Carefully chosen colors to promote relaxation
- **Mood-Based Theming**: Visual elements that adapt to emotional states
- **Accessibility First**: WCAG 2.1 AA compliant for inclusive design
- **Dark/Light Themes**: Comfortable viewing in any environment

### User Experience
- **Intuitive Navigation**: Clear information architecture
- **Progressive Disclosure**: Features revealed as users engage more deeply
- **Micro-Interactions**: Subtle animations that provide feedback
- **Responsive Design**: Seamless experience across all devices

## 🔧 Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- Supabase account for backend services
- OpenAI API key for AI features

### Quick Start
```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd mental-wellness-app

# Install dependencies
npm install

# Set up environment variables
# Configure Supabase and OpenAI keys in your Supabase dashboard

# Start development server
npm run dev
```

### Environment Configuration
1. **Supabase Setup**: Project is pre-configured with Supabase integration
2. **OpenAI API Key**: Add your OpenAI API key to Supabase secrets as `OPENAI_API_KEY`
3. **Database Schema**: Auto-deployed with migrations for all required tables

## 📊 Database Schema

### Core Tables
- **profiles** - User profile information and preferences
- **mood_entries** - Mood tracking data with intensity and notes
- **journal_entries** - Private journal entries with rich content
- **chat_messages** - AI conversation history

### Security Features
- Row Level Security (RLS) policies ensure data privacy
- User-scoped access to all personal data
- Automatic data cleanup and retention policies

## 🌟 Key Features Deep Dive

### Mood Tracking Intelligence
- **7 Emotion Categories**: Happy, Calm, Excited, Anxious, Sad, Angry, Neutral
- **1-10 Intensity Scale**: Granular emotional measurement
- **Contextual Notes**: Rich context for each mood entry
- **Pattern Analysis**: AI-powered insights into emotional patterns

### AI Companion Capabilities
- **Therapeutic Conversations**: Evidence-based conversation techniques
- **Crisis Detection**: Automatic detection of concerning language patterns
- **Personalized Responses**: Adapts communication style to user preferences
- **Resource Recommendations**: Suggests relevant wellness resources

### Analytics & Insights
- **Trend Visualization**: Beautiful charts showing emotional patterns
- **Correlation Analysis**: Identify relationships between activities and mood
- **Progress Tracking**: Measure improvement over time
- **Goal Setting**: Set and track wellness objectives

## 🔐 Privacy & Data Protection

### Data Handling
- **Minimal Data Collection**: Only collect data necessary for functionality
- **User Ownership**: Users maintain full control over their data
- **Transparent Processing**: Clear explanation of how data is used
- **Right to Deletion**: Complete data removal on request

### Security Measures
- **Encryption at Rest**: All data encrypted in database
- **Secure Transmission**: HTTPS/TLS for all communications
- **Access Controls**: Role-based access to sensitive data
- **Audit Logging**: Complete audit trail of data access

## 📱 Responsive Design

### Mobile-First Approach
- **Touch-Optimized Interface**: Designed for mobile interaction
- **Offline Capability**: Core features work without internet
- **Progressive Web App**: Install on mobile devices
- **Cross-Platform**: Consistent experience across devices

## 🛠️ Development & Architecture

### Code Organization
- **Feature-Based Structure**: Organized by functionality
- **Reusable Components**: Modular, composable UI components
- **Type Safety**: Comprehensive TypeScript coverage
- **Testing**: Unit and integration tests for critical paths

### Performance Optimization
- **Code Splitting**: Lazy-loaded routes and components
- **Image Optimization**: Responsive images with modern formats
- **Caching Strategy**: Intelligent caching for API responses
- **Bundle Analysis**: Optimized bundle size for fast loading

## 🚀 Deployment

### Production Ready
- **Automated Deployment**: CI/CD pipeline with Lovable
- **Environment Management**: Separate staging and production environments
- **Performance Monitoring**: Real-time application performance tracking
- **Error Reporting**: Comprehensive error tracking and reporting

### Scaling Considerations
- **Database Optimization**: Indexed queries for fast data retrieval
- **CDN Integration**: Global content delivery for optimal performance
- **Load Balancing**: Horizontal scaling capabilities
- **Monitoring**: Comprehensive application and infrastructure monitoring

## 🤝 Contributing

We welcome contributions to improve the Mental Wellness platform! Please read our contributing guidelines and code of conduct before submitting pull requests.

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes with tests
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support, feature requests, or questions:
- Create an issue in this repository
- Contact the development team
- Check the documentation wiki

## 🌟 Acknowledgments

- Built with [Lovable](https://lovable.dev) - AI-powered development platform
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Backend infrastructure by [Supabase](https://supabase.com/)
- AI capabilities powered by [OpenAI](https://openai.com/)

---

**Mental Wellness App** - Empowering individuals on their journey to better mental health through technology, empathy, and data-driven insights.

## Resume Summary

**Mental Wellness Platform | Full-Stack React Application**
Developed a comprehensive mental health platform featuring AI-powered wellness conversations, advanced mood tracking with data visualization, secure journaling, and progress analytics. Built with React, TypeScript, Supabase backend, and OpenAI integration, emphasizing privacy-first design and accessibility standards.

**Key Technologies:** React 18, TypeScript, Supabase, OpenAI GPT-4, Tailwind CSS, Framer Motion, Real-time Analytics