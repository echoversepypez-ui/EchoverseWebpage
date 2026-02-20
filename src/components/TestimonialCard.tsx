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
    <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-purple-500 hover:shadow-xl transition-all duration-300 h-full flex flex-col">
      {/* Rating Stars */}
      <div className="flex gap-1 mb-4">
        {[...Array(rating)].map((_, i) => (
          <span key={i} className="text-lg">⭐</span>
        ))}
      </div>

      {/* Testimonial Content */}
      <p className="text-gray-700 grow mb-6 leading-relaxed italic">"{content}"</p>

      {/* Author Info */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-linear-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-lg font-bold shrink-0">
          {image || name.charAt(0)}
        </div>
        <div>
          <p className="font-bold text-gray-900">{name}</p>
          <p className="text-sm text-gray-600">{role}</p>
        </div>
      </div>
    </div>
  );
};
