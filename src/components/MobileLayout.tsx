'use client';

import { ReactNode } from 'react';
import { useMobileDetection } from '@/hooks/useMobileDetection';

interface MobileLayoutProps {
  children: ReactNode;
  className?: string;
}

export const MobileLayout = ({ children, className = '' }: MobileLayoutProps) => {
  const { isMobile } = useMobileDetection();

  return (
    <div className={`min-h-screen ${className}`}>
      {/* Main content with proper mobile spacing */}
      <div className={`${isMobile ? 'pb-16' : ''}`}>
        {children}
      </div>
      
      {/* Mobile-specific optimizations */}
      {isMobile && (
        <>
          {/* Touch-friendly spacing adjustments */}
          <style jsx>{`
            @media (max-width: 768px) {
              /* Increase touch targets */
              button, a, input, textarea, select {
                min-height: 44px;
              }
              
              /* Prevent horizontal scroll */
              body {
                overflow-x: hidden;
              }
              
              /* Safe area insets for notched phones */
              .safe-area-top {
                padding-top: env(safe-area-inset-top);
              }
              
              .safe-area-bottom {
                padding-bottom: env(safe-area-inset-bottom);
              }
            }
          `}</style>
        </>
      )}
    </div>
  );
};
