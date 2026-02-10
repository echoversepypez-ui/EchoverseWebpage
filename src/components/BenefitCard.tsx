'use client';

interface BenefitCardProps {
  icon: string;
  title: string;
  description: string;
}

export const BenefitCard = ({ icon, title, description }: BenefitCardProps) => {
  return (
    <div className="bg-white border-2 border-gray-200 rounded-xl p-8 hover:border-purple-500 hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
};
