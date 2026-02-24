'use client';

import { useState } from 'react';

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

const CARDS_PER_VIEW = 3;

export function TestimonialCarousel({
  testimonials,
  loading,
  onLoadMore,
  hasMore = false
}: TestimonialCarouselProps) {
  const [carouselIndex, setCarouselIndex] = useState(0);

  const displayedTestimonials = testimonials.length > 0 ? testimonials : DEFAULT_TESTIMONIALS;
  const maxIndex = Math.max(0, displayedTestimonials.length - CARDS_PER_VIEW);
  const currentIndex = Math.min(carouselIndex, maxIndex);
  const visibleCards = displayedTestimonials.slice(currentIndex, currentIndex + CARDS_PER_VIEW);

  const handlePrevious = () => {
    setCarouselIndex(Math.max(0, carouselIndex - CARDS_PER_VIEW));
  };

  const handleNext = () => {
    setCarouselIndex(Math.min(maxIndex, carouselIndex + CARDS_PER_VIEW));
  };

  const handleDotClick = (index: number) => {
    setCarouselIndex(index * CARDS_PER_VIEW);
  };

  const handleLoadMore = () => {
    if (onLoadMore) {
      onLoadMore();
      setCarouselIndex(0);
    }
  };

  const totalPages = Math.ceil(displayedTestimonials.length / CARDS_PER_VIEW);
  const currentPage = Math.floor(currentIndex / CARDS_PER_VIEW);

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Loading testimonials...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Carousel */}
      <div className="relative">
        <div className="overflow-hidden">
          <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {visibleCards.map((testimonial: Testimonial, index: number) => (
              <div
                key={index}
                className="p-6 bg-white border-2 border-gray-200 rounded-2xl hover:border-purple-600 hover:shadow-2xl transition-all duration-300 group h-full flex flex-col"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating || 5)].map((_, i) => (
                    <span key={i} className="text-lg">
                      ⭐
                    </span>
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed mb-6 italic grow">
                  {`"${testimonial.quote}"`}
                </p>
                <div className="border-t-2 border-gray-200 pt-4 mt-auto">
                  <p className="font-bold text-gray-900 text-sm">{testimonial.name}</p>
                  <p className="text-purple-600 font-semibold text-xs">
                    {testimonial.role} • {testimonial.duration}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        {displayedTestimonials.length > CARDS_PER_VIEW && (
          <>
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="absolute -left-4 top-1/2 transform -translate-y-1/2 z-10 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white rounded-full p-3 transition-all duration-300 hover:scale-110 disabled:cursor-not-allowed shadow-lg"
              aria-label="Previous testimonials"
            >
              ←
            </button>
            <button
              onClick={handleNext}
              disabled={currentIndex >= maxIndex}
              className="absolute -right-4 top-1/2 transform -translate-y-1/2 z-10 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white rounded-full p-3 transition-all duration-300 hover:scale-110 disabled:cursor-not-allowed shadow-lg"
              aria-label="Next testimonials"
            >
              →
            </button>
          </>
        )}
      </div>

      {/* Carousel Dots/Indicators */}
      {displayedTestimonials.length > CARDS_PER_VIEW && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => handleDotClick(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === currentPage ? 'bg-purple-600 w-8' : 'bg-gray-300 w-2 hover:bg-gray-400'
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
