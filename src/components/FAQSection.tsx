'use client';

import { useState, useCallback } from 'react';
import { usePageSections } from '@/hooks/usePageSections';

export const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { getSection, loading } = usePageSections();
  const section = getSection('faq');

  const handleToggle = useCallback((index: number) => {
    setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
  }, []);

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
    <section className="py-8" id="faq">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-black mb-1">{section.title}</h2>
          <p className="text-sm text-gray-600">{section.subtitle}</p>
        </div>
        <div className="space-y-2">
          {faqs.map((item: any, i: number) => (
            <div key={i} className="border border-gray-200 rounded hover:border-black transition">
              <button
                onClick={() => handleToggle(i)}
                className="w-full p-3 flex justify-between items-center hover:bg-gray-50 transition"
              >
                <h3 className="text-sm font-bold text-black text-left">{item.q}</h3>
                <span className="text-lg text-gray-600 shrink-0 ml-4">{openIndex === i ? '−' : '+'}</span>
              </button>
              {openIndex === i && (
                <div className="px-3 pb-3 border-t border-gray-200 bg-gray-50">
                  <p className="text-gray-700 text-xs leading-relaxed">{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
