import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { LiveFeed } from './components/LiveFeed';
import { LectorBanner } from './components/LectorBanner';
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
import { soundFx } from './utils/audio';

export const App: React.FC = () => {
  // Navigation & View state
  const [currentTab, setCurrentTab] = useState<TabType>('cases');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc'>('default');

  // Currency & User balances
  const [currency, setCurrency] = useState<'stars' | 'rub'>('stars');
  const [balanceStars, setBalanceStars] = useState<number>(350); // Starting welcome bonus!
  const [balanceRub, setBalanceRub] = useState<number>(550);

  // User inventory
  const [inventory, setInventory] = useState<InventoryItem[]>([
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
  ]);

  // Active Modals
  const [activeCase, setActiveCase] = useState<CaseItem | null>(null);
  const [isDepositOpen, setIsDepositOpen] = useState<boolean>(false);
  const [isInventoryOpen, setIsInventoryOpen] = useState<boolean>(false);
  const [isUpgradeOpen, setIsUpgradeOpen] = useState<boolean>(false);
  const [upgradePreselected, setUpgradePreselected] = useState<GiftItem | null>(null);

  // Initialize Telegram WebApp SDK if available
  useEffect(() => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
      if (window.Telegram.WebApp.setHeaderColor) {
        window.Telegram.WebApp.setHeaderColor('#0b0d18');
      }
      if (window.Telegram.WebApp.setBackgroundColor) {
        window.Telegram.WebApp.setBackgroundColor('#0b0d18');
      }
    }
  }, []);

  // Filter & sort cases
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

  // Handle case win
  const handleCaseWin = (wonItem: GiftItem, action: 'keep' | 'sell') => {
    // Deduct case price if not daily
    if (activeCase && !activeCase.isDaily) {
      if (currency === 'stars') {
        setBalanceStars((prev) => Math.max(0, prev - activeCase.price));
      } else {
        setBalanceRub((prev) => Math.max(0, prev - activeCase.rubPrice));
      }
    }

    if (action === 'sell') {
      if (currency === 'stars') {
        setBalanceStars((prev) => prev + wonItem.price);
      } else {
        setBalanceRub((prev) => prev + wonItem.rubPrice);
      }
    } else {
      const newInvItem: InventoryItem = {
        ...wonItem,
        inventoryId: Math.random().toString(),
        wonAt: 'Только что',
      };
      setInventory((prev) => [newInvItem, ...prev]);
    }
  };

  // Handle sell single inventory item
  const handleSellItem = (item: InventoryItem) => {
    setInventory((prev) => prev.filter((i) => i.inventoryId !== item.inventoryId));
    if (currency === 'stars') {
      setBalanceStars((prev) => prev + item.price);
    } else {
      setBalanceRub((prev) => prev + item.rubPrice);
    }
  };

  // Handle sell all items
  const handleSellAll = () => {
    const totalS = inventory.reduce((acc, i) => acc + i.price, 0);
    const totalR = inventory.reduce((acc, i) => acc + i.rubPrice, 0);
    setInventory([]);
    setBalanceStars((prev) => prev + totalS);
    setBalanceRub((prev) => prev + totalR);
  };

  // Handle gift withdrawal request
  const handleWithdrawGift = (item: InventoryItem, username: string) => {
    setInventory((prev) => prev.filter((i) => i.inventoryId !== item.inventoryId));
    console.log(`Sending gift ${item.name} to Telegram user @${username}`);
  };

  // Battle win
  const handleWinBattle = (wonItems: GiftItem[], totalValue: number) => {
    const newItems: InventoryItem[] = wonItems.map((item) => ({
      ...item,
      inventoryId: Math.random().toString(),
      wonAt: 'Победа в Батле',
    }));
    setInventory((prev) => [...newItems, ...prev]);
  };

  const handleDeductBalance = (amount: number) => {
    if (currency === 'stars') {
      setBalanceStars((prev) => Math.max(0, prev - amount));
    } else {
      setBalanceRub((prev) => Math.max(0, prev - amount));
    }
  };

  // Upgrade handlers
  const handleUpgradeSuccess = (spentItem: InventoryItem | null, wonItem: GiftItem) => {
    if (spentItem) {
      setInventory((prev) => prev.filter((i) => i.inventoryId !== spentItem.inventoryId));
    }
    const newInvItem: InventoryItem = {
      ...wonItem,
      inventoryId: Math.random().toString(),
      wonAt: 'Апгрейд',
    };
    setInventory((prev) => [newInvItem, ...prev]);
  };

  const handleUpgradeFail = (spentItem: InventoryItem | null) => {
    if (spentItem) {
      setInventory((prev) => prev.filter((i) => i.inventoryId !== spentItem.inventoryId));
    }
  };

  // Add balance from deposit
  const handleAddBalance = (amount: number, type: 'stars' | 'rub') => {
    if (type === 'stars') {
      setBalanceStars((prev) => prev + amount);
    } else {
      setBalanceRub((prev) => prev + amount);
    }
  };

  return (
    <div className="min-h-screen pb-24 text-white flex flex-col">
      {/* Top Fixed Header */}
      <Header
        balanceStars={balanceStars}
        balanceRub={balanceRub}
        currency={currency}
        setCurrency={setCurrency}
        onOpenDeposit={() => setIsDepositOpen(true)}
        onOpenProfile={() => setIsInventoryOpen(true)}
      />

      {/* Realtime Live Drop Ticker */}
      <LiveFeed />

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-3 md:px-4">
        {currentTab === 'cases' && (
          <>
            {/* Lector BS Mascot Banner */}
            <LectorBanner onBonusClick={() => setIsDepositOpen(true)} />

            {/* Filter Navigation matching reference UI */}
            <CategoryNav
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              sortBy={sortBy}
              setSortBy={setSortBy}
            />

            {/* Section Header */}
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
                {filteredCases.length} кейсов доступно
              </span>
            </div>

            {/* Cases 2-column Grid */}
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
              preselectedItem={upgradePreselected}
              onUpgradeSuccess={handleUpgradeSuccess}
              onUpgradeFail={handleUpgradeFail}
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

      {/* Roulette Opening Modal */}
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

      {/* Deposit Modal */}
      <DepositModal
        isOpen={isDepositOpen}
        onClose={() => setIsDepositOpen(false)}
        currency={currency}
        onAddBalance={handleAddBalance}
      />

      {/* Standalone Inventory Modal triggered from Header */}
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

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        inventoryCount={inventory.length}
      />
    </div>
  );
};
