'use client';

import { usePageSections } from '@/hooks/usePageSections';

export const HowItWorksSection = () => {
  const { getSection, loading } = usePageSections();
  const section = getSection('how_it_works');

  if (loading || !section) {
    return (
      <section className="py-20 bg-gray-50" id="how-it-works">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </section>
    );
  }

  const steps = ((section.content as any)?.steps || []) as any[];

  return (
    <section className="py-8 bg-gray-50" id="how-it-works">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-black mb-1">{section.title}</h2>
          <p className="text-sm text-gray-600">{section.subtitle}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {steps.map((step: any, i: number) => (
            <div key={i} className="text-center">
              <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-2">
                {step.number}
              </div>
              <h3 className="text-sm font-bold text-black mb-1">{step.title}</h3>
              <p className="text-xs text-gray-600 leading-tight">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
