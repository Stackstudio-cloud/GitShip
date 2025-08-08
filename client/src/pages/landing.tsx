import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Rocket, Zap, Shield, Globe } from "lucide-react";
import PublicNavbar from "@/components/public-navbar";

export default function Landing() {
  return (
    <div className="min-h-screen bg-dark-900 text-white">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 data-onboarding="hero-title" className="text-5xl md:text-6xl font-bold mb-6">
            Deploy with{" "}
            <span className="flame-gradient-text">Confidence</span>
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Experience the future of web deployment with intelligent build optimization and real-time monitoring. 
            Connect your GitHub repository and deploy at the speed of flame.
          </p>
          <Button 
            data-onboarding="auth-button"
            onClick={() => window.location.href = '/api/login'}
            size="lg"
            className="flame-gradient text-dark-900 font-semibold text-lg px-8 py-4 hover:shadow-lg flame-glow transition-all duration-300"
          >
            <Rocket className="w-5 h-5 mr-2" />
            Get Started
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose <span className="flame-gradient-text">GitShip</span>?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-dark-800 border-dark-600 hover:border-neon-yellow/50 transition-all">
              <CardHeader>
                <div className="w-12 h-12 bg-neon-yellow/20 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-neon-yellow" />
                </div>
                <CardTitle className="text-white">Lightning Fast</CardTitle>
                <CardDescription className="text-gray-400">
                  Deploy your sites in seconds with our optimized build pipeline
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-dark-800 border-dark-600 hover:border-neon-red/50 transition-all">
              <CardHeader>
                <div className="w-12 h-12 bg-neon-red/20 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-neon-red" />
                </div>
                <CardTitle className="text-white">Secure & Reliable</CardTitle>
                <CardDescription className="text-gray-400">
                  Built with security in mind, featuring automatic SSL and DDoS protection
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-dark-800 border-dark-600 hover:border-neon-orange/50 transition-all">
              <CardHeader>
                <div className="w-12 h-12 bg-neon-orange/20 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-neon-orange" />
                </div>
                <CardTitle className="text-white">Global CDN</CardTitle>
                <CardDescription className="text-gray-400">
                  Your sites are served from locations worldwide for optimal performance
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-dark-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to <span className="flame-gradient-text">Deploy</span>?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Join the revolution in deployment technology with GitShip's flame-powered platform.
          </p>
          <Button 
            onClick={() => window.location.href = '/api/login'}
            size="lg"
            className="flame-gradient text-dark-900 font-semibold text-lg px-8 py-4 hover:shadow-lg flame-glow transition-all duration-300"
          >
            Start Deploying Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark-900 border-t border-dark-600 px-6 py-8">
        <div className="max-w-6xl mx-auto text-center text-gray-400">
          <p>&copy; 2025 GitShip. Built with ❤️ for developers.</p>
        </div>
      </footer>
    </div>
  );
}
