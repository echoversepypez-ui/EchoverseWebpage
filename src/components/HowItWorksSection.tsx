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
    <section className="py-20 bg-gray-50" id="how-it-works">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-black mb-3">{section.title}</h2>
          <p className="text-lg text-gray-600">{section.subtitle}</p>
        </div>
        <div className="grid md:grid-cols-4 gap-6">
          {steps.map((step: any, i: number) => (
            <div key={i} className="text-center">
              <div className="w-14 h-14 bg-black text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-3">
                {step.number}
              </div>
              <h3 className="text-lg font-bold text-black mb-2">{step.title}</h3>
              <p className="text-sm text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
