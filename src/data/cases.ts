import { CaseItem } from '../types';
import { ALL_GIFTS } from './gifts';

export const ALL_CASES: CaseItem[] = [
  // --- Daily / Free ---
  {
    id: 'daily-gift',
    name: 'Подарок Дня',
    category: 'daily',
    price: 0,
    rubPrice: 0,
    badge: 'БЕСПЛАТНО',
    isDaily: true,
    cooldownHours: 24,
    color: '#3b82f6',
    caseImage: 'assets/cases/case_daily.png',
    previewIcons: [
      ALL_GIFTS['bear'].image,
      ALL_GIFTS['rose'].image,
      ALL_GIFTS['star.svg']?.image || ALL_GIFTS['stars-15'].image,
      ALL_GIFTS['rocket'].image,
    ],
    drops: [
      { item: ALL_GIFTS['bear'], weight: 50 },
      { item: ALL_GIFTS['rose'], weight: 30 },
      { item: ALL_GIFTS['stars-15'], weight: 14 },
      { item: ALL_GIFTS['cake'], weight: 4 },
      { item: ALL_GIFTS['rocket'], weight: 1.5 },
      { item: ALL_GIFTS['diamond'], weight: 0.5 },
    ]
  },

  // --- На сдачу (Budget) ---
  {
    id: 'case-meloch',
    name: 'Мелочь',
    category: 'budget',
    price: 25,
    rubPrice: 39,
    oldPrice: 35,
    color: '#ec4899',
    caseImage: 'assets/cases/case_meloch.png',
    previewIcons: [
      ALL_GIFTS['perfume'].image,
      ALL_GIFTS['heart'].image,
      ALL_GIFTS['bear'].image,
      ALL_GIFTS['lollipop'].image,
    ],
    drops: [
      { item: ALL_GIFTS['lollipop'], weight: 38 },
      { item: ALL_GIFTS['bear'], weight: 32 },
      { item: ALL_GIFTS['rose'], weight: 18 },
      { item: ALL_GIFTS['stars-50'], weight: 8 },
      { item: ALL_GIFTS['perfume'], weight: 4 },
    ]
  },
  {
    id: 'case-sdacha',
    name: 'Сдача',
    category: 'budget',
    price: 30,
    rubPrice: 49,
    color: '#8b5cf6',
    caseImage: 'assets/cases/case_meloch.png',
    previewIcons: [
      ALL_GIFTS['socks'].image,
      ALL_GIFTS['bow'].image,
      ALL_GIFTS['cake'].image,
      ALL_GIFTS['diamond'].image,
    ],
    drops: [
      { item: ALL_GIFTS['socks'], weight: 35 },
      { item: ALL_GIFTS['bow'], weight: 30 },
      { item: ALL_GIFTS['cake'], weight: 20 },
      { item: ALL_GIFTS['stars-100'], weight: 10 },
      { item: ALL_GIFTS['diamond'], weight: 5 },
    ]
  },
  {
    id: 'case-kopilka',
    name: 'Копилка',
    category: 'budget',
    price: 39,
    rubPrice: 59,
    color: '#06b6d4',
    caseImage: 'assets/cases/case_meloch.png',
    previewIcons: [
      ALL_GIFTS['watch'].image,
      ALL_GIFTS['socks'].image,
      ALL_GIFTS['rocket'].image,
      ALL_GIFTS['perfume'].image,
    ],
    drops: [
      { item: ALL_GIFTS['socks'], weight: 32 },
      { item: ALL_GIFTS['heart'], weight: 28 },
      { item: ALL_GIFTS['perfume'], weight: 20 },
      { item: ALL_GIFTS['watch'], weight: 12 },
      { item: ALL_GIFTS['rocket'], weight: 8 },
    ]
  },
  {
    id: 'case-zanachka',
    name: 'Заначка',
    category: 'budget',
    price: 49,
    rubPrice: 79,
    color: '#a855f7',
    caseImage: 'assets/cases/case_meloch.png',
    previewIcons: [
      ALL_GIFTS['mushroom'].image,
      ALL_GIFTS['shoes'].image,
      ALL_GIFTS['champagne'].image,
      ALL_GIFTS['ring'].image,
    ],
    drops: [
      { item: ALL_GIFTS['mushroom'], weight: 35 },
      { item: ALL_GIFTS['shoes'], weight: 25 },
      { item: ALL_GIFTS['champagne'], weight: 20 },
      { item: ALL_GIFTS['stars-250'], weight: 12 },
      { item: ALL_GIFTS['ring'], weight: 8 },
    ]
  },

  // --- Сопротивление (Resistance Dogs & Durov themes) ---
  {
    id: 'case-resistance-dog',
    name: 'Пёс Сопротивления',
    category: 'resistance',
    price: 210,
    rubPrice: 349,
    badge: 'ДУРОВ',
    color: '#38bdf8',
    caseImage: 'assets/cases/case_resistance.png',
    previewIcons: [
      ALL_GIFTS['nft-doge'].image,
      ALL_GIFTS['ring'].image,
      ALL_GIFTS['rocket'].image,
      ALL_GIFTS['durovscap-1']?.image || ALL_GIFTS['nft-cap'].image,
    ],
    drops: [
      { item: ALL_GIFTS['bear'], weight: 20 },
      { item: ALL_GIFTS['champagne'], weight: 25 },
      { item: ALL_GIFTS['ring'], weight: 25 },
      { item: ALL_GIFTS['stars-500'], weight: 18 },
      { item: ALL_GIFTS['nft-doge'], weight: 12 },
    ]
  },
  {
    id: 'case-redo',
    name: 'Редо Кейс',
    category: 'resistance',
    price: 990,
    rubPrice: 1679,
    badge: 'ХАРДКОР',
    color: '#ef4444',
    caseImage: 'assets/cases/case_redo.png',
    previewIcons: [
      ALL_GIFTS['nft-redo'].image,
      ALL_GIFTS['nft-doge'].image,
      ALL_GIFTS['diamond'].image,
    ],
    drops: [
      { item: ALL_GIFTS['ring'], weight: 25 },
      { item: ALL_GIFTS['rocket'], weight: 25 },
      { item: ALL_GIFTS['diamond'], weight: 20 },
      { item: ALL_GIFTS['nft-doge'], weight: 15 },
      { item: ALL_GIFTS['nft-redo'], weight: 15 },
    ]
  },

  // --- NFT Кейсы (Fragment Official) ---
  {
    id: 'case-nft-main',
    name: 'NFT-Кейс (Fragment)',
    category: 'nft',
    price: 550,
    rubPrice: 890,
    badge: 'FRAGMENT NFT',
    color: '#10b981',
    caseImage: 'assets/cases/case_nft.png',
    previewIcons: [
      ALL_GIFTS['nft-swiss-watch'].image,
      ALL_GIFTS['nft-heart-locket'].image,
      ALL_GIFTS['nft-heroic-helmet'].image,
      ALL_GIFTS['nft-plush-pepe'].image,
    ],
    drops: [
      { item: ALL_GIFTS['cake'], weight: 20 },
      { item: ALL_GIFTS['perfume'], weight: 20 },
      { item: ALL_GIFTS['nft-heart-locket'], weight: 20 },
      { item: ALL_GIFTS['nft-swiss-watch'], weight: 15 },
      { item: ALL_GIFTS['nft-heroic-helmet'], weight: 15 },
      { item: ALL_GIFTS['nft-plush-pepe'], weight: 10 },
    ]
  },

  // --- 50 / 50 ---
  {
    id: 'case-5050-bear-cake',
    name: '50/50: Мишка или Торт',
    category: 'fifty',
    price: 40,
    rubPrice: 65,
    badge: '50/50',
    color: '#f59e0b',
    caseImage: 'assets/cases/case_5050.png',
    previewIcons: [
      ALL_GIFTS['bear'].image,
      ALL_GIFTS['cake'].image,
    ],
    drops: [
      { item: ALL_GIFTS['bear'], weight: 50 },
      { item: ALL_GIFTS['cake'], weight: 50 },
    ]
  },
  {
    id: 'case-5050-rose-diamond',
    name: '50/50: Роза или Алмаз',
    category: 'fifty',
    price: 600,
    rubPrice: 990,
    badge: 'РИСК 50%',
    color: '#ec4899',
    caseImage: 'assets/cases/case_5050.png',
    previewIcons: [
      ALL_GIFTS['rose'].image,
      ALL_GIFTS['diamond'].image,
    ],
    drops: [
      { item: ALL_GIFTS['rose'], weight: 50 },
      { item: ALL_GIFTS['diamond'], weight: 50 },
    ]
  },

  // --- ЛЕКТОР & BLACK SPRUIT (Top / Mascot Exclusive) ---
  {
    id: 'case-lector-bs',
    name: 'Lector Black Spruit',
    category: 'top',
    price: 1850,
    rubPrice: 2990,
    badge: 'МАСКОТ VIP',
    color: '#f59e0b',
    caseImage: 'assets/cases/case_lector_bs.png',
    previewIcons: [
      ALL_GIFTS['nft-lector-halo'].image,
      ALL_GIFTS['nft-lector-mask'].image,
      ALL_GIFTS['diamond'].image,
      ALL_GIFTS['stars-1000'].image,
    ],
    drops: [
      { item: ALL_GIFTS['diamond'], weight: 35 },
      { item: ALL_GIFTS['stars-1000'], weight: 25 },
      { item: ALL_GIFTS['nft-redo'], weight: 20 },
      { item: ALL_GIFTS['nft-lector-halo'], weight: 12 },
      { item: ALL_GIFTS['nft-lector-mask'], weight: 8 },
    ]
  },
  {
    id: 'case-stars-rush',
    name: 'Звёздный Шторм',
    category: 'top',
    price: 490,
    rubPrice: 850,
    badge: 'ТОЛЬКО ЗВЁЗДЫ',
    color: '#eab308',
    caseImage: 'assets/cases/case_stars.png',
    previewIcons: [
      ALL_GIFTS['stars-5000'].image,
      ALL_GIFTS['stars-1000'].image,
      ALL_GIFTS['stars-500'].image,
    ],
    drops: [
      { item: ALL_GIFTS['stars-50'], weight: 35 },
      { item: ALL_GIFTS['stars-100'], weight: 30 },
      { item: ALL_GIFTS['stars-250'], weight: 20 },
      { item: ALL_GIFTS['stars-500'], weight: 10 },
      { item: ALL_GIFTS['stars-1000'], weight: 4 },
      { item: ALL_GIFTS['stars-5000'], weight: 1 },
    ]
  }
];

export const CATEGORIES = [
  { id: 'all', label: 'Все' },
  { id: 'daily', label: 'Подарок дня' },
  { id: 'budget', label: 'На сдачу' },
  { id: 'resistance', label: 'Сопротивление' },
  { id: 'fifty', label: '50/50' },
  { id: 'nft', label: 'NFT' },
  { id: 'top', label: 'Lector BS' },
];
