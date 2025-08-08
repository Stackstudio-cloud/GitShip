import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  HelpCircle, 
  Search, 
  Book, 
  MessageSquare, 
  Video, 
  Code, 
  Zap,
  AlertCircle,
  CheckCircle,
  ExternalLink,
  ArrowRight,
  Lightbulb,
  Clock,
  Star,
  Users,
  Settings,
  GitBranch,
  Shield
} from 'lucide-react';
import { useLocation } from 'wouter';

interface HelpArticle {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  readTime: number;
  tags: string[];
  content: string;
  helpful: number;
  lastUpdated: string;
}

interface ContextualTip {
  id: string;
  page: string;
  element?: string;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function HelpCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [location] = useLocation();
  
  const categories = [
    { id: 'all', name: 'All Topics', count: 24 },
    { id: 'getting-started', name: 'Getting Started', count: 6 },
    { id: 'deployment', name: 'Deployment', count: 8 },
    { id: 'domains', name: 'Domains & SSL', count: 4 },
    { id: 'ai-features', name: 'AI Features', count: 3 },
    { id: 'troubleshooting', name: 'Troubleshooting', count: 3 }
  ];

  const helpArticles: HelpArticle[] = [
    {
      id: '1',
      title: 'Getting Started with GitShip',
      description: 'Learn how to deploy your first project in under 5 minutes',
      category: 'getting-started',
      difficulty: 'beginner',
      readTime: 3,
      tags: ['setup', 'first-deploy', 'github'],
      content: `# Getting Started with GitShip

GitShip makes it incredibly easy to deploy your projects from GitHub repositories. Follow this guide to get your first deployment up and running.

## Step 1: Connect Your Repository
1. Click "Create Project" from your dashboard
2. Authorize GitShip to access your GitHub repositories
3. Select the repository you want to deploy

## Step 2: Configure Your Build
GitShip automatically detects your framework and suggests optimal build settings:
- **React**: Builds with Vite or Create React App
- **Next.js**: Supports both static and server-side rendering
- **Vue.js**: Optimized builds with Vite
- **Static Sites**: Direct deployment of HTML/CSS/JS

## Step 3: Deploy
Click "Deploy" and watch your site go live in seconds!

## Need Help?
- Check our AI Copilot for intelligent assistance
- Browse our template gallery for inspiration
- Join our community for support`,
      helpful: 127,
      lastUpdated: '2025-01-20'
    },
    {
      id: '2',
      title: 'Understanding Build Logs',
      description: 'How to read and troubleshoot build failures',
      category: 'troubleshooting',
      difficulty: 'intermediate',
      readTime: 5,
      tags: ['debugging', 'build-errors', 'logs'],
      content: `# Understanding Build Logs

Build logs are your best friend when troubleshooting deployment issues. Here's how to read them effectively.

## Common Build Errors

### Missing Dependencies
\`\`\`
Error: Module not found: Can't resolve 'package-name'
\`\`\`
**Solution**: Add the missing package to your package.json

### Build Command Issues
\`\`\`
npm ERR! missing script: build
\`\`\`
**Solution**: Ensure your package.json has a "build" script

### Environment Variables
\`\`\`
ReferenceError: process is not defined
\`\`\`
**Solution**: Check your environment variable configuration

## Using AI Copilot for Debugging
Our AI can automatically analyze your build logs and suggest fixes. Simply paste your error into the AI chat for instant help.`,
      helpful: 89,
      lastUpdated: '2025-01-18'
    },
    {
      id: '3',
      title: 'Custom Domain Setup',
      description: 'Configure custom domains with SSL certificates',
      category: 'domains',
      difficulty: 'intermediate',
      readTime: 7,
      tags: ['domains', 'ssl', 'dns'],
      content: `# Custom Domain Setup

Setting up a custom domain gives your project a professional appearance. Follow these steps to configure your domain.

## Step 1: Add Your Domain
1. Go to your project's "Domains" tab
2. Click "Add Custom Domain"
3. Enter your domain name (e.g., mysite.com)

## Step 2: Configure DNS
Add these DNS records to your domain provider:

### For Apex Domains (example.com)
- **Type**: A
- **Name**: @
- **Value**: 76.223.126.88

### For Subdomains (www.example.com)
- **Type**: CNAME
- **Name**: www
- **Value**: your-project.gitship.app

## Step 3: SSL Certificate
GitShip automatically provisions SSL certificates for all custom domains. This usually takes 5-10 minutes after DNS propagation.

## Troubleshooting
- DNS changes can take up to 24 hours to propagate
- Use \`dig\` or online DNS checkers to verify your records
- Contact support if SSL provisioning fails after 24 hours`,
      helpful: 156,
      lastUpdated: '2025-01-22'
    },
    {
      id: '4',
      title: 'AI Code Analysis Features',
      description: 'Leverage AI to optimize your code and deployments',
      category: 'ai-features',
      difficulty: 'beginner',
      readTime: 4,
      tags: ['ai', 'optimization', 'analysis'],
      content: `# AI Code Analysis Features

GitShip's AI Copilot provides intelligent insights to improve your code quality and deployment performance.

## Code Quality Analysis
Get real-time feedback on:
- **Security vulnerabilities** in dependencies
- **Performance bottlenecks** in your code
- **Best practices** recommendations
- **Bundle size optimization** opportunities

## How to Use AI Analysis
1. Navigate to the AI Copilot page
2. Click "Try Demo" on any feature card
3. Upload your code or paste snippets for analysis
4. Review AI suggestions and apply fixes

## Performance Intelligence
Our AI monitors your deployed applications and provides:
- **Load time optimization** suggestions
- **SEO improvements** recommendations
- **Accessibility audit** results
- **Core Web Vitals** analysis

## Integration with Build Process
Enable automatic AI analysis during builds to catch issues before deployment.`,
      helpful: 94,
      lastUpdated: '2025-01-21'
    }
  ];

  const contextualTips: ContextualTip[] = [
    {
      id: 'dashboard-welcome',
      page: '/',
      title: 'Welcome to GitShip!',
      description: 'Start by creating your first project or explore our templates for quick deployment.',
      action: {
        label: 'Create Project',
        onClick: () => console.log('Navigate to create project')
      }
    },
    {
      id: 'templates-guide',
      page: '/templates',
      title: 'Choose the Perfect Template',
      description: 'Browse our curated collection of professional templates. Each one can be deployed with a single click.',
      action: {
        label: 'View Featured',
        onClick: () => console.log('Scroll to featured')
      }
    },
    {
      id: 'ai-copilot-help',
      page: '/ai-copilot',
      title: 'AI-Powered Development',
      description: 'Use our AI features to analyze code, optimize performance, and get intelligent deployment suggestions.',
      action: {
        label: 'Try Demo',
        onClick: () => console.log('Start AI demo')
      }
    }
  ];

  const getContextualTips = () => {
    return contextualTips.filter(tip => tip.page === location);
  };

  const filteredArticles = helpArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-600/20 text-green-400';
      case 'intermediate': return 'bg-neon-yellow/20 text-neon-yellow';
      case 'advanced': return 'bg-neon-red/20 text-neon-red';
      default: return 'bg-gray-600/20 text-gray-400';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'getting-started': return <Lightbulb className="w-4 h-4" />;
      case 'deployment': return <Zap className="w-4 h-4" />;
      case 'domains': return <Shield className="w-4 h-4" />;
      case 'ai-features': return <Star className="w-4 h-4" />;
      case 'troubleshooting': return <AlertCircle className="w-4 h-4" />;
      default: return <Book className="w-4 h-4" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="fixed bottom-20 right-6 z-50 bg-dark-800 border-neon-cyan/50 text-neon-cyan hover:bg-dark-700 hover:border-neon-cyan shadow-lg"
        >
          <HelpCircle className="w-4 h-4 mr-2" />
          Help
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-6xl max-h-[90vh] bg-dark-800 border-dark-600 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white flex items-center">
            <Book className="w-6 h-6 mr-3 text-neon-cyan" />
            GitShip Help Center
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="help" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-dark-700">
            <TabsTrigger value="help" className="data-[state=active]:bg-neon-cyan data-[state=active]:text-dark-900">
              Help Articles
            </TabsTrigger>
            <TabsTrigger value="contextual" className="data-[state=active]:bg-neon-cyan data-[state=active]:text-dark-900">
              Page Guide
            </TabsTrigger>
            <TabsTrigger value="contact" className="data-[state=active]:bg-neon-cyan data-[state=active]:text-dark-900">
              Get Support
            </TabsTrigger>
          </TabsList>

          <TabsContent value="help" className="mt-6">
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search help articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-dark-700 border-dark-600 text-white placeholder-gray-400 focus:border-neon-cyan"
                />
              </div>
              
              <div className="flex gap-2 flex-wrap">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className={`${
                      selectedCategory === category.id 
                        ? "bg-neon-cyan text-dark-900" 
                        : "border-gray-600 text-white hover:bg-dark-700"
                    }`}
                  >
                    {getCategoryIcon(category.id)}
                    <span className="ml-2">{category.name} ({category.count})</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Help Articles */}
            <ScrollArea className="h-[500px]">
              <div className="grid gap-4">
                {filteredArticles.map((article) => (
                  <Card key={article.id} className="bg-dark-700 border-dark-600 hover:border-neon-cyan/50 transition-all">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-white text-lg mb-2">{article.title}</CardTitle>
                          <CardDescription className="text-gray-400 mb-3">
                            {article.description}
                          </CardDescription>
                          
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge className={getDifficultyColor(article.difficulty)}>
                              {article.difficulty}
                            </Badge>
                            <Badge variant="outline" className="border-gray-600 text-gray-400">
                              <Clock className="w-3 h-3 mr-1" />
                              {article.readTime} min read
                            </Badge>
                            <Badge variant="outline" className="border-gray-600 text-gray-400">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              {article.helpful} helpful
                            </Badge>
                          </div>
                          
                          <div className="flex gap-1 mt-2">
                            {article.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="secondary" className="bg-dark-600 text-gray-300 text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-neon-cyan/50 text-neon-cyan hover:bg-neon-cyan hover:text-dark-900"
                        >
                          Read <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="contextual" className="mt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">Contextual Tips for This Page</h3>
              
              {getContextualTips().length > 0 ? (
                <div className="grid gap-4">
                  {getContextualTips().map((tip) => (
                    <Card key={tip.id} className="bg-dark-700 border-neon-yellow/50">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-white text-lg mb-2 flex items-center">
                              <Lightbulb className="w-5 h-5 mr-2 text-neon-yellow" />
                              {tip.title}
                            </CardTitle>
                            <CardDescription className="text-gray-400">
                              {tip.description}
                            </CardDescription>
                          </div>
                          
                          {tip.action && (
                            <Button 
                              onClick={tip.action.onClick}
                              className="bg-neon-yellow text-dark-900 hover:bg-neon-yellow/90"
                            >
                              {tip.action.label}
                            </Button>
                          )}
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="bg-dark-700 border-dark-600">
                  <CardContent className="pt-6 text-center">
                    <MessageSquare className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400">No specific tips for this page. Check the Help Articles tab for general guidance.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="contact" className="mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-dark-700 border-dark-600">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2 text-neon-cyan" />
                    Community Support
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Join our community for peer support and discussions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start border-gray-600 text-white hover:bg-dark-600">
                      <Users className="w-4 h-4 mr-2" />
                      Join Discord Community
                      <ExternalLink className="w-3 h-3 ml-auto" />
                    </Button>
                    <Button variant="outline" className="w-full justify-start border-gray-600 text-white hover:bg-dark-600">
                      <GitBranch className="w-4 h-4 mr-2" />
                      GitHub Discussions
                      <ExternalLink className="w-3 h-3 ml-auto" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-dark-700 border-dark-600">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Video className="w-5 h-5 mr-2 text-neon-orange" />
                    Video Tutorials
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Watch step-by-step guides and tutorials
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start border-gray-600 text-white hover:bg-dark-600">
                      <Video className="w-4 h-4 mr-2" />
                      Getting Started Series
                      <ExternalLink className="w-3 h-3 ml-auto" />
                    </Button>
                    <Button variant="outline" className="w-full justify-start border-gray-600 text-white hover:bg-dark-600">
                      <Code className="w-4 h-4 mr-2" />
                      Advanced Deployment Tips
                      <ExternalLink className="w-3 h-3 ml-auto" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}