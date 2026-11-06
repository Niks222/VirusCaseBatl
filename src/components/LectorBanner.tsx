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
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#171a33] via-[#1b1735] to-[#101222] border-2 border-purple-500/40 p-4 md:p-5 shadow-2xl shadow-purple-950/40 my-3">
      {/* Background neon ambient lights */}
      <div className="absolute -top-10 -right-10 w-48 h-48 bg-purple-600/25 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 flex items-center justify-between gap-4">
        {/* Left: Text & Mascot Speech */}
        <div className="flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-500/20 border border-red-500/40 text-red-300 text-[10px] font-black uppercase tracking-wider">
              <Flame className="w-3 h-3 text-red-400" />
              <span>BLACK SPRUIT</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-200 text-[10px] font-bold">
              👑 ГЛАВНЫЙ МАСКОТ: LECTOR
            </span>
          </div>

          <div 
            onClick={nextQuote}
            className="cursor-pointer group flex items-start gap-1.5"
            title="Нажмите, чтобы сменить цитату Лектора"
          >
            <MessageSquare className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <h2 className="font-gaming font-black text-base sm:text-lg text-white tracking-wide leading-tight group-hover:text-amber-200 transition-colors">
              {LECTOR_QUOTES[quoteIdx]}
            </h2>
          </div>

          <p className="text-xs text-gray-300 max-w-sm line-clamp-2">
            Реальные Telegram подарки из Fragment и нативные дропы звёзд. Выводи подарки прямо в свой профиль!
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              onClick={() => {
                soundFx.playClick();
                onBonusClick();
              }}
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 active:scale-95 text-black font-gaming font-black text-xs px-3.5 py-2 rounded-xl shadow-lg shadow-amber-500/30 transition-all border border-amber-300"
            >
              <Sparkles className="w-3.5 h-3.5 text-black fill-black" />
              <span>БОНУС ЛЕКТОРА (+150 ⭐)</span>
            </button>
            <span className="text-[11px] text-purple-300 font-semibold font-mono">
              Код: LECTOR
            </span>
          </div>
        </div>

        {/* Right: Full Featured Lector Mascot Art with Glowing Halo */}
        <div className="relative shrink-0 flex flex-col items-center">
          {/* Glowing Animated Halo over Lector's head */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-14 h-4 rounded-[100%] border-2 border-white bg-white/40 shadow-[0_0_20px_#ffffff] animate-pulse pointer-events-none z-20"></div>

          <div className="relative w-24 h-28 sm:w-28 sm:h-32 rounded-2xl overflow-hidden border-2 border-purple-400/60 shadow-[0_0_25px_rgba(168,85,247,0.4)] bg-black/90">
            <img
              src="assets/lector_portrait.jpg"
              alt="Lector BS Mascot"
              className="w-full h-full object-cover object-top hover:scale-110 transition-transform duration-500"
            />
            {/* Dark gradient vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex items-end justify-center pb-1">
              <span className="text-[10px] font-gaming font-black tracking-widest text-white uppercase bg-purple-950/80 px-2 py-0.5 rounded border border-purple-400/50">
                LECTOR
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
