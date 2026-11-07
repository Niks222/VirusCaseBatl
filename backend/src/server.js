import express from 'express';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  getOrCreateUser,
  updateBalance,
  getUserInventory,
  addToInventory,
  removeFromInventory,
  recordDrop,
  createWithdrawal,
  getWithdrawalById
} from './db.js';
import { notifyAdminsAboutWithdrawal } from './bot.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const frontendDist = path.join(__dirname, '../../frontend/dist');
app.use(express.static(frontendDist));

const activeBattles = new Map();

export function broadcastLiveDrop(dropData) {
  const payload = JSON.stringify({ type: 'LIVE_DROP', data: dropData });
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', mascot: 'Lector Black Spruit', time: new Date() });
});

app.post('/api/auth', (req, res) => {
  const { user } = req.body;
  const userId = user?.id ? String(user.id) : 'demo_user';
  const dbUser = getOrCreateUser(userId, user || {});
  const inventory = getUserInventory(userId);

  res.json({
    success: true,
    user: {
      id: dbUser.id,
      name: dbUser.first_name,
      username: dbUser.username,
      balanceStars: dbUser.balance_stars,
      balanceRub: dbUser.balance_rub,
      totalOpened: dbUser.total_opened,
      totalWon: dbUser.total_won_stars,
      inventory,
    }
  });
});

app.post('/api/balance/add', (req, res) => {
  const { userId, amountStars, type, description } = req.body;
  const targetId = userId ? String(userId) : 'demo_user';
  const newBalance = updateBalance(targetId, Number(amountStars) || 0, type || 'deposit', description || '');
  res.json({ success: true, ...newBalance });
});

app.post('/api/case/win', (req, res) => {
  const { userId, caseId, item, action, costStars } = req.body;
  const targetId = userId ? String(userId) : 'demo_user';

  if (costStars) {
    updateBalance(targetId, -Number(costStars), 'case_open', `Кейс: ${caseId}`);
  }

  recordDrop(targetId, caseId, item);

  if (action === 'sell') {
    const newBal = updateBalance(targetId, item.price, 'item_sell', `Продажа: ${item.name}`);
    res.json({ success: true, action: 'sold', ...newBal });
  } else {
    const invId = addToInventory(targetId, item);
    res.json({ success: true, action: 'kept', inventoryId: invId });
  }
});

app.post('/api/payment/stars-invoice', async (req, res) => {
  const { amountStars } = req.body;
  res.json({
    success: true,
    invoiceUrl: `https://t.me/$stars_invoice_mock?amount=${amountStars}`,
    stars: amountStars,
  });
});

app.post('/api/withdraw', async (req, res) => {
  const { userId, username, itemId, itemName, itemPrice, targetUsername, fee } = req.body;
  const targetId = userId ? String(userId) : 'demo_user';
  if (itemId) {
    removeFromInventory(targetId, itemId, 'withdraw');
  }

  const withdrawId = createWithdrawal({
    userId: targetId,
    username: username || '',
    targetUsername: targetUsername || '',
    itemId: itemId || '',
    itemName: itemName || 'Подарок',
    itemPrice: Number(itemPrice) || 0,
    fee: Number(fee) || 25,
  });

  const record = getWithdrawalById(withdrawId);
  if (record) {
    notifyAdminsAboutWithdrawal(record).catch(() => {});
  }

  res.json({
    success: true,
    withdrawalId: withdrawId,
    message: `Заявка на вывод ${itemName} для @${targetUsername} успешно зарегистрирована!`,
  });
});

wss.on('connection', (ws) => {
  console.log('[WebSocket] Client connected');

  ws.send(JSON.stringify({ type: 'WELCOME', message: 'Connected to Lector Cases Battle WS' }));

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      if (data.type === 'PING') {
        ws.send(JSON.stringify({ type: 'PONG' }));
      }
    } catch (e) {
      console.error('WS Error:', e);
    }
  });

  ws.on('close', () => {
    console.log('[WebSocket] Client disconnected');
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(frontendDist, 'index.html'));
});

server.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`⚡ LECTOR CASES BACKEND RUNNING ON PORT ${PORT}`);
  console.log(`⚡ MASCOT: LECTOR FROM BLACK SPRUIT`);
  console.log(`===============================================`);
});
