import React, { useEffect, useState } from 'react';
import { GiftItem } from '../types';
import { ALL_GIFTS } from '../data/gifts';

interface FeedItem {
  id: string;
  userName: string;
  avatar: string;
  item: GiftItem;
  caseName: string;
}

const INITIAL_FEED: FeedItem[] = [
  { id: '1', userName: 'Alex_TG', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=1', item: ALL_GIFTS['nft-doge'], caseName: 'Пёс Сопротивления' },
  { id: '2', userName: 'crypto_boss', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=2', item: ALL_GIFTS['stars-500'], caseName: 'Звёздный Шторм' },
  { id: '3', userName: 'Dmitry_99', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=3', item: ALL_GIFTS['ring'], caseName: 'Lector BS' },
  { id: '4', userName: 'vlad_ton', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=4', item: ALL_GIFTS['nft-flamingo'], caseName: 'NFT-Кейс' },
  { id: '5', userName: 'Elena_V', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=5', item: ALL_GIFTS['diamond'], caseName: '50/50 Роза или Алмаз' },
  { id: '6', userName: 'shadow_bs', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=6', item: ALL_GIFTS['rocket'], caseName: 'Копилка' },
];

export const LiveFeed: React.FC = () => {
  const [items, setItems] = useState<FeedItem[]>(INITIAL_FEED);

  useEffect(() => {
    const giftKeys = Object.keys(ALL_GIFTS);
    const mockNames = ['Pavel_D', 'TonMaster', 'Anon_BS', 'Ghost_77', 'Viktor', 'Nikita_X', 'DarkLector'];

    const interval = setInterval(() => {
      const randomKey = giftKeys[Math.floor(Math.random() * giftKeys.length)];
      const randomItem = ALL_GIFTS[randomKey];
      const randomName = mockNames[Math.floor(Math.random() * mockNames.length)];

      const newItem: FeedItem = {
        id: Math.random().toString(),
        userName: randomName,
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${Math.floor(Math.random() * 1000)}`,
        item: randomItem,
        caseName: 'Кейс',
      };

      setItems(prev => [newItem, ...prev.slice(0, 14)]);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
      case 'mythic': return 'border-red-500/80 bg-red-950/20';
      case 'nft': return 'border-emerald-400/80 bg-emerald-950/20';
      case 'legendary': return 'border-amber-400/80 bg-amber-950/20';
      case 'epic': return 'border-purple-400/80 bg-purple-950/20';
      case 'rare': return 'border-sky-400/80 bg-sky-950/20';
      default: return 'border-slate-600/50 bg-slate-900/30';
    }
  };

  return (
    <div className="w-full bg-[#0d0f1c]/90 border-b border-white/[0.04] py-2 overflow-hidden select-none">
      <div className="max-w-4xl mx-auto px-4 flex items-center gap-2">
        <div className="flex items-center gap-1.5 shrink-0 pr-2 border-r border-white/10">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">LIVE</span>
        </div>

        {/* Horizontal scrolling strip */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          {items.map((drop) => (
            <div
              key={drop.id}
              className={`shrink-0 flex items-center gap-2 px-2.5 py-1 rounded-lg border backdrop-blur-sm transition-all duration-300 hover:scale-105 ${getRarityBorder(
                drop.item.rarity
              )}`}
            >
              <span className="text-lg filter drop-shadow">{drop.item.icon}</span>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-white truncate max-w-[90px] leading-tight">
                  {drop.item.name}
                </span>
                <span className="text-[9px] text-gray-400 truncate max-w-[80px]">
                  @{drop.userName}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
