import React from 'react';
import { CaseItem } from '../types';
import { Sparkles, Clock } from 'lucide-react';
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
      ? `${caseItem.price}`
      : `${caseItem.rubPrice} ₽`;

  return (
    <div
      onClick={handleClick}
      className="group relative cursor-pointer rounded-2xl bg-[#0e111d]/80 border border-white/10 hover:border-amber-400/50 hover:shadow-xl hover:shadow-black/60 p-3 flex flex-col justify-between overflow-hidden transition-all duration-200"
    >
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full blur-2xl opacity-15 group-hover:opacity-30 transition-opacity pointer-events-none"
        style={{ backgroundColor: caseItem.color || '#f59e0b' }}
      />

      <div className="flex items-center justify-between z-10 mb-1">
        {caseItem.badge ? (
          <span
            className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border backdrop-blur-md"
            style={{
              backgroundColor: `${caseItem.color}20`,
              borderColor: `${caseItem.color}50`,
              color: '#ffffff',
            }}
          >
            {caseItem.badge}
          </span>
        ) : (
          <div />
        )}

        {caseItem.oldPrice && (
          <span className="text-[10px] text-gray-500 line-through font-semibold">
            {currency === 'stars' ? `${caseItem.oldPrice} ⭐` : `${Math.round(caseItem.oldPrice * 1.6)} ₽`}
          </span>
        )}
      </div>

      <div className="relative py-2 flex items-center justify-center min-h-[110px] z-10">
        <div className="relative w-full flex items-center justify-center">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden shadow-2xl group-hover:scale-105 group-hover:-translate-y-0.5 transition-all duration-200">
            <img
              src={caseItem.caseImage}
              alt={caseItem.name}
              className="w-full h-full object-cover object-center filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>

          {caseItem.previewIcons && caseItem.previewIcons.slice(0, 3).map((iconUrl, idx) => {
            const positions = [
              '-top-1 -right-1 w-8 h-8 rotate-6',
              '-bottom-1 -left-1 w-7 h-7 -rotate-6',
              '-bottom-2 -right-1 w-6 h-6 rotate-12',
            ];
            return (
              <div
                key={idx}
                className={`absolute ${positions[idx]} rounded-lg p-0.5 bg-black/60 border border-white/20 backdrop-blur-sm shadow-lg pointer-events-none group-hover:scale-110 transition-transform`}
              >
                <img
                  src={iconUrl}
                  alt="drop"
                  className="w-full h-full object-contain filter drop-shadow"
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className="z-10 mt-1.5 space-y-1.5">
        <h3 className="font-extrabold text-xs sm:text-sm text-white text-center truncate group-hover:text-amber-200 transition-colors">
          {caseItem.name}
        </h3>

        {caseItem.isDaily ? (
          <button className="w-full py-2 px-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 active:scale-98 text-white shadow border border-blue-400/30 flex items-center justify-center gap-1.5 transition-all">
            {canClaimDaily ? (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Забрать</span>
              </>
            ) : (
              <>
                <Clock className="w-3.5 h-3.5 text-gray-300" />
                <span>18:42</span>
              </>
            )}
          </button>
        ) : (
          <button className="w-full py-2 px-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 active:scale-98 text-black shadow-md shadow-amber-500/20 border border-amber-300 flex items-center justify-center gap-1.5 transition-all">
            {currency === 'stars' && (
              <img src="assets/gifts/star.svg" alt="star" className="w-3.5 h-3.5 object-contain" />
            )}
            <span>{priceDisplay}</span>
          </button>
        )}
      </div>
    </div>
  );
};
