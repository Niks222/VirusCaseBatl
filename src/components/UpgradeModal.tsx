import React, { useState } from 'react';
import { GiftItem, InventoryItem } from '../types';
import { ALL_GIFTS } from '../data/gifts';
import { Zap, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundFx } from '../utils/audio';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency: 'stars' | 'rub';
  inventory: InventoryItem[];
  preselectedItem?: GiftItem | null;
  onUpgradeSuccess: (spentItem: InventoryItem | null, wonItem: GiftItem) => void;
  onUpgradeFail: (spentItem: InventoryItem | null) => void;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({
  isOpen,
  onClose,
  currency,
  inventory,
  preselectedItem,
  onUpgradeSuccess,
  onUpgradeFail,
}) => {
  if (!isOpen) return null;

  const targetOptions = [
    ALL_GIFTS['heart'],
    ALL_GIFTS['watch'],
    ALL_GIFTS['ring'],
    ALL_GIFTS['rocket'],
    ALL_GIFTS['diamond'],
    ALL_GIFTS['nft-doge'],
    ALL_GIFTS['nft-swiss-watch'],
    ALL_GIFTS['nft-plush-pepe'],
    ALL_GIFTS['nft-heroic-helmet'],
    ALL_GIFTS['stars-1000'],
  ];

  const [selectedInputItem, setSelectedInputItem] = useState<InventoryItem | null>(
    (inventory.find((i) => i.id === preselectedItem?.id) as InventoryItem) || inventory[0] || null
  );
  const [targetItem, setTargetItem] = useState<GiftItem>(targetOptions[3]); // default rocket or ring
  const [isSpinning, setIsSpinning] = useState(false);
  const [wheelAngle, setWheelAngle] = useState(0);
  const [resultState, setResultState] = useState<'idle' | 'won' | 'lost'>('idle');

  const inputPrice = selectedInputItem
    ? currency === 'stars'
      ? selectedInputItem.price
      : selectedInputItem.rubPrice
    : 30;

  const targetPrice = currency === 'stars' ? targetItem.price : targetItem.rubPrice;

  const rawChance = (inputPrice / targetPrice) * 92;
  const chancePercent = Math.min(82, Math.max(3, parseFloat(rawChance.toFixed(1))));

  const handleSpinUpgrade = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setResultState('idle');

    soundFx.playTick();

    const isWin = Math.random() * 100 <= chancePercent;
    const winSectorDegrees = (chancePercent / 100) * 360;

    let targetStopDeg: number;
    if (isWin) {
      targetStopDeg = 5 + Math.random() * Math.max(1, winSectorDegrees - 10);
    } else {
      targetStopDeg = winSectorDegrees + 10 + Math.random() * (350 - winSectorDegrees);
    }

    const totalSpins = 5 * 360;
    const finalAngle = totalSpins + targetStopDeg;

    setWheelAngle(finalAngle);

    const interval = setInterval(() => {
      soundFx.playTick(1.1);
    }, 180);

    setTimeout(() => {
      clearInterval(interval);
      setIsSpinning(false);

      if (isWin) {
        setResultState('won');
        soundFx.playWin(targetItem.rarity);
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
        onUpgradeSuccess(selectedInputItem, targetItem);
      } else {
        setResultState('lost');
        soundFx.playTick(0.7);
        onUpgradeFail(selectedInputItem);
      }
    }, 4200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#111425] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.08] bg-[#161a30]">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <h2 className="font-extrabold text-base text-white">Апгрейд Подарков Telegram</h2>
          </div>
          <button
            onClick={() => {
              if (isSpinning) return;
              soundFx.playClick();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto space-y-4">
          {/* Top selection with REAL IMAGES */}
          <div className="grid grid-cols-2 gap-3 items-center relative">
            {/* Input Card */}
            <div className="bg-[#171a2e] border border-white/10 rounded-2xl p-3 text-center flex flex-col items-center">
              <span className="text-[10px] text-gray-400 uppercase font-bold block mb-1">
                Ваш предмет
              </span>
              {selectedInputItem ? (
                <>
                  <div className="w-16 h-16 my-1 flex items-center justify-center">
                    <img src={selectedInputItem.image} alt={selectedInputItem.name} className="max-w-full max-h-full object-contain filter drop-shadow" />
                  </div>
                  <p className="text-xs font-bold text-white truncate max-w-[120px]">{selectedInputItem.name}</p>
                  <p className="text-[11px] text-amber-300 font-extrabold font-gaming">
                    {currency === 'stars' ? `${selectedInputItem.price} ⭐` : `${selectedInputItem.rubPrice} ₽`}
                  </p>
                </>
              ) : (
                <div className="py-2">
                  <p className="text-xs text-gray-400">Нет предметов</p>
                  <span className="text-[11px] text-gray-500">Базовая ставка 30 ⭐</span>
                </div>
              )}
            </div>

            {/* Target Card */}
            <div className="bg-[#171a2e] border border-purple-500/40 rounded-2xl p-3 text-center flex flex-col items-center shadow-lg shadow-purple-600/10">
              <span className="text-[10px] text-purple-300 uppercase font-bold block mb-1">
                Цель апгрейда
              </span>
              <div className="w-16 h-16 my-1 flex items-center justify-center animate-pulse">
                <img src={targetItem.image} alt={targetItem.name} className="max-w-full max-h-full object-contain filter drop-shadow" />
              </div>
              <p className="text-xs font-bold text-white truncate max-w-[120px]">{targetItem.name}</p>
              <p className="text-[11px] text-amber-300 font-extrabold font-gaming">
                {targetPrice} {currency === 'stars' ? '⭐' : '₽'}
              </p>
            </div>
          </div>

          {/* Circular Wheel Gauge */}
          <div className="relative py-3 flex flex-col items-center justify-center">
            <div className="relative w-44 h-44 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="transparent"
                  stroke="#ef4444"
                  strokeWidth="8"
                  opacity="0.3"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="transparent"
                  stroke="#10b981"
                  strokeWidth="8"
                  strokeDasharray={`${(chancePercent / 100) * 263.89} 263.89`}
                  strokeLinecap="round"
                />
              </svg>

              <div
                className="absolute inset-0 flex items-center justify-center transition-transform"
                style={{
                  transform: `rotate(${wheelAngle}deg)`,
                  transitionDuration: isSpinning ? '4200ms' : '0ms',
                  transitionTimingFunction: 'cubic-bezier(0.12, 0.8, 0.22, 1)',
                }}
              >
                <div className="w-1.5 h-16 bg-gradient-to-t from-white to-amber-400 rounded-full shadow-lg shadow-amber-400 -translate-y-7"></div>
                <div className="absolute w-4 h-4 rounded-full bg-white border-2 border-amber-400"></div>
              </div>

              <div className="absolute flex flex-col items-center pointer-events-none">
                <span className="font-gaming font-black text-2xl text-white">
                  {chancePercent}%
                </span>
                <span className="text-[10px] uppercase font-bold text-emerald-400">
                  Шанс Успеха
                </span>
              </div>
            </div>
          </div>

          {/* Result Alert */}
          {resultState === 'won' && (
            <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-center animate-fadeIn">
              <p className="font-gaming font-bold text-sm text-emerald-300">
                🎉 УСПЕШНЫЙ АПГРЕЙД!
              </p>
              <p className="text-xs text-white">
                {targetItem.name} добавлен в ваш инвентарь!
              </p>
            </div>
          )}

          {resultState === 'lost' && (
            <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-center animate-fadeIn">
              <p className="font-gaming font-bold text-sm text-red-300">
                💔 НЕ ПОВЕЗЛО
              </p>
              <p className="text-xs text-gray-300">Предмет сгорел при апгрейде. Попробуйте еще раз!</p>
            </div>
          )}

          {/* Target Items Carousel Selector with REAL IMAGES */}
          <div>
            <label className="text-xs text-gray-400 font-bold block mb-2">
              Выберите целевой подарок:
            </label>
            <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
              {targetOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    soundFx.playClick();
                    setTargetItem(opt);
                    setResultState('idle');
                  }}
                  className={`shrink-0 p-2 rounded-xl border text-center transition-all flex flex-col items-center justify-between ${
                    targetItem.id === opt.id
                      ? 'border-purple-500 bg-purple-950/40 shadow-md shadow-purple-600/30'
                      : 'border-white/10 bg-[#161a2e] hover:border-white/20'
                  }`}
                >
                  <div className="w-10 h-10 flex items-center justify-center my-0.5">
                    <img src={opt.image} alt={opt.name} className="max-w-full max-h-full object-contain" />
                  </div>
                  <span className="text-[10px] text-white font-bold block truncate max-w-[75px]">
                    {opt.name}
                  </span>
                  <span className="text-[9px] text-amber-300 font-semibold block font-gaming">
                    {currency === 'stars' ? `${opt.price} ⭐` : `${opt.rubPrice} ₽`}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleSpinUpgrade}
            disabled={isSpinning}
            className={`w-full py-3.5 rounded-2xl font-gaming font-extrabold text-sm uppercase tracking-wider text-white shadow-xl transition-all ${
              isSpinning
                ? 'opacity-50 cursor-not-allowed bg-gray-700'
                : 'bg-gradient-to-r from-amber-500 via-purple-600 to-indigo-600 hover:opacity-95 active:scale-98 shadow-purple-600/30 border border-purple-400/40'
            }`}
          >
            {isSpinning ? 'Крутим колесо апгрейда...' : `Апгрейд (Шанс ${chancePercent}%)`}
          </button>
        </div>
      </div>
    </div>
  );
};
