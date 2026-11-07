import React, { useState, useEffect, useRef } from 'react';
import { GiftItem, InventoryItem } from '../types';
import { ALL_GIFTS } from '../data/gifts';
import { Zap, X, Sparkles, ChevronLeft, ChevronRight, Coins } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundFx } from '../utils/audio';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency: 'stars' | 'rub';
  inventory: InventoryItem[];
  balanceStars?: number;
  balanceRub?: number;
  preselectedItem?: GiftItem | null;
  onUpgradeSuccess: (spentItem: InventoryItem | null, wonItem: GiftItem, balanceCost?: number) => void;
  onUpgradeFail: (spentItem: InventoryItem | null, balanceCost?: number) => void;
  onOpenDeposit?: () => void;
}

const BALANCE_TIERS = [25, 50, 100, 250, 500];

export const UpgradeModal: React.FC<UpgradeModalProps> = ({
  isOpen,
  onClose,
  currency,
  inventory,
  balanceStars = 0,
  balanceRub = 0,
  preselectedItem,
  onUpgradeSuccess,
  onUpgradeFail,
  onOpenDeposit,
}) => {
  if (!isOpen) return null;

  const [inputMode, setInputMode] = useState<'item' | 'balance'>(inventory.length > 0 ? 'item' : 'balance');
  const [selectedInventoryItem, setSelectedInventoryItem] = useState<InventoryItem | null>(
    (inventory.find((i) => i.id === preselectedItem?.id) as InventoryItem) || inventory[0] || null
  );
  const [selectedBalanceAmount, setSelectedBalanceAmount] = useState<number>(25);

  const inputPriceInStars = inputMode === 'item' && selectedInventoryItem
    ? selectedInventoryItem.price
    : currency === 'stars' ? selectedBalanceAmount : Math.round(selectedBalanceAmount / 1.5);

  const targetOptions: GiftItem[] = Object.values(ALL_GIFTS)
    .filter((g) => g.price > inputPriceInStars)
    .sort((a, b) => a.price - b.price);

  const [targetItem, setTargetItem] = useState<GiftItem>(() => targetOptions[0] || ALL_GIFTS['champagne'] || ALL_GIFTS['bear']);

  useEffect(() => {
    if (targetOptions.length > 0 && (!targetItem || targetItem.price <= inputPriceInStars)) {
      setTargetItem(targetOptions[0]);
    }
  }, [inputPriceInStars, targetOptions.length]);

  const targetScrollRef = useRef<HTMLDivElement>(null);
  const scrollTargets = (direction: 'left' | 'right') => {
    if (targetScrollRef.current) {
      const offset = direction === 'left' ? -220 : 220;
      targetScrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const [isSpinning, setIsSpinning] = useState(false);
  const [wheelAngle, setWheelAngle] = useState(0);
  const [resultState, setResultState] = useState<'idle' | 'won' | 'lost'>('idle');
  const accumulatedAngleRef = useRef(0);

  const currentBalance = currency === 'stars' ? balanceStars : balanceRub;

  const inputPrice = inputMode === 'item' && selectedInventoryItem
    ? currency === 'stars'
      ? selectedInventoryItem.price
      : selectedInventoryItem.rubPrice
    : selectedBalanceAmount;

  const targetPrice = targetItem ? (currency === 'stars' ? targetItem.price : targetItem.rubPrice) : 0;
  const rawChance = targetPrice > 0 ? (inputPrice / targetPrice) * 90 : 0;
  const chancePercent = targetOptions.length === 0 ? 0 : Math.min(85, Math.max(1, parseFloat(rawChance.toFixed(1))));

  const handleSpinUpgrade = () => {
    if (isSpinning) return;
    if (!targetItem || targetOptions.length === 0) return;
    if (inputMode === 'item' && !selectedInventoryItem) return;
    if (inputMode === 'balance' && currentBalance < inputPrice) {
      if (onOpenDeposit) onOpenDeposit();
      return;
    }

    setIsSpinning(true);
    setResultState('idle');
    soundFx.playTick();

    const isWin = Math.random() * 100 <= chancePercent;
    const winSectorDegrees = (chancePercent / 100) * 360;

    let targetStopDeg: number;
    if (isWin) {
      targetStopDeg = 6 + Math.random() * Math.max(2, winSectorDegrees - 12);
    } else {
      targetStopDeg = winSectorDegrees + 8 + Math.random() * Math.max(2, 348 - winSectorDegrees);
    }

    const spinRotations = 6 * 360;
    const nextAngle = accumulatedAngleRef.current + spinRotations + targetStopDeg - (accumulatedAngleRef.current % 360);
    accumulatedAngleRef.current = nextAngle;
    setWheelAngle(nextAngle);

    const interval = setInterval(() => {
      soundFx.playTick(1.1);
    }, 170);

    setTimeout(() => {
      clearInterval(interval);
      setIsSpinning(false);

      if (isWin) {
        setResultState('won');
        soundFx.playWin(targetItem.rarity);
        confetti({ particleCount: 70, spread: 65, origin: { y: 0.6 } });
        onUpgradeSuccess(
          inputMode === 'item' ? selectedInventoryItem : null,
          targetItem,
          inputMode === 'balance' ? inputPrice : undefined
        );
      } else {
        setResultState('lost');
        soundFx.playTick(0.7);
        onUpgradeFail(
          inputMode === 'item' ? selectedInventoryItem : null,
          inputMode === 'balance' ? inputPrice : undefined
        );
      }
    }, 3900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 pb-16 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#0e111d] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[82vh]">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.08] bg-[#131728]">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <h2 className="font-extrabold text-sm uppercase tracking-wider text-white">Апгрейд</h2>
          </div>
          <button
            onClick={() => {
              if (isSpinning) return;
              soundFx.playClick();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto space-y-3.5">
          <div className="flex bg-[#161a2c] p-1 rounded-xl border border-white/5 text-xs">
            <button
              onClick={() => { setInputMode('item'); setResultState('idle'); }}
              disabled={isSpinning}
              className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
                inputMode === 'item' ? 'bg-[#222944] text-white shadow' : 'text-gray-400 hover:text-white'
              }`}
            >
              Из инвентаря ({inventory.length})
            </button>
            <button
              onClick={() => { setInputMode('balance'); setResultState('idle'); }}
              disabled={isSpinning}
              className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
                inputMode === 'balance' ? 'bg-[#222944] text-white shadow' : 'text-gray-400 hover:text-white'
              }`}
            >
              Балансом ({currency === 'stars' ? `${balanceStars} ⭐` : `${balanceRub} ₽`})
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 items-center">
            <div className="bg-[#121626] border border-white/10 rounded-2xl p-3 text-center flex flex-col items-center">
              <span className="text-[10px] text-gray-400 uppercase font-bold block mb-1">
                {inputMode === 'item' ? 'Ваш предмет' : 'Ставка балансом'}
              </span>
              {inputMode === 'item' && selectedInventoryItem ? (
                <>
                  <div className="w-14 h-14 my-1 flex items-center justify-center">
                    <img src={selectedInventoryItem.image} alt={selectedInventoryItem.name} className="max-w-full max-h-full object-contain drop-shadow" />
                  </div>
                  <p className="text-xs font-bold text-white truncate max-w-[120px]">{selectedInventoryItem.name}</p>
                  <p className="text-[11px] text-amber-300 font-extrabold font-gaming">
                    {currency === 'stars' ? `${selectedInventoryItem.price} ⭐` : `${selectedInventoryItem.rubPrice} ₽`}
                  </p>
                </>
              ) : inputMode === 'item' ? (
                <div className="py-2">
                  <p className="text-xs text-gray-400">Инвентарь пуст</p>
                  <button
                    onClick={() => setInputMode('balance')}
                    className="mt-1 text-[11px] text-amber-400 font-bold hover:underline"
                  >
                    Апгрейд звёздами
                  </button>
                </div>
              ) : (
                <div className="py-1 w-full flex flex-col items-center">
                  <div className="w-14 h-14 my-1 flex items-center justify-center">
                    <Coins className="w-10 h-10 text-amber-400" />
                  </div>
                  <p className="text-xs font-bold text-white">Ставка с баланса</p>
                  <p className="text-[11px] text-amber-300 font-extrabold font-gaming">
                    {selectedBalanceAmount} {currency === 'stars' ? '⭐' : '₽'}
                  </p>
                </div>
              )}
            </div>

            <div className="bg-[#121626] border border-purple-500/40 rounded-2xl p-3 text-center flex flex-col items-center shadow-lg shadow-purple-600/10">
              <span className="text-[10px] text-purple-300 uppercase font-bold block mb-1">
                Цель апгрейда
              </span>
              <div className="w-14 h-14 my-1 flex items-center justify-center">
                <img src={targetItem.image} alt={targetItem.name} className="max-w-full max-h-full object-contain drop-shadow" />
              </div>
              <p className="text-xs font-bold text-white truncate max-w-[120px]">{targetItem.name}</p>
              <p className="text-[11px] text-amber-300 font-extrabold font-gaming">
                {targetPrice} {currency === 'stars' ? '⭐' : '₽'}
              </p>
            </div>
          </div>

          {inputMode === 'item' && inventory.length > 0 && (
            <div>
              <span className="text-[11px] text-gray-400 block mb-1.5">Выберите предмет для ставки:</span>
              <div
                style={{ touchAction: 'pan-x' }}
                className="flex gap-2 overflow-x-auto no-scrollbar py-1 scroll-smooth select-none"
              >
                {inventory.map((inv) => (
                  <button
                    key={inv.inventoryId}
                    onClick={() => {
                      if (isSpinning) return;
                      soundFx.playClick();
                      setSelectedInventoryItem(inv);
                      setResultState('idle');
                    }}
                    className={`shrink-0 p-2 rounded-xl border text-center transition-all flex flex-col items-center ${
                      selectedInventoryItem?.inventoryId === inv.inventoryId
                        ? 'border-amber-400 bg-amber-500/10 shadow-sm'
                        : 'border-white/10 bg-[#161a2c] hover:border-white/20'
                    }`}
                  >
                    <img src={inv.image} alt={inv.name} className="w-8 h-8 object-contain my-0.5" />
                    <span className="text-[10px] text-white truncate max-w-[65px]">{inv.name}</span>
                    <span className="text-[9px] text-amber-300 font-bold">{currency === 'stars' ? `${inv.price} ⭐` : `${inv.rubPrice} ₽`}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {inputMode === 'balance' && (
            <div>
              <span className="text-[11px] text-gray-400 block mb-1.5">Выберите сумму ставки:</span>
              <div className="flex gap-1.5">
                {BALANCE_TIERS.map((tier) => (
                  <button
                    key={tier}
                    onClick={() => {
                      if (isSpinning) return;
                      soundFx.playClick();
                      setSelectedBalanceAmount(tier);
                      setResultState('idle');
                    }}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold font-gaming border transition-all ${
                      selectedBalanceAmount === tier
                        ? 'border-amber-400 bg-amber-500/20 text-amber-300 shadow-sm'
                        : 'border-white/10 bg-[#161a2c] text-gray-300 hover:border-white/20'
                    }`}
                  >
                    {tier} {currency === 'stars' ? '⭐' : '₽'}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="relative py-2 flex flex-col items-center justify-center">
            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="transparent" stroke="#252a42" strokeWidth="7" />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="transparent"
                  stroke="#10b981"
                  strokeWidth="7"
                  strokeDasharray={`${(chancePercent / 100) * 263.89} 263.89`}
                  strokeLinecap="round"
                />
              </svg>

              <div
                className="absolute inset-0 flex items-center justify-center transition-transform"
                style={{
                  transform: `rotate(${wheelAngle}deg)`,
                  transitionDuration: isSpinning ? '3900ms' : '0ms',
                  transitionTimingFunction: 'cubic-bezier(0.12, 0.8, 0.22, 1)',
                }}
              >
                <div className="w-1.5 h-14 bg-gradient-to-t from-white to-amber-400 rounded-full shadow-md shadow-amber-400 -translate-y-6" />
                <div className="absolute w-3.5 h-3.5 rounded-full bg-white border-2 border-amber-400" />
              </div>

              <div className="absolute flex flex-col items-center pointer-events-none">
                <span className="font-gaming font-black text-2xl text-white">{chancePercent}%</span>
                <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Шанс</span>
              </div>
            </div>
          </div>

          {resultState === 'won' && (
            <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-center animate-fadeIn">
              <p className="font-gaming font-bold text-xs text-emerald-400">УСПЕШНЫЙ АПГРЕЙД</p>
              <p className="text-xs text-white mt-0.5">{targetItem.name} в инвентаре</p>
            </div>
          )}

          {resultState === 'lost' && (
            <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-center animate-fadeIn">
              <p className="font-gaming font-bold text-xs text-red-400">НЕ ПОВЕЗЛО</p>
              <p className="text-xs text-gray-400 mt-0.5">Предмет сгорел при апгрейде</p>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] text-gray-400 font-bold">
                Выберите цель (только дороже вашего):
              </span>
              {targetOptions.length > 0 && (
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => scrollTargets('left')}
                    className="w-6 h-6 rounded-lg bg-[#161a2c] hover:bg-[#20253d] border border-white/10 flex items-center justify-center text-gray-300 hover:text-white transition-colors"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollTargets('right')}
                    className="w-6 h-6 rounded-lg bg-[#161a2c] hover:bg-[#20253d] border border-white/10 flex items-center justify-center text-gray-300 hover:text-white transition-colors"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {targetOptions.length === 0 ? (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-center text-xs text-amber-300 font-bold">
                Ваш предмет наивысшего уровня в игре! Апгрейд не требуется.
              </div>
            ) : (
              <div
                ref={targetScrollRef}
                style={{ touchAction: 'pan-x' }}
                className="flex gap-2 overflow-x-auto no-scrollbar py-1 scroll-smooth select-none"
              >
                {targetOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      soundFx.playClick();
                      setTargetItem(opt);
                      setResultState('idle');
                    }}
                    className={`shrink-0 p-2 rounded-xl border text-center transition-all flex flex-col items-center justify-between ${
                      targetItem?.id === opt.id
                        ? 'border-purple-500 bg-purple-950/40 shadow-md shadow-purple-600/20'
                        : 'border-white/10 bg-[#161a2c] hover:border-white/20'
                    }`}
                  >
                    <img src={opt.image} alt={opt.name} className="w-10 h-10 object-contain my-0.5" />
                    <span className="text-[10px] text-white font-bold block truncate max-w-[75px]">{opt.name}</span>
                    <span className="text-[9px] text-amber-300 font-semibold block font-gaming">
                      {currency === 'stars' ? `${opt.price} ⭐` : `${opt.rubPrice} ₽`}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleSpinUpgrade}
            disabled={isSpinning || targetOptions.length === 0}
            className={`w-full py-3.5 rounded-2xl font-gaming font-extrabold text-xs uppercase tracking-wider text-white shadow-xl transition-all ${
              isSpinning || targetOptions.length === 0
                ? 'opacity-50 cursor-not-allowed bg-gray-800'
                : 'bg-gradient-to-r from-amber-500 via-purple-600 to-indigo-600 hover:opacity-95 active:scale-98 border border-purple-400/30'
            }`}
          >
            {isSpinning ? 'Вращение...' : targetOptions.length === 0 ? 'Максимальный уровень' : `Апгрейд (${chancePercent}%)`}
          </button>
        </div>
      </div>
    </div>
  );
};
