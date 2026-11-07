import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'lector_cases.db');
const db = new DatabaseSync(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT,
    first_name TEXT,
    balance_stars REAL DEFAULT 0,
    balance_rub REAL DEFAULT 0,
    total_opened INTEGER DEFAULT 0,
    total_won_stars REAL DEFAULT 0,
    created_at TEXT
  );

  CREATE TABLE IF NOT EXISTS inventory (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    item_id TEXT,
    name TEXT,
    image TEXT,
    price_stars REAL,
    price_rub REAL,
    rarity TEXT,
    is_nft INTEGER DEFAULT 0,
    won_at TEXT,
    is_sold INTEGER DEFAULT 0,
    is_withdrawn INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS case_drops (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    case_id TEXT,
    item_id TEXT,
    item_name TEXT,
    price_stars REAL,
    dropped_at TEXT
  );

  CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    type TEXT,
    amount_stars REAL,
    amount_rub REAL,
    description TEXT,
    created_at TEXT
  );

  CREATE TABLE IF NOT EXISTS withdrawals (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    username TEXT,
    target_username TEXT,
    item_id TEXT,
    item_name TEXT,
    item_price REAL,
    fee REAL DEFAULT 25,
    status TEXT DEFAULT 'pending',
    created_at TEXT
  );

  CREATE TABLE IF NOT EXISTS admins (
    id TEXT PRIMARY KEY,
    username TEXT,
    created_at TEXT
  );
`);

export function getOrCreateUser(userId, userData = {}) {
  const selectStmt = db.prepare('SELECT * FROM users WHERE id = ?');
  let user = selectStmt.get(userId);

  if (!user) {
    const insertStmt = db.prepare(`
      INSERT INTO users (id, username, first_name, balance_stars, balance_rub, total_opened, total_won_stars, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const initialStars = 0;
    const initialRub = 0;
    const now = new Date().toISOString();
    insertStmt.run(
      userId,
      userData.username || '',
      userData.first_name || 'Игрок',
      initialStars,
      initialRub,
      0,
      0,
      now
    );
    user = selectStmt.get(userId);
  }

  return user;
}

export function updateBalance(userId, starsDelta, type = 'update', description = '') {
  const user = getOrCreateUser(userId);
  const newStars = Math.max(0, user.balance_stars + starsDelta);
  const newRub = Math.round(newStars * 1.5);

  const updateStmt = db.prepare(`
    UPDATE users 
    SET balance_stars = ?, balance_rub = ?
    WHERE id = ?
  `);
  updateStmt.run(newStars, newRub, userId);

  const txStmt = db.prepare(`
    INSERT INTO transactions (id, user_id, type, amount_stars, amount_rub, description, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  txStmt.run(
    Math.random().toString(36).substring(2, 12),
    userId,
    type,
    starsDelta,
    Math.round(starsDelta * 1.5),
    description,
    new Date().toISOString()
  );

  return { balanceStars: newStars, balanceRub: newRub };
}

export function getUserInventory(userId) {
  const stmt = db.prepare('SELECT * FROM inventory WHERE user_id = ? AND is_sold = 0 AND is_withdrawn = 0 ORDER BY rowid DESC');
  return stmt.all(userId);
}

export function addToInventory(userId, item) {
  const stmt = db.prepare(`
    INSERT INTO inventory (id, user_id, item_id, name, image, price_stars, price_rub, rarity, is_nft, won_at, is_sold, is_withdrawn)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0)
  `);
  const invId = item.inventoryId || Math.random().toString(36).substring(2, 12);
  stmt.run(
    invId,
    userId,
    item.id,
    item.name,
    item.image,
    item.price,
    item.rubPrice || Math.round(item.price * 1.5),
    item.rarity || 'common',
    item.isNft ? 1 : 0,
    item.wonAt || 'Только что'
  );
  return invId;
}

export function removeFromInventory(userId, invId, action = 'sold') {
  if (action === 'sold') {
    const stmt = db.prepare('UPDATE inventory SET is_sold = 1 WHERE id = ? AND user_id = ?');
    stmt.run(invId, userId);
  } else {
    const stmt = db.prepare('UPDATE inventory SET is_withdrawn = 1 WHERE id = ? AND user_id = ?');
    stmt.run(invId, userId);
  }
}

export function recordDrop(userId, caseId, item) {
  const dropStmt = db.prepare(`
    INSERT INTO case_drops (id, user_id, case_id, item_id, item_name, price_stars, dropped_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  dropStmt.run(
    Math.random().toString(36).substring(2, 12),
    userId,
    caseId,
    item.id,
    item.name,
    item.price,
    new Date().toISOString()
  );

  const updateStmt = db.prepare(`
    UPDATE users 
    SET total_opened = total_opened + 1, total_won_stars = total_won_stars + ?
    WHERE id = ?
  `);
  updateStmt.run(item.price, userId);
}

export function createWithdrawal(data) {
  const id = data.id || Math.random().toString(36).substring(2, 10).toUpperCase();
  const stmt = db.prepare(`
    INSERT INTO withdrawals (id, user_id, username, target_username, item_id, item_name, item_price, fee, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)
  `);
  stmt.run(
    id,
    data.userId,
    data.username || '',
    data.targetUsername,
    data.itemId,
    data.itemName,
    data.itemPrice,
    data.fee || 25,
    new Date().toISOString()
  );
  return id;
}

export function getPendingWithdrawals() {
  const stmt = db.prepare("SELECT * FROM withdrawals WHERE status = 'pending' ORDER BY rowid DESC");
  return stmt.all();
}

export function getWithdrawalById(id) {
  const stmt = db.prepare('SELECT * FROM withdrawals WHERE id = ?');
  return stmt.get(id);
}

export function updateWithdrawalStatus(id, status) {
  const stmt = db.prepare('UPDATE withdrawals SET status = ? WHERE id = ?');
  stmt.run(status, id);
}

export function addAdmin(id, username = '') {
  const stmt = db.prepare('INSERT OR IGNORE INTO admins (id, username, created_at) VALUES (?, ?, ?)');
  stmt.run(String(id), username, new Date().toISOString());
}

export function getAdmins() {
  const stmt = db.prepare('SELECT * FROM admins');
  return stmt.all();
}

export function isAdmin(id) {
  const stmt = db.prepare('SELECT id FROM admins WHERE id = ?');
  return !!stmt.get(String(id));
}

export function getStats() {
  const users = db.prepare('SELECT COUNT(*) as count FROM users').get()?.count || 0;
  const pending = db.prepare("SELECT COUNT(*) as count FROM withdrawals WHERE status = 'pending'").get()?.count || 0;
  const stats = db.prepare('SELECT SUM(total_opened) as opened, SUM(total_won_stars) as won FROM users').get() || {};
  return {
    totalUsers: users,
    pendingWithdrawals: pending,
    totalOpened: stats.opened || 0,
    totalWonStars: stats.won || 0,
  };
}

export default db;
