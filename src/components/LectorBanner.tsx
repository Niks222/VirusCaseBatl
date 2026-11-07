import React, { useState } from 'react';
import { Flame, Sparkles, MessageSquare, Zap } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface LectorBannerProps {
  onBonusClick: () => void;
}

const LECTOR_QUOTES = [
  '«Прошарили за эту тему?»',
  '«Крути барабан — забирай куш в TG Gifts!»',
  '«Black Spruit в здании. Лектор одобряет дроп!»',
  '«Редкие NFT и Звёзды ждут тебя на арене батлов!»',
];

export const LectorBanner: React.FC<LectorBannerProps> = ({ onBonusClick }) => {
  const [quoteIdx, setQuoteIdx] = useState(0);

  const nextQuote = () => {
    soundFx.playClick();
    setQuoteIdx((prev) => (prev + 1) % LECTOR_QUOTES.length);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#111322] via-[#15122b] to-[#0c0e1a] border border-white/10 p-4 md:p-5 shadow-2xl my-3">
      <div className="absolute -top-10 -right-10 w-48 h-48 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex items-center justify-between gap-4">
        <div className="flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-500/20 border border-red-500/40 text-red-300 text-[10px] font-black uppercase tracking-wider">
              <Flame className="w-3 h-3 text-red-400" />
              <span>BLACK SPRUIT</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-300 text-[10px] font-bold">
              МАСКОТ: LECTOR
            </span>
          </div>

          <div 
            onClick={nextQuote}
            className="cursor-pointer group flex items-start gap-1.5"
          >
            <MessageSquare className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <h2 className="font-gaming font-black text-base sm:text-lg text-white tracking-wide leading-tight group-hover:text-amber-200 transition-colors">
              {LECTOR_QUOTES[quoteIdx]}
            </h2>
          </div>

          <p className="text-xs text-gray-400 max-w-sm line-clamp-2">
            Реальные Telegram подарки из Fragment и нативные звёзды с выводом в профиль.
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              onClick={() => {
                soundFx.playClick();
                onBonusClick();
              }}
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 active:scale-95 text-black font-gaming font-black text-xs px-3.5 py-2 rounded-xl shadow-lg shadow-amber-500/20 transition-all border border-amber-300"
            >
              <Sparkles className="w-3.5 h-3.5 text-black fill-black" />
              <span>БОНУС ЛЕКТОРА (+150 ⭐)</span>
            </button>
            <span className="text-[11px] text-purple-300 font-semibold font-mono">
              Код: LECTOR
            </span>
          </div>
        </div>

        <div className="relative shrink-0 flex flex-col items-center">
          <div className="relative w-24 h-32 sm:w-28 sm:h-36 rounded-2xl overflow-hidden border border-white/10 bg-black/60 flex items-end justify-center">
            <img
              src="assets/lector_mascot_real.png"
              alt="Lector"
              className="h-full w-auto object-contain object-bottom hover:scale-105 transition-transform duration-300 filter drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex items-end justify-center pb-1">
              <span className="text-[10px] font-gaming font-black tracking-widest text-white uppercase bg-white/10 px-2 py-0.5 rounded border border-white/10 backdrop-blur-sm">
                LECTOR
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
