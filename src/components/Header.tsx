import React from 'react';
import { Sparkles, Plus, Volume2, VolumeX, ShieldCheck } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface HeaderProps {
  balanceStars: number;
  balanceRub: number;
  currency: 'stars' | 'rub';
  setCurrency: (c: 'stars' | 'rub') => void;
  onOpenDeposit: () => void;
  onOpenProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  balanceStars,
  balanceRub,
  currency,
  setCurrency,
  onOpenDeposit,
  onOpenProfile,
}) => {
  const [muted, setMuted] = React.useState(false);

  const handleToggleSound = () => {
    const isMuted = soundFx.toggleMute();
    setMuted(isMuted);
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-[#0b0d18]/90 backdrop-blur-md border-b border-white/[0.06] px-4 py-3">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
        {/* Brand with Lector Mascot Halo */}
        <div 
          onClick={onOpenProfile}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="relative w-10 h-10 rounded-xl overflow-hidden ring-2 ring-purple-500/50 group-hover:ring-purple-400 transition-all shadow-lg shadow-purple-500/20 bg-slate-900">
            <img 
              src="assets/lector_portrait.jpg" 
              alt="Lector Mascot" 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              onError={(e) => {
                // fallback if missing
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            {/* Halo ring glow effect */}
            <div className="absolute inset-0 border border-white/40 rounded-xl pointer-events-none"></div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-gaming font-extrabold text-sm tracking-wider bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent">
                LECTOR
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                BS
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-gray-400 font-medium">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Gifts & NFTs</span>
            </div>
          </div>
        </div>

        {/* Balance & Actions */}
        <div className="flex items-center gap-2">
          {/* Currency Toggle & Balance Pill */}
          <div 
            onClick={() => setCurrency(currency === 'stars' ? 'rub' : 'stars')}
            className="flex items-center gap-1.5 bg-[#171a2c] hover:bg-[#1f233b] border border-white/10 rounded-full py-1.5 px-3 cursor-pointer transition-colors"
            title="Нажмите для смены валюты"
          >
            {currency === 'stars' ? (
              <>
                <span className="text-amber-400 font-bold text-sm">⭐</span>
                <span className="font-extrabold text-sm text-amber-200 font-gaming">
                  {balanceStars.toLocaleString()}
                </span>
              </>
            ) : (
              <>
                <span className="text-blue-400 font-bold text-xs">₽</span>
                <span className="font-extrabold text-sm text-blue-200 font-gaming">
                  {balanceRub.toLocaleString()}
                </span>
              </>
            )}
          </div>

          {/* Deposit Button */}
          <button
            onClick={() => {
              soundFx.playClick();
              onOpenDeposit();
            }}
            className="flex items-center gap-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 active:scale-95 text-white font-bold text-xs py-1.5 px-3.5 rounded-full shadow-lg shadow-purple-600/30 border border-purple-400/30 transition-all"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>Пополнить</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={handleToggleSound}
            className="w-8 h-8 rounded-full bg-[#171a2c] hover:bg-[#1f233b] border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
            title={muted ? 'Включить звук' : 'Выключить звук'}
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
