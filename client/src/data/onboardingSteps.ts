import type { OnboardingStep } from '@/hooks/useOnboarding';

// Landing page onboarding steps
export const landingOnboardingSteps: OnboardingStep[] = [
  {
    id: 'welcome',
    target: '[data-onboarding="hero-title"]',
    title: 'Welcome to GitShip!',
    content: 'GitShip is your AI-powered deployment platform. Deploy faster with intelligent insights and seamless GitHub integration.',
    placement: 'bottom',
    delay: 500
  },
  {
    id: 'templates',
    target: '[data-onboarding="templates-link"]',
    title: 'Explore Templates',
    content: 'Browse our collection of professional templates. One-click deployment for React, Next.js, Vue, and more frameworks.',
    placement: 'bottom'
  },
  {
    id: 'ai-copilot',
    target: '[data-onboarding="ai-copilot-link"]',
    title: 'AI Copilot',
    content: 'Get intelligent code analysis, performance insights, and optimization suggestions powered by advanced AI.',
    placement: 'bottom'
  },
  {
    id: 'github-auth',
    target: '[data-onboarding="auth-button"]',
    title: 'Connect with Replit',
    content: 'Sign in with your Replit account to start deploying projects and accessing GitHub repositories.',
    placement: 'left'
  }
];

// Dashboard onboarding steps
export const dashboardOnboardingSteps: OnboardingStep[] = [
  {
    id: 'dashboard-welcome',
    target: '[data-onboarding="dashboard-title"]',
    title: 'Your Dashboard',
    content: 'Welcome to your GitShip dashboard! This is your command center for managing all your projects and deployments.',
    placement: 'bottom'
  },
  {
    id: 'create-project',
    target: '[data-onboarding="create-project-button"]',
    title: 'Create Your First Project',
    content: 'Click here to connect a GitHub repository and deploy your first project. GitShip will automatically detect your framework.',
    placement: 'bottom'
  },
  {
    id: 'sidebar-navigation',
    target: '[data-onboarding="sidebar"]',
    title: 'Navigation Sidebar',
    content: 'Use the sidebar to navigate between your projects, access templates, view documentation, and explore AI features.',
    placement: 'right'
  },
  {
    id: 'project-stats',
    target: '[data-onboarding="project-stats"]',
    title: 'Project Statistics',
    content: 'Monitor your deployment stats, build success rates, and performance metrics at a glance.',
    placement: 'top'
  },
  {
    id: 'recent-deployments',
    target: '[data-onboarding="recent-deployments"]',
    title: 'Recent Activity',
    content: 'Keep track of your latest deployments, build logs, and project updates in the activity feed.',
    placement: 'top'
  }
];

// Templates page onboarding steps
export const templatesOnboardingSteps: OnboardingStep[] = [
  {
    id: 'templates-overview',
    target: '[data-onboarding="templates-title"]',
    title: 'Template Gallery',
    content: 'Discover professionally designed templates for every use case. All templates are sourced from popular GitHub repositories.',
    placement: 'bottom'
  },
  {
    id: 'template-search',
    target: '[data-onboarding="template-search"]',
    title: 'Search & Filter',
    content: 'Use the search bar and category filters to find the perfect template for your project.',
    placement: 'bottom'
  },
  {
    id: 'template-categories',
    target: '[data-onboarding="template-categories"]',
    title: 'Framework Categories',
    content: 'Browse templates by framework: React, Next.js, Vue.js, static sites, e-commerce, and more.',
    placement: 'bottom'
  },
  {
    id: 'deploy-template',
    target: '[data-onboarding="featured-template"]',
    title: 'One-Click Deployment',
    content: 'Click any "Deploy Template" button to instantly deploy a template to your GitShip account.',
    placement: 'top'
  }
];

// AI Copilot onboarding steps
export const aiCopilotOnboardingSteps: OnboardingStep[] = [
  {
    id: 'ai-overview',
    target: '[data-onboarding="ai-title"]',
    title: 'AI Copilot Features',
    content: 'GitShip\'s AI Copilot provides intelligent development assistance with 6 powerful features.',
    placement: 'bottom'
  },
  {
    id: 'code-analysis',
    target: '[data-onboarding="code-analysis-card"]',
    title: 'Code Quality Analysis',
    content: 'Get real-time code quality insights, detect issues, and receive optimization suggestions.',
    placement: 'bottom'
  },
  {
    id: 'performance-insights',
    target: '[data-onboarding="performance-card"]',
    title: 'Performance Intelligence',
    content: 'AI-powered performance monitoring with automated optimization recommendations.',
    placement: 'bottom'
  },
  {
    id: 'try-demo',
    target: '[data-onboarding="demo-button"]',
    title: 'Try the Demo',
    content: 'Click "Try Demo" on any feature card to see the AI analysis in action with sample code.',
    placement: 'top'
  }
];

// Project detail onboarding steps
export const projectDetailOnboardingSteps: OnboardingStep[] = [
  {
    id: 'project-overview',
    target: '[data-onboarding="project-header"]',
    title: 'Project Management',
    content: 'This is your project control panel. Monitor deployments, manage settings, and view analytics.',
    placement: 'bottom'
  },
  {
    id: 'deployment-status',
    target: '[data-onboarding="deployment-status"]',
    title: 'Deployment Status',
    content: 'Track your current deployment status and see real-time build progress.',
    placement: 'bottom'
  },
  {
    id: 'build-logs',
    target: '[data-onboarding="build-logs"]',
    title: 'Build Logs',
    content: 'View live build logs and debugging information during deployments.',
    placement: 'top'
  },
  {
    id: 'project-tabs',
    target: '[data-onboarding="project-tabs"]',
    title: 'Project Sections',
    content: 'Use tabs to navigate between Overview, Builds, Analytics, Domains, Team settings, and more.',
    placement: 'bottom'
  }
];