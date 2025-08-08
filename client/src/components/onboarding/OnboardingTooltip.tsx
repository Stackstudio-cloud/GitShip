import { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, ChevronLeft, ChevronRight, SkipForward, Sparkles } from 'lucide-react';
import type { OnboardingStep } from '@/hooks/useOnboarding';

interface OnboardingTooltipProps {
  step: OnboardingStep;
  currentStepIndex: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
  onClose: () => void;
  isVisible: boolean;
}

export default function OnboardingTooltip({
  step,
  currentStepIndex,
  totalSteps,
  onNext,
  onPrev,
  onSkip,
  onClose,
  isVisible
}: OnboardingTooltipProps) {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [isPositioned, setIsPositioned] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isVisible) return;

    const updatePosition = () => {
      const targetElement = document.querySelector(step.target) as HTMLElement;
      const tooltip = tooltipRef.current;

      if (!targetElement || !tooltip) {
        setIsPositioned(false);
        return;
      }

      const targetRect = targetElement.getBoundingClientRect();
      const tooltipRect = tooltip.getBoundingClientRect();
      const padding = 16;

      let top = 0;
      let left = 0;

      switch (step.placement) {
        case 'top':
          top = targetRect.top - tooltipRect.height - padding;
          left = targetRect.left + (targetRect.width - tooltipRect.width) / 2;
          break;
        case 'bottom':
          top = targetRect.bottom + padding;
          left = targetRect.left + (targetRect.width - tooltipRect.width) / 2;
          break;
        case 'left':
          top = targetRect.top + (targetRect.height - tooltipRect.height) / 2;
          left = targetRect.left - tooltipRect.width - padding;
          break;
        case 'right':
          top = targetRect.top + (targetRect.height - tooltipRect.height) / 2;
          left = targetRect.right + padding;
          break;
      }

      // Keep tooltip within viewport
      const maxLeft = window.innerWidth - tooltipRect.width - padding;
      const maxTop = window.innerHeight - tooltipRect.height - padding;

      left = Math.max(padding, Math.min(left, maxLeft));
      top = Math.max(padding, Math.min(top, maxTop));

      setPosition({ top, left });
      setIsPositioned(true);

      // Highlight target element
      targetElement.style.position = 'relative';
      targetElement.style.zIndex = '1001';
      targetElement.style.boxShadow = '0 0 0 4px rgba(255, 165, 0, 0.3), 0 0 20px rgba(255, 165, 0, 0.2)';
      targetElement.style.borderRadius = '8px';
      targetElement.style.transition = 'all 0.3s ease';
    };

    // Wait for DOM to be ready
    setTimeout(updatePosition, 100);
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
      
      // Remove highlight
      const targetElement = document.querySelector(step.target) as HTMLElement;
      if (targetElement) {
        targetElement.style.position = '';
        targetElement.style.zIndex = '';
        targetElement.style.boxShadow = '';
        targetElement.style.borderRadius = '';
        targetElement.style.transition = '';
      }
    };
  }, [step.target, step.placement, isVisible]);

  if (!isVisible || !isPositioned) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-1000 backdrop-blur-sm" />
      
      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className="fixed z-1002 max-w-sm"
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
        }}
      >
        <Card className="bg-dark-700 border-neon-orange/50 shadow-2xl animate-in fade-in-0 zoom-in-95 duration-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-neon-orange" />
                <CardTitle className="text-white text-lg">{step.title}</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-gray-400 hover:text-white h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <Badge variant="outline" className="w-fit text-xs border-neon-orange/30 text-neon-orange">
              Step {currentStepIndex + 1} of {totalSteps}
            </Badge>
          </CardHeader>
          
          <CardContent className="pt-0">
            <p className="text-gray-300 mb-4 text-sm leading-relaxed">
              {step.content}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                {currentStepIndex > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onPrev}
                    className="border-gray-600 text-gray-300 hover:bg-dark-600"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Back
                  </Button>
                )}
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onSkip}
                  className="text-gray-400 hover:text-white"
                >
                  <SkipForward className="w-4 h-4 mr-1" />
                  Skip
                </Button>
              </div>
              
              <Button
                onClick={onNext}
                className="flame-gradient text-dark-900 font-semibold"
                size="sm"
              >
                {currentStepIndex === totalSteps - 1 ? 'Finish' : 'Next'}
                {currentStepIndex < totalSteps - 1 && (
                  <ChevronRight className="w-4 h-4 ml-1" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Arrow */}
        <div className={`absolute w-0 h-0 ${getArrowClasses(step.placement)}`} />
      </div>
    </>
  );
}

function getArrowClasses(placement: string) {
  switch (placement) {
    case 'top':
      return 'top-full left-1/2 transform -translate-x-1/2 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-dark-700';
    case 'bottom':
      return 'bottom-full left-1/2 transform -translate-x-1/2 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-dark-700';
    case 'left':
      return 'left-full top-1/2 transform -translate-y-1/2 border-t-8 border-b-8 border-l-8 border-t-transparent border-b-transparent border-l-dark-700';
    case 'right':
      return 'right-full top-1/2 transform -translate-y-1/2 border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent border-r-dark-700';
    default:
      return '';
  }
}