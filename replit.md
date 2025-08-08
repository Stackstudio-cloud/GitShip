# replit.md

## Overview

GitShip is a revolutionary, open-source deployment platform with flame-powered speed and intelligence, built as a comprehensive full-stack web application that redefines how developers ship code. The platform enables users to connect GitHub repositories through dual authentication (Replit Auth + GitHub OAuth) and automatically build and deploy static sites with real-time monitoring. The application uses a modern monorepo structure with separate client and server directories, implementing a git-driven workflow with atomic deployments and professional flame-themed UI.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming (dark theme optimized)
- **State Management**: TanStack React Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL using Neon serverless database
- **ORM**: Drizzle ORM for type-safe database operations
- **Authentication**: Replit Auth using OpenID Connect with Passport.js
- **Session Management**: Express sessions with PostgreSQL store
- **Real-time**: WebSocket support for live build logs

### Development Setup
- **Monorepo Structure**: Client and server code in separate directories with shared schema
- **Build System**: Vite for frontend bundling, esbuild for server bundling
- **Development**: Hot reload via Vite dev server with Express middleware
- **Type Safety**: Shared TypeScript interfaces between client and server

## Key Components

### Database Schema
Located in `shared/schema.ts`, defines:
- **Users table**: Stores user authentication data from Replit Auth
- **Projects table**: Repository information, build configuration, and deployment settings
- **Deployments table**: Build status, logs, and deployment metadata
- **Functions table**: Serverless function configurations
- **Analytics table**: Site performance and usage metrics
- **Sessions table**: Required for Replit Auth session management

### Authentication System
- Replit Auth integration with OpenID Connect
- JWT token handling and session management
- Automatic user creation and profile synchronization
- Protected routes with authentication middleware

### Project Management
- GitHub repository integration
- Build configuration (commands, output directories, frameworks)
- Environment variable management
- Custom domain support
- Branch-based deployments

### Deployment Pipeline
- Webhook-triggered builds from Git pushes
- Real-time build log streaming via WebSockets
- Atomic deployment strategy with rollback capability
- Static asset hosting and CDN integration
- Build status tracking and notifications

### Real-time Features
- Live build logs during deployment
- WebSocket connection management
- Real-time deployment status updates

## Recent Major Updates (January 22, 2025)

### Project Migration to Replit Environment (January 22, 2025)
- **Environment Setup**: Successfully migrated GitShip from Replit Agent to native Replit environment
- **Database Configuration**: PostgreSQL database provisioned and connected via DATABASE_URL
- **Infrastructure Migration**: All dependencies installed and configured for Replit compatibility
- **Security Implementation**: Proper client/server separation maintained during migration
- **Development Workflow**: Express server running on port 5000 with Vite dev server integration

### Migration Impact Assessment
- **Preserved**: Complete source code, database schema, project structure, and documentation
- **Lost in Migration**: Previous database data, environment variables, user sessions, and local assets
- **Authentication**: Replit Auth configuration may need reconfiguration for new environment
- **Next Steps**: Users will need to set up authentication and rebuild any lost data

### Gemini AI Integration Implementation (January 22, 2025)
- **AI Copilot Service**: Complete Gemini AI integration with comprehensive GitShipAI class providing 6 intelligent features
- **Code Analysis Engine**: Real-time code quality analysis with issue detection, optimization suggestions, and scoring system
- **Performance Intelligence**: AI-powered performance insights with automated optimization recommendations
- **Build Optimization**: Smart build configuration analysis and framework-specific optimization suggestions
- **Interactive Demos**: Working demo functionality on AI Copilot page showcasing code analysis capabilities
- **API Integration**: Full backend API routes for AI services with proper error handling and response formatting

### Technical AI Infrastructure
- **Gemini API Integration**: Proper integration with Google's Gemini 2.5 Pro and Flash models for different AI tasks
- **Structured AI Responses**: JSON schema validation for consistent AI output formatting across all features
- **Demo Endpoint**: Public demo route for showcasing AI capabilities without authentication requirements
- **Real-time UI**: Interactive AI analysis results display with live processing indicators and comprehensive results visualization
- **Blueprint Implementation**: Following javascript_gemini blueprint for optimal Gemini AI usage patterns

### OAuth Authentication System Enhancement (January 22, 2025)
- **Multi-Provider OAuth Demo**: Comprehensive OAuth authentication showcase supporting 6 providers (Replit, GitHub, Google, X, Apple, Email)
- **Interactive Provider Cards**: Real-time connection demo with scope display and security features overview
- **Authentication Flow Visualization**: Complete sign-in options with email/password fallback and security feature highlights
- **Integration Guide**: Step-by-step setup instructions for OAuth provider configuration
- **Production Ready**: Professional, polished interface with sophisticated animations and engaging user experience
- **Debug Resolution**: Successfully resolved all JSX structure errors and compilation issues for seamless functionality

### Authentic Templates Implementation (January 22, 2025)
- **Real GitHub Templates**: Replaced all mock templates with 18 authentic templates from popular GitHub repositories
- **Modern Framework Coverage**: React, Next.js, Vue.js, Astro, SvelteKit, Remix, Angular, T3 Stack, Shopify Hydrogen
- **Accurate Repository Data**: Real star counts, fork numbers, demo URLs, and repository links from actual GitHub projects
- **One-Click Deployment**: Functional deployment buttons that integrate with GitShip's deployment pipeline
- **Professional Categories**: Organized by portfolio, SaaS, e-commerce, blogs, dashboards, documentation, and static sites
- **Enhanced Search & Filtering**: Advanced template discovery with category filtering and framework-specific icons

### Interactive Onboarding Tutorial System (January 22, 2025)
- **Smart Tutorial System**: Comprehensive onboarding with interactive tooltips and guided tours for new users
- **Automatic Detection**: New users receive automatic tutorial start with localStorage tracking for completion status
- **Floating Help Button**: Always-available help button (bottom-right) allows manual tutorial restart anytime
- **Page-Specific Tours**: Custom onboarding flows for Landing page, Dashboard, Templates, AI Copilot, and Project detail pages
- **Interactive Tooltips**: Professional tooltip design with step navigation, skip options, and progress tracking
- **Enhanced UX**: Targeted element highlighting, backdrop blur, and smooth animations for engaging user experience

### Interactive Help Center with Contextual Guidance (January 22, 2025)
- **Comprehensive Help Center**: Full-featured help dialog with searchable articles, categorized content, and support resources
- **Contextual Tips**: Smart page-specific tips that appear automatically based on user location and behavior
- **Smart Assistant**: AI-powered chat assistant providing real-time help with deployment issues, troubleshooting, and best practices
- **Multi-Tab Interface**: Organized help content with dedicated sections for articles, contextual guidance, and support contacts
- **Intelligent Content**: Curated help articles covering deployment, troubleshooting, domains, AI features, and getting started
- **Priority-Based Suggestions**: Contextual tips with priority levels (high/medium/low) and dismissible interface for optimal user experience

## Recent Major Updates (January 22, 2025)

### Project Migration to Replit Environment (January 22, 2025)
- **Environment Setup**: Successfully migrated GitShip from Replit Agent to native Replit environment
- **Database Configuration**: PostgreSQL database provisioned and connected via DATABASE_URL
- **Infrastructure Migration**: All dependencies installed and configured for Replit compatibility
- **Security Implementation**: Proper client/server separation maintained during migration
- **Development Workflow**: Express server running on port 5000 with Vite dev server integration

### Migration Impact Assessment
- **Preserved**: Complete source code, database schema, project structure, and documentation
- **Lost in Migration**: Previous database data, environment variables, user sessions, and local assets
- **Authentication**: Replit Auth configuration may need reconfiguration for new environment
- **Next Steps**: Users will need to set up authentication and rebuild any lost data

### Professional Documentation & Project Structure Enhancement
- **Comprehensive README**: Created professional documentation combining technical implementation with clear setup instructions
- **Contributing Guidelines**: Established complete contribution framework with coding standards, testing guidelines, and security practices
- **Project Positioning**: Enhanced GitShip branding as the next-generation deployment platform with flame-powered speed and developer-first innovation
- **Development Roadmap**: Defined clear production phases from core infrastructure to enterprise features

### Professional README Enhancement (January 22, 2025)
- **Comprehensive Documentation**: Created professional GitHub README with live demo links, feature showcases, and visual previews
- **Screenshot Integration**: Added GitShip logo and visual assets with instructions for animated GIF creation  
- **Demo Link Integration**: Embedded working demo links for OAuth showcase, AI Copilot, Templates, and main platform
- **Technical Documentation**: Enhanced API documentation, development guidelines, and contribution workflows
- **Achievement Showcase**: Documented all major features completed including AI integration, authentication system, and professional UI

### Complete Deployment Pipeline Implementation (January 22, 2025)
- **Comprehensive GitHub Integration**: Full OAuth authentication with repository access, branch selection, and webhook management for automatic deployments
- **Real-time Build System**: BuildService class with framework detection, automated build commands, and live log streaming via WebSockets
- **Advanced Deployment Panel**: Complete UI with deployment history, real-time status updates, build logs viewer, and deployment management tools
- **Project Creation Workflow**: End-to-end GitHub repository selection with automatic framework detection and deployment configuration
- **Webhook Automation**: GitHub webhook handling for automatic deployments triggered by code pushes with signature verification
- **Environment Management**: Complete API routes for environment variables and team secrets management with encryption support

### Technical Infrastructure Achievements
- **Deployment Components**: DeploymentPanel with real-time polling, GitHubConnectButton with repository browsing, CreateProjectPage with step-by-step workflow
- **Backend Services**: BuildService for deployment orchestration, comprehensive API routes for GitHub integration, webhook processing, and environment management
- **Database Integration**: Full deployment tracking, environment variables storage, team secrets management, and project metadata with proper relationships
- **Authentication System**: Dual authentication (Replit Auth + GitHub OAuth) for secure repository access while maintaining user session management
- **Real-time Features**: WebSocket support for live build logs, deployment status updates, and automatic refresh capabilities

### GitHub OAuth Integration Implementation
- **Dual Authentication Architecture**: Implemented separate GitHub OAuth for repository access while maintaining Replit Auth for user authentication
- **GitHub API Integration**: Complete @octokit/rest integration with repository browsing, branch selection, and webhook management
- **Repository Management**: Interactive repository selector with search, metadata display, and automatic framework detection
- **Database Schema Updates**: Enhanced user and project tables to support GitHub tokens, repository metadata, and webhook configurations
- **Enhanced Project Creation**: GitHub repository validation, automatic framework detection, and webhook setup for continuous deployment

### Technical Infrastructure Improvements
- **GitHub Service Layer**: Comprehensive GitHubService class with repository operations, webhook management, and framework detection
- **Type-safe API Routes**: Enhanced backend routes with GitHub integration, error handling, and user validation
- **Frontend Components**: New GitHubConnectButton and RepositorySelector components with real-time repository browsing
- **Authentication Flow**: Complete OAuth callback handling with token storage and user GitHub profile synchronization

### Previous Updates (January 21, 2025)

### Breakthrough Features Beyond Netlify
- **AI Copilot**: Intelligent development assistant with real-time code analysis, automated debugging, and performance optimization suggestions
- **Performance Insights**: Advanced performance monitoring with automated optimization opportunities and real-time metrics
- **Developer-First Design**: Focus on improving developer experience with intelligent tooling and actionable insights
- **Complete Documentation Platform**: Comprehensive docs, guides, and templates sections with advanced search and categorization

### Differentiating Advantages Over Netlify
1. **AI-Powered Development**: Built-in AI assistant for debugging, optimization, and best practices
2. **Real-time Performance Intelligence**: Automated performance monitoring with actionable optimization suggestions
3. **Open Source Integration**: Native support for open source tools and community-driven development
4. **Advanced Collaboration**: Enhanced team features with intelligent project insights and recommendations

### Previous Updates (January 19, 2025)

### Advanced Feature Implementation
- **Real-time Build Logs**: WebSocket integration for live build streaming with auto-scroll and download capabilities
- **Team Collaboration**: Complete team management with role-based permissions (Owner, Admin, Developer, Viewer)
- **Domain Management**: Custom domain configuration with DNS setup guidance and SSL status tracking
- **Enhanced Project Detail**: Comprehensive tabbed interface with overview, builds, analytics, domains, team, and settings
- **Professional UI Components**: Advanced sidebar navigation, build log streaming, and team invitation system

### Technical Infrastructure
- **WebSocket Server**: Real-time communication for build logs with subscription management
- **Team API Routes**: Full CRUD operations for team member management and invitations
- **Domain API Routes**: Custom domain management with verification and SSL tracking
- **Enhanced Database Schema**: Added team collaboration and domain management data structures
- **Component Architecture**: Modular components for build logs, team management, and domain configuration

### User Experience Improvements
- **Tabbed Project Interface**: Organized project management with dedicated sections for different functionalities
- **Real-time Updates**: Live build progress with WebSocket streaming and status indicators
- **Professional Design**: Dark mode with neon accents, consistent with GitShip branding
- **Comprehensive Statistics**: Detailed project metrics including success rates, build times, and deployment history

## Data Flow

1. **Authentication Flow**: Users authenticate via Replit Auth, creating/updating user records
2. **Project Creation**: Users connect GitHub repositories, storing configuration in projects table
3. **Team Collaboration**: Project owners invite team members with role-based access control
4. **Build Trigger**: Manual or webhook-triggered builds with real-time WebSocket log streaming
5. **Domain Configuration**: Custom domain setup with DNS verification and SSL certificate management
6. **Analytics Tracking**: Comprehensive metrics collection for performance monitoring

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL serverless database client
- **drizzle-orm**: Type-safe ORM with PostgreSQL dialect
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Accessible UI component primitives
- **wouter**: Lightweight React router
- **passport**: Authentication middleware
- **express-session**: Session management

### Development Dependencies
- **vite**: Frontend build tool and dev server
- **typescript**: Type checking and compilation
- **tailwindcss**: Utility-first CSS framework
- **postcss**: CSS processing
- **esbuild**: Fast JavaScript/TypeScript bundler for server

### Replit-Specific
- **@replit/vite-plugin-runtime-error-modal**: Development error overlay
- **@replit/vite-plugin-cartographer**: Development tooling integration

## Deployment Strategy

### Development Environment
- Vite dev server with HMR for frontend development
- Express server with automatic restart on changes
- Shared TypeScript configuration for type safety
- Real-time error reporting and debugging tools

### Production Build
- Frontend: Vite builds optimized React bundle to `dist/public`
- Backend: esbuild bundles Express server to `dist/index.js`
- Database: Drizzle migrations for schema updates
- Environment: PostgreSQL database provisioning required

### Infrastructure Requirements
- PostgreSQL database (configured via DATABASE_URL)
- Node.js runtime environment
- Static file serving capability
- WebSocket support for real-time features
- Session secret for authentication (SESSION_SECRET)

The application follows a clean separation of concerns with shared TypeScript types, making it easy to maintain type safety across the full stack while providing a modern development experience optimized for the Replit platform.