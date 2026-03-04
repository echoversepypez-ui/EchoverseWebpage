'use client';

import { usePageSections } from '@/hooks/usePageSections';

export const WhatWeOfferSection = () => {
  const { getSection, loading } = usePageSections();
  const section = getSection('what_we_offer');

  if (loading || !section) {
    return (
      <section className="py-8 bg-linear-to-b from-purple-50 via-pink-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </section>
    );
  }

  const cards = ((section.content as any)?.cards || []) as any[];

  return (
    <section className="py-8 bg-linear-to-b from-purple-50 via-pink-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{section.title}</h2>
          <p className="text-sm text-gray-600">{section.subtitle}</p>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-3 gap-4 sm:gap-6 mb-8">
          {cards.map((card: any, index: number) => (
            <div key={index} className="text-center p-4 sm:p-6 bg-white rounded-lg border border-gray-100 hover:border-purple-300 hover:shadow-md transition-all duration-300">
              <div className="text-3xl sm:text-4xl mb-2">{card.icon}</div>
              <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1">{card.title}</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-tight">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
