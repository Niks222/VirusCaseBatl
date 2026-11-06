import React from 'react';
import { Box, Swords, Zap, Package, User } from 'lucide-react';
import { soundFx } from '../utils/audio';

export type TabType = 'cases' | 'battles' | 'upgrade' | 'inventory';

interface BottomNavProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  inventoryCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  inventoryCount,
}) => {
  const navItems = [
    { id: 'cases', label: 'Кейсы', icon: Box },
    { id: 'battles', label: 'Батлы', icon: Swords },
    { id: 'upgrade', label: 'Апгрейд', icon: Zap },
    { id: 'inventory', label: 'Инвентарь', icon: Package, badge: inventoryCount },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-[#0d0f1e]/95 backdrop-blur-lg border-t border-white/[0.08] px-3 py-2 pb-5 md:pb-2">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                soundFx.playClick();
                onSelectTab(item.id as TabType);
              }}
              className={`relative flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
                isActive
                  ? 'text-white'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 shadow-md shadow-purple-600/40 text-white'
                    : 'bg-transparent text-gray-400'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>

              <span
                className={`text-[10px] font-bold tracking-tight transition-colors ${
                  isActive ? 'text-white' : 'text-gray-400'
                }`}
              >
                {item.label}
              </span>

              {/* Inventory Badge */}
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute top-0 right-2 w-4 h-4 rounded-full bg-red-500 text-white font-extrabold text-[9px] flex items-center justify-center shadow">
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
