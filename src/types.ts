export type RarityType = 'common' | 'rare' | 'epic' | 'legendary' | 'mythic' | 'nft';

export interface GiftItem {
  id: string;
  name: string;
  subtitle?: string;
  image: string; // Path to real PNG/WEBP asset
  iconFallback?: string;
  price: number; // Value in Stars (⭐)
  rubPrice: number; // Value in Rubles (₽)
  rarity: RarityType;
  category: 'regular' | 'nft' | 'stars' | 'exclusive';
  isNft?: boolean;
}

export interface CaseDropRate {
  item: GiftItem;
  weight: number; // Weight for probability calculation
  chancePercent?: number;
}

export interface CaseItem {
  id: string;
  name: string;
  category: 'all' | 'budget' | 'nft' | 'resistance' | 'fifty' | 'top' | 'daily';
  price: number; // In Stars
  rubPrice: number; // In Rubles
  oldPrice?: number;
  caseImage: string; // 3D case artwork image
  previewIcons: string[]; // URLs or fallbacks
  drops: CaseDropRate[];
  badge?: string;
  isDaily?: boolean;
  cooldownHours?: number;
  color: string;
}

export interface UserProfile {
  id: number | string;
  username: string;
  firstName: string;
  avatar: string;
  balanceStars: number;
  balanceRub: number;
  totalOpened: number;
  totalWon: number;
  inventory: InventoryItem[];
}

export interface InventoryItem extends GiftItem {
  inventoryId: string;
  wonAt: string;
}

export interface LiveDrop {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  item: GiftItem;
  caseName: string;
  time: string;
}

export interface CaseBattleRoom {
  id: string;
  name: string;
  caseId: string;
  caseName: string;
  casePrice: number;
  roundsCount: number;
  totalCost: number;
  player: {
    id: string;
    name: string;
    avatar: string;
    totalWon: number;
    drops: GiftItem[];
  };
  opponent: {
    id: string;
    name: string;
    avatar: string;
    isBot: boolean;
    totalWon: number;
    drops: GiftItem[];
  } | null;
  status: 'waiting' | 'ready' | 'battling' | 'finished';
  currentRound: number;
  winner: 'player' | 'opponent' | 'draw' | null;
}
