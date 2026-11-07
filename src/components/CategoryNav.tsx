import React from 'react';
import { Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { CATEGORIES } from '../data/cases';

interface CategoryNavProps {
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  sortBy: 'default' | 'price-asc' | 'price-desc';
  setSortBy: (sort: 'default' | 'price-asc' | 'price-desc') => void;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  selectedCategory,
  onSelectCategory,
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
}) => {
  const [showSearch, setShowSearch] = React.useState(false);

  const toggleSort = () => {
    if (sortBy === 'default') setSortBy('price-asc');
    else if (sortBy === 'price-asc') setSortBy('price-desc');
    else setSortBy('default');
  };

  return (
    <div className="w-full space-y-2.5 my-3">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowSearch(!showSearch)}
          className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center border transition-all ${
            showSearch
              ? 'bg-purple-600 border-purple-400 text-white'
              : 'bg-[#171a2c] border-white/10 text-gray-400 hover:text-white'
          }`}
          title="Поиск кейсов"
        >
          <Search className="w-4 h-4" />
        </button>

        <div className="flex-1 flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30 border border-blue-400/40'
                    : 'bg-[#171a2c] text-gray-300 hover:text-white hover:bg-[#20253d] border border-white/[0.06]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        <button
          onClick={toggleSort}
          className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center border transition-all ${
            sortBy !== 'default'
              ? 'bg-indigo-600 border-indigo-400 text-white'
              : 'bg-[#171a2c] border-white/10 text-gray-400 hover:text-white'
          }`}
          title={`Сортировка: ${
            sortBy === 'price-asc'
              ? 'По возрастанию цены'
              : sortBy === 'price-desc'
              ? 'По убыванию цены'
              : 'По умолчанию'
          }`}
        >
          <ArrowUpDown className="w-4 h-4" />
        </button>
      </div>

      {showSearch && (
        <div className="relative animate-fadeIn">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск кейсов или подарков (мишка, кольцо, пёс, nft...)"
            inputMode="search"
            autoCapitalize="none"
            autoCorrect="off"
            autoComplete="off"
            enterKeyHint="search"
            className="w-full bg-[#131627] border border-white/10 focus:border-purple-500 rounded-xl px-4 py-2.5 text-base sm:text-xs text-white placeholder-gray-500 outline-none transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-xs text-gray-400 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>
      )}
    </div>
  );
};
