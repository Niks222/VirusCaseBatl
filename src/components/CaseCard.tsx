import React from 'react';
import { CaseItem } from '../types';
import { Sparkles, Clock, Flame } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface CaseCardProps {
  caseItem: CaseItem;
  currency: 'stars' | 'rub';
  onSelect: (caseItem: CaseItem) => void;
  canClaimDaily?: boolean;
}

export const CaseCard: React.FC<CaseCardProps> = ({
  caseItem,
  currency,
  onSelect,
  canClaimDaily = true,
}) => {
  const handleClick = () => {
    soundFx.playClick();
    onSelect(caseItem);
  };

  const priceDisplay =
    currency === 'stars'
      ? `${caseItem.price} ⭐`
      : `${caseItem.rubPrice} ₽`;

  return (
    <div
      onClick={handleClick}
      className="group relative cursor-pointer rounded-2xl glass-card hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-950/40 p-3.5 flex flex-col justify-between overflow-hidden transition-all duration-300"
    >
      {/* Ambient background light matching case color */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity pointer-events-none"
        style={{ backgroundColor: caseItem.color || '#6366f1' }}
      ></div>

      {/* Top Badge (if any) */}
      <div className="flex items-center justify-between z-10 mb-2">
        {caseItem.badge ? (
          <span
            className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border shadow-sm backdrop-blur-md"
            style={{
              backgroundColor: `${caseItem.color}25`,
              borderColor: `${caseItem.color}60`,
              color: '#ffffff',
            }}
          >
            {caseItem.badge}
          </span>
        ) : (
          <div></div>
        )}

        {caseItem.oldPrice && (
          <span className="text-[10px] text-gray-500 line-through font-semibold">
            {currency === 'stars' ? `${caseItem.oldPrice} ⭐` : `${Math.round(caseItem.oldPrice * 1.6)} ₽`}
          </span>
        )}
      </div>

      {/* Floating Center Drops Preview */}
      <div className="relative py-3 flex items-center justify-center min-h-[96px] z-10">
        <div className="relative flex items-center justify-center">
          {/* Main Central Icon with Float animation */}
          <div className="text-4xl md:text-5xl transform group-hover:scale-110 transition-transform duration-300 filter drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] animate-float">
            {caseItem.previewIcons[0]}
          </div>

          {/* Secondary Orbiting Icons */}
          {caseItem.previewIcons.slice(1, 4).map((icon, idx) => {
            const offsets = [
              '-top-2 -right-3 text-xl opacity-90',
              '-bottom-1 -left-3 text-xl opacity-80',
              '-bottom-2 -right-2 text-base opacity-75',
            ];
            return (
              <span
                key={idx}
                className={`absolute ${offsets[idx]} filter drop-shadow transition-transform duration-300 group-hover:translate-y-[-2px]`}
              >
                {icon}
              </span>
            );
          })}
        </div>
      </div>

      {/* Title & Price Pill */}
      <div className="z-10 mt-2 space-y-2">
        <h3 className="font-extrabold text-xs md:text-sm text-white text-center truncate group-hover:text-purple-200 transition-colors">
          {caseItem.name}
        </h3>

        {/* Price / Action Button */}
        {caseItem.isDaily ? (
          <button className="w-full py-2 px-3 rounded-xl font-bold text-xs bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-blue-600/30 border border-blue-400/30 flex items-center justify-center gap-1.5 transition-all">
            {canClaimDaily ? (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Подарок ждет</span>
              </>
            ) : (
              <>
                <Clock className="w-3.5 h-3.5 text-gray-300" />
                <span>Через 18:42</span>
              </>
            )}
          </button>
        ) : (
          <button className="w-full py-2 px-3 rounded-xl font-bold text-xs bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-md shadow-indigo-600/30 border border-indigo-400/30 flex items-center justify-center gap-1 transition-all">
            <span>{priceDisplay}</span>
          </button>
        )}
      </div>
    </div>
  );
};
