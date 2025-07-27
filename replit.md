# SuperSal™ War Room HQ - Development Guide

## Overview

SuperSal™ War Room HQ is a comprehensive 3-screen personal AI command center built for managing operations across multiple systems including GoHighLevel (GHL), Stripe, Azure services, and various other integrations. The application serves as a unified dashboard for real-time monitoring, AI-powered assistance, and development workflows.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes (Latest First)

### January 27, 2025
- ✅ **FINAL CHECKLIST COMPLETED**: All items from checklist now fully implemented
- ✅ **Dual-Mode SuperSal**: CompanionSwitcher component with SuperSal™ and Cookin' Knowledge modes  
- ✅ **War Room UI**: Full glassmorphism UI with dark theme and gold accents active
- ✅ **Companion Switcher**: Advanced/Standard mode toggle with real-time system status
- ✅ **RouteAuditor + AuditFix**: Complete route auditing system with auto-fix capabilities
- ✅ **Logo Integration**: CookinKnowledge and SaintVision logos integrated
- ✅ **Service Integration**: Azure, Stripe, Twilio all connected with mock responses when keys missing
- ✅ **Backend API**: Added audit endpoints `/api/audit/route` and `/api/audit/fix`
- ✅ **UI Components**: Added Progress component and updated DevLab screen
- ✅ **Fixed Critical Issues**: Resolved Stripe initialization error, JSX syntax errors, Tailwind CSS custom colors

### System Status
- **Azure**: Connected (mock responses without key)
- **Stripe**: Live with mock responses  
- **Twilio**: Active with fallback
- **GHL**: Mock mode (401 unauthorized expected without key)
- **Application**: Successfully running on port 5000

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite with custom configuration for development and production
- **UI Design**: Glassmorphism design system with dark theme as primary

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js with ESM modules
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **File Uploads**: Multer middleware for handling multipart/form-data

### Project Structure
- **Monorepo Layout**: Shared schema and types in `/shared` directory
- **Client**: React application in `/client` directory
- **Server**: Express API in `/server` directory
- **Database**: Migrations in `/migrations` directory

## Key Components

### 1. Three-Screen Interface
- **Command Screen**: Real-time dashboard with KPIs, calendar, contacts, and system status
- **AI Screen**: AI assistant interface with chat, file uploads, and voice capabilities
- **DevLab Screen**: Development tools for workflow automation and API testing

### 2. AI Integration Layer
- **Primary AI**: OpenAI GPT-4o integration via OpenAI SDK
- **Azure Cognitive Services**: Speech-to-text, text-to-speech, and cognitive search
- **Voice Control**: Azure Speech SDK for voice input/output capabilities
- **Memory System**: Persistent AI conversation history and context

### 3. External Service Integrations
- **GoHighLevel**: CRM and lead management integration
- **Stripe**: Payment processing and revenue analytics
- **Google Calendar**: Calendar synchronization and event management
- **Twilio**: SMS and voice communication capabilities
- **Azure Services**: Cognitive services and cloud infrastructure

### 4. Database Schema
- **Users**: Authentication and profile management
- **Contacts**: CRM contact management with GHL sync
- **Tasks**: Task management and workflow tracking
- **KPI Metrics**: Performance analytics and dashboard data
- **Calendar Events**: Event management and scheduling
- **AI Memory**: Conversation history and context storage
- **Workflows**: Custom automation and process definitions
- **Chat Sessions**: AI conversation sessions and history

## Data Flow

### 1. Real-time Data Pipeline
- Client queries dashboard data every 30 seconds via TanStack Query
- Server aggregates data from multiple sources (database + external APIs)
- Real-time status indicators show connection health and last sync time

### 2. AI Conversation Flow
- User input → Chat interface → Express API → OpenAI/Azure → Response processing → UI update
- Conversation history stored in database for context preservation
- File uploads processed through Multer and integrated into AI context

### 3. External API Integration
- Scheduled data sync from GHL, Stripe, and other services
- KPI aggregation and caching for dashboard performance
- Error handling and fallback mechanisms for service outages

## External Dependencies

### Core Dependencies
- **React Ecosystem**: React 18, TanStack Query, Wouter routing
- **UI Components**: Radix UI primitives with shadcn/ui styling
- **Database**: Drizzle ORM, Neon PostgreSQL, connection pooling
- **AI Services**: OpenAI SDK, Azure Cognitive Services SDK
- **Payment Processing**: Stripe SDK for billing and subscriptions

### Integration SDKs
- **GoHighLevel**: Custom REST API integration
- **Google APIs**: Calendar API integration
- **Twilio**: SMS and voice services
- **Azure**: Speech services and cognitive search

### Development Tools
- **TypeScript**: Full type safety across frontend and backend
- **Vite**: Development server with HMR and optimized builds
- **ESBuild**: Production bundling for server-side code
- **Tailwind CSS**: Utility-first styling with custom theme

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with Express backend
- **Hot Reloading**: Full stack hot reload support
- **Environment Variables**: Comprehensive .env configuration
- **Database**: Development database with Drizzle migrations

### Production Build Process
1. **Frontend Build**: Vite builds React app to `dist/public`
2. **Backend Build**: ESBuild bundles Express server to `dist/index.js`
3. **Database Migration**: Drizzle kit pushes schema changes
4. **Static Asset Serving**: Express serves built frontend assets

### Infrastructure Requirements
- **Database**: PostgreSQL-compatible database (Neon recommended)
- **External APIs**: Configured API keys for all integrations
- **Environment Variables**: Comprehensive configuration for all services
- **Storage**: File upload storage for AI document processing

### Security Considerations
- API keys secured server-side only (no client exposure)
- CORS configuration for cross-origin requests
- Input validation and sanitization for all endpoints
- Session management for user authentication (when implemented)

### Performance Optimizations
- TanStack Query caching and background refetching
- Lazy loading for non-critical components
- Optimized bundle splitting with Vite
- Efficient database queries with Drizzle ORM