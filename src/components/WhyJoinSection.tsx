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
    <section className="py-20 bg-gray-50" id="why-join">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-black mb-3">{section.title}</h2>
          <p className="text-lg text-gray-600">{section.subtitle}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((benefit: any, i: number) => (
            <div key={i} className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition">
              <div className="text-4xl mb-4">{benefit.icon}</div>
              <h3 className="text-xl font-bold text-black mb-2">{benefit.title}</h3>
              <p className="text-gray-600 text-sm">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
