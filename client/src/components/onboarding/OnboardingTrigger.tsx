import { Button } from '@/components/ui/button';
import { HelpCircle, Sparkles } from 'lucide-react';
import { useOnboardingContext } from './OnboardingProvider';

export default function OnboardingTrigger() {
  const { startOnboarding, isActive } = useOnboardingContext();

  if (isActive) return null;

  return (
    <Button
      onClick={startOnboarding}
      className="fixed bottom-6 right-6 z-50 bg-neon-orange/90 hover:bg-neon-orange text-dark-900 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 rounded-full w-14 h-14 p-0"
      title="Start Tutorial"
    >
      <div className="relative">
        <HelpCircle className="w-6 h-6" />
        <Sparkles className="w-3 h-3 absolute -top-1 -right-1 text-neon-yellow animate-pulse" />
      </div>
    </Button>
  );
}