# GitShip 🔥

<div align="center">
  <h3>The ultimate open-source deployment platform with flame-powered speed</h3>
  <p>Built for developers who demand lightning-fast deployments with beautiful, intelligent tooling</p>
</div>

---

## 🌟 Features

### 🔥 Core Platform
- **Dual Authentication**: Replit Auth (GitHub, Google, email) + GitHub OAuth for repository access
- **GitHub Integration**: Native repository browser with search, filtering, and metadata display
- **Encrypted Secrets**: At-rest encryption for tokens and secrets with `ENCRYPTION_KEY`
- **Framework Auto-Detection**: Intelligent detection of React, Next.js, Vue, Nuxt, Astro, Svelte, Gatsby, Angular, and static sites
- **Real-time Build Logs**: WebSocket-powered live build streaming with downloadable logs
- **Team Collaboration**: Role-based team management with invitation system (ready for implementation)
- **Custom Domains**: DNS setup guidance and SSL certificate management (ready for implementation)
- **Environment Variables**: Secure environment variable management
- **Analytics Dashboard**: Performance metrics and deployment statistics

### 🎨 Design & Experience
- **Neon Flame Theme**: Professional dark mode with orange-cyan-purple-red flame gradient colors
- **Responsive UI**: shadcn/ui components optimized for all screen sizes
- **Real-time Updates**: Live build progress with WebSocket streaming
- **Professional Navigation**: Collapsible sidebar with project management

### 🛠 Technical Stack
- **Frontend**: React + TypeScript, Vite, TailwindCSS, shadcn/ui, Wouter routing
- **Backend**: Node.js + Express, PostgreSQL (Neon), Drizzle ORM
- **Authentication**: Replit Auth with OpenID Connect + GitHub OAuth
- **Real-time**: WebSocket server for live build logs
- **GitHub API**: Complete integration with @octokit/rest
- **State Management**: TanStack React Query for server state

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database (Neon recommended)
- GitHub OAuth App credentials

### Environment Setup

Create a `.env` file with:
```bash
# Database (provided by Replit/Neon)
DATABASE_URL=your_postgresql_url
SESSION_SECRET=your_session_secret

# GitHub OAuth (required for repository access)
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_WEBHOOK_SECRET=your_webhook_secret

# Optional security and OIDC
ENCRYPTION_KEY=32-byte-hex-or-base64
REPLIT_DOMAINS=your.repl.domain
ISSUER_URL=https://replit.com/oidc
REPL_ID=your_replit_client_id
```

### GitHub OAuth Setup

1. Go to GitHub → Settings → Developer settings → OAuth Apps
2. Create a new OAuth App:
   - **Application name**: GitShip
   - **Homepage URL**: Your deployment URL
   - **Authorization callback URL**: `your_url/api/auth/github/callback`
3. Copy the Client ID and Client Secret to your environment variables

### Installation & Development

```bash
# Install dependencies (automatically handled by Replit)
npm install

# Push database schema
npm run db:push

# Start development server
npm run dev
```

Visit your Replit URL to see GitShip in action! 🔥

## 📁 Project Structure

```
gitship/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components (navbar, sidebar, dialogs)
│   │   ├── pages/         # Route pages (dashboard, project details)
│   │   ├── hooks/         # React hooks (useAuth)
│   │   ├── lib/           # Utilities (queryClient, authUtils)
│   │   └── assets/        # Static assets
├── server/                 # Express backend
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API routes with GitHub integration
│   ├── db.ts              # Database connection
│   ├── replitAuth.ts      # Replit Auth with OpenID Connect
│   ├── github.ts          # GitHub API service layer
│   └── storage.ts         # Data access layer with Drizzle ORM
├── shared/                 # Shared types/schemas
│   └── schema.ts          # Complete database schema
└── README.md              # This file
```

## 🔧 Current Implementation Status

### ✅ Fully Implemented
- **Authentication System**: Replit Auth with multi-provider support
- **GitHub OAuth**: Repository access and user profile integration
- **Project Management**: CRUD operations with GitHub repository validation
- **Real-time Builds**: WebSocket streaming with 5-6 second simulated deployments
- **Database Layer**: PostgreSQL with Drizzle ORM, complete schema
- **Professional UI**: Flame-themed interface with responsive design
- **Repository Browser**: Interactive GitHub repository selection

### 🚧 Ready for Production Enhancement
- **Real Build Pipeline**: Container-based builds (currently simulated)
- **CDN Integration**: Global content delivery
- **Team Collaboration**: Database schema ready, UI pending
- **Custom Domains**: SSL certificate automation
- **Payment System**: Subscription management
- **Monitoring**: Error tracking and performance metrics

## 🌐 API Endpoints

### Authentication
- `GET /api/auth/user` - Get current authenticated user
- `GET /api/login` - Replit Auth login flow
- `GET /api/logout` - Logout user
- `GET /api/auth/github` - GitHub OAuth URL generation
- `GET /api/auth/github/callback` - GitHub OAuth callback

### GitHub Integration
- `GET /api/github/repositories` - List user's GitHub repositories
- Repository parsing, framework detection, webhook setup

### Projects
- `GET /api/projects` - List user projects with filtering
- `POST /api/projects` - Create project with GitHub validation
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project configuration
- `DELETE /api/projects/:id` - Delete project

### Deployments
- `GET /api/projects/:id/deployments` - List project deployments
- `POST /api/projects/:id/deploy` - Trigger new deployment
- `GET /api/deployments/:id/logs` - Real-time build logs via WebSocket

## 🔥 Neon Flame Color Palette

GitShip uses a carefully crafted flame-inspired design system:

```css
/* Neon Flame Colors */
--neon-cyan: 188 94% 42%      /* Primary links and highlights */
--neon-green: 142 71% 45%     /* Success states */
--neon-orange: 25 95% 53%     /* Warning and secondary actions */
--neon-purple: 271 81% 56%    /* Accent elements */
--neon-red: 0 84% 60%         /* Error states */

/* Dark Theme Foundation */
--dark-900: 222 84% 5%        /* Main background */
--dark-800: 215 28% 17%       /* Card/surface background */
--dark-700: 215 20% 25%       /* Elevated surfaces */
--dark-600: 215 16% 47%       /* Borders */
```

## 🚦 Development

### Available Scripts
- `npm run dev` - Start development server (Vite + Express)
- `npm run build` - Build for production
- `npm run db:push` - Push database schema changes
- `npm run db:studio` - Open Drizzle Studio

### Development Guidelines
- Follow the neon flame color scheme for consistency
- Use TypeScript throughout for type safety
- Implement comprehensive error handling
- Add real-time features where beneficial
- Maintain responsive design principles
- Use shadcn/ui components for consistency

## 🏗 Architecture Decisions

### Dual Authentication Strategy
- **Replit Auth**: Handles user login with multiple providers (GitHub, Google, email)
- **GitHub OAuth**: Separate integration for repository access and API operations
- **Benefit**: Users can log in with any provider but still access GitHub repositories

### Real-time Features
- **WebSocket Server**: Dedicated path `/ws` for live build logs
- **Build Simulation**: 5-6 second realistic deployment simulation
- **Live Updates**: Real-time project status and deployment progress

### Database Design
- **PostgreSQL + Drizzle ORM**: Type-safe database operations
- **Session Storage**: PostgreSQL-based sessions for Replit Auth
- **GitHub Integration**: Encrypted token storage and repository metadata

## 📊 Production Roadmap

GitShip is architected as the next-generation deployment platform with the following production priorities:

### Phase 1: Core Infrastructure
- **Build Workers**: Docker containerization for real builds
- **CDN Integration**: Global content delivery network
- **SSL Automation**: Let's Encrypt certificate management
- **Domain Management**: DNS automation and custom domain setup

### Phase 2: Enterprise Features
- **Team Collaboration**: Complete role-based access control
- **Payment Processing**: Subscription billing integration
- **Advanced Analytics**: Performance monitoring and insights
- **Enterprise Auth**: SSO and audit logging

### Phase 3: Advanced Features
- **AI Copilot**: Development assistance and code optimization
- **Performance Insights**: Automated optimization recommendations
- **Multi-region Deployments**: Global deployment infrastructure
- **Advanced Security**: Vulnerability scanning and compliance

## 🤝 Contributing

We welcome contributions! Follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Current Development Priorities
1. Real build pipeline implementation
2. Team collaboration UI components
3. Custom domain management interface
4. Enhanced security features
5. Performance optimizations

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

<div align="center">
  <p>Built with 🔥 by the GitShip team</p>
  <p>Ready to ship your code at the speed of flame?</p>
</div>