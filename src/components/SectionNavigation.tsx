'use client';

import { useState, useEffect } from 'react';

export const TableOfContents = () => {
  const [activeSection, setActiveSection] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  const sections = [
    { label: 'Jobs', labelFull: 'Available Jobs', href: '#accounts-available', id: 'accounts-available' },
    { label: 'Req', labelFull: 'Requirements', href: '#requirements', id: 'requirements' },
    { label: 'Why', labelFull: 'Why Join Us', href: '#why-join', id: 'why-join' },
    { label: 'FAQ', labelFull: 'FAQ', href: '#faq', id: 'faq' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      // Show nav when scrolled down
      setIsVisible(window.scrollY > 100);

      // Find active section - closest to top
      const sectionIds = ['accounts-available', 'requirements', 'why-join', 'faq'];
      let closestSection = '';
      let closestDistance = Infinity;

      sectionIds.forEach(sectionId => {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          const distance = Math.abs(rect.top - 100);
          if (distance < closestDistance) {
            closestDistance = distance;
            closestSection = sectionId;
          }
        }
      });
      
      if (closestSection) setActiveSection(closestSection);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`fixed left-0 right-0 top-16 z-40 transition-all duration-500 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}>
      <div className="bg-white border-b-4 border-purple-200 shadow-2xl backdrop-blur-sm bg-opacity-95">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto justify-center gap-1 sm:gap-3 py-2 sm:py-4 scrollbar-hide">
            {sections.map((section, i) => (
              <a
                key={i}
                href={section.href}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveSection(section.id);
                  const element = document.getElementById(section.id);
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                className={`px-2 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-base font-bold whitespace-nowrap shrink-0 transition-all duration-300 ease-out cursor-pointer ${
                  activeSection === section.id
                    ? 'bg-linear-to-r from-purple-600 to-pink-600 text-white shadow-2xl sm:scale-110 ring-2 ring-pink-300'
                    : 'bg-gray-100 text-gray-800 border-2 border-transparent hover:border-purple-400 hover:bg-white hover:shadow-lg sm:hover:scale-105'
                }`}
              >
                <span className="sm:hidden">{section.label}</span>
                <span className="hidden sm:inline">{section.labelFull}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
