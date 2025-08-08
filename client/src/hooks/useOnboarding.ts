import { useState, useEffect } from 'react';

export interface OnboardingStep {
  id: string;
  target: string;
  title: string;
  content: string;
  placement: 'top' | 'bottom' | 'left' | 'right';
  action?: 'click' | 'hover' | 'focus';
  delay?: number;
}

export const useOnboarding = () => {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  // Check if user has completed onboarding
  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem('gitship-onboarding-completed');
    const isFirstVisit = !localStorage.getItem('gitship-visited');
    
    if (!hasCompletedOnboarding && isFirstVisit) {
      // Start onboarding for new users
      setTimeout(() => setIsActive(true), 1000);
      localStorage.setItem('gitship-visited', 'true');
    }
  }, []);

  const startOnboarding = () => {
    setIsActive(true);
    setCurrentStep(0);
    setCompletedSteps([]);
  };

  const nextStep = (steps: OnboardingStep[]) => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
      setCompletedSteps(prev => [...prev, steps[currentStep].id]);
    } else {
      completeOnboarding();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const skipStep = (steps: OnboardingStep[]) => {
    setCompletedSteps(prev => [...prev, steps[currentStep].id]);
    nextStep(steps);
  };

  const completeOnboarding = () => {
    setIsActive(false);
    setCurrentStep(0);
    localStorage.setItem('gitship-onboarding-completed', 'true');
  };

  const resetOnboarding = () => {
    localStorage.removeItem('gitship-onboarding-completed');
    localStorage.removeItem('gitship-visited');
    setCompletedSteps([]);
    setCurrentStep(0);
  };

  return {
    isActive,
    currentStep,
    completedSteps,
    startOnboarding,
    nextStep,
    prevStep,
    skipStep,
    completeOnboarding,
    resetOnboarding,
    setIsActive
  };
};