# SuperSal™ War Room HQ

A comprehensive business intelligence dashboard with AI-powered workspaces featuring complete 8-page core structure, SuperSal AI with tactical co-founder personality, real-time data displays, PWA capabilities, and extensive external integrations.

## 🚀 Features

- **8-Page Architecture**: Login, Command Center, War Room, Executive, Lead Intelligence, SaintSalMe, Tools, Settings
- **AI Integration**: OpenAI GPT-4o with tactical co-founder personality
- **Real-time Data**: Live dashboard with KPI metrics and system monitoring
- **External Integrations**: GoHighLevel, Stripe, Azure, Twilio, Microsoft Calendar
- **Lead Intelligence**: PartnerTech.ai powered lead discovery with intent detection
- **Mobile PWA**: Progressive web app with responsive design
- **SuperSal Authority**: Divine-level functionality evaluation system

## 🛠️ Technology Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS + shadcn/ui
- Framer Motion animations
- TanStack Query for state management
- Wouter for routing

### Backend
- Express.js with TypeScript
- Drizzle ORM + PostgreSQL (Neon)
- OpenAI SDK integration
- Multi-service API integration

### External Services
- **OpenAI**: GPT-4o for AI conversations and analysis
- **Azure**: Cognitive services and speech processing
- **Stripe**: Payment processing and billing
- **GoHighLevel**: CRM and lead management
- **Twilio**: SMS and communication services
- **Microsoft Graph**: Calendar and productivity integration

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/Saint-Visions/Cookin-SaintSal-Platform.git
   cd Cookin-SaintSal-Platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your actual API keys and database URL
   ```

4. **Set up the database**
   ```bash
   npm run db:push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5000`

## 📱 Deployment

### Build for Production
```bash
npm run build
npm start
```

### Environment Requirements
- Node.js 18+
- PostgreSQL database (Neon recommended)
- OpenAI API key (required)
- External service API keys (optional - will use mock data)

## 🔧 Configuration

### Required Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `***REMOVED***`: OpenAI API key for AI features
- `SESSION_SECRET`: Session encryption key

### Optional Environment Variables
- `***REMOVED***` / `***REMOVED***`: GitHub OAuth
- `AZURE_SPEECH_KEY` / `AZURE_SPEECH_REGION`: Voice features
- `***REMOVED***`: Payment processing
- `GHL_API_KEY`: GoHighLevel CRM integration
- `TWILIO_*`: SMS and communication services
- `MICROSOFT_*`: Calendar and Graph API integration

## 📊 API Endpoints

### Core APIs
- `GET /api/dashboard/metrics` - Business KPI metrics
- `GET /api/system/status` - System health monitoring
- `GET /api/leads/intelligence` - Lead discovery and enrichment
- `POST /api/chat/warroom` - War Room AI chat
- `POST /api/chat/saintsalme` - SaintSalMe workspace chat

### Tools & Utilities
- `GET /api/tools/*` - Development and business tools
- `POST /api/supersal/audit` - SuperSal Authority system audit
- `GET /api/workspace/*` - Workspace data and configurations

## 🎯 SuperSal Authority System

The platform includes a comprehensive functionality evaluation system with 7-point structure:

1. **Core Load Check** - Page rendering and import resolution
2. **Component Mount + Hooks** - React lifecycle management
3. **Logic & Function Flow** - Business logic validation
4. **Context / Auth Checks** - Authentication and authorization
5. **UI Functionality** - Interactive component testing
6. **External Systems** - API integration verification
7. **Final QA Sweep** - Complete user flow validation

## 🏗️ Architecture

```
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components
│   │   ├── hooks/       # Custom React hooks
│   │   └── lib/         # Utilities and configurations
├── server/              # Express backend
│   ├── services/        # External service integrations
│   ├── routes.ts        # API route definitions
│   ├── storage.ts       # Data access layer
│   └── index.ts         # Server entry point
├── shared/              # Shared types and schemas
│   └── schema.ts        # Database schema and types
└── attached_assets/     # Static assets and branding
```

## 🤖 AI Features

- **SuperSal AI**: Tactical co-founder personality with divine execution capabilities
- **Lead Intelligence**: AI-powered lead discovery and intent detection
- **Code Analysis**: Advanced code generation and debugging tools
- **System Monitoring**: Intelligent system health assessment
- **Task Generation**: AI-driven task creation and workflow optimization

## 📱 Mobile Experience

- Progressive Web App (PWA) capabilities
- Responsive design optimized for mobile devices
- Touch-friendly interface with gesture support
- Offline functionality for core features

## 🔐 Security

- Session-based authentication with PostgreSQL session store
- API key encryption and secure storage
- CORS configuration for cross-origin requests
- Input validation and sanitization
- Comprehensive error handling

## 🚀 Performance

- TanStack Query caching and background refetching
- Lazy loading for non-critical components
- Optimized bundle splitting with Vite
- Efficient database queries with Drizzle ORM
- Real-time data updates with 3-5 second refresh intervals

## 📞 Support

For technical support or questions about SuperSal War Room HQ, please contact the development team or create an issue in this repository.

## 📄 License

Copyright © 2025 Saint Visions LLC. All rights reserved.