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
    <section className="py-8" id="requirements">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-black mb-1">{section.title}</h2>
          <p className="text-sm text-gray-600">{section.subtitle}</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div>
            <h3 className="text-sm font-bold text-black mb-3">Essential Requirements</h3>
            <ul className="space-y-2">
              {essential.map((req: any, i: number) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-green-600 font-bold mt-0.5">{req.icon}</span>
                  <span className="text-gray-700 text-xs">{req.text}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold text-black mb-3">Nice to Have</h3>
            <ul className="space-y-2">
              {nice_to_have.map((bonus: any, i: number) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-0.5">{bonus.icon}</span>
                  <span className="text-gray-700 text-xs">{bonus.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
