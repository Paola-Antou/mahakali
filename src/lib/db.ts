import initSqlJs, { Database } from 'sql.js';
import bcrypt from 'bcryptjs';

let db: Database | null = null;

export async function initDatabase(): Promise<Database> {
  if (db) return db;

  const SQL = await initSqlJs({
    locateFile: (file) => `https://sql.js.org/dist/${file}`,
  });

  try {
    const response = await fetch('/mahakali_stock_app_v3.db');
    const buffer = await response.arrayBuffer();
    db = new SQL.Database(new Uint8Array(buffer));
    return db;
  } catch (error) {
    console.error('Failed to load database:', error);
    db = new SQL.Database();
    initTables(db);
    return db;
  }
}

function initTables(database: Database) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS user_permissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER UNIQUE NOT NULL,
      can_stock INTEGER DEFAULT 1,
      can_movements INTEGER DEFAULT 1,
      can_expenses INTEGER DEFAULT 1,
      can_dashboard INTEGER DEFAULT 1,
      can_sales INTEGER DEFAULT 1,
      can_debtors INTEGER DEFAULT 1,
      can_invoices INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      category TEXT,
      initial_stock INTEGER DEFAULT 0,
      min_stock INTEGER DEFAULT 0,
      unit_price REAL DEFAULT 0,
      purchase_price REAL DEFAULT 0,
      reseller_price REAL DEFAULT 0,
      image_path TEXT,
      created_by INTEGER,
      FOREIGN KEY (created_by) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS movements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      type TEXT NOT NULL,
      product_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      unit_price REAL,
      client_name TEXT,
      client_phone TEXT,
      comment TEXT,
      created_by INTEGER,
      FOREIGN KEY (product_id) REFERENCES products(id),
      FOREIGN KEY (created_by) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      description TEXT NOT NULL,
      amount REAL NOT NULL,
      payment_mode TEXT NOT NULL,
      category TEXT,
      comment TEXT,
      created_by INTEGER,
      FOREIGN KEY (created_by) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS sales (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      product_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      unit_price REAL NOT NULL,
      total REAL NOT NULL,
      payment_mode TEXT NOT NULL,
      client_name TEXT,
      client_phone TEXT,
      paid_amount REAL NOT NULL DEFAULT 0,
      balance REAL NOT NULL DEFAULT 0,
      comment TEXT,
      created_by INTEGER,
      FOREIGN KEY(product_id) REFERENCES products(id),
      FOREIGN KEY(created_by) REFERENCES users(id)
    );
  `);

  const adminHash = bcrypt.hashSync('admin123', 10);
  database.run(
    'INSERT OR IGNORE INTO users (id, email, password_hash, role) VALUES (1, ?, ?, ?)',
    ['admin@mahakali.local', adminHash, 'admin']
  );
  database.run(
    'INSERT OR IGNORE INTO user_permissions (user_id, can_stock, can_movements, can_expenses, can_dashboard, can_sales, can_debtors, can_invoices) VALUES (1, 1, 1, 1, 1, 1, 1, 1)'
  );
}

export function getDatabase(): Database {
  if (!db) throw new Error('Database not initialized');
  return db;
}

export function saveDatabase() {
  if (!db) return;
  const data = db.export();
  localStorage.setItem('mahakali_db', JSON.stringify(Array.from(data)));
}

export function loadDatabaseFromStorage() {
  const stored = localStorage.getItem('mahakali_db');
  if (!stored) return null;
  try {
    const data = JSON.parse(stored);
    return new Uint8Array(data);
  } catch {
    return null;
  }
}