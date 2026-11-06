import React from 'react';
import { Flame, Sparkles, Award } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface LectorBannerProps {
  onBonusClick: () => void;
}

export const LectorBanner: React.FC<LectorBannerProps> = ({ onBonusClick }) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#171a33] via-[#1e1b38] to-[#121424] border border-purple-500/30 p-4 md:p-5 shadow-2xl shadow-purple-950/30 my-3">
      {/* Background neon ambient glows */}
      <div className="absolute -top-12 -right-12 w-44 h-44 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 flex items-center justify-between gap-3">
        <div className="flex-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-[10px] font-extrabold uppercase tracking-wider mb-1.5">
            <Flame className="w-3 h-3 text-amber-400" />
            <span>BLACK SPRUIT • LECTOR DROP</span>
          </div>

          <h2 className="font-gaming font-extrabold text-lg md:text-xl text-white tracking-wide leading-tight">
            «ПРОШАРИЛИ ЗА ЭТУ ТЕМУ?»
          </h2>

          <p className="text-xs text-gray-300 mt-1 max-w-xs md:max-w-md line-clamp-2">
            Открывай кейсы с реальными Telegram подарками, NFT и Звёздами. Вывод подарка прямо в профиль TG!
          </p>

          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={() => {
                soundFx.playClick();
                onBonusClick();
              }}
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 active:scale-95 text-black font-gaming font-black text-xs px-3.5 py-1.5 rounded-xl shadow-lg shadow-amber-500/30 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>БОНУС ЛЕКТОРА</span>
            </button>
            <span className="text-[11px] text-purple-300 font-medium">
              До +150 ⭐ на баланс
            </span>
          </div>
        </div>

        {/* Lector Mascot Avatar with Halo */}
        <div className="relative shrink-0 w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden border-2 border-purple-400/50 shadow-2xl shadow-purple-600/40 bg-black">
          <img
            src="assets/lector_portrait.jpg"
            alt="Lector BS Mascot"
            className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          {/* Glowing Halo Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end justify-center pb-1">
            <span className="text-[9px] font-gaming font-extrabold tracking-widest text-purple-200 uppercase bg-black/60 px-1.5 py-0.5 rounded border border-white/20">
              LECTOR
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
