import { CaseItem } from '../types';
import { ALL_GIFTS } from './gifts';

export const ALL_CASES: CaseItem[] = [
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
      ALL_GIFTS['present-box'].image,
      ALL_GIFTS['stars-15'].image,
    ],
    drops: [
      { item: ALL_GIFTS['heart-box'], weight: 35 },
      { item: ALL_GIFTS['bear'], weight: 35 },
      { item: ALL_GIFTS['present-box'], weight: 15 },
      { item: ALL_GIFTS['rose'], weight: 10 },
      { item: ALL_GIFTS['stars-15'], weight: 4 },
      { item: ALL_GIFTS['cake'], weight: 1 },
    ]
  },
  {
    id: 'case-meloch',
    name: 'Мелочь',
    category: 'budget',
    price: 20,
    rubPrice: 30,
    oldPrice: 30,
    color: '#ec4899',
    caseImage: 'assets/cases/case_meloch.png',
    previewIcons: [
      ALL_GIFTS['heart-box'].image,
      ALL_GIFTS['bear'].image,
      ALL_GIFTS['present-box'].image,
      ALL_GIFTS['rose'].image,
    ],
    drops: [
      { item: ALL_GIFTS['heart-box'], weight: 45 },
      { item: ALL_GIFTS['bear'], weight: 40 },
      { item: ALL_GIFTS['present-box'], weight: 10 },
      { item: ALL_GIFTS['rose'], weight: 4 },
      { item: ALL_GIFTS['stars-50'], weight: 1 },
    ]
  },
  {
    id: 'case-sdacha',
    name: 'Сдача',
    category: 'budget',
    price: 45,
    rubPrice: 68,
    color: '#8b5cf6',
    caseImage: 'assets/cases/case_meloch.png',
    previewIcons: [
      ALL_GIFTS['cake'].image,
      ALL_GIFTS['bouquet'].image,
      ALL_GIFTS['rocket'].image,
      ALL_GIFTS['champagne'].image,
    ],
    drops: [
      { item: ALL_GIFTS['present-box'], weight: 50 },
      { item: ALL_GIFTS['cake'], weight: 20 },
      { item: ALL_GIFTS['bouquet'], weight: 15 },
      { item: ALL_GIFTS['champagne'], weight: 10 },
      { item: ALL_GIFTS['rocket'], weight: 4 },
      { item: ALL_GIFTS['ring'], weight: 1 },
    ]
  },
  {
    id: 'case-top-drop',
    name: 'Трофей & Алмаз',
    category: 'budget',
    price: 90,
    rubPrice: 135,
    badge: '100 ⭐ ДРОПЫ',
    color: '#06b6d4',
    caseImage: 'assets/cases/case_meloch.png',
    previewIcons: [
      ALL_GIFTS['trophy'].image,
      ALL_GIFTS['diamond'].image,
      ALL_GIFTS['ring'].image,
      ALL_GIFTS['rocket'].image,
    ],
    drops: [
      { item: ALL_GIFTS['rocket'], weight: 52 },
      { item: ALL_GIFTS['champagne'], weight: 35 },
      { item: ALL_GIFTS['trophy'], weight: 6 },
      { item: ALL_GIFTS['ring'], weight: 4 },
      { item: ALL_GIFTS['diamond'], weight: 3 },
    ]
  },
  {
    id: 'case-nft-resale',
    name: 'Resale NFT Подарки',
    category: 'nft',
    price: 450,
    rubPrice: 675,
    badge: 'RESALE NFT',
    color: '#10b981',
    caseImage: 'assets/cases/case_nft.png',
    previewIcons: [
      ALL_GIFTS['snoop-dog'].image,
      ALL_GIFTS['lantern'].image,
      ALL_GIFTS['instant-ramen'].image,
      ALL_GIFTS['candy-cane'].image,
    ],
    drops: [
      { item: ALL_GIFTS['snake-2025'], weight: 32 },
      { item: ALL_GIFTS['lollipop'], weight: 26 },
      { item: ALL_GIFTS['candy-cane'], weight: 18 },
      { item: ALL_GIFTS['instant-ramen'], weight: 14 },
      { item: ALL_GIFTS['lantern'], weight: 5 },
      { item: ALL_GIFTS['snoop-dog'], weight: 3 },
      { item: ALL_GIFTS['clover-pin'], weight: 2 },
    ]
  },
  {
    id: 'case-snoop-special',
    name: 'Snoop Cigar & Jedi',
    category: 'nft',
    price: 790,
    rubPrice: 1185,
    badge: '1316 ⭐ SNOOP',
    color: '#ef4444',
    caseImage: 'assets/cases/case_redo.png',
    previewIcons: [
      ALL_GIFTS['snoop-cigar'].image,
      ALL_GIFTS['hockey-mask'].image,
      ALL_GIFTS['light-sword'].image,
      ALL_GIFTS['weed-bag'].image,
    ],
    drops: [
      { item: ALL_GIFTS['weed-bag'], weight: 40 },
      { item: ALL_GIFTS['money-bouquet'], weight: 30 },
      { item: ALL_GIFTS['light-sword'], weight: 16 },
      { item: ALL_GIFTS['hockey-mask'], weight: 8 },
      { item: ALL_GIFTS['snoop-dog'], weight: 4 },
      { item: ALL_GIFTS['snoop-cigar'], weight: 2 },
    ]
  },
  {
    id: 'case-resistance-dog',
    name: 'Пёс Сопротивления (Fragment)',
    category: 'resistance',
    price: 1690,
    rubPrice: 2535,
    badge: 'FRAGMENT OG',
    color: '#38bdf8',
    caseImage: 'assets/cases/case_resistance.png',
    previewIcons: [
      ALL_GIFTS['nft-doge'].image,
      ALL_GIFTS['nft-cap'].image,
      ALL_GIFTS['nft-plush-pepe'].image,
      ALL_GIFTS['nft-swiss-watch'].image,
    ],
    drops: [
      { item: ALL_GIFTS['nft-swiss-watch'], weight: 65 },
      { item: ALL_GIFTS['nft-heroic-helmet'], weight: 24 },
      { item: ALL_GIFTS['nft-cap'], weight: 6 },
      { item: ALL_GIFTS['nft-doge'], weight: 3.5 },
      { item: ALL_GIFTS['nft-heart-locket'], weight: 1.2 },
      { item: ALL_GIFTS['nft-plush-pepe'], weight: 0.3 },
    ]
  },
  {
    id: 'case-5050-bear-cake',
    name: '50/50: Мишка или Торт',
    category: 'fifty',
    price: 32,
    rubPrice: 48,
    badge: '50/50',
    color: '#f59e0b',
    caseImage: 'assets/cases/case_5050.png',
    previewIcons: [
      ALL_GIFTS['bear'].image,
      ALL_GIFTS['cake'].image,
    ],
    drops: [
      { item: ALL_GIFTS['bear'], weight: 70 },
      { item: ALL_GIFTS['cake'], weight: 30 },
    ]
  },
  {
    id: 'case-5050-rose-diamond',
    name: '50/50: Роза или Алмаз',
    category: 'fifty',
    price: 60,
    rubPrice: 90,
    badge: 'РИСК 50%',
    color: '#ec4899',
    caseImage: 'assets/cases/case_5050.png',
    previewIcons: [
      ALL_GIFTS['rose'].image,
      ALL_GIFTS['diamond'].image,
    ],
    drops: [
      { item: ALL_GIFTS['rose'], weight: 75 },
      { item: ALL_GIFTS['diamond'], weight: 25 },
    ]
  },
  {
    id: 'case-5050-bouquet-ring',
    name: '50/50: Букет или Кольцо',
    category: 'fifty',
    price: 75,
    rubPrice: 113,
    badge: '50/50 ДЖЕКПОТ',
    color: '#10b981',
    caseImage: 'assets/cases/case_5050.png',
    previewIcons: [
      ALL_GIFTS['bouquet'].image,
      ALL_GIFTS['ring'].image,
    ],
    drops: [
      { item: ALL_GIFTS['bouquet'], weight: 75 },
      { item: ALL_GIFTS['ring'], weight: 25 },
    ]
  },
  {
    id: 'case-5050-trophy',
    name: '50/50: Роза или Кубок',
    category: 'fifty',
    price: 60,
    rubPrice: 90,
    badge: '50/50 КУБОК',
    color: '#f59e0b',
    caseImage: 'assets/cases/case_5050.png',
    previewIcons: [
      ALL_GIFTS['rose'].image,
      ALL_GIFTS['trophy'].image,
    ],
    drops: [
      { item: ALL_GIFTS['rose'], weight: 75 },
      { item: ALL_GIFTS['trophy'], weight: 25 },
    ]
  },
  {
    id: 'case-lector-bs',
    name: 'Lector Black Spruit VIP',
    category: 'top',
    price: 2490,
    rubPrice: 3735,
    badge: 'МАСКОТ VIP',
    color: '#f59e0b',
    caseImage: 'assets/cases/case_lector_bs.png',
    previewIcons: [
      ALL_GIFTS['nft-doge'].image,
      ALL_GIFTS['nft-cap'].image,
      ALL_GIFTS['nft-plush-pepe'].image,
      ALL_GIFTS['stars-5000'].image,
    ],
    drops: [
      { item: ALL_GIFTS['snoop-cigar'], weight: 45 },
      { item: ALL_GIFTS['nft-swiss-watch'], weight: 30 },
      { item: ALL_GIFTS['nft-heroic-helmet'], weight: 14 },
      { item: ALL_GIFTS['stars-5000'], weight: 6 },
      { item: ALL_GIFTS['nft-cap'], weight: 3 },
      { item: ALL_GIFTS['nft-doge'], weight: 1.7 },
      { item: ALL_GIFTS['nft-plush-pepe'], weight: 0.3 },
    ]
  },
  {
    id: 'case-stars-rush',
    name: 'Звёздный Шторм',
    category: 'top',
    price: 350,
    rubPrice: 525,
    badge: 'ТОЛЬКО ЗВЁЗДЫ',
    color: '#eab308',
    caseImage: 'assets/cases/case_stars.png',
    previewIcons: [
      ALL_GIFTS['stars-5000'].image,
      ALL_GIFTS['stars-1000'].image,
      ALL_GIFTS['stars-500'].image,
    ],
    drops: [
      { item: ALL_GIFTS['stars-50'], weight: 40 },
      { item: ALL_GIFTS['stars-100'], weight: 30 },
      { item: ALL_GIFTS['stars-250'], weight: 18 },
      { item: ALL_GIFTS['stars-500'], weight: 8 },
      { item: ALL_GIFTS['stars-1000'], weight: 3.5 },
      { item: ALL_GIFTS['stars-5000'], weight: 0.5 },
    ]
  }
];

export const CATEGORIES = [
  { id: 'all', label: 'Все' },
  { id: 'daily', label: 'Подарок дня' },
  { id: 'budget', label: 'Не-NFT подарки' },
  { id: 'nft', label: 'Resale NFT' },
  { id: 'resistance', label: 'Fragment OG' },
  { id: 'fifty', label: '50/50' },
  { id: 'top', label: 'Lector BS' },
];
