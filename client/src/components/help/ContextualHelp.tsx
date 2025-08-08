import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Lightbulb, ArrowRight, CheckCircle } from 'lucide-react';
import { useLocation } from 'wouter';

interface ContextualTip {
  id: string;
  page: string;
  trigger?: string;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  dismissible: boolean;
  priority: 'high' | 'medium' | 'low';
}

export default function ContextualHelp() {
  const [location] = useLocation();
  const [dismissedTips, setDismissedTips] = useState<string[]>([]);
  const [visibleTips, setVisibleTips] = useState<ContextualTip[]>([]);

  const contextualTips: ContextualTip[] = [
    {
      id: 'dashboard-first-project',
      page: '/',
      title: 'Create Your First Project',
      description: 'Connect a GitHub repository to get started with your first deployment on GitShip.',
      action: {
        label: 'Create Project',
        onClick: () => {
          // Navigate to create project
          const createButton = document.querySelector('[data-onboarding="create-project-button"]');
          createButton?.scrollIntoView({ behavior: 'smooth' });
        }
      },
      dismissible: true,
      priority: 'high'
    },
    {
      id: 'templates-explore',
      page: '/templates',
      title: 'One-Click Deployment',
      description: 'Select any template and deploy it instantly to your GitShip account with zero configuration.',
      action: {
        label: 'View Featured',
        onClick: () => {
          const featuredSection = document.querySelector('[data-onboarding="featured-template"]');
          featuredSection?.scrollIntoView({ behavior: 'smooth' });
        }
      },
      dismissible: true,
      priority: 'medium'
    },
    {
      id: 'ai-copilot-demo',
      page: '/ai-copilot',
      title: 'Try AI Analysis',
      description: 'Experience the power of AI-driven code analysis with our interactive demo.',
      action: {
        label: 'Start Demo',
        onClick: () => {
          const demoButton = document.querySelector('[data-onboarding="demo-button"]');
          if (demoButton instanceof HTMLButtonElement) {
            demoButton.click();
          }
        }
      },
      dismissible: true,
      priority: 'high'
    },
    {
      id: 'oauth-demo-providers',
      page: '/oauth-demo',
      title: 'Explore OAuth Providers',
      description: 'See how GitShip integrates with multiple authentication providers for seamless user experience.',
      dismissible: true,
      priority: 'medium'
    },
    {
      id: 'docs-search',
      page: '/docs',
      title: 'Use Search for Quick Answers',
      description: 'Find specific documentation quickly using our enhanced search functionality.',
      dismissible: true,
      priority: 'low'
    }
  ];

  useEffect(() => {
    // Load dismissed tips from localStorage
    const dismissed = JSON.parse(localStorage.getItem('gitship-dismissed-tips') || '[]');
    setDismissedTips(dismissed);
  }, []);

  useEffect(() => {
    // Update visible tips based on current page and dismissed status
    const pageTips = contextualTips.filter(tip => 
      tip.page === location && 
      !dismissedTips.includes(tip.id)
    );
    
    // Sort by priority (high -> medium -> low)
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    pageTips.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
    
    setVisibleTips(pageTips.slice(0, 2)); // Show max 2 tips at once
  }, [location, dismissedTips]);

  const dismissTip = (tipId: string) => {
    const newDismissed = [...dismissedTips, tipId];
    setDismissedTips(newDismissed);
    localStorage.setItem('gitship-dismissed-tips', JSON.stringify(newDismissed));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-neon-orange/50 bg-neon-orange/5';
      case 'medium': return 'border-neon-yellow/50 bg-neon-yellow/5';
      case 'low': return 'border-neon-cyan/50 bg-neon-cyan/5';
      default: return 'border-gray-600 bg-dark-700';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return <Badge className="bg-neon-orange/20 text-neon-orange">High Priority</Badge>;
      case 'medium': return <Badge className="bg-neon-yellow/20 text-neon-yellow">Tip</Badge>;
      case 'low': return <Badge className="bg-neon-cyan/20 text-neon-cyan">Info</Badge>;
      default: return null;
    }
  };

  if (visibleTips.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-40 max-w-sm space-y-3">
      {visibleTips.map((tip) => (
        <Card 
          key={tip.id} 
          className={`${getPriorityColor(tip.priority)} border shadow-lg animate-in slide-in-from-right-full duration-300`}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2">
                <Lightbulb className="w-5 h-5 text-neon-yellow" />
                <CardTitle className="text-white text-sm">{tip.title}</CardTitle>
              </div>
              
              <div className="flex items-center space-x-2">
                {getPriorityBadge(tip.priority)}
                {tip.dismissible && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => dismissTip(tip.id)}
                    className="text-gray-400 hover:text-white h-6 w-6 p-0"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="pt-0">
            <CardDescription className="text-gray-300 text-xs mb-3">
              {tip.description}
            </CardDescription>
            
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => dismissTip(tip.id)}
                className="text-gray-400 hover:text-white text-xs"
              >
                <CheckCircle className="w-3 h-3 mr-1" />
                Got it
              </Button>
              
              {tip.action && (
                <Button
                  size="sm"
                  onClick={tip.action.onClick}
                  className="bg-neon-orange/90 hover:bg-neon-orange text-dark-900 font-semibold text-xs"
                >
                  {tip.action.label}
                  <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}