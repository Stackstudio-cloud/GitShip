import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MessageSquare, 
  Bot, 
  Send, 
  Sparkles, 
  User, 
  Clock,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Code,
  ExternalLink
} from 'lucide-react';
import { useLocation } from 'wouter';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  helpful?: boolean;
}

interface SmartSuggestion {
  id: string;
  page: string;
  context: string;
  suggestion: string;
  type: 'tip' | 'warning' | 'action';
}

export default function SmartAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [location] = useLocation();

  const smartSuggestions: SmartSuggestion[] = [
    {
      id: 'dashboard-first-deploy',
      page: '/',
      context: 'no-projects',
      suggestion: 'Ready to deploy your first project? Connect a GitHub repository to get started.',
      type: 'action'
    },
    {
      id: 'templates-framework',
      page: '/templates',
      context: 'browsing',
      suggestion: 'Looking for a specific framework? Use the category filters to find React, Vue, or Next.js templates.',
      type: 'tip'
    },
    {
      id: 'ai-performance',
      page: '/ai-copilot',
      context: 'viewing',
      suggestion: 'Pro tip: Enable AI analysis on your builds to catch performance issues before deployment.',
      type: 'tip'
    },
    {
      id: 'build-errors',
      page: '/projects',
      context: 'build-failed',
      suggestion: 'Build failing? Our AI can analyze your logs and suggest fixes automatically.',
      type: 'warning'
    }
  ];

  const quickActions = [
    'How do I deploy my React app?',
    'My build is failing, what should I check?',
    'How do I set up a custom domain?',
    'How does the AI code analysis work?',
    'What frameworks does GitShip support?',
    'How do I optimize my bundle size?'
  ];

  const contextualHelp = {
    '/': {
      title: 'Dashboard Help',
      suggestions: [
        'Create your first project by clicking "Create Project"',
        'Explore our templates for quick deployment options',
        'Check the AI Copilot for intelligent development assistance'
      ]
    },
    '/templates': {
      title: 'Templates Guide',
      suggestions: [
        'Use search to find templates for your specific framework',
        'Click "Deploy Template" for instant one-click deployment',
        'Check template GitHub repositories for customization ideas'
      ]
    },
    '/ai-copilot': {
      title: 'AI Features Help',
      suggestions: [
        'Try the demo features to see AI analysis in action',
        'Upload your code for personalized optimization suggestions',
        'Enable AI monitoring for continuous performance insights'
      ]
    },
    '/oauth-demo': {
      title: 'OAuth Integration',
      suggestions: [
        'Explore different authentication provider options',
        'Test connection flows with interactive demos',
        'Review security features and implementation guides'
      ]
    }
  };

  const getContextualContent = () => {
    return contextualHelp[location as keyof typeof contextualHelp] || {
      title: 'GitShip Help',
      suggestions: ['Ask me anything about deployments, AI features, or troubleshooting!']
    };
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    setChatHistory(prev => [...prev, userMessage]);
    setMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: generateResponse(message),
        timestamp: new Date(),
        suggestions: generateSuggestions(message)
      };

      setChatHistory(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateResponse = (userMessage: string) => {
    const msg = userMessage.toLowerCase();
    
    if (msg.includes('deploy') || msg.includes('deployment')) {
      return `To deploy your project on GitShip:

1. **Connect Repository**: Link your GitHub repository
2. **Auto-Configuration**: GitShip detects your framework automatically
3. **Deploy**: Click deploy and watch your site go live!

For React apps, ensure you have a "build" script in package.json. GitShip supports Next.js, Vue, Angular, and static sites out of the box.

Need help with a specific framework? Just ask!`;
    }
    
    if (msg.includes('build') && (msg.includes('fail') || msg.includes('error'))) {
      return `Build failures are common but easily fixable! Here's how to diagnose:

1. **Check Build Logs**: Look for specific error messages
2. **Verify Dependencies**: Ensure all packages are in package.json
3. **Environment Variables**: Check if your app needs environment variables
4. **AI Analysis**: Use our AI Copilot to analyze logs automatically

Common fixes:
- Missing build script: Add \`"build": "npm run build"\` to package.json
- Node version: Specify Node version in .nvmrc file
- Dependencies: Run \`npm install\` locally to test

Want me to analyze specific error logs?`;
    }
    
    if (msg.includes('domain') || msg.includes('ssl')) {
      return `Setting up custom domains is straightforward:

1. **Add Domain**: Go to your project's Domains tab
2. **DNS Configuration**: Add A record pointing to our servers
3. **SSL Certificate**: Automatically provisioned within 10 minutes

DNS Records needed:
- **A Record**: @ → 76.223.126.88
- **CNAME**: www → your-project.gitship.app

SSL certificates are free and auto-renewed. Need help with your specific domain provider?`;
    }
    
    if (msg.includes('ai') || msg.includes('copilot')) {
      return `GitShip's AI Copilot offers several powerful features:

1. **Code Quality Analysis**: Detects issues and suggests improvements
2. **Performance Intelligence**: Optimizes bundle size and load times
3. **Security Scanning**: Identifies vulnerabilities in dependencies
4. **Build Optimization**: Suggests better build configurations

Try the demo on the AI Copilot page to see it in action! The AI learns from your codebase and provides personalized suggestions.

Want to enable AI analysis for your projects?`;
    }

    return `I'm here to help with GitShip! I can assist with:

• **Deployment issues** - Build failures, configuration problems
• **Domain setup** - Custom domains, SSL certificates
• **AI features** - Code analysis, performance optimization  
• **Templates** - Finding the right starter template
• **Troubleshooting** - Debugging common issues

What specific challenge are you facing?`;
  };

  const generateSuggestions = (userMessage: string): string[] => {
    const msg = userMessage.toLowerCase();
    
    if (msg.includes('deploy')) {
      return [
        'Show me React deployment guide',
        'How do I set environment variables?',
        'What about Next.js deployments?'
      ];
    }
    
    if (msg.includes('build')) {
      return [
        'Analyze my build logs',
        'Common build error solutions',
        'How to optimize build performance?'
      ];
    }
    
    if (msg.includes('domain')) {
      return [
        'DNS configuration guide',
        'SSL certificate troubleshooting',
        'How to redirect www to apex domain?'
      ];
    }

    return [
      'Browse deployment templates',
      'Try AI code analysis',
      'Check troubleshooting guide'
    ];
  };

  const handleSuggestionClick = (suggestion: string) => {
    setMessage(suggestion);
  };

  useEffect(() => {
    // Add welcome message when assistant opens
    if (isOpen && chatHistory.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        type: 'assistant',
        content: `Hi! I'm your GitShip assistant. I can help with deployments, troubleshooting, AI features, and more.

${getContextualContent().title}:
${getContextualContent().suggestions.map(s => `• ${s}`).join('\n')}

What can I help you with today?`,
        timestamp: new Date(),
        suggestions: quickActions.slice(0, 3)
      };
      setChatHistory([welcomeMessage]);
    }
  }, [isOpen]);

  return (
    <>
      {/* Chat Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg transition-all duration-300 ${
          isOpen 
            ? 'bg-neon-cyan text-dark-900 rotate-180' 
            : 'bg-neon-cyan/90 hover:bg-neon-cyan text-dark-900 hover:shadow-xl'
        }`}
      >
        <MessageSquare className="w-6 h-6" />
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-96 h-[500px] z-40 bg-dark-800 border-dark-600 shadow-2xl animate-in slide-in-from-bottom-2 duration-300">
          <CardHeader className="pb-3 border-b border-dark-600">
            <CardTitle className="text-white flex items-center">
              <Bot className="w-5 h-5 mr-2 text-neon-cyan" />
              GitShip Assistant
              <Badge className="ml-auto bg-green-600/20 text-green-400">Online</Badge>
            </CardTitle>
            <CardDescription className="text-gray-400 text-sm">
              Get instant help with deployments and features
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-0 flex flex-col h-[400px]">
            {/* Chat Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {chatHistory.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex items-start space-x-2 max-w-[85%] ${msg.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        msg.type === 'user' 
                          ? 'bg-neon-orange text-dark-900' 
                          : 'bg-neon-cyan text-dark-900'
                      }`}>
                        {msg.type === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                      </div>
                      
                      <div className={`rounded-lg p-3 ${
                        msg.type === 'user'
                          ? 'bg-neon-orange text-dark-900'
                          : 'bg-dark-700 text-white border border-dark-600'
                      }`}>
                        <p className="text-sm whitespace-pre-line">{msg.content}</p>
                        
                        {msg.suggestions && (
                          <div className="mt-3 space-y-1">
                            {msg.suggestions.map((suggestion, index) => (
                              <Button
                                key={index}
                                variant="ghost"
                                size="sm"
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="w-full justify-start text-xs text-neon-cyan hover:bg-dark-600 hover:text-neon-cyan"
                              >
                                <Lightbulb className="w-3 h-3 mr-2" />
                                {suggestion}
                              </Button>
                            ))}
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-dark-600">
                          <span className="text-xs text-gray-400">
                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          
                          {msg.type === 'assistant' && (
                            <div className="flex space-x-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 text-gray-400 hover:text-green-400"
                              >
                                <CheckCircle className="w-3 h-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-neon-cyan text-dark-900 flex items-center justify-center">
                        <Bot className="w-4 h-4" />
                      </div>
                      <div className="bg-dark-700 border border-dark-600 rounded-lg p-3">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            
            {/* Input Area */}
            <div className="p-4 border-t border-dark-600">
              <div className="flex space-x-2">
                <Textarea
                  placeholder="Ask about deployments, troubleshooting, or AI features..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  className="flex-1 min-h-[40px] max-h-[80px] bg-dark-700 border-dark-600 text-white placeholder-gray-400 focus:border-neon-cyan resize-none"
                  rows={1}
                />
                <Button
                  onClick={sendMessage}
                  disabled={!message.trim() || isTyping}
                  className="bg-neon-cyan text-dark-900 hover:bg-neon-cyan/90 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Quick Actions */}
              <div className="flex flex-wrap gap-1 mt-2">
                {quickActions.slice(0, 2).map((action, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    onClick={() => setMessage(action)}
                    className="text-xs text-gray-400 hover:text-neon-cyan hover:bg-dark-700"
                  >
                    {action}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}