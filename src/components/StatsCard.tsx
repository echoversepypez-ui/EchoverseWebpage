'use client';

interface StatsCardProps {
  icon: string;
  number: string;
  label: string;
  description?: string;
}

export const StatsCard = ({ icon, number, label, description }: StatsCardProps) => {
  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-gray-200 rounded-xl p-8 text-center hover:border-purple-500 hover:shadow-xl transition-all duration-300 group">
      <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{icon}</div>
      <p className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2">
        {number}
      </p>
      <p className="text-lg font-semibold text-gray-900 mb-2">{label}</p>
      {description && <p className="text-sm text-gray-600">{description}</p>}
    </div>
  );
};
