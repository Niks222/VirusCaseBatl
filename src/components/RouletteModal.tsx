import React, { useState, useEffect, useRef } from 'react';
import { CaseItem, GiftItem } from '../types';
import { X, Sparkles, RefreshCw, ArrowUpRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundFx } from '../utils/audio';

interface RouletteModalProps {
  caseItem: CaseItem | null;
  currency: 'stars' | 'rub';
  userBalance: number;
  onClose: () => void;
  onWin: (wonItem: GiftItem, action: 'keep' | 'sell') => void;
  onOpenUpgradeWithItem?: (item: GiftItem) => void;
}

const ITEM_WIDTH = 130;
const STRIP_LENGTH = 65;
const WINNING_INDEX = 52;

export const RouletteModal: React.FC<RouletteModalProps> = ({
  caseItem,
  currency,
  userBalance,
  onClose,
  onWin,
  onOpenUpgradeWithItem,
}) => {
  if (!caseItem) return null;

  const [isSpinning, setIsSpinning] = useState(false);
  const [rouletteItems, setRouletteItems] = useState<GiftItem[]>([]);
  const [winningItem, setWinningItem] = useState<GiftItem | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [fastOpen, setFastOpen] = useState(false);

  const stripRef = useRef<HTMLDivElement>(null);
  const tickAudioTimerRef = useRef<number[]>([]);

  const pickWinningItem = (): GiftItem => {
    const totalWeight = caseItem.drops.reduce((sum, drop) => sum + drop.weight, 0);
    let rand = Math.random() * totalWeight;
    for (const drop of caseItem.drops) {
      if (rand < drop.weight) {
        return drop.item;
      }
      rand -= drop.weight;
    }
    return caseItem.drops[0].item;
  };

  const generateStrip = (winner: GiftItem) => {
    const allDrops = caseItem.drops.map((d) => d.item);
    const strip: GiftItem[] = [];

    for (let i = 0; i < STRIP_LENGTH; i++) {
      if (i === WINNING_INDEX) {
        strip.push(winner);
      } else {
        const randItem = allDrops[Math.floor(Math.random() * allDrops.length)];
        strip.push(randItem);
      }
    }
    return strip;
  };

  useEffect(() => {
    const winner = pickWinningItem();
    setRouletteItems(generateStrip(winner));
    setIsSpinning(false);
    setShowResult(false);
    setWinningItem(null);

    return () => {
      tickAudioTimerRef.current.forEach((t) => clearTimeout(t));
    };
  }, [caseItem]);

  const handleStartOpen = () => {
    if (isSpinning) return;
    const price = currency === 'stars' ? caseItem.price : caseItem.rubPrice;
    if (userBalance < price && !caseItem.isDaily) {
      alert('Недостаточно средств на балансе! Пополните баланс.');
      return;
    }

    const winner = pickWinningItem();
    const strip = generateStrip(winner);
    setRouletteItems(strip);
    setWinningItem(winner);
    setIsSpinning(true);
    setShowResult(false);

    if (fastOpen) {
      setTimeout(() => {
        setIsSpinning(false);
        setShowResult(true);
        triggerVictory(winner);
      }, 400);
      return;
    }

    if (stripRef.current) {
      stripRef.current.style.transition = 'none';
      stripRef.current.style.transform = 'translateX(0px)';

      void stripRef.current.offsetHeight;

      const jitter = (Math.random() - 0.5) * 60;
      const containerWidth = stripRef.current.parentElement?.clientWidth || 400;
      const targetOffset = -(WINNING_INDEX * ITEM_WIDTH + ITEM_WIDTH / 2 - containerWidth / 2 + jitter);

      const durationMs = 5200;
      stripRef.current.style.transition = `transform ${durationMs}ms cubic-bezier(0.12, 0.8, 0.22, 1)`;
      stripRef.current.style.transform = `translateX(${targetOffset}px)`;

      playTicksSequence(durationMs);

      setTimeout(() => {
        setIsSpinning(false);
        setShowResult(true);
        triggerVictory(winner);
      }, durationMs + 200);
    }
  };

  const playTicksSequence = (duration: number) => {
    tickAudioTimerRef.current.forEach((t) => clearTimeout(t));
    tickAudioTimerRef.current = [];

    let elapsed = 0;
    let step = 60;
    while (elapsed < duration - 400) {
      const timer = window.setTimeout(() => {
        soundFx.playTick();
      }, elapsed);
      tickAudioTimerRef.current.push(timer);
      elapsed += step;
      step = step * 1.055;
    }
  };

  const triggerVictory = (item: GiftItem) => {
    soundFx.playWin(item.rarity);

    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.6 },
      colors: ['#8b5cf6', '#3b82f6', '#f59e0b', '#ec4899', '#10b981'],
    });
  };

  const handleAction = (action: 'keep' | 'sell') => {
    if (!winningItem) return;
    onWin(winningItem, action);
    onClose();
  };

  const getRarityBadge = (rarity: string) => {
    switch (rarity) {
      case 'mythic':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'nft':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50';
      case 'legendary':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/50';
      case 'epic':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
      case 'rare':
        return 'bg-sky-500/20 text-sky-400 border-sky-500/50';
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    }
  };

  const costDisplay =
    currency === 'stars'
      ? `${caseItem.price} ⭐`
      : `${caseItem.rubPrice} ₽`;

  const totalDropsWeight = caseItem.drops.reduce((acc, d) => acc + d.weight, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/90 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl max-h-[92vh] flex flex-col bg-[#111425] border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header with 3D Case Preview */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.08] bg-[#161a30]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/20 bg-black/40">
              <img
                src={caseItem.caseImage}
                alt={caseItem.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="font-extrabold text-base text-white">{caseItem.name}</h2>
              <span className="text-[11px] text-gray-400 font-medium">
                {caseItem.isDaily ? 'Ежедневный бесплатный подарок' : `Цена открытия: ${costDisplay}`}
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              if (isSpinning) return;
              soundFx.playClick();
              onClose();
            }}
            disabled={isSpinning}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Roulette Stage */}
        <div className="relative bg-[#0b0d18] py-8 px-2 overflow-hidden border-b border-white/[0.08] flex flex-col items-center justify-center min-h-[220px]">
          {/* Top & Bottom Center Pointer Indicators */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[14px] border-t-amber-400 z-30 filter drop-shadow-[0_2px_8px_rgba(251,191,36,0.8)]"></div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[14px] border-b-amber-400 z-30 filter drop-shadow-[0_-2px_8px_rgba(251,191,36,0.8)]"></div>
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[2px] bg-gradient-to-b from-amber-400 via-purple-400 to-amber-400 z-20 pointer-events-none opacity-85"></div>

          {/* Vignette shadows at left and right edges */}
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#0b0d18] to-transparent z-20 pointer-events-none"></div>
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#0b0d18] to-transparent z-20 pointer-events-none"></div>

          {/* Scrolling Items Strip with REAL Images */}
          <div className="w-full overflow-hidden">
            <div
              ref={stripRef}
              className="flex items-center"
              style={{ willChange: 'transform' }}
            >
              {rouletteItems.map((item, idx) => (
                <div
                  key={`${item.id}-${idx}`}
                  style={{ width: `${ITEM_WIDTH}px` }}
                  className="shrink-0 px-1.5"
                >
                  <div
                    className={`h-36 rounded-xl flex flex-col items-center justify-between p-2 border bg-gradient-to-b from-[#181d36] to-[#121424] transition-all ${getRarityBadge(
                      item.rarity
                    )}`}
                  >
                    <span className="text-[9px] font-black uppercase tracking-wider truncate w-full text-center">
                      {item.rarity}
                    </span>

                    {/* Real Transparent Image of Gift */}
                    <div className="w-16 h-16 flex items-center justify-center p-1">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="max-w-full max-h-full object-contain filter drop-shadow hover:scale-110 transition-transform"
                      />
                    </div>

                    <div className="w-full text-center">
                      <p className="text-[11px] font-bold text-white truncate">{item.name}</p>
                      <p className="text-[10px] text-amber-300 font-bold font-gaming">
                        {currency === 'stars' ? `${item.price} ⭐` : `${item.rubPrice} ₽`}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Controls & Fast Open Toggle */}
        <div className="p-4 bg-[#14182b] flex items-center justify-between gap-3 border-b border-white/[0.08]">
          <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-300 select-none">
            <input
              type="checkbox"
              checked={fastOpen}
              onChange={(e) => setFastOpen(e.target.checked)}
              className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 bg-gray-800 border-gray-700"
            />
            <span className="font-medium">Быстрое открытие (Instant)</span>
          </label>

          <button
            onClick={handleStartOpen}
            disabled={isSpinning}
            className={`flex-1 max-w-[240px] py-3 px-5 rounded-2xl font-gaming font-extrabold text-sm uppercase tracking-wider text-white shadow-xl transition-all ${
              isSpinning
                ? 'opacity-50 cursor-not-allowed bg-gray-700'
                : 'bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:opacity-95 active:scale-95 shadow-purple-600/30 border border-purple-400/40'
            }`}
          >
            {isSpinning ? 'Крутим...' : caseItem.isDaily ? 'Получить подарок' : `Открыть за ${costDisplay}`}
          </button>
        </div>

        {/* Drops Preview List with Real Images */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 max-h-[220px]">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Содержимое кейса и шансы дропа:</span>
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
            {caseItem.drops.map((drop, idx) => {
              const chance = ((drop.weight / totalDropsWeight) * 100).toFixed(1);
              return (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 p-2 rounded-xl bg-[#171b30] border border-white/[0.06] hover:border-purple-500/30 transition-colors"
                >
                  <div className="w-9 h-9 shrink-0 flex items-center justify-center p-0.5 rounded-lg bg-black/40 border border-white/10">
                    <img
                      src={drop.item.image}
                      alt={drop.item.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white truncate">{drop.item.name}</p>
                    <div className="flex items-center justify-between text-[10px] text-gray-400">
                      <span className="text-amber-400 font-semibold">
                        {currency === 'stars' ? `${drop.item.price} ⭐` : `${drop.item.rubPrice} ₽`}
                      </span>
                      <span className="font-mono text-purple-300 font-bold">{chance}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* VICTORY POPUP OVERLAY WITH REAL GIFT IMAGE */}
        {showResult && winningItem && (
          <div className="absolute inset-0 z-40 bg-[#0d0f1ee6] backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
            {/* Lector Mascot Approved Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/40 text-purple-200 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>ОДОБРЕНО ЛЕКТОРОМ (BS)</span>
            </div>

            <h3 className="font-gaming font-extrabold text-2xl text-white tracking-wide">
              ПОЗДРАВЛЯЕМ!
            </h3>

            {/* Glowing Item Spotlight */}
            <div className="relative my-4 flex flex-col items-center">
              <div
                className="absolute inset-0 rounded-full blur-3xl opacity-60"
                style={{
                  backgroundColor:
                    winningItem.rarity === 'mythic'
                      ? '#ef4444'
                      : winningItem.rarity === 'nft'
                      ? '#10b981'
                      : winningItem.rarity === 'legendary'
                      ? '#f59e0b'
                      : '#8b5cf6',
                }}
              ></div>

              <div className="relative w-28 h-28 rounded-2xl bg-gradient-to-b from-[#212745] to-[#14172a] border-2 border-white/20 flex items-center justify-center p-3 shadow-2xl">
                <img
                  src={winningItem.image}
                  alt={winningItem.name}
                  className="max-w-full max-h-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] animate-bounce"
                />
              </div>

              <div className="mt-3">
                <span
                  className={`inline-block text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border mb-1 ${getRarityBadge(
                    winningItem.rarity
                  )}`}
                >
                  {winningItem.rarity}
                </span>
                <h4 className="font-extrabold text-lg text-white">{winningItem.name}</h4>
                <p className="text-xs text-amber-300 font-bold font-gaming">
                  Стоимость: {currency === 'stars' ? `${winningItem.price} ⭐` : `${winningItem.rubPrice} ₽`}
                </p>
              </div>
            </div>

            {/* Win Actions */}
            <div className="w-full max-w-sm space-y-2 mt-2">
              <div className="flex gap-2">
                <button
                  onClick={() => handleAction('sell')}
                  className="flex-1 py-3 px-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:opacity-90 active:scale-95 text-black font-gaming font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20"
                >
                  Продать (+{currency === 'stars' ? `${winningItem.price} ⭐` : `${winningItem.rubPrice} ₽`})
                </button>

                <button
                  onClick={() => handleAction('keep')}
                  className="flex-1 py-3 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-90 active:scale-95 text-white font-gaming font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 border border-emerald-400/30"
                >
                  В инвентарь
                </button>
              </div>

              {onOpenUpgradeWithItem && (
                <button
                  onClick={() => {
                    onOpenUpgradeWithItem(winningItem);
                    onClose();
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#1f253f] hover:bg-[#283052] text-purple-300 border border-purple-500/30 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ArrowUpRight className="w-4 h-4 text-purple-400" />
                  <span>Апгрейдить этот дроп в колесе</span>
                </button>
              )}

              <button
                onClick={() => {
                  setShowResult(false);
                  handleStartOpen();
                }}
                className="w-full py-2 text-xs text-gray-400 hover:text-white font-medium flex items-center justify-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Открыть еще один раз</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
