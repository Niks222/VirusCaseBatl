import { Bot, InlineKeyboard, Keyboard, InputFile } from 'grammy';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import {
  isAdmin,
  addAdmin,
  getAdmins,
  getPendingWithdrawals,
  getWithdrawalById,
  updateWithdrawalStatus,
  updateBalance,
  getStats,
  getOrCreateUser
} from './db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BOT_TOKEN = process.env.BOT_TOKEN || '9179379427:AAFJVRpJx-nUg3mh-BtFjanMLWBymb8YXyc';
const WEBAPP_URL = process.env.WEBAPP_URL || 'https://niks222.github.io/VirusCaseBatl/';
const envAdminIds = (process.env.ADMIN_IDS || '').split(',').map((s) => s.trim()).filter(Boolean);

export const bot = new Bot(BOT_TOKEN);

export function checkIsAdmin(userId) {
  if (!userId) return false;
  const uid = String(userId);
  return envAdminIds.includes(uid) || isAdmin(uid);
}

export function getAllAdminIds() {
  const dbAdmins = getAdmins().map((a) => String(a.id));
  return Array.from(new Set([...envAdminIds, ...dbAdmins]));
}

export async function notifyAdminsAboutWithdrawal(withdrawal) {
  const adminIds = getAllAdminIds();
  const text =
`🚨 <b>НОВАЯ ЗАЯВКА НА ВЫВОД ПОДАРКА!</b>

🆔 <b>Заявка:</b> <code>#${withdrawal.id}</code>
👤 <b>Игрок:</b> @${withdrawal.username || 'не указан'} (ID: <code>${withdrawal.user_id}</code>)
🎯 <b>Получатель в TG:</b> @${String(withdrawal.target_username).replace('@', '')}
🎁 <b>Подарок:</b> <b>${withdrawal.item_name}</b>
⭐ <b>Стоимость:</b> <b>${withdrawal.item_price} ⭐</b>
💰 <b>Комиссия:</b> <b>${withdrawal.fee || 25} ⭐</b> (Оплачена)
📅 <b>Время:</b> ${new Date().toLocaleString('ru-RU')}`;

  const keyboard = new InlineKeyboard()
    .text(`✅ Выполнено #${withdrawal.id}`, `approve_w_${withdrawal.id}`)
    .text(`❌ Отклонить`, `reject_w_${withdrawal.id}`);

  for (const adminId of adminIds) {
    try {
      await bot.api.sendMessage(adminId, text, {
        parse_mode: 'HTML',
        reply_markup: keyboard,
      });
    } catch {
    }
  }
}

bot.command('start', async (ctx) => {
  const firstName = ctx.from?.first_name || 'Игрок';
  const userId = ctx.from?.id;
  const isAdm = checkIsAdmin(userId);

  getOrCreateUser(String(userId), {
    username: ctx.from?.username || '',
    first_name: firstName,
  });

  const keyboard = new InlineKeyboard()
    .webApp('ИГРАТЬ В КЕЙСЫ (Mini App)', WEBAPP_URL)
    .row()
    .text(' Кейс Батлы', 'btn_battles')
    .webApp(' Мой Инвентарь', WEBAPP_URL)
    .row()
    .text(' Пополнить Stars', 'btn_deposit')
    .text(' Мои Заявки', 'btn_my_withdrawals')
    .row()
    .text('Промокод (+150 )', 'btn_bonus')
    .text(' Поддержка', 'btn_support');

  if (isAdm) {
    keyboard.row().text('🛡 Панель Администратора', 'btn_admin_panel');
  }

  const replyKeyboard = new Keyboard()
    .webApp('⚡️ ИГРАТЬ В КЕЙСЫ (Mini App)', WEBAPP_URL)
    .row()
    .text('⚔️ Кейс Батлы')
    .webApp('🎁 Мой Инвентарь', WEBAPP_URL)
    .row()
    .text('💎 Пополнить Stars')
    .text('📦 Мои Заявки')
    .row()
    .text('👑 Промокод (+150 ⭐)')
    .text('💬 Поддержка');

  if (isAdm) {
    replyKeyboard.row().text('🛡 Панель Администратора');
  }
  replyKeyboard.resized().persistent();

  const caption =
`👑 <b>LECTOR CASES & BATTLES</b>
<i>Официальный дроп-сервис Black Spruit</i>

Салют, <b>${firstName}</b>! На связи <b>LECTOR</b>.
<i>«Прошарили за эту тему?»</i>

🎁 <b>Что тебя ждёт:</b>
• Официальные Telegram подарки (мишки, розы, духи, часы, кольца)
• Легендарные NFT с Fragment (Пёс Сопротивления, Кепка Дурова, Маска Джейсона)
• Дропы Telegram Stars (до 5000 ⭐)
• Кейс Батлы 1 на 1 против других игроков
• Вывод подарков прямо в твой Telegram профиль!

⭐️ Твой начальный баланс: <b>0 ⭐</b>
Используй промокод <code>LECTOR</code> в игре, чтобы получить стартовый бонус!

Жми кнопку ниже, чтобы войти в игру 👇`;

  const photoPath = path.join(__dirname, '../assets/lector_portrait.jpg');

  try {
    if (fs.existsSync(photoPath)) {
      await ctx.replyWithPhoto(new InputFile(photoPath), {
        caption,
        parse_mode: 'HTML',
        reply_markup: keyboard,
      });
    } else {
      await ctx.reply(caption, {
        parse_mode: 'HTML',
        reply_markup: keyboard,
      });
    }
  } catch {
    await ctx.reply(caption, {
      parse_mode: 'HTML',
      reply_markup: keyboard,
    });
  }

  try {
    await ctx.reply('Используйте меню внизу для быстрого перехода:', {
      reply_markup: replyKeyboard,
    });
  } catch {
  }
});

bot.command('admin', async (ctx) => {
  const userId = ctx.from?.id;
  if (!checkIsAdmin(userId)) {
    return ctx.reply('⛔️ У вас нет прав доступа к админ-панели.');
  }

  const stats = getStats();
  const text =
`🛡 <b>ПАНЕЛЬ АДМИНИСТРАТОРА LECTOR CASES</b>

📊 <b>Статистика сервиса:</b>
• Пользователей в БД: <b>${stats.totalUsers}</b>
• Заявок на вывод ожидают: <b>${stats.pendingWithdrawals}</b>
• Всего открыто кейсов: <b>${stats.totalOpened}</b>
• Выиграно в кейсах: <b>${Math.round(stats.totalWonStars)} ⭐</b>

Команда для добавления модератора:
<code>/addadmin &lt;telegram_id&gt;</code>`;

  const keyboard = new InlineKeyboard()
    .text(`📋 Заявки на вывод (${stats.pendingWithdrawals})`, 'admin_view_pending')
    .row()
    .text('🔄 Обновить', 'btn_admin_panel');

  await ctx.reply(text, { parse_mode: 'HTML', reply_markup: keyboard });
});

bot.command('addadmin', async (ctx) => {
  const userId = ctx.from?.id;
  if (!checkIsAdmin(userId)) {
    return ctx.reply('⛔️ Только действующий администратор может добавлять новых администраторов.');
  }

  const targetId = ctx.match?.trim();
  if (!targetId || !/^\d+$/.test(targetId)) {
    return ctx.reply('Укажите числовой Telegram ID пользователя: <code>/addadmin 123456789</code>', { parse_mode: 'HTML' });
  }

  addAdmin(targetId, '');
  await ctx.reply(`✅ Пользователь с ID <code>${targetId}</code> успешно добавлен в администраторы!`, { parse_mode: 'HTML' });
});

bot.callbackQuery('btn_admin_panel', async (ctx) => {
  await ctx.answerCallbackQuery();
  const userId = ctx.from?.id;
  if (!checkIsAdmin(userId)) {
    return ctx.reply('⛔️ Нет доступа к админ панели.');
  }

  const stats = getStats();
  const text =
`🛡 <b>ПАНЕЛЬ АДМИНИСТРАТОРА LECTOR CASES</b>

📊 <b>Статистика сервиса:</b>
• Пользователей в БД: <b>${stats.totalUsers}</b>
• Заявок на вывод ожидают: <b>${stats.pendingWithdrawals}</b>
• Всего открыто кейсов: <b>${stats.totalOpened}</b>
• Выиграно в кейсах: <b>${Math.round(stats.totalWonStars)} ⭐</b>`;

  const keyboard = new InlineKeyboard()
    .text(`📋 Заявки на вывод (${stats.pendingWithdrawals})`, 'admin_view_pending')
    .row()
    .text('🔄 Обновить', 'btn_admin_panel');

  try {
    await ctx.editMessageText(text, { parse_mode: 'HTML', reply_markup: keyboard });
  } catch {
    await ctx.reply(text, { parse_mode: 'HTML', reply_markup: keyboard });
  }
});

bot.callbackQuery('admin_view_pending', async (ctx) => {
  await ctx.answerCallbackQuery();
  const userId = ctx.from?.id;
  if (!checkIsAdmin(userId)) return;

  const pendings = getPendingWithdrawals();
  if (pendings.length === 0) {
    return ctx.reply('✅ Нет активных заявок на вывод! Все заказы обработаны.');
  }

  for (const item of pendings.slice(0, 10)) {
    const text =
`📦 <b>ЗАЯВКА НА ВЫВОД #${item.id}</b>

👤 <b>Игрок:</b> @${item.username || 'нет'} (ID: <code>${item.user_id}</code>)
🎯 <b>Получатель:</b> @${String(item.target_username).replace('@', '')}
🎁 <b>Подарок:</b> <b>${item.item_name}</b>
⭐ <b>Стоимость:</b> <b>${item.item_price} ⭐</b>
💰 <b>Комиссия:</b> <b>${item.fee} ⭐</b> (Списана)
📅 <b>Дата:</b> ${item.created_at || 'Недавно'}`;

    const keyboard = new InlineKeyboard()
      .text(`✅ Выполнить #${item.id}`, `approve_w_${item.id}`)
      .text(`❌ Отклонить`, `reject_w_${item.id}`);

    await ctx.reply(text, { parse_mode: 'HTML', reply_markup: keyboard });
  }
});

bot.callbackQuery(/^approve_w_(.+)$/, async (ctx) => {
  await ctx.answerCallbackQuery();
  const userId = ctx.from?.id;
  if (!checkIsAdmin(userId)) return;

  const withdrawId = ctx.match[1];
  const item = getWithdrawalById(withdrawId);
  if (!item) {
    return ctx.reply(`Заявка #${withdrawId} не найдена.`);
  }

  updateWithdrawalStatus(withdrawId, 'completed');

  try {
    await ctx.editMessageText(
      ctx.callbackQuery.message?.text + `\n\n✅ <b>ВЫПОЛНЕНО:</b> Подарок успешно передан!`,
      { parse_mode: 'HTML' }
    );
  } catch {
  }

  if (item.user_id && /^\d+$/.test(item.user_id)) {
    try {
      await bot.api.sendMessage(
        item.user_id,
        `🎉 <b>Ваш подарок отправлен!</b>\n\n🎁 <b>${item.item_name}</b> был успешно передан на аккаунт @${String(item.target_username).replace('@', '')}!\nСпасибо за игру в Lector Cases.`,
        { parse_mode: 'HTML' }
      );
    } catch {
    }
  }
});

bot.callbackQuery(/^reject_w_(.+)$/, async (ctx) => {
  await ctx.answerCallbackQuery();
  const userId = ctx.from?.id;
  if (!checkIsAdmin(userId)) return;

  const withdrawId = ctx.match[1];
  const item = getWithdrawalById(withdrawId);
  if (!item) {
    return ctx.reply(`Заявка #${withdrawId} не найдена.`);
  }

  updateWithdrawalStatus(withdrawId, 'rejected');

  const fee = item.fee || 25;
  if (item.user_id) {
    updateBalance(item.user_id, fee, 'refund', `Возврат комиссии за вывод #${withdrawId}`);
  }

  try {
    await ctx.editMessageText(
      ctx.callbackQuery.message?.text + `\n\n❌ <b>ОТКЛОНЕНО:</b> Комиссия ${fee} ⭐ возвращена игроку.`,
      { parse_mode: 'HTML' }
    );
  } catch {
  }

  if (item.user_id && /^\d+$/.test(item.user_id)) {
    try {
      await bot.api.sendMessage(
        item.user_id,
        `⚠️ <b>Заявка на вывод подарка #${withdrawId} отклонена.</b>\n\nПодарок: <b>${item.item_name}</b>.\nКомиссия <b>${fee} ⭐</b> возвращена на ваш баланс.`,
        { parse_mode: 'HTML' }
      );
    } catch {
    }
  }
});

bot.callbackQuery('btn_bonus', async (ctx) => {
  await ctx.answerCallbackQuery();
  const keyboard = new InlineKeyboard().webApp('🚀 Активировать в игре', WEBAPP_URL);
  await ctx.reply(
    `🎁 <b>СЕКРЕТНЫЙ ПРОМОКОД ЛЕКТОРА</b>\n\nВведи в игре промокод: <code>LECTOR</code>\nИ получи мгновенно <b>+150 ⭐</b> на свой игровой баланс!`,
    { parse_mode: 'HTML', reply_markup: keyboard }
  );
});

bot.callbackQuery('btn_battles', async (ctx) => {
  await ctx.answerCallbackQuery();
  const keyboard = new InlineKeyboard().webApp('⚔️ Войти в Арену Батлов', WEBAPP_URL);
  await ctx.reply(
    `⚔️ <b>РЕЖИМ КЕЙС БАТЛОВ</b>\n\nВыбирай раунды и кейсы. Открывай синхронно с соперником — победитель с наибольшей суммой забирает ВСЕ выпавшие подарки себе!`,
    { parse_mode: 'HTML', reply_markup: keyboard }
  );
});

bot.callbackQuery('btn_deposit', async (ctx) => {
  await ctx.answerCallbackQuery();
  const keyboard = new InlineKeyboard().webApp('💎 Открыть Кассу (Mini App)', WEBAPP_URL);
  await ctx.reply(
    `💎 <b>ПОПОЛНЕНИЕ БАЛАНСА STARS</b>\n\nКурс: <b>1 ⭐ = 1.5 ₽</b>\nПополняйте баланс через Telegram Stars или Карты прямо внутри Mini App!`,
    { parse_mode: 'HTML', reply_markup: keyboard }
  );
});

bot.callbackQuery('btn_my_withdrawals', async (ctx) => {
  await ctx.answerCallbackQuery();
  const userId = String(ctx.from?.id);
  const pendings = getPendingWithdrawals().filter((w) => String(w.user_id) === userId);

  if (pendings.length === 0) {
    const keyboard = new InlineKeyboard().webApp('🎁 Открыть Инвентарь', WEBAPP_URL);
    return ctx.reply('У вас пока нет активных заявок на вывод. Выводите подарки из Инвентаря (от 361 ⭐)!', { reply_markup: keyboard });
  }

  let text = `📦 <b>ВАШИ АКТИВНЫЕ ЗАЯВКИ НА ВЫВОД:</b>\n\n`;
  for (const p of pendings) {
    text += `• #${p.id} — <b>${p.item_name}</b> (${p.item_price} ⭐) для @${String(p.target_username).replace('@', '')} [В обработке ⏳]\n`;
  }
  await ctx.reply(text, { parse_mode: 'HTML' });
});

bot.callbackQuery('btn_support', async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.reply(
    `💬 <b>СЛУЖБА ПОДДЕРЖКИ LECTOR CASES</b>\n\nЕсли у вас возникли вопросы по пополнению, выводу подарков или батлам, пишите: @Lector_BS_Support`,
    { parse_mode: 'HTML' }
  );
});

bot.command('help', async (ctx) => {
  await ctx.reply(
    `ℹ️ <b>LECTOR CASES FAQ:</b>\n\n` +
    `1. <b>Как играть?</b> Нажмите кнопку "Играть в кейсы".\n` +
    `2. <b>Как вывести подарок?</b> В инвентаре нажмите "Вывод" (подарки дороже 360 ⭐, комиссия доставки 25 ⭐) и укажите @username.\n` +
    `3. <b>Какая валюта?</b> Telegram Stars (⭐) и Рубли (₽) по курсу 1 ⭐ = 1.5 ₽.\n` +
    `4. <b>Поддержка:</b> @Lector_BS_Support`,
    { parse_mode: 'HTML' }
  );
});

bot.hears('⚔️ Кейс Батлы', async (ctx) => {
  const keyboard = new InlineKeyboard().webApp('⚔️ Войти в Арену Батлов', WEBAPP_URL);
  await ctx.reply('⚔️ <b>РЕЖИМ КЕЙС БАТЛОВ</b>\n\nСражайся 1 на 1 против других игроков и забирай все подарки!', { parse_mode: 'HTML', reply_markup: keyboard });
});

bot.hears('💎 Пополнить Stars', async (ctx) => {
  const keyboard = new InlineKeyboard().webApp('💎 Открыть Кассу (Mini App)', WEBAPP_URL);
  await ctx.reply('💎 <b>ПОПОЛНЕНИЕ БАЛАНСА STARS</b>\n\nКурс: <b>1 ⭐ = 1.5 ₽</b>\nПополняйте баланс прямо в приложении!', { parse_mode: 'HTML', reply_markup: keyboard });
});

bot.hears('📦 Мои Заявки', async (ctx) => {
  const userId = String(ctx.from?.id);
  const pendings = getPendingWithdrawals().filter((w) => String(w.user_id) === userId);
  if (pendings.length === 0) {
    const keyboard = new InlineKeyboard().webApp('🎁 Открыть Инвентарь', WEBAPP_URL);
    return ctx.reply('У вас пока нет активных заявок на вывод. Выводите подарки из Инвентаря (от 361 ⭐)!', { reply_markup: keyboard });
  }
  let text = '📦 <b>ВАШИ АКТИВНЫЕ ЗАЯВКИ НА ВЫВОД:</b>\n\n';
  for (const p of pendings) {
    text += `• #${p.id} — <b>${p.item_name}</b> (${p.item_price} ⭐) [В обработке ⏳]\n`;
  }
  await ctx.reply(text, { parse_mode: 'HTML' });
});

bot.hears('👑 Промокод (+150 ⭐)', async (ctx) => {
  const keyboard = new InlineKeyboard().webApp('🚀 Активировать в игре', WEBAPP_URL);
  await ctx.reply('🎁 <b>ПРОМОКОД ЛЕКТОРА</b>\n\nВведи в игре: <code>LECTOR</code>\nИ получи мгновенно <b>+150 ⭐</b> на баланс!', { parse_mode: 'HTML', reply_markup: keyboard });
});

bot.hears('💬 Поддержка', async (ctx) => {
  await ctx.reply('💬 <b>СЛУЖБА ПОДДЕРЖКИ LECTOR CASES</b>\n\nПо всем вопросам пишите: @Lector_BS_Support', { parse_mode: 'HTML' });
});

bot.hears('🛡 Панель Администратора', async (ctx) => {
  const userId = ctx.from?.id;
  if (!checkIsAdmin(userId)) {
    return ctx.reply('⛔️ У вас нет прав доступа к админ-панели.');
  }
  const stats = getStats();
  const text = `🛡 <b>ПАНЕЛЬ АДМИНИСТРАТОРА LECTOR CASES</b>\n\n📊 <b>Статистика:</b>\n• Пользователей: <b>${stats.totalUsers}</b>\n• Заявок на вывод: <b>${stats.pendingWithdrawals}</b>\n• Открыто кейсов: <b>${stats.totalOpened}</b>\n• Выигрышей: <b>${Math.round(stats.totalWonStars)} ⭐</b>`;
  const keyboard = new InlineKeyboard()
    .text(`📋 Заявки на вывод (${stats.pendingWithdrawals})`, 'admin_view_pending')
    .row()
    .text('🔄 Обновить', 'btn_admin_panel');
  await ctx.reply(text, { parse_mode: 'HTML', reply_markup: keyboard });
});

bot.on('pre_checkout_query', async (ctx) => {
  await ctx.answerPreCheckoutQuery(true);
});

bot.on('message:successful_payment', async (ctx) => {
  const payment = ctx.message.successful_payment;
  const starsAmount = payment.total_amount;
  const userId = String(ctx.from?.id);
  updateBalance(userId, starsAmount, 'deposit_stars', 'Пополнение через Telegram Stars');
  await ctx.reply(
    `🎉 <b>Оплата прошла успешно!</b>\nНачислено: <b>${starsAmount} ⭐</b>.\nВозвращайтесь в игру и открывайте кейсы!`,
    { parse_mode: 'HTML' }
  );
});

if (BOT_TOKEN && BOT_TOKEN !== 'YOUR_TELEGRAM_BOT_TOKEN_HERE') {
  bot.start({
    onStart: (botInfo) => {
      console.log(`🤖 Telegram Bot @${botInfo.username} started successfully!`);
    },
  });
} else {
  console.log('⚠️ BOT_TOKEN is not set in .env.');
}