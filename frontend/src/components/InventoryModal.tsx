import React, { useState } from 'react';
import { InventoryItem } from '../types';
import { X, Package, Send, CheckCircle2, AlertCircle, Plus } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface InventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency: 'stars' | 'rub';
  inventory: InventoryItem[];
  balanceStars?: number;
  onSellItem: (item: InventoryItem) => void;
  onSellAll: () => void;
  onWithdrawGift: (item: InventoryItem, username: string) => void;
  onOpenDeposit?: () => void;
}

export const InventoryModal: React.FC<InventoryModalProps> = ({
  isOpen,
  onClose,
  currency,
  inventory,
  balanceStars = 0,
  onSellItem,
  onSellAll,
  onWithdrawGift,
  onOpenDeposit,
}) => {
  if (!isOpen) return null;

  const [withdrawTargetItem, setWithdrawTargetItem] = useState<InventoryItem | null>(null);
  const [tgUsername, setTgUsername] = useState<string>('');
  const [withdrawSuccess, setWithdrawSuccess] = useState<boolean>(false);
  const [tipMessage, setTipMessage] = useState<string | null>(null);

  const totalValueStars = inventory.reduce((acc, i) => acc + i.price, 0);
  const totalValueRub = inventory.reduce((acc, i) => acc + i.rubPrice, 0);

  const handleWithdrawClick = (item: InventoryItem) => {
    soundFx.playClick();
    if (item.price <= 360) {
      setTipMessage(`Вывод доступен только для подарков дороже 360 ⭐. Этот подарок стоит ${item.price} ⭐. Вы можете продать его или использовать в апгрейде!`);
      return;
    }
    setWithdrawTargetItem(item);
  };

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!withdrawTargetItem || !tgUsername.trim()) return;

    if (balanceStars < 25) {
      alert('Недостаточно звёзд на балансе для оплаты комиссии (требуется 25 ⭐). Пополните баланс!');
      return;
    }

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 pb-16 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-[#111425] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[82vh]">
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
                      onClick={() => handleWithdrawClick(item)}
                      className={`py-1.5 px-1 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition-all ${
                        item.price > 360
                          ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-600/30'
                          : 'bg-white/5 hover:bg-white/10 text-gray-400'
                      }`}
                      title={item.price > 360 ? 'Вывести в Telegram (25 ⭐)' : 'Вывод доступен только для подарков дороже 360 ⭐'}
                    >
                      <Send className="w-2.5 h-2.5" />
                      <span>{item.price > 360 ? 'Вывод' : 'От 361 ⭐'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {tipMessage && (
          <div className="absolute inset-0 z-40 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
            <div className="w-full max-w-sm bg-[#161a30] border border-amber-500/40 rounded-2xl p-5 text-center shadow-2xl space-y-3">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="font-gaming font-extrabold text-sm text-white">
                Ограничение вывода
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                {tipMessage}
              </p>
              <button
                onClick={() => setTipMessage(null)}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-gaming font-bold text-xs"
              >
                Понятно
              </button>
            </div>
          </div>
        )}

        {withdrawTargetItem && (
          <div className="absolute inset-0 z-30 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
            <div className="w-full max-w-sm bg-[#161a30] border border-purple-500/40 rounded-2xl p-5 text-center shadow-2xl">
              <div className="w-20 h-20 mx-auto mb-2 flex items-center justify-center">
                <img src={withdrawTargetItem.image} alt={withdrawTargetItem.name} className="max-w-full max-h-full object-contain" />
              </div>
              <h3 className="font-gaming font-extrabold text-base text-white">
                Вывод подарка в Telegram
              </h3>
              <p className="text-xs text-gray-300 mt-1 mb-2">
                {withdrawTargetItem.name} ({withdrawTargetItem.price} ⭐)
              </p>

              <div className="p-3 rounded-xl bg-[#101222] border border-white/10 text-left space-y-1 mb-3 text-xs">
                <div className="flex justify-between text-gray-400">
                  <span>Комиссия отправки:</span>
                  <span className="font-bold text-amber-400">25 ⭐</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Ваш баланс:</span>
                  <span className={`font-bold ${balanceStars >= 25 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {balanceStars} ⭐
                  </span>
                </div>
              </div>

              {balanceStars < 25 && (
                <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs mb-3 text-left flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    Для отправки подарка необходимо 25 ⭐ на балансе. Пополните баланс для продолжения!
                  </div>
                </div>
              )}

              {withdrawSuccess ? (
                <div className="py-4 space-y-2 text-emerald-400 animate-fadeIn">
                  <CheckCircle2 className="w-10 h-10 mx-auto" />
                  <p className="font-bold text-sm">Заявка успешно отправлена!</p>
                  <p className="text-xs text-gray-300">
                    25 ⭐ списано. Администратор отправит подарок пользователю @{tgUsername}.
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
                    inputMode="text"
                    autoCapitalize="none"
                    autoCorrect="off"
                    autoComplete="off"
                    enterKeyHint="done"
                    className="w-full bg-[#101222] border border-white/10 focus:border-purple-500 rounded-xl px-3 py-2 text-base sm:text-xs text-white placeholder-gray-500 outline-none"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setWithdrawTargetItem(null)}
                      className="flex-1 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-bold"
                    >
                      Отмена
                    </button>
                    {balanceStars < 25 && onOpenDeposit ? (
                      <button
                        type="button"
                        onClick={() => {
                          setWithdrawTargetItem(null);
                          onOpenDeposit();
                        }}
                        className="flex-1 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:opacity-90 text-black font-gaming font-bold text-xs flex items-center justify-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Пополнить (25 ⭐)</span>
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={balanceStars < 25}
                        className="flex-1 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 disabled:opacity-50 text-white font-gaming font-bold text-xs"
                      >
                        Подтвердить (25 ⭐)
                      </button>
                    )}
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
