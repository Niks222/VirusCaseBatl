import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { CategoryNav } from './components/CategoryNav';
import { CaseCard } from './components/CaseCard';
import { RouletteModal } from './components/RouletteModal';
import { BattleArena } from './components/BattleArena';
import { UpgradeModal } from './components/UpgradeModal';
import { InventoryModal } from './components/InventoryModal';
import { DepositModal } from './components/DepositModal';
import { BottomNav, TabType } from './components/BottomNav';

import { ALL_CASES } from './data/cases';
import { ALL_GIFTS } from './data/gifts';
import { CaseItem, GiftItem, InventoryItem } from './types';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<TabType>('cases');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc'>('default');

  const [currency, setCurrency] = useState<'stars' | 'rub'>('stars');
  const [balanceStars, setBalanceStars] = useState<number>(() => {
    const saved = localStorage.getItem('lector_balance_stars');
    return saved !== null ? Number(saved) : 0;
  });
  const balanceRub = Math.round(balanceStars * 1.5);

  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('lector_inventory');
      if (saved) return JSON.parse(saved);
    } catch {
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('lector_balance_stars', balanceStars.toString());
  }, [balanceStars]);

  useEffect(() => {
    localStorage.setItem('lector_inventory', JSON.stringify(inventory));
  }, [inventory]);

  const [activeCase, setActiveCase] = useState<CaseItem | null>(null);
  const [isDepositOpen, setIsDepositOpen] = useState<boolean>(false);
  const [isInventoryOpen, setIsInventoryOpen] = useState<boolean>(false);
  const [upgradePreselected, setUpgradePreselected] = useState<GiftItem | null>(null);

  const [lastDailyClaim, setLastDailyClaim] = useState<number>(() => {
    const saved = localStorage.getItem('lector_last_daily_claim');
    return saved ? Number(saved) : 0;
  });
  const [nowTime, setNowTime] = useState<number>(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setNowTime(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const DAILY_COOLDOWN_MS = 24 * 60 * 60 * 1000;
  const canClaimDaily = nowTime - lastDailyClaim >= DAILY_COOLDOWN_MS;
  const remainingDailyMs = Math.max(0, DAILY_COOLDOWN_MS - (nowTime - lastDailyClaim));

  const formatDailyRemaining = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const hours = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  const dailyRemainingText = formatDailyRemaining(remainingDailyMs);

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
      if (window.Telegram.WebApp.setHeaderColor) {
        window.Telegram.WebApp.setHeaderColor('#070913');
      }
      if (window.Telegram.WebApp.setBackgroundColor) {
        window.Telegram.WebApp.setBackgroundColor('#070913');
      }
    }
  }, []);

  const filteredCases = ALL_CASES.filter((c) => {
    if (selectedCategory !== 'all' && c.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = c.name.toLowerCase().includes(q);
      const matchDrop = c.drops.some((d) => d.item.name.toLowerCase().includes(q));
      return matchName || matchDrop;
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') {
      const pA = currency === 'stars' ? a.price : a.rubPrice;
      const pB = currency === 'stars' ? b.price : b.rubPrice;
      return pA - pB;
    }
    if (sortBy === 'price-desc') {
      const pA = currency === 'stars' ? a.price : a.rubPrice;
      const pB = currency === 'stars' ? b.price : b.rubPrice;
      return pB - pA;
    }
    return 0;
  });

  const handleCaseWin = (wonItem: GiftItem, action: 'keep' | 'sell') => {
    if (activeCase && !activeCase.isDaily) {
      const costInStars = currency === 'stars' ? activeCase.price : Math.round(activeCase.rubPrice / 1.5);
      setBalanceStars((prev) => Math.max(0, prev - costInStars));
    }

    if (activeCase?.isDaily) {
      const now = Date.now();
      setLastDailyClaim(now);
      localStorage.setItem('lector_last_daily_claim', now.toString());
    }

    if (action === 'sell') {
      setBalanceStars((prev) => prev + wonItem.price);
    } else {
      const newInvItem: InventoryItem = {
        ...wonItem,
        inventoryId: Math.random().toString(),
        wonAt: 'Только что',
      };
      setInventory((prev) => [newInvItem, ...prev]);
    }
  };

  const handleSellItem = (item: InventoryItem) => {
    setInventory((prev) => prev.filter((i) => i.inventoryId !== item.inventoryId));
    setBalanceStars((prev) => prev + item.price);
  };

  const handleSellAll = () => {
    const totalS = inventory.reduce((acc, i) => acc + i.price, 0);
    setInventory([]);
    setBalanceStars((prev) => prev + totalS);
  };

  const handleWithdrawGift = (item: InventoryItem, username: string) => {
    setBalanceStars((prev) => Math.max(0, prev - 25));
    setInventory((prev) => prev.filter((i) => i.inventoryId !== item.inventoryId));
    try {
      const user = window.Telegram?.WebApp?.initDataUnsafe?.user;
      const senderId = user?.id ? String(user.id) : '8318347639';
      const senderName = user?.username ? `@${user.username}` : (user?.first_name || 'Игрок');
      const cleanTarget = username.replace('@', '').trim();
      const withdrawId = 'W' + Math.floor(100000 + Math.random() * 900000);
      const timeStr = new Date().toLocaleString('ru-RU');

      const messageText = `🚨 <b>НОВАЯ ЗАЯВКА НА ВЫВОД ПОДАРКА!</b>\n\n🆔 <b>Заявка:</b> <code>#${withdrawId}</code>\n👤 <b>Игрок:</b> ${senderName} (ID: <code>${senderId}</code>)\n🎯 <b>Получатель в TG:</b> @${cleanTarget}\n🎁 <b>Подарок:</b> <b>${item.name}</b>\n⭐ <b>Стоимость:</b> <b>${item.price} ⭐</b>\n💰 <b>Комиссия:</b> <b>25 ⭐</b> (Оплачена)\n📅 <b>Время:</b> ${timeStr}`;

      const token = '9179379427:AAFJVRpJx-nUg3mh-BtFjanMLWBymb8YXyc';
      const admins = ['8318347639'];

      admins.forEach((adminId) => {
        fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: adminId,
            text: messageText,
            parse_mode: 'HTML',
            reply_markup: {
              inline_keyboard: [
                [
                  { text: `✅ Выполнено #${withdrawId}`, callback_data: `approve_w_${withdrawId}` },
                  { text: '❌ Отклонить', callback_data: `reject_w_${withdrawId}` },
                ],
              ],
            },
          }),
        }).catch(() => {});
      });

      try {
        window.Telegram?.WebApp?.sendData?.(
          JSON.stringify({
            type: 'WITHDRAW',
            id: withdrawId,
            userId: senderId,
            username: senderName,
            targetUsername: cleanTarget,
            itemName: item.name,
            itemPrice: item.price,
            fee: 25,
          })
        );
      } catch {}

      try {
        const stored = JSON.parse(localStorage.getItem('lector_withdrawals') || '[]');
        stored.unshift({
          id: withdrawId,
          userId: senderId,
          username: senderName,
          targetUsername: cleanTarget,
          itemName: item.name,
          itemPrice: item.price,
          fee: 25,
          status: 'pending',
          createdAt: timeStr,
        });
        localStorage.setItem('lector_withdrawals', JSON.stringify(stored.slice(0, 50)));
      } catch {}
    } catch {
    }
  };

  const handleWinBattle = (wonItems: GiftItem[]) => {
    const newItems: InventoryItem[] = wonItems.map((item) => ({
      ...item,
      inventoryId: Math.random().toString(),
      wonAt: 'Победа в Батле',
    }));
    setInventory((prev) => [...newItems, ...prev]);
  };

  const handleDeductBalance = (amount: number) => {
    const starsDeduct = currency === 'stars' ? amount : Math.round(amount / 1.5);
    setBalanceStars((prev) => Math.max(0, prev - starsDeduct));
  };

  const handleUpgradeSuccess = (spentItem: InventoryItem | null, wonItem: GiftItem, balanceCost?: number) => {
    if (spentItem) {
      setInventory((prev) => prev.filter((i) => i.inventoryId !== spentItem.inventoryId));
    } else if (balanceCost) {
      const costStars = currency === 'stars' ? balanceCost : Math.round(balanceCost / 1.5);
      setBalanceStars((prev) => Math.max(0, prev - costStars));
    }
    const newInvItem: InventoryItem = {
      ...wonItem,
      inventoryId: Math.random().toString(),
      wonAt: 'Апгрейд',
    };
    setInventory((prev) => [newInvItem, ...prev]);
  };

  const handleUpgradeFail = (spentItem: InventoryItem | null, balanceCost?: number) => {
    if (spentItem) {
      setInventory((prev) => prev.filter((i) => i.inventoryId !== spentItem.inventoryId));
    } else if (balanceCost) {
      const costStars = currency === 'stars' ? balanceCost : Math.round(balanceCost / 1.5);
      setBalanceStars((prev) => Math.max(0, prev - costStars));
    }
  };

  const handleAddBalance = (amount: number, type: 'stars' | 'rub') => {
    const starsToAdd = type === 'stars' ? amount : Math.round(amount / 1.5);
    setBalanceStars((prev) => prev + starsToAdd);
  };

  return (
    <div className="min-h-screen text-white flex flex-col relative overflow-x-hidden bg-[#070913]">
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden flex justify-center items-end opacity-[0.22]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,transparent_0%,#070913_78%)]" />
        <img
          src="assets/lector_bg.png"
          alt=""
          className="h-[88vh] max-h-[860px] object-contain object-bottom filter drop-shadow-[0_0_50px_rgba(245,158,11,0.22)] select-none"
        />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen pb-24">
        <Header
          balanceStars={balanceStars}
          balanceRub={balanceRub}
          currency={currency}
          setCurrency={setCurrency}
          onOpenDeposit={() => setIsDepositOpen(true)}
          onOpenProfile={() => setIsInventoryOpen(true)}
        />

        <main className="flex-1 max-w-4xl w-full mx-auto px-3 md:px-4">
          {currentTab === 'cases' && (
            <>
              <CategoryNav
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                sortBy={sortBy}
                setSortBy={setSortBy}
              />

            <div className="flex items-center justify-between mt-3 mb-2 px-1">
              <span className="font-gaming font-extrabold text-sm text-gray-200">
                {selectedCategory === 'all'
                  ? 'Все кейсы'
                  : selectedCategory === 'budget'
                  ? 'На сдачу'
                  : selectedCategory === 'resistance'
                  ? 'Сопротивление'
                  : selectedCategory === 'fifty'
                  ? '50 / 50'
                  : selectedCategory === 'top'
                  ? 'Lector BS Эксклюзив'
                  : 'Кейсы'}
              </span>
              <span className="text-[11px] text-gray-400 font-semibold">
                {filteredCases.length} кейсов
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-3.5">
              {filteredCases.map((caseItem) => (
                <CaseCard
                  key={caseItem.id}
                  caseItem={caseItem}
                  currency={currency}
                  onSelect={(item) => setActiveCase(item)}
                  canClaimDaily={canClaimDaily}
                  dailyRemainingText={dailyRemainingText}
                />
              ))}
            </div>
          </>
        )}

        {currentTab === 'battles' && (
          <BattleArena
            currency={currency}
            userBalance={currency === 'stars' ? balanceStars : balanceRub}
            onWinBattle={handleWinBattle}
            onDeductBalance={handleDeductBalance}
          />
        )}

        {currentTab === 'upgrade' && (
          <div className="py-4">
            <UpgradeModal
              isOpen={true}
              onClose={() => setCurrentTab('cases')}
              currency={currency}
              inventory={inventory}
              balanceStars={balanceStars}
              balanceRub={balanceRub}
              preselectedItem={upgradePreselected}
              onUpgradeSuccess={handleUpgradeSuccess}
              onUpgradeFail={handleUpgradeFail}
              onOpenDeposit={() => setIsDepositOpen(true)}
            />
          </div>
        )}

        {currentTab === 'inventory' && (
          <div className="py-4">
            <InventoryModal
              isOpen={true}
              onClose={() => setCurrentTab('cases')}
              currency={currency}
              inventory={inventory}
              balanceStars={balanceStars}
              onSellItem={handleSellItem}
              onSellAll={handleSellAll}
              onWithdrawGift={handleWithdrawGift}
              onOpenDeposit={() => setIsDepositOpen(true)}
            />
          </div>
        )}
      </main>

      {activeCase && (
        <RouletteModal
          caseItem={activeCase}
          currency={currency}
          userBalance={currency === 'stars' ? balanceStars : balanceRub}
          onClose={() => setActiveCase(null)}
          onWin={handleCaseWin}
          onOpenUpgradeWithItem={(item) => {
            setUpgradePreselected(item);
            setCurrentTab('upgrade');
          }}
          isDailyAvailable={canClaimDaily}
          dailyRemainingText={dailyRemainingText}
        />
      )}

      <DepositModal
        isOpen={isDepositOpen}
        onClose={() => setIsDepositOpen(false)}
        currency={currency}
        onAddBalance={handleAddBalance}
      />

      {isInventoryOpen && currentTab !== 'inventory' && (
        <InventoryModal
          isOpen={isInventoryOpen}
          onClose={() => setIsInventoryOpen(false)}
          currency={currency}
          inventory={inventory}
          balanceStars={balanceStars}
          onSellItem={handleSellItem}
          onSellAll={handleSellAll}
          onWithdrawGift={handleWithdrawGift}
          onOpenDeposit={() => setIsDepositOpen(true)}
        />
      )}
      </div>

      <BottomNav
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setIsInventoryOpen(false);
          setIsDepositOpen(false);
          setActiveCase(null);
          setCurrentTab(tab);
        }}
        inventoryCount={inventory.length}
      />
    </div>
  );
};
