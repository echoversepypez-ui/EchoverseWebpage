'use client';

import { useState } from 'react';
import { usePageSections } from '@/hooks/usePageSections';

export const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { getSection, loading } = usePageSections();
  const section = getSection('faq');

  if (loading || !section) {
    return (
      <section className="py-20" id="faq">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </section>
    );
  }

  const faqs = ((section.content as any)?.questions || []) as any[];

  return (
    <section className="py-20" id="faq">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-black mb-3">{section.title}</h2>
          <p className="text-lg text-gray-600">{section.subtitle}</p>
        </div>
        <div className="space-y-2">
          {faqs.map((item: any, i: number) => (
            <div key={i} className="border-2 border-gray-200 rounded-lg hover:border-black transition">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full p-4 flex justify-between items-center hover:bg-gray-50 transition"
              >
                <h3 className="text-base font-bold text-black text-left">{item.q}</h3>
                <span className="text-2xl text-gray-600 shrink-0 ml-4">{openIndex === i ? '−' : '+'}</span>
              </button>
              {openIndex === i && (
                <div className="px-4 pb-4 border-t-2 border-gray-200 bg-gray-50">
                  <p className="text-gray-700 text-sm leading-relaxed">{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
