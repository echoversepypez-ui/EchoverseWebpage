'use client';

import { usePageSections } from '@/hooks/usePageSections';

export const RequirementsSection = () => {
  const { getSection, loading } = usePageSections();
  const section = getSection('requirements');

  if (loading || !section) {
    return (
      <section className="py-20" id="requirements">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </section>
    );
  }

  const { essential = [], nice_to_have = [] } = (section.content || {}) as { essential: any[]; nice_to_have: any[] };

  return (
    <section className="py-20" id="requirements">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-black mb-3">{section.title}</h2>
          <p className="text-lg text-gray-600">{section.subtitle}</p>
        </div>
        <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
          <div>
            <h3 className="text-xl font-bold text-black mb-5">Essential Requirements</h3>
            <ul className="space-y-3">
              {essential.map((req: any, i: number) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-green-600 font-bold text-lg mt-0.5">{req.icon}</span>
                  <span className="text-gray-700 text-sm">{req.text}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold text-black mb-5">Nice to Have</h3>
            <ul className="space-y-3">
              {nice_to_have.map((bonus: any, i: number) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold text-lg mt-0.5">{bonus.icon}</span>
                  <span className="text-gray-700 text-sm">{bonus.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
