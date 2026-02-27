'use client';

interface TestimonialCardProps {
  name: string;
  role: string;
  image?: string;
  content: string;
  rating: number;
}

export const TestimonialCard = ({ name, role, image, content, rating }: TestimonialCardProps) => {
  return (
    <div className="group relative bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden h-full flex flex-col hover:-translate-y-2">
      {/* Gradient accent bar at top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500"></div>

      <div className="p-6 flex flex-col h-full">
        {/* Rating Stars */}
        <div className="flex gap-1 mb-4">
          {[...Array(rating)].map((_, i) => (
            <span key={i} className="text-base">⭐</span>
          ))}
        </div>

        {/* Testimonial Content */}
        <p className="text-gray-700 grow mb-6 leading-relaxed italic font-light text-sm">
          "{content}"
        </p>

        {/* Divider */}
        <div className="border-t border-gray-100 pt-4 mt-auto">
          {/* Author Info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold shrink-0">
              {image || name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 text-sm truncate">{name}</p>
              <p className="text-xs text-gray-600 truncate">{role}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
