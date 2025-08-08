import { createContext, useContext, ReactNode } from 'react';
import { useOnboarding, type OnboardingStep } from '@/hooks/useOnboarding';
import OnboardingTooltip from './OnboardingTooltip';

interface OnboardingContextType {
  startOnboarding: () => void;
  resetOnboarding: () => void;
  isActive: boolean;
}

const OnboardingContext = createContext<OnboardingContextType | null>(null);

interface OnboardingProviderProps {
  children: ReactNode;
  steps: OnboardingStep[];
}

export function OnboardingProvider({ children, steps }: OnboardingProviderProps) {
  const {
    isActive,
    currentStep,
    startOnboarding,
    nextStep,
    prevStep,
    skipStep,
    completeOnboarding,
    resetOnboarding,
    setIsActive
  } = useOnboarding();

  const currentStepData = steps[currentStep];

  return (
    <OnboardingContext.Provider value={{ startOnboarding, resetOnboarding, isActive }}>
      {children}
      
      {isActive && currentStepData && (
        <OnboardingTooltip
          step={currentStepData}
          currentStepIndex={currentStep}
          totalSteps={steps.length}
          onNext={() => nextStep(steps)}
          onPrev={prevStep}
          onSkip={() => skipStep(steps)}
          onClose={() => setIsActive(false)}
          isVisible={isActive}
        />
      )}
    </OnboardingContext.Provider>
  );
}

export function useOnboardingContext() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboardingContext must be used within OnboardingProvider');
  }
  return context;
}