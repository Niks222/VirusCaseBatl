import React, { useState } from 'react';
import { InventoryItem } from '../types';
import { X, Package, Send, CheckCircle2 } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface InventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency: 'stars' | 'rub';
  inventory: InventoryItem[];
  onSellItem: (item: InventoryItem) => void;
  onSellAll: () => void;
  onWithdrawGift: (item: InventoryItem, username: string) => void;
}

export const InventoryModal: React.FC<InventoryModalProps> = ({
  isOpen,
  onClose,
  currency,
  inventory,
  onSellItem,
  onSellAll,
  onWithdrawGift,
}) => {
  if (!isOpen) return null;

  const [withdrawTargetItem, setWithdrawTargetItem] = useState<InventoryItem | null>(null);
  const [tgUsername, setTgUsername] = useState<string>('');
  const [withdrawSuccess, setWithdrawSuccess] = useState<boolean>(false);

  const totalValueStars = inventory.reduce((acc, i) => acc + i.price, 0);
  const totalValueRub = inventory.reduce((acc, i) => acc + i.rubPrice, 0);

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!withdrawTargetItem || !tgUsername.trim()) return;

    soundFx.playWin('epic');
    onWithdrawGift(withdrawTargetItem, tgUsername.replace('@', ''));
    setWithdrawSuccess(true);
    setTimeout(() => {
      setWithdrawSuccess(false);
      setWithdrawTargetItem(null);
      setTgUsername('');
    }, 2500);
  };

  const getRarityBadge = (rarity: string) => {
    switch (rarity) {
      case 'mythic':
        return 'border-red-500/60 bg-red-950/30 text-red-400';
      case 'nft':
        return 'border-emerald-500/60 bg-emerald-950/30 text-emerald-400';
      case 'legendary':
        return 'border-amber-500/60 bg-amber-950/30 text-amber-400';
      case 'epic':
        return 'border-purple-500/60 bg-purple-950/30 text-purple-400';
      case 'rare':
        return 'border-sky-500/60 bg-sky-950/30 text-sky-400';
      default:
        return 'border-slate-500/40 bg-slate-900/30 text-slate-300';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-[#111425] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.08] bg-[#161a30]">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-purple-400" />
            <div>
              <h2 className="font-extrabold text-base text-white">Инвентарь Подарков</h2>
              <span className="text-[11px] text-gray-400">
                Всего предметов: {inventory.length}
              </span>
            </div>
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

        {/* Total Worth & Quick Actions */}
        <div className="p-4 bg-[#14182b] border-b border-white/[0.08] flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] text-gray-400 uppercase font-bold block">
              Стоимость инвентаря:
            </span>
            <span className="font-gaming font-extrabold text-base text-amber-300">
              {currency === 'stars' ? `${totalValueStars} ⭐` : `${totalValueRub} ₽`}
            </span>
          </div>

          {inventory.length > 0 && (
            <button
              onClick={() => {
                soundFx.playClick();
                onSellAll();
              }}
              className="py-2 px-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:opacity-90 active:scale-95 text-black font-gaming font-bold text-xs shadow-md shadow-amber-500/20"
            >
              Продать всё (+{currency === 'stars' ? `${totalValueStars} ⭐` : `${totalValueRub} ₽`})
            </button>
          )}
        </div>

        {/* Inventory Items Grid with REAL IMAGES */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {inventory.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-16 h-16 mx-auto flex items-center justify-center animate-bounce">
                <img src="assets/gifts/bear.png" alt="Empty" className="w-full h-full object-contain opacity-60" />
              </div>
              <p className="font-gaming font-bold text-sm text-gray-300">
                Ваш инвентарь пока пуст
              </p>
              <p className="text-xs text-gray-500 max-w-xs mx-auto">
                Открывайте кейсы или побеждайте в кейс-батлах, чтобы выбивать реальные подарки и NFT!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {inventory.map((item) => (
                <div
                  key={item.inventoryId}
                  className={`p-3 rounded-2xl border flex flex-col justify-between transition-all bg-[#171b30] hover:scale-[1.02] ${getRarityBadge(
                    item.rarity
                  )}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded border">
                      {item.rarity}
                    </span>
                    <span className="text-[10px] font-bold text-amber-300 font-gaming">
                      {currency === 'stars' ? `${item.price} ⭐` : `${item.rubPrice} ₽`}
                    </span>
                  </div>

                  {/* Real Transparent Image of Gift */}
                  <div className="w-full h-20 flex items-center justify-center my-2 p-1">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="max-w-full max-h-full object-contain filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]"
                    />
                  </div>

                  <div className="text-center mb-2">
                    <p className="font-extrabold text-xs text-white truncate">{item.name}</p>
                    <p className="text-[9px] text-gray-400">{item.wonAt}</p>
                  </div>

                  {/* Actions: Sell or Withdraw */}
                  <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-white/10">
                    <button
                      onClick={() => {
                        soundFx.playClick();
                        onSellItem(item);
                      }}
                      className="py-1.5 px-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[10px] font-bold transition-colors"
                      title="Продать за баланс"
                    >
                      Продать
                    </button>
                    <button
                      onClick={() => {
                        soundFx.playClick();
                        setWithdrawTargetItem(item);
                      }}
                      className="py-1.5 px-1 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 text-[10px] font-bold flex items-center justify-center gap-1 transition-colors"
                      title="Вывести в Telegram"
                    >
                      <Send className="w-2.5 h-2.5" />
                      <span>Вывод</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* WITHDRAW MODAL SUB-POPUP */}
        {withdrawTargetItem && (
          <div className="absolute inset-0 z-30 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
            <div className="w-full max-w-sm bg-[#161a30] border border-purple-500/40 rounded-2xl p-5 text-center shadow-2xl">
              <div className="w-20 h-20 mx-auto mb-2 flex items-center justify-center">
                <img src={withdrawTargetItem.image} alt={withdrawTargetItem.name} className="max-w-full max-h-full object-contain" />
              </div>
              <h3 className="font-gaming font-extrabold text-base text-white">
                Вывод подарка в Telegram
              </h3>
              <p className="text-xs text-gray-300 mt-1 mb-3">
                {withdrawTargetItem.name} будет отправлен ботом на ваш Telegram аккаунт!
              </p>

              {withdrawSuccess ? (
                <div className="py-4 space-y-2 text-emerald-400 animate-fadeIn">
                  <CheckCircle2 className="w-10 h-10 mx-auto" />
                  <p className="font-bold text-sm">Заявка принята!</p>
                  <p className="text-xs text-gray-300">
                    Бот отправит подарок пользователю @{tgUsername} в течение нескольких минут.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleWithdrawSubmit} className="space-y-3">
                  <input
                    type="text"
                    value={tgUsername}
                    onChange={(e) => setTgUsername(e.target.value)}
                    placeholder="@username получателя в TG"
                    required
                    className="w-full bg-[#101222] border border-white/10 focus:border-purple-500 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 outline-none"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setWithdrawTargetItem(null)}
                      className="flex-1 py-2 rounded-xl bg-gray-800 text-gray-300 text-xs font-bold"
                    >
                      Отмена
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-gaming font-bold text-xs"
                    >
                      Подтвердить
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
