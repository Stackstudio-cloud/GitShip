import { Button } from "@/components/ui/button";

export default function PublicNavbar() {
  return (
    <nav className="bg-dark-800 border-b border-dark-600 px-6 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-8">
          <a href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <img 
              src="/gitship-logo-transparent.png" 
              alt="GitShip Logo" 
              className="h-12 w-auto"
            />
          </a>
          <div className="hidden md:flex items-center space-x-6">
            <a data-onboarding="templates-link" href="/templates" className="text-gray-400 hover:text-neon-orange transition-colors">Templates</a>
            <a data-onboarding="ai-copilot-link" href="/ai-copilot" className="text-gray-400 hover:text-neon-orange transition-colors">AI Copilot</a>
            <a href="/performance" className="text-gray-400 hover:text-neon-orange transition-colors">Performance</a>
            <a href="/guides" className="text-gray-400 hover:text-neon-orange transition-colors">Guides</a>
            <a href="/docs" className="text-gray-400 hover:text-neon-orange transition-colors">Docs</a>
            <a href="#pricing" className="text-gray-400 hover:text-neon-orange transition-colors">Pricing</a>
          </div>
        </div>
        <Button 
          data-onboarding="auth-button"
          onClick={() => window.location.href = '/api/login'}
          className="flame-gradient text-dark-900 font-semibold hover:shadow-lg flame-glow transition-all duration-300"
        >
          Sign In
        </Button>
      </div>
    </nav>
  );
}