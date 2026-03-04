'use client';

import { useState, useEffect } from 'react';

interface ScreenSize {
  width: number;
  height: number;
}

interface MobileInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  screenSize: ScreenSize;
  orientation: 'portrait' | 'landscape';
}

export const useMobileDetection = (): MobileInfo => {
  const [screenSize, setScreenSize] = useState<ScreenSize>({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Set initial size
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Add orientation change listener for mobile
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  const isMobile = screenSize.width < 768;
  const isTablet = screenSize.width >= 768 && screenSize.width < 1024;
  const isDesktop = screenSize.width >= 1024;
  const orientation = screenSize.width > screenSize.height ? 'landscape' : 'portrait';

  return {
    isMobile,
    isTablet,
    isDesktop,
    screenSize,
    orientation,
  };
};
