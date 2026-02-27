'use client';

import { useState, useMemo } from 'react';

export interface Testimonial {
  quote: string;
  rating: number;
  name: string;
  role: string;
  duration: string;
}

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
  loading: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    quote: "Echoverse changed my life! I went from freelance tutoring to earning $5k/month. The flexibility is unmatched and the support is amazing.",
    rating: 5,
    name: "Maria Santos",
    role: "Full-time Teacher",
    duration: "6 months in"
  },
  {
    quote: "I started as a side hustle and got my first student within 48 hours. The platform is so easy to use and students are genuinely engaged.",
    rating: 5,
    name: "John Smith",
    role: "Part-time Educator",
    duration: "3 months in"
  },
  {
    quote: "Teaching 20+ hours a week with complete flexibility. Students from all over the world. This is exactly what I was looking for!",
    rating: 5,
    name: "Sarah Johnson",
    role: "Career Switcher",
    duration: "9 months in"
  }
];

export function TestimonialCarousel({
  testimonials,
  loading,
  onLoadMore,
  hasMore = false
}: TestimonialCarouselProps) {
  const [carouselIndex, setCarouselIndex] = useState(0);

  const displayedTestimonials = testimonials.length > 0 ? testimonials : DEFAULT_TESTIMONIALS;

  // Dynamic cards per view - show more on larger screens
  const cardsPerView = useMemo(() => {
    if (displayedTestimonials.length === 1) return 1;
    if (displayedTestimonials.length === 2) return 2;
    return 3; // Default to 3 for larger sets
  }, [displayedTestimonials.length]);

  const maxIndex = Math.max(0, displayedTestimonials.length - cardsPerView);
  const currentIndex = Math.min(carouselIndex, maxIndex);
  const visibleCards = displayedTestimonials.slice(currentIndex, currentIndex + cardsPerView);

  const handlePrevious = () => {
    setCarouselIndex(Math.max(0, carouselIndex - cardsPerView));
  };

  const handleNext = () => {
    setCarouselIndex(Math.min(maxIndex, carouselIndex + cardsPerView));
  };

  const handleDotClick = (index: number) => {
    setCarouselIndex(index * cardsPerView);
  };

  const handleLoadMore = () => {
    if (onLoadMore) {
      onLoadMore();
      setCarouselIndex(0);
    }
  };

  const needsCarousel = displayedTestimonials.length > cardsPerView;
  const totalPages = Math.ceil(displayedTestimonials.length / cardsPerView);
  const currentPage = Math.floor(currentIndex / cardsPerView);

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Loading testimonials...</p>
      </div>
    );
  }

  // Determine grid columns based on number of visible cards
  const getGridCols = () => {
    if (visibleCards.length === 1) return 'grid-cols-1 max-w-md mx-auto';
    if (visibleCards.length === 2) return 'grid-cols-1 sm:grid-cols-2';
    return 'grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
  };

  return (
    <div className="space-y-8">
      {/* Carousel */}
      <div className={`relative ${needsCarousel ? 'px-12' : ''}`}>
        <div className="overflow-hidden">
          <div className={`grid gap-6 ${getGridCols()}`}>
            {visibleCards.map((testimonial: Testimonial, index: number) => (
              <div
                key={index}
                className="group relative bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden h-full flex flex-col hover:-translate-y-2"
              >
                {/* Gradient accent bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500"></div>

                <div className="p-6 flex flex-col h-full">
                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating || 5)].map((_, i) => (
                      <span key={i} className="text-base">
                        ⭐
                      </span>
                    ))}
                  </div>

                  {/* Quote Text */}
                  <p className="text-gray-700 leading-relaxed mb-6 grow text-sm italic font-light">
                    {`"${testimonial.quote}"`}
                  </p>

                  {/* Divider */}
                  <div className="border-t border-gray-100 pt-4 mt-auto">
                    {/* Author Info */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm shrink-0">
                        {testimonial.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 text-sm truncate">{testimonial.name}</p>
                        <p className="text-xs text-gray-600 truncate">
                          {testimonial.role} • {testimonial.duration}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Buttons - Only show if carousel is needed */}
        {needsCarousel && displayedTestimonials.length > cardsPerView && (
          <>
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="absolute -left-6 top-1/2 transform -translate-y-1/2 z-10 bg-white border-2 border-purple-500 text-purple-600 hover:bg-purple-50 disabled:border-gray-300 disabled:text-gray-300 disabled:bg-gray-50 rounded-full p-3 transition-all duration-300 hover:scale-110 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
              aria-label="Previous testimonials"
            >
              ←
            </button>
            <button
              onClick={handleNext}
              disabled={currentIndex >= maxIndex}
              className="absolute -right-6 top-1/2 transform -translate-y-1/2 z-10 bg-white border-2 border-purple-500 text-purple-600 hover:bg-purple-50 disabled:border-gray-300 disabled:text-gray-300 disabled:bg-gray-50 rounded-full p-3 transition-all duration-300 hover:scale-110 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
              aria-label="Next testimonials"
            >
              →
            </button>
          </>
        )}
      </div>

      {/* Carousel Dots/Indicators - Only show if carousel is needed */}
      {needsCarousel && displayedTestimonials.length > cardsPerView && (
        <div className="flex justify-center gap-3 pt-4">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => handleDotClick(i)}
              className={`rounded-full transition-all duration-300 ${
                i === currentPage
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 w-8 h-3'
                  : 'bg-gray-300 w-3 h-3 hover:bg-gray-400'
              }`}
              aria-label={`Go to testimonial page ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center">
          <button
            onClick={handleLoadMore}
            className="px-8 py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            Load More Testimonials
          </button>
        </div>
      )}
    </div>
  );
}
