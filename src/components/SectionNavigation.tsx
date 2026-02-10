'use client';

export const SectionNavigation = () => {
  const sections = [
    { label: 'Home', href: '#home' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Requirements', href: '#requirements' },
    { label: 'Hiring', href: '#jobs' },
    { label: 'FAQ', href: '#faq' },
  ];

  return (
    <div className="fixed left-0 top-1/2 transform -translate-y-1/2 z-30 hidden lg:flex flex-col gap-2 bg-black bg-opacity-80 backdrop-blur rounded-r-lg p-2">
      {sections.map((section, i) => (
        <a
          key={i}
          href={section.href}
          className="px-3 py-2 text-white text-xs font-bold hover:bg-white hover:text-black transition rounded whitespace-nowrap"
        >
          {section.label}
        </a>
      ))}
    </div>
  );
};

export const TableOfContents = () => {
  const sections = [
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Requirements', href: '#requirements' },
    { label: 'Currently Hiring', href: '#jobs' },
    { label: 'FAQ', href: '#faq' },
  ];

  return (
    <div className="bg-gray-50 border-t border-b border-gray-200 sticky top-16 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex overflow-x-auto gap-2 py-3">
          {sections.map((section, i) => (
            <a
              key={i}
              href={section.href}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-black hover:bg-black hover:text-white transition whitespace-nowrap shrink-0"
            >
              {section.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
