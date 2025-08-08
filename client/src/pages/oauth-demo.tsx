import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  Github, 
  Chrome, 
  Twitter, 
  Apple, 
  Mail, 
  Shield, 
  CheckCircle, 
  AlertCircle,
  Users,
  Settings,
  Key
} from "lucide-react";
import PublicNavbar from "@/components/public-navbar";

export default function OAuthDemoPage() {
  const [activeProvider, setActiveProvider] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedProviders, setConnectedProviders] = useState<string[]>([]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    },
    hover: {
      scale: 1.02,
      y: -5,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 30
      }
    },
    tap: {
      scale: 0.98
    }
  };

  const heroVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        duration: 0.8
      }
    }
  };

  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const oauthProviders = [
    {
      id: "replit",
      name: "Replit Auth",
      icon: "🔥",
      description: "Primary authentication through Replit's secure OAuth system",
      scopes: ["openid", "email", "profile", "offline_access"],
      status: "active",
      color: "neon-orange"
    },
    {
      id: "github",
      name: "GitHub",
      icon: Github,
      description: "Connect GitHub for repository access and deployment",
      scopes: ["repo", "user:email", "admin:repo_hook"],
      status: "active",
      color: "purple"
    },
    {
      id: "google",
      name: "Google",
      icon: Chrome,
      description: "Sign in with Google account for easy access",
      scopes: ["openid", "email", "profile"],
      status: "available",
      color: "blue"
    },
    {
      id: "twitter",
      name: "X (Twitter)",
      icon: Twitter,
      description: "Connect your X account for social features",
      scopes: ["tweet.read", "users.read"],
      status: "available",
      color: "cyan"
    },
    {
      id: "apple",
      name: "Apple",
      icon: Apple,
      description: "Sign in with Apple ID for secure authentication",
      scopes: ["name", "email"],
      status: "available",
      color: "gray"
    },
    {
      id: "email",
      name: "Email/Password",
      icon: Mail,
      description: "Traditional email and password authentication",
      scopes: ["email", "profile"],
      status: "available",
      color: "green"
    }
  ];

  const handleConnect = async (providerId: string) => {
    setActiveProvider(providerId);
    setIsConnecting(true);

    // Simulate OAuth flow
    setTimeout(() => {
      if (providerId === "replit") {
        // Replit Auth flow
        window.location.href = "/api/login";
      } else if (providerId === "github") {
        // GitHub OAuth flow
        window.location.href = "/api/auth/github";
      } else {
        // Demo simulation for other providers
        setConnectedProviders(prev => [...prev, providerId]);
        setIsConnecting(false);
        setActiveProvider(null);
      }
    }, 1500);
  };

  const getProviderIcon = (provider: any) => {
    if (typeof provider.icon === "string") {
      return <span className="text-2xl">{provider.icon}</span>;
    }
    const IconComponent = provider.icon;
    return <IconComponent className="w-6 h-6" />;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active": return <Badge className="bg-green-600/20 text-green-400">Active</Badge>;
      case "available": return <Badge className="bg-blue-600/20 text-blue-400">Available</Badge>;
      case "connected": return <Badge className="bg-neon-orange/20 text-neon-orange">Connected</Badge>;
      default: return <Badge className="bg-gray-600/20 text-gray-400">Inactive</Badge>;
    }
  };

  return (
    <motion.div 
      className="min-h-screen bg-dark-900"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <PublicNavbar />
      
      {/* Hero Section */}
      <motion.section 
        className="pt-32 pb-20 px-6"
        variants={heroVariants}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div 
            className="flex items-center justify-center mb-6"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            <motion.div
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Shield className="w-16 h-16 text-neon-orange mr-4" />
            </motion.div>
            <motion.h1 
              className="text-5xl font-bold"
              variants={heroVariants}
            >
              OAuth <span className="flame-gradient-text">Authentication</span>
            </motion.h1>
          </motion.div>
          
          <motion.p 
            className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto"
            variants={heroVariants}
          >
            Secure multi-provider authentication system supporting Replit Auth, GitHub, Google, X, Apple, and traditional email/password
          </motion.p>
          
          {/* Auth Stats */}
          <motion.div 
            className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto"
            variants={containerVariants}
          >
            <motion.div 
              className="text-center"
              variants={cardVariants}
              whileHover="hover"
            >
              <motion.div 
                className="text-3xl font-bold text-neon-orange mb-2"
                variants={pulseVariants}
                animate="pulse"
              >
                6
              </motion.div>
              <div className="text-gray-400">OAuth Providers</div>
            </motion.div>
            <motion.div 
              className="text-center"
              variants={cardVariants}
              whileHover="hover"
            >
              <motion.div 
                className="text-3xl font-bold text-neon-cyan mb-2"
                variants={pulseVariants}
                animate="pulse"
              >
                100%
              </motion.div>
              <div className="text-gray-400">Secure Authentication</div>
            </motion.div>
            <motion.div 
              className="text-center"
              variants={cardVariants}
              whileHover="hover"
            >
              <motion.div 
                className="text-3xl font-bold text-neon-purple mb-2"
                variants={pulseVariants}
                animate="pulse"
              >
                2FA
              </motion.div>
              <div className="text-gray-400">Security Support</div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* OAuth Provider Cards */}
      <motion.section 
        className="py-16 px-6"
        variants={containerVariants}
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            className="text-3xl font-bold mb-12 text-center"
            variants={heroVariants}
          >
            Supported <span className="flame-gradient-text">Providers</span>
          </motion.h2>
          
          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
          >
            {oauthProviders.map((provider, index) => {
              const isConnected = connectedProviders.includes(provider.id);
              const isConnecting_current = isConnecting && activeProvider === provider.id;
              
              return (
                <motion.div
                  key={provider.id}
                  variants={cardVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Card className="bg-dark-700 border-dark-600 hover:border-neon-orange/50 transition-all h-full">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-4">
                        <motion.div 
                          className={`w-12 h-12 bg-${provider.color}-600/20 rounded-lg flex items-center justify-center`}
                          whileHover={{ 
                            scale: 1.1,
                            rotate: [0, -10, 10, 0]
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 30
                          }}
                        >
                          {getProviderIcon(provider)}
                        </motion.div>
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={isConnected ? 'connected' : provider.status}
                            initial={{ scale: 0, rotate: 180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: -180 }}
                            transition={{ 
                              type: "spring", 
                              stiffness: 500,
                              damping: 30
                            }}
                          >
                            {isConnected ? getStatusBadge("connected") : getStatusBadge(provider.status)}
                          </motion.div>
                        </AnimatePresence>
                      </div>
                      <CardTitle className="text-white">{provider.name}</CardTitle>
                      <CardDescription className="text-gray-400">
                        {provider.description}
                      </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm text-gray-400 mb-2 block">Scopes:</Label>
                        <motion.div 
                          className="flex flex-wrap gap-1"
                          variants={containerVariants}
                        >
                          {provider.scopes.map((scope, scopeIndex) => (
                            <motion.div
                              key={scope}
                              variants={cardVariants}
                              custom={scopeIndex}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
                                {scope}
                              </Badge>
                            </motion.div>
                          ))}
                        </motion.div>
                      </div>
                      
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button 
                          onClick={() => handleConnect(provider.id)}
                          disabled={isConnecting_current || isConnected}
                          className={`w-full ${isConnected ? 'bg-green-600/20 text-green-400' : 'flame-gradient text-dark-900 font-semibold'} transition-all duration-300`}
                        >
                          <AnimatePresence mode="wait">
                            {isConnecting_current ? (
                              <motion.div
                                key="connecting"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="flex items-center"
                              >
                                <motion.div 
                                  className="w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full"
                                  animate={{ rotate: 360 }}
                                  transition={{ 
                                    duration: 1, 
                                    repeat: Infinity, 
                                    ease: "linear" 
                                  }}
                                />
                                Connecting...
                              </motion.div>
                            ) : isConnected ? (
                              <motion.div
                                key="connected"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="flex items-center"
                              >
                                <motion.div
                                  animate={{
                                    scale: [1, 1.2, 1],
                                    rotate: [0, 360]
                                  }}
                                  transition={{
                                    duration: 0.6,
                                    ease: "easeInOut"
                                  }}
                                >
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                </motion.div>
                                Connected
                              </motion.div>
                            ) : (
                              <motion.div
                                key="connect"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="flex items-center"
                              >
                                <Key className="w-4 h-4 mr-2" />
                                Connect
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </Button>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </motion.section>

      {/* Authentication Flow Demo */}
      <section className="py-16 px-6 bg-dark-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Authentication <span className="flame-gradient-text">Flow</span>
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Login Form */}
            <Card className="bg-dark-700 border-dark-600">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Users className="w-5 h-5 mr-2 text-neon-orange" />
                  Sign In Options
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={() => handleConnect("replit")}
                  className="w-full flame-gradient text-dark-900 font-semibold"
                >
                  🔥 Continue with Replit
                </Button>
                
                <Button 
                  onClick={() => handleConnect("github")}
                  variant="outline" 
                  className="w-full border-gray-600 text-white hover:bg-dark-600"
                >
                  <Github className="w-4 h-4 mr-2" />
                  Continue with GitHub
                </Button>
                
                <Separator className="bg-gray-600" />
                
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="email" className="text-gray-300">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="Enter your email"
                      className="bg-dark-600 border-dark-500 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="password" className="text-gray-300">Password</Label>
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="Enter your password"
                      className="bg-dark-600 border-dark-500 text-white"
                    />
                  </div>
                  <Button variant="outline" className="w-full border-gray-600 text-white hover:bg-dark-600">
                    Sign In with Email
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Security Features */}
            <Card className="bg-dark-700 border-dark-600">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Settings className="w-5 h-5 mr-2 text-neon-cyan" />
                  Security Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">OAuth 2.0 / OpenID Connect</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">Two-Factor Authentication</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">Session Management</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">Secure Token Storage</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">CSRF Protection</span>
                </div>
                <div className="flex items-center space-x-3">
                  <AlertCircle className="w-5 h-5 text-neon-yellow" />
                  <span className="text-gray-300">Rate Limiting</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Integration Guide */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Integration <span className="flame-gradient-text">Guide</span>
          </h2>
          
          <Card className="bg-dark-700 border-dark-600">
            <CardHeader>
              <CardTitle className="text-white">Quick Setup</CardTitle>
              <CardDescription className="text-gray-400">
                Get started with OAuth authentication in minutes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-neon-orange/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">1️⃣</span>
                  </div>
                  <h3 className="text-white font-semibold mb-2">Configure Providers</h3>
                  <p className="text-gray-400 text-sm">Set up OAuth applications with your chosen providers</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-neon-cyan/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">2️⃣</span>
                  </div>
                  <h3 className="text-white font-semibold mb-2">Add Environment Variables</h3>
                  <p className="text-gray-400 text-sm">Configure client IDs, secrets, and callback URLs</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-neon-purple/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">3️⃣</span>
                  </div>
                  <h3 className="text-white font-semibold mb-2">Start Authenticating</h3>
                  <p className="text-gray-400 text-sm">Users can now sign in with their preferred method</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </motion.div>
  );
}