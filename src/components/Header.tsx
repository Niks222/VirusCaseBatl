import React, { useState, useEffect } from 'react';
import { Plus, Volume2, VolumeX, ShieldCheck, User } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface HeaderProps {
  balanceStars: number;
  balanceRub: number;
  currency: 'stars' | 'rub';
  setCurrency: (c: 'stars' | 'rub') => void;
  onOpenDeposit: () => void;
  onOpenProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  balanceStars,
  balanceRub,
  currency,
  setCurrency,
  onOpenDeposit,
  onOpenProfile,
}) => {
  const [muted, setMuted] = useState(false);
  const [tgUser, setTgUser] = useState<{ firstName: string; photoUrl?: string } | null>(() => {
    const cachedPhoto = localStorage.getItem('lector_user_avatar') || undefined;
    const cachedName = localStorage.getItem('lector_user_name') || 'Игрок';
    return { firstName: cachedName, photoUrl: cachedPhoto };
  });

  useEffect(() => {
    const BOT_TOKEN = '9179379427:AAFJVRpJx-nUg3mh-BtFjanMLWBymb8YXyc';
    const tg = window.Telegram?.WebApp;
    const u = tg?.initDataUnsafe?.user;

    const firstName = u?.first_name || localStorage.getItem('lector_user_name') || 'Игрок';
    if (u?.first_name) {
      localStorage.setItem('lector_user_name', u.first_name);
    }

    let photo = u?.photo_url || localStorage.getItem('lector_user_avatar') || '';
    if (photo) {
      setTgUser({ firstName, photoUrl: photo });
      localStorage.setItem('lector_user_avatar', photo);
    } else {
      setTgUser({ firstName });
    }

    const userId = u?.id ? String(u.id) : (localStorage.getItem('lector_user_id') || '8318347639');
    if (u?.id) {
      localStorage.setItem('lector_user_id', String(u.id));
    }

    if (!photo && userId) {
      fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getUserProfilePhotos?user_id=${userId}&limit=1`)
        .then((res) => res.json())
        .then((data) => {
          const photos = data?.result?.photos?.[0];
          const fileId = photos?.[photos.length - 1]?.file_id || photos?.[0]?.file_id;
          if (fileId) {
            return fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${fileId}`)
              .then((r) => r.json())
              .then((fileData) => {
                const filePath = fileData?.result?.file_path;
                if (filePath) {
                  const fullPhotoUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${filePath}`;
                  setTgUser({ firstName, photoUrl: fullPhotoUrl });
                  localStorage.setItem('lector_user_avatar', fullPhotoUrl);
                }
              });
          }
        })
        .catch(() => {});
    }
  }, []);

  const handleToggleSound = () => {
    const isMuted = soundFx.toggleMute();
    setMuted(isMuted);
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-[#070913]/90 backdrop-blur-md border-b border-white/[0.06] px-3.5 py-2.5">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
        <div 
          onClick={onOpenProfile}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="relative w-9 h-9 rounded-full overflow-hidden ring-1 ring-white/20 group-hover:ring-amber-400/60 transition-all bg-[#141829] flex items-center justify-center shadow-md">
            {tgUser?.photoUrl ? (
              <img 
                src={tgUser.photoUrl} 
                alt="User" 
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-5 h-5 text-white/90" />
            )}
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#070913]" />
          </div>

          <div className="hidden xs:block sm:block">
            <span className="font-bold text-xs text-white truncate max-w-[85px] leading-tight block">
              {tgUser?.firstName || 'Игрок'}
            </span>
            <div className="flex items-center gap-1 text-[10px] text-gray-400">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Профиль</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/5">
          <span className="font-gaming font-black text-xs tracking-wider bg-gradient-to-r from-white via-amber-200 to-amber-400 bg-clip-text text-transparent">
            LECTOR BS
          </span>
          <span className="text-[9px] font-black uppercase px-1 py-0.2 rounded bg-white/5 text-gray-300 border border-white/10">
            BATTLE
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div 
            onClick={() => setCurrency(currency === 'stars' ? 'rub' : 'stars')}
            title="Курс: 1 ⭐ = 1.5 ₽ (нажмите для переключения)"
            className="flex items-center gap-1.5 bg-[#141829] hover:bg-[#1b2038] border border-white/10 rounded-full py-1.5 px-3 cursor-pointer transition-colors"
          >
            {currency === 'stars' ? (
              <>
                <img src="assets/gifts/star.svg" alt="Stars" className="w-4 h-4 object-contain" />
                <span className="font-extrabold text-xs sm:text-sm text-amber-200 font-gaming">
                  {balanceStars.toLocaleString()}
                </span>
              </>
            ) : (
              <>
                <span className="text-blue-400 font-bold text-xs">₽</span>
                <span className="font-extrabold text-xs sm:text-sm text-blue-200 font-gaming">
                  {balanceRub.toLocaleString()}
                </span>
              </>
            )}
          </div>

          <button
            onClick={() => {
              soundFx.playClick();
              onOpenDeposit();
            }}
            className="flex items-center gap-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:opacity-90 active:scale-95 text-black font-extrabold text-xs py-1.5 px-3 rounded-full shadow-lg shadow-amber-500/20 border border-amber-300 transition-all"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span className="hidden sm:inline">Пополнить</span>
          </button>

          <button
            onClick={handleToggleSound}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#141829] hover:bg-[#1b2038] border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
          >
            {muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </header>
  );
};
