import React from 'react';
import { FOOD_CATEGORIES } from '../data/mockData';
import { useLanguage } from '../context/LanguageContext';
import {
  Utensils,
  Flame,
  Soup,
  Fish,
  Sandwich,
  Pizza,
  Cake,
  Coffee,
} from 'lucide-react';

interface FoodCategoryPillsProps {
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

export const FoodCategoryPills: React.FC<FoodCategoryPillsProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const { language } = useLanguage();

  const getIcon = (id: string) => {
    switch (id) {
      case 'chuijhal':
        return <Flame className="w-4 h-4 text-red-500" />;
      case 'biryani':
        return <Soup className="w-4 h-4 text-amber-500" />;
      case 'bengali':
        return <Fish className="w-4 h-4 text-blue-500" />;
      case 'fastfood':
        return <Sandwich className="w-4 h-4 text-orange-500" />;
      case 'pizza':
        return <Pizza className="w-4 h-4 text-rose-500" />;
      case 'chinese':
        return <Utensils className="w-4 h-4 text-emerald-500" />;
      case 'sweets':
        return <Cake className="w-4 h-4 text-pink-500" />;
      case 'tea_snacks':
        return <Coffee className="w-4 h-4 text-amber-700" />;
      default:
        return <Utensils className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="py-4 overflow-x-auto scrollbar-none flex items-center gap-2 sm:gap-2.5 pb-2">
      {FOOD_CATEGORIES.map(category => {
        const isSelected = selectedCategory === category.id;
        return (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={`shrink-0 px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all duration-200 border cursor-pointer ${
              isSelected
                ? 'bg-slate-900 text-white border-slate-900 shadow-md shadow-slate-900/20 scale-102'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200/90 shadow-2xs hover:border-slate-300'
            }`}
          >
            <span className={isSelected ? 'brightness-125' : ''}>
              {getIcon(category.id)}
            </span>
            <span>{language === 'bn' ? category.nameBn : category.nameEn}</span>
          </button>
        );
      })}
    </div>
  );
};
