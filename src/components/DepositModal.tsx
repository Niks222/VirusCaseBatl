import React, { useState } from 'react';
import { X, Sparkles, CreditCard, Star, ShieldCheck, Tag } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundFx } from '../utils/audio';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency: 'stars' | 'rub';
  onAddBalance: (amount: number, currencyType: 'stars' | 'rub') => void;
}

export const DepositModal: React.FC<DepositModalProps> = ({
  isOpen,
  onClose,
  currency,
  onAddBalance,
}) => {
  if (!isOpen) return null;

  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [selectedPackIndex, setSelectedPackIndex] = useState(1);

  const starPacks = [
    { stars: 50, rub: 99, bonus: '+0 ⭐' },
    { stars: 150, rub: 279, bonus: '+15 ⭐ БОНУС', popular: true },
    { stars: 350, rub: 599, bonus: '+50 ⭐ БОНУС' },
    { stars: 750, rub: 1199, bonus: '+120 ⭐ БОНУС' },
    { stars: 1500, rub: 2299, bonus: '+300 ⭐ БОНУС' },
    { stars: 5000, rub: 6990, bonus: '+1500 ⭐ VIP' },
  ];

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const code = promoCode.trim().toUpperCase();
    if (code === 'LECTOR' || code === 'BLACK_SPRUIT' || code === 'BS' || code === 'VIRUS') {
      soundFx.playWin('epic');
      confetti({ particleCount: 50, spread: 60 });
      onAddBalance(150, 'stars');
      setPromoApplied(true);
      setPromoCode('');
    } else {
      alert('Неверный промокод! Попробуйте промокод LECTOR или BLACK_SPRUIT');
    }
  };

  const handleDepositClick = () => {
    const pack = starPacks[selectedPackIndex];
    soundFx.playWin('rare');

    if (window.Telegram?.WebApp?.openInvoice) {
      console.log('Opening Telegram Invoice...');
    }

    onAddBalance(currency === 'stars' ? pack.stars : pack.rub, currency);
    alert(`Успешно начислено +${currency === 'stars' ? `${pack.stars} ⭐` : `${pack.rub} ₽`} на ваш баланс!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#111425] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.08] bg-[#161a30]">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            <h2 className="font-extrabold text-base text-white">Пополнение Баланса</h2>
          </div>
          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto space-y-4">
          {/* Promo code box */}
          <div className="p-3 rounded-2xl bg-[#171a2e] border border-purple-500/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-purple-300 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5" />
                <span>Промокод Лектора на +150 ⭐</span>
              </span>
              <span className="text-[10px] text-gray-400">Код: LECTOR</span>
            </div>

            {promoApplied ? (
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-bold text-center">
                ✓ Промокод активирован! +150 ⭐ начислено
              </div>
            ) : (
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Введите LECTOR или BLACK_SPRUIT"
                  className="flex-1 bg-[#101222] border border-white/10 focus:border-purple-500 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 outline-none uppercase font-mono"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-gaming font-bold text-xs"
                >
                  Ввод
                </button>
              </form>
            )}
          </div>

          {/* Preset Packs Grid */}
          <div>
            <label className="text-xs text-gray-400 font-bold block mb-2">
              Выберите пакет пополнения:
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {starPacks.map((pack, idx) => {
                const isSelected = selectedPackIndex === idx;
                return (
                  <div
                    key={idx}
                    onClick={() => {
                      soundFx.playClick();
                      setSelectedPackIndex(idx);
                    }}
                    className={`cursor-pointer relative p-3 rounded-2xl border transition-all ${
                      isSelected
                        ? 'border-purple-500 bg-purple-950/40 shadow-lg shadow-purple-600/20 scale-[1.02]'
                        : 'border-white/[0.06] bg-[#171a2e] hover:border-white/20'
                    }`}
                  >
                    {pack.popular && (
                      <span className="absolute -top-2 right-2 text-[9px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 to-amber-600 text-black px-1.5 py-0.5 rounded-full shadow">
                        Хит
                      </span>
                    )}

                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-lg">⭐</span>
                      <span className="font-gaming font-extrabold text-base text-white">
                        {pack.stars}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs mt-1">
                      <span className="font-bold text-amber-300">{pack.rub} ₽</span>
                      <span className="text-[10px] text-purple-300 font-bold">{pack.bonus}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Secure Guarantee */}
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#14172a] border border-white/5 text-[11px] text-gray-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Официальные платежи Telegram Stars и быстрый вывод призов на аккаунт.</span>
          </div>

          {/* Main Deposit Action */}
          <button
            onClick={handleDepositClick}
            className="w-full py-3.5 rounded-2xl font-gaming font-extrabold text-sm uppercase tracking-wider text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:opacity-95 active:scale-98 shadow-xl shadow-purple-600/30 border border-purple-400/40 flex items-center justify-center gap-2"
          >
            <span>
              Пополнить на{' '}
              {currency === 'stars'
                ? `${starPacks[selectedPackIndex].stars} ⭐`
                : `${starPacks[selectedPackIndex].rub} ₽`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
