import React, { useState, useEffect } from 'react';
import { CaseItem, GiftItem } from '../types';
import { ALL_CASES } from '../data/cases';
import { ALL_GIFTS } from '../data/gifts';
import { Swords, Trophy, Play, User, Bot, Sparkles, RefreshCw, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundFx } from '../utils/audio';

interface BattleArenaProps {
  currency: 'stars' | 'rub';
  userBalance: number;
  onWinBattle: (wonItems: GiftItem[], totalValue: number) => void;
  onDeductBalance: (amount: number) => void;
}

export const BattleArena: React.FC<BattleArenaProps> = ({
  currency,
  userBalance,
  onWinBattle,
  onDeductBalance,
}) => {
  const [selectedCase, setSelectedCase] = useState<CaseItem>(ALL_CASES[1]); // default 'Мелочь' or 'Пёс Сопротивления'
  const [roundsCount, setRoundsCount] = useState<number>(3);
  const [battleState, setBattleState] = useState<'lobby' | 'fighting' | 'finished'>('lobby');
  const [currentRound, setCurrentRound] = useState<number>(0);

  const [playerDrops, setPlayerDrops] = useState<GiftItem[]>([]);
  const [botDrops, setBotDrops] = useState<GiftItem[]>([]);
  const [currentSpinning, setCurrentSpinning] = useState(false);

  // Helper to pick a drop based on case weights
  const getRandomDrop = (c: CaseItem): GiftItem => {
    const totalWeight = c.drops.reduce((sum, d) => sum + d.weight, 0);
    let rand = Math.random() * totalWeight;
    for (const d of c.drops) {
      if (rand < d.weight) return d.item;
      rand -= d.weight;
    }
    return c.drops[0].item;
  };

  const totalCost = (currency === 'stars' ? selectedCase.price : selectedCase.rubPrice) * roundsCount;

  const playerTotalValue = playerDrops.reduce((acc, item) => acc + (currency === 'stars' ? item.price : item.rubPrice), 0);
  const botTotalValue = botDrops.reduce((acc, item) => acc + (currency === 'stars' ? item.price : item.rubPrice), 0);

  const startBattle = () => {
    if (userBalance < totalCost) {
      alert('Недостаточно средств для участия в батле! Пополните баланс.');
      return;
    }

    onDeductBalance(totalCost);
    setPlayerDrops([]);
    setBotDrops([]);
    setCurrentRound(1);
    setBattleState('fighting');
    executeBattleRound(1, [], []);
  };

  const executeBattleRound = (roundNum: number, currentP: GiftItem[], currentB: GiftItem[]) => {
    setCurrentSpinning(true);
    soundFx.playTick();

    setTimeout(() => {
      soundFx.playTick(1.2);
    }, 400);

    setTimeout(() => {
      soundFx.playTick(1.5);
    }, 800);

    setTimeout(() => {
      const pDrop = getRandomDrop(selectedCase);
      const bDrop = getRandomDrop(selectedCase);

      const nextP = [...currentP, pDrop];
      const nextB = [...currentB, bDrop];

      setPlayerDrops(nextP);
      setBotDrops(nextB);
      setCurrentSpinning(false);
      soundFx.playTick(2);

      if (roundNum < roundsCount) {
        setTimeout(() => {
          setCurrentRound(roundNum + 1);
          executeBattleRound(roundNum + 1, nextP, nextB);
        }, 1200);
      } else {
        // Finished
        setTimeout(() => {
          setBattleState('finished');
          const finalPVal = nextP.reduce((acc, item) => acc + (currency === 'stars' ? item.price : item.rubPrice), 0);
          const finalBVal = nextB.reduce((acc, item) => acc + (currency === 'stars' ? item.price : item.rubPrice), 0);

          if (finalPVal >= finalBVal) {
            // Player won all drops!
            soundFx.playWin('legendary');
            confetti({
              particleCount: 100,
              spread: 90,
              origin: { y: 0.5 },
            });
            onWinBattle([...nextP, ...nextB], finalPVal + finalBVal);
          } else {
            // Lost
            soundFx.playTick(0.8);
          }
        }, 800);
      }
    }, 1300);
  };

  const resetBattle = () => {
    setBattleState('lobby');
    setPlayerDrops([]);
    setBotDrops([]);
    setCurrentRound(0);
  };

  const winner =
    playerTotalValue > botTotalValue
      ? 'player'
      : botTotalValue > playerTotalValue
      ? 'bot'
      : 'draw';

  return (
    <div className="space-y-4 my-2">
      {/* Title & Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-950/40 via-[#181a2e] to-purple-950/40 border border-red-500/30 p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-red-400 font-extrabold text-xs uppercase tracking-wider mb-1">
              <Swords className="w-4 h-4 text-red-400" />
              <span>PvP РЕЖИМ: ПОБЕДИТЕЛЬ ЗАБИРАЕТ ВСЁ</span>
            </div>
            <h2 className="font-gaming font-extrabold text-xl text-white">
              КЕЙС БАТЛЫ
            </h2>
            <p className="text-xs text-gray-300 mt-0.5">
              Сразись 1 на 1 против LECTOR BOT или игроков. Чей дроп дороже — тот забирает общий банк!
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-2xl">
            ⚔️
          </div>
        </div>
      </div>

      {battleState === 'lobby' ? (
        <div className="space-y-4 bg-[#131627] border border-white/10 rounded-2xl p-4">
          <h3 className="font-gaming font-bold text-sm text-white">
            1. Выберите кейс для батла:
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {ALL_CASES.filter((c) => !c.isDaily).map((c) => (
              <div
                key={c.id}
                onClick={() => {
                  soundFx.playClick();
                  setSelectedCase(c);
                }}
                className={`cursor-pointer p-3 rounded-xl border transition-all ${
                  selectedCase.id === c.id
                    ? 'border-purple-500 bg-purple-950/30 shadow-lg shadow-purple-600/20'
                    : 'border-white/[0.06] bg-[#171a2e] hover:border-white/20'
                }`}
              >
                <div className="text-2xl text-center mb-1">{c.previewIcons[0]}</div>
                <div className="font-bold text-xs text-center text-white truncate">{c.name}</div>
                <div className="text-[11px] text-center text-amber-300 font-semibold">
                  {currency === 'stars' ? `${c.price} ⭐` : `${c.rubPrice} ₽`}
                </div>
              </div>
            ))}
          </div>

          <h3 className="font-gaming font-bold text-sm text-white pt-2">
            2. Количество раундов:
          </h3>
          <div className="flex gap-2">
            {[1, 2, 3, 5].map((rounds) => (
              <button
                key={rounds}
                onClick={() => {
                  soundFx.playClick();
                  setRoundsCount(rounds);
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                  roundsCount === rounds
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                    : 'bg-[#1a1e35] text-gray-400 hover:text-white border border-white/[0.06]'
                }`}
              >
                {rounds} {rounds === 1 ? 'раунд' : rounds < 5 ? 'раунда' : 'раундов'}
              </button>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-[#181d33] border border-white/10 flex items-center justify-between">
            <span className="text-xs text-gray-300">Стоимость входа в батл:</span>
            <span className="font-gaming font-extrabold text-base text-amber-300">
              {totalCost} {currency === 'stars' ? '⭐' : '₽'}
            </span>
          </div>

          <button
            onClick={startBattle}
            className="w-full py-3.5 rounded-xl font-gaming font-extrabold text-sm uppercase tracking-wider text-white bg-gradient-to-r from-red-600 via-purple-600 to-indigo-600 hover:opacity-95 active:scale-98 shadow-xl shadow-purple-600/30 border border-purple-400/40 flex items-center justify-center gap-2"
          >
            <Swords className="w-4 h-4" />
            <span>Начать Батл против Lector Bot</span>
          </button>
        </div>
      ) : (
        /* Battle Live Arena */
        <div className="space-y-4 bg-[#121526] border border-white/10 rounded-2xl p-4">
          {/* Round Indicator */}
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <span className="font-gaming font-extrabold text-sm text-white">
                Раунд {currentRound} / {roundsCount}
              </span>
              {currentSpinning && (
                <span className="text-xs text-purple-300 animate-pulse font-medium">
                  Крутим дропы...
                </span>
              )}
            </div>
            <span className="text-xs font-bold text-gray-400">
              Кейс: {selectedCase.name}
            </span>
          </div>

          {/* Side by Side Combatants */}
          <div className="grid grid-cols-2 gap-3 relative">
            {/* Center VS Badge */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-red-600 border-2 border-white/40 flex items-center justify-center font-gaming font-black text-xs text-white shadow-xl">
              VS
            </div>

            {/* Left: Player */}
            <div className="bg-[#171b30] border border-blue-500/30 rounded-xl p-3 flex flex-col items-center">
              <div className="flex items-center gap-2 w-full border-b border-white/10 pb-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-300">
                  <User className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-bold text-white block truncate">ВЫ (Игрок)</span>
                  <span className="text-[11px] text-amber-300 font-extrabold font-gaming">
                    {playerTotalValue} {currency === 'stars' ? '⭐' : '₽'}
                  </span>
                </div>
              </div>

              {/* Player Drops history */}
              <div className="w-full space-y-1.5 min-h-[140px] flex flex-col justify-center">
                {playerDrops.map((drop, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2 rounded-lg bg-[#202542] border border-blue-400/20 animate-fadeIn"
                  >
                    <span className="text-xl">{drop.icon}</span>
                    <span className="text-xs font-bold text-white truncate max-w-[70px]">
                      {drop.name}
                    </span>
                    <span className="text-[10px] text-amber-300 font-bold">
                      +{currency === 'stars' ? drop.price : drop.rubPrice}
                    </span>
                  </div>
                ))}
                {currentSpinning && (
                  <div className="p-3 text-center text-2xl animate-spin-slow">
                    🎲
                  </div>
                )}
              </div>
            </div>

            {/* Right: Opponent (Lector Bot) */}
            <div className="bg-[#171b30] border border-red-500/30 rounded-xl p-3 flex flex-col items-center">
              <div className="flex items-center gap-2 w-full border-b border-white/10 pb-2 mb-2">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-purple-400">
                  <img
                    src="assets/lector_portrait.jpg"
                    alt="Lector Bot"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-bold text-white block truncate">Lector BS (Bot)</span>
                  <span className="text-[11px] text-amber-300 font-extrabold font-gaming">
                    {botTotalValue} {currency === 'stars' ? '⭐' : '₽'}
                  </span>
                </div>
              </div>

              {/* Bot Drops history */}
              <div className="w-full space-y-1.5 min-h-[140px] flex flex-col justify-center">
                {botDrops.map((drop, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2 rounded-lg bg-[#202542] border border-red-400/20 animate-fadeIn"
                  >
                    <span className="text-xl">{drop.icon}</span>
                    <span className="text-xs font-bold text-white truncate max-w-[70px]">
                      {drop.name}
                    </span>
                    <span className="text-[10px] text-amber-300 font-bold">
                      +{currency === 'stars' ? drop.price : drop.rubPrice}
                    </span>
                  </div>
                ))}
                {currentSpinning && (
                  <div className="p-3 text-center text-2xl animate-spin-slow">
                    🎲
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Finish Screen / Result Banner */}
          {battleState === 'finished' && (
            <div className="p-4 rounded-xl bg-gradient-to-b from-[#1b203a] to-[#121528] border border-white/15 text-center animate-fadeIn space-y-3">
              {winner === 'player' ? (
                <>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-extrabold uppercase">
                    <Trophy className="w-4 h-4 text-amber-300" />
                    <span>ПОБЕДА В БАТЛЕ!</span>
                  </div>
                  <h3 className="font-gaming font-extrabold text-xl text-white">
                    ВЫ ЗАБРАЛИ ВЕСЬ КУШ!
                  </h3>
                  <p className="text-xs text-gray-300">
                    Все {playerDrops.length + botDrops.length} предметов отправлены в ваш инвентарь (стоимость: +{playerTotalValue + botTotalValue} {currency === 'stars' ? '⭐' : '₽'})
                  </p>
                </>
              ) : (
                <>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-extrabold uppercase">
                    <span>ПОРАЖЕНИЕ</span>
                  </div>
                  <h3 className="font-gaming font-extrabold text-xl text-white">
                    LECTOR BOT ВЫИГРАЛ ЭТОТ РАУНД
                  </h3>
                  <p className="text-xs text-gray-300">
                    В этот раз удача была на стороне бота. Попробуйте еще раз!
                  </p>
                </>
              )}

              <button
                onClick={resetBattle}
                className="w-full py-3 rounded-xl font-gaming font-extrabold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 transition-all flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Новый Батл</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
