import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { LiveFeed } from './components/LiveFeed';
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
    return saved !== null ? Number(saved) : 350;
  });
  const balanceRub = Math.round(balanceStars * 1.5);

  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('lector_inventory');
      if (saved) return JSON.parse(saved);
    } catch {
    }
    return [
      {
        ...ALL_GIFTS['bear'],
        inventoryId: 'init-1',
        wonAt: 'Сегодня, 18:20',
      },
      {
        ...ALL_GIFTS['rose'],
        inventoryId: 'init-2',
        wonAt: 'Сегодня, 18:25',
      },
    ];
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
    setInventory((prev) => prev.filter((i) => i.inventoryId !== item.inventoryId));
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

        <LiveFeed />

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
              onSellItem={handleSellItem}
              onSellAll={handleSellAll}
              onWithdrawGift={handleWithdrawGift}
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
          onSellItem={handleSellItem}
          onSellAll={handleSellAll}
          onWithdrawGift={handleWithdrawGift}
        />
      )}

      <BottomNav
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        inventoryCount={inventory.length}
      />
      </div>
    </div>
  );
};
