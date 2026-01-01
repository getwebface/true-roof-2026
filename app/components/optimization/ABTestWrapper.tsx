// A/B Test Wrapper Component
// Wraps components for A/B testing in the autonomous optimization system

'use client';

import { useEffect, useState } from 'react';

interface ABTestWrapperProps {
  testId: string;
  componentId: string;
  variantA: React.ReactNode;
  variantB: React.ReactNode;
  onVariantAssigned?: (variant: 'A' | 'B') => void;
}

export default function ABTestWrapper({ 
  testId, 
  componentId, 
  variantA, 
  variantB,
  onVariantAssigned
}: ABTestWrapperProps) {
  const [variant, setVariant] = useState<'A' | 'B'>('A');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const assignVariant = async () => {
      try {
        // Check if variant is already assigned in localStorage
        const storedVariant = localStorage.getItem(`ab_test_${testId}`);
        
        if (storedVariant) {
          setVariant(storedVariant as 'A' | 'B');
          setIsLoading(false);
          onVariantAssigned?.(storedVariant as 'A' | 'B');
          return;
        }

        // Determine variant (50/50 split by default)
        const randomVariant = Math.random() > 0.5 ? 'B' : 'A';
        
        // Store in localStorage for consistency
        localStorage.setItem(`ab_test_${testId}`, randomVariant);
        
        // Track assignment
        await trackAssignment(testId, componentId, randomVariant);
        
        setVariant(randomVariant);
        setIsLoading(false);
        onVariantAssigned?.(randomVariant);
        
      } catch (error) {
        console.error('Error assigning A/B test variant:', error);
        // Fallback to variant A on error
        setVariant('A');
        setIsLoading(false);
        onVariantAssigned?.('A');
      }
    };

    assignVariant();
  }, [testId, componentId, onVariantAssigned]);

  const trackAssignment = async (testId: string, componentId: string, variant: 'A' | 'B') => {
    try {
      // Get session ID from tracking library if available
      const sessionId = localStorage.getItem('tracking_session_id') || 
                       `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Send assignment to beacon endpoint
      const response = await fetch('/api/beacon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          events: [{
            eventType: 'ab_test_assignment',
            eventData: {
              testId,
              componentId,
              variant,
              assignmentTime: Date.now()
            },
            timestamp: Date.now(),
            pageUrl: window.location.href,
            componentId
          }]
        }),
        keepalive: true
      });

      if (!response.ok) {
        console.warn('Failed to track A/B test assignment');
      }
    } catch (error) {
      // Silent fail - assignment tracking is non-critical
      console.warn('A/B test assignment tracking failed:', error);
    }
  };

  const trackConversion = async (conversionEvent: string, metadata: Record<string, any> = {}) => {
    try {
      const sessionId = localStorage.getItem('tracking_session_id') || 
                       `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      await fetch('/api/beacon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          events: [{
            eventType: 'ab_test_conversion',
            eventData: {
              testId,
              componentId,
              variant,
              conversionEvent,
              ...metadata
            },
            timestamp: Date.now(),
            pageUrl: window.location.href,
            componentId
          }]
        }),
        keepalive: true
      });
    } catch (error) {
      console.warn('A/B test conversion tracking failed:', error);
    }
  };

  // Expose conversion tracking via ref or context if needed
  // For now, we'll provide a simple hook-like pattern

  if (isLoading) {
    // Show loading state or variant A as default
    return <>{variantA}</>;
  }

  return (
    <>
      {variant === 'A' ? variantA : variantB}
    </>
  );
}

// Helper hook for tracking conversions within A/B tested components
export function useABTestConversion(testId: string, componentId: string) {
  const trackConversion = async (conversionEvent: string, metadata: Record<string, any> = {}) => {
    try {
      const variant = localStorage.getItem(`ab_test_${testId}`) || 'A';
      const sessionId = localStorage.getItem('tracking_session_id') || 
                       `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      await fetch('/api/beacon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          events: [{
            eventType: 'ab_test_conversion',
            eventData: {
              testId,
              componentId,
              variant,
              conversionEvent,
              ...metadata
            },
            timestamp: Date.now(),
            pageUrl: window.location.href,
            componentId
          }]
        }),
        keepalive: true
      });
    } catch (error) {
      console.warn('A/B test conversion tracking failed:', error);
    }
  };

  return { trackConversion };
}
