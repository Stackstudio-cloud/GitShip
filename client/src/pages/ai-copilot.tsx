import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Bot, 
  Zap, 
  Code, 
  Shield, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Sparkles,
  Lightbulb,
  Target,
  Rocket,
  Brain,
  Search,
  MessageSquare,
  FileSearch,
  GitPullRequest,
  Cpu
} from "lucide-react";
import { useState } from "react";
import PublicNavbar from "@/components/public-navbar";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function AICopilotPage() {
  const [query, setQuery] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [activeDemo, setActiveDemo] = useState<string | null>(null);

  // AI Analysis mutation (using demo endpoint)
  const analyzeCodeMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/ai/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error('Analysis failed');
      return response.json();
    },
    onSuccess: (data) => {
      setAnalysis(data);
      setIsAnalyzing(false);
    },
    onError: (error) => {
      console.error('Analysis failed:', error);
      setIsAnalyzing(false);
    }
  });

  const runDemo = async (demoType: string) => {
    setActiveDemo(demoType);
    setIsAnalyzing(true);
    
    // Demo data for different analysis types
    const demoData = {
      'code-analysis': {
        codeFiles: [
          {
            path: 'src/App.tsx',
            content: `import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Inefficient data fetching
    fetch('/api/data')
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="App">
      {loading ? 'Loading...' : (
        <div>
          {data.map((item, index) => (
            <div key={index} onClick={() => console.log(item)}>
              {item.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;`
          },
          {
            path: 'package.json',
            content: `{
  "name": "demo-app",
  "version": "0.1.0",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "lodash": "^4.17.21"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build"
  }
}`
          }
        ]
      }
    };

    if (demoType === 'code-analysis') {
      analyzeCodeMutation.mutate();
    }
  };

  const aiFeatures = [
    {
      title: "Smart Deployment Analysis",
      description: "AI analyzes your build failures and provides specific solutions",
      icon: Bot,
      color: "neon-yellow",
      status: "active"
    },
    {
      title: "Performance Optimization",
      description: "Automatic suggestions for improving site speed and user experience",
      icon: TrendingUp,
      color: "neon-orange",
      status: "active"
    },
    {
      title: "Security Vulnerability Detection",
      description: "Real-time scanning for security issues and dependency vulnerabilities",
      icon: Shield,
      color: "neon-red",
      status: "active"
    },
    {
      title: "Code Quality Insights",
      description: "AI-powered code review and best practice recommendations",
      icon: Code,
      color: "neon-purple",
      status: "beta"
    },
    {
      title: "Smart Resource Allocation",
      description: "Optimize build resources and reduce costs automatically",
      icon: Cpu,
      color: "neon-cyan",
      status: "coming-soon"
    },
    {
      title: "Predictive Scaling",
      description: "AI predicts traffic patterns and optimizes infrastructure accordingly",
      icon: Brain,
      color: "neon-green",
      status: "coming-soon"
    }
  ];

  const recentInsights = [
    {
      type: "performance",
      title: "Bundle size can be reduced by 34%",
      description: "Remove unused lodash functions and switch to tree-shaking alternatives",
      impact: "High",
      project: "my-react-app"
    },
    {
      type: "security",
      title: "Outdated dependencies detected",
      description: "3 dependencies have security vulnerabilities. Auto-fix available.",
      impact: "Critical",
      project: "portfolio-site"
    },
    {
      type: "optimization",
      title: "Image optimization opportunity",
      description: "Convert 12 PNG files to WebP format to reduce load time by 2.3s",
      impact: "Medium",
      project: "e-commerce-store"
    },
    {
      type: "suggestion",
      title: "Consider using Edge Functions",
      description: "Your API calls can be moved to edge functions for 40% faster response",
      impact: "High",
      project: "blog-site"
    }
  ];

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "Critical": return "bg-red-600/20 text-red-400";
      case "High": return "bg-neon-orange/20 text-neon-orange";
      case "Medium": return "bg-neon-yellow/20 text-neon-yellow";
      default: return "bg-gray-600/20 text-gray-400";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active": return <Badge className="bg-green-600/20 text-green-400">Live</Badge>;
      case "beta": return <Badge className="bg-neon-yellow/20 text-neon-yellow">Beta</Badge>;
      case "coming-soon": return <Badge className="bg-gray-600/20 text-gray-400">Coming Soon</Badge>;
      default: return null;
    }
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    // Simulate AI analysis
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      <PublicNavbar />
      {/* Header */}
      <section className="py-20 px-6 bg-gradient-to-b from-dark-800 to-dark-900">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-neon-yellow to-neon-orange rounded-full mb-6">
            <Sparkles className="w-10 h-10 text-dark-900" />
          </div>
          <h1 data-onboarding="ai-title" className="text-5xl font-bold mb-6">
            AI <span className="flame-gradient-text">Copilot</span>
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
            Your intelligent development companion. Get real-time insights, automated optimizations, 
            and smart suggestions to deploy faster and more efficiently than ever before.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Button className="flame-gradient text-dark-900 font-semibold">
              <Bot className="w-4 h-4 mr-2" />
              Enable AI Copilot
            </Button>
            <Button variant="outline" className="border-gray-600 text-white hover:bg-dark-700">
              <FileSearch className="w-4 h-4 mr-2" />
              View Documentation
            </Button>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-neon-yellow mb-2">127%</div>
              <div className="text-gray-400">Faster deployment time</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-neon-orange mb-2">89%</div>
              <div className="text-gray-400">Fewer build failures</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-neon-red mb-2">34%</div>
              <div className="text-gray-400">Performance improvement</div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Chat Interface */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-dark-800 border-dark-600">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <MessageSquare className="w-5 h-5 mr-3 text-neon-orange" />
                Ask AI Copilot
              </CardTitle>
              <CardDescription className="text-gray-400">
                Get instant help with deployment issues, performance optimization, and best practices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea
                  placeholder="Ask me anything about your deployment... (e.g., 'Why is my build failing?' or 'How can I optimize my React app?')"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="bg-dark-700 border-dark-600 text-white placeholder-gray-400 focus:border-neon-orange"
                  rows={3}
                />
                <div className="flex gap-2">
                  <Button 
                    onClick={handleAnalyze}
                    disabled={isAnalyzing || !query.trim()}
                    className="flame-gradient text-dark-900 font-semibold"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="animate-spin w-4 h-4 mr-2 border-2 border-dark-900 border-t-transparent rounded-full" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Analyze
                      </>
                    )}
                  </Button>
                  <Button variant="outline" className="border-gray-600 text-white hover:bg-dark-700">
                    <Search className="w-4 h-4 mr-2" />
                    Search Knowledge Base
                  </Button>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-2 pt-4">
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-neon-orange hover:bg-dark-700">
                    "Optimize my bundle size"
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-neon-orange hover:bg-dark-700">
                    "Fix build errors"
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-neon-orange hover:bg-dark-700">
                    "Improve performance"
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-neon-orange hover:bg-dark-700">
                    "Security scan"
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* AI Features */}
      <section className="py-16 px-6 bg-dark-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Intelligent <span className="flame-gradient-text">Features</span>
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aiFeatures.map((feature, index) => (
              <Card 
                key={index} 
                data-onboarding={
                  feature.title === "Code Quality Insights" ? "code-analysis-card" :
                  feature.title === "Performance Intelligence" ? "performance-card" :
                  undefined
                }
                className="bg-dark-700 border-dark-600 hover:border-neon-orange/50 transition-all"
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 bg-${feature.color}/20 rounded-lg flex items-center justify-center`}>
                      <feature.icon className={`w-6 h-6 text-${feature.color}`} />
                    </div>
                    {getStatusBadge(feature.status)}
                  </div>
                  <CardTitle className="text-white">{feature.title}</CardTitle>
                  <CardDescription className="text-gray-400">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center">
                    {feature.title === "Code Quality Insights" && feature.status === "beta" ? (
                      <Button 
                        data-onboarding="demo-button"
                        onClick={() => runDemo('code-analysis')}
                        disabled={isAnalyzing}
                        className="flame-gradient text-dark-900 font-semibold disabled:opacity-50"
                      >
                        {isAnalyzing && activeDemo === 'code-analysis' ? (
                          <>
                            <Bot className="w-4 h-4 mr-2 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 mr-2" />
                            Try Demo
                          </>
                        )}
                      </Button>
                    ) : (
                      <Button 
                        variant="outline" 
                        className="border-gray-600 text-white hover:bg-dark-700"
                        disabled={feature.status !== "active"}
                      >
                        {feature.status === "active" ? "Learn More" : "Coming Soon"}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* AI Analysis Results */}
      {analysis && (
        <section className="py-20 px-6 bg-dark-800">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">
                AI Analysis Results
                <span className="ml-4 text-2xl">Score: {analysis.score}/100</span>
              </h2>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-8 mb-12">
              {/* Issues */}
              <Card className="bg-dark-700 border-dark-600">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2 text-neon-orange" />
                    Issues Found ({analysis.issues?.length || 0})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analysis.issues?.map((issue: any, index: number) => (
                      <div key={index} className="border border-dark-500 rounded p-3">
                        <div className="flex items-center justify-between mb-2">
                          <Badge className={`${issue.severity === 'high' ? 'bg-red-600/20 text-red-400' : 
                            issue.severity === 'medium' ? 'bg-neon-orange/20 text-neon-orange' : 
                            'bg-neon-yellow/20 text-neon-yellow'}`}>
                            {issue.severity} {issue.type}
                          </Badge>
                        </div>
                        <p className="text-white text-sm mb-1">{issue.message}</p>
                        <p className="text-gray-400 text-xs">{issue.suggestion}</p>
                        {issue.file && <p className="text-neon-cyan text-xs mt-1">{issue.file}:{issue.line}</p>}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Optimizations */}
              <Card className="bg-dark-700 border-dark-600">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Rocket className="w-5 h-5 mr-2 text-neon-purple" />
                    Optimizations ({analysis.optimizations?.length || 0})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analysis.optimizations?.map((opt: any, index: number) => (
                      <div key={index} className="border border-dark-500 rounded p-3">
                        <div className="flex items-center justify-between mb-2">
                          <Badge className={`${opt.impact === 'high' ? 'bg-green-600/20 text-green-400' : 
                            opt.impact === 'medium' ? 'bg-neon-orange/20 text-neon-orange' : 
                            'bg-gray-600/20 text-gray-400'}`}>
                            {opt.impact} impact {opt.type}
                          </Badge>
                        </div>
                        <p className="text-white text-sm mb-1">{opt.description}</p>
                        <p className="text-gray-400 text-xs">{opt.implementation}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Recent Insights */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Recent <span className="flame-gradient-text">Insights</span>
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {recentInsights.map((insight, index) => (
              <Card key={index} className="bg-dark-800 border-dark-600 hover:border-neon-orange/50 transition-all">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      {insight.type === "performance" && <TrendingUp className="w-5 h-5 text-neon-orange" />}
                      {insight.type === "security" && <Shield className="w-5 h-5 text-red-400" />}
                      {insight.type === "optimization" && <Zap className="w-5 h-5 text-neon-yellow" />}
                      {insight.type === "suggestion" && <Lightbulb className="w-5 h-5 text-neon-purple" />}
                      <div>
                        <CardTitle className="text-white text-lg">{insight.title}</CardTitle>
                        <div className="text-sm text-gray-400">{insight.project}</div>
                      </div>
                    </div>
                    <Badge className={getImpactColor(insight.impact)}>
                      {insight.impact}
                    </Badge>
                  </div>
                  <CardDescription className="text-gray-400 ml-8">
                    {insight.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center ml-8">
                    <Button size="sm" className="flame-gradient text-dark-900 font-semibold">
                      Apply Fix
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                      Learn More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-gradient-to-b from-dark-900 to-dark-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to deploy with <span className="flame-gradient-text">AI</span>?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Join the future of intelligent web deployment and let AI optimize your workflow
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button className="flame-gradient text-dark-900 font-semibold">
              <Rocket className="w-4 h-4 mr-2" />
              Start Free Trial
            </Button>
            <Button variant="outline" className="border-gray-600 text-white hover:bg-dark-700">
              <Target className="w-4 h-4 mr-2" />
              View Pricing
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}