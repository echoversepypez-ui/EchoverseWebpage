'use client';

import { usePageSections } from '@/hooks/usePageSections';

export const WhyJoinSection = () => {
  const { getSection, loading } = usePageSections();
  const section = getSection('why_join');

  if (loading || !section) {
    return (
      <section className="py-20 bg-gray-50" id="why-join">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </section>
    );
  }

  const benefits = ((section.content as any)?.benefits || []) as any[];

  return (
    <section className="py-8 bg-gray-50" id="why-join">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-black mb-1">{section.title}</h2>
          <p className="text-sm text-gray-600">{section.subtitle}</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {benefits.map((benefit: any, i: number) => (
            <div key={i} className="bg-white rounded-md p-3 border border-gray-200 hover:shadow-md transition">
              <div className="text-2xl mb-2">{benefit.icon}</div>
              <h3 className="text-sm font-bold text-black mb-1">{benefit.title}</h3>
              <p className="text-gray-600 text-xs leading-tight">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
