import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'database.sqlite');

let dbInstance: Database.Database | null = null;

function createConnection(): Database.Database {
  const db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');

  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      price REAL NOT NULL,
      stock INTEGER NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      items_json TEXT NOT NULL,
      total_price REAL NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  seedProducts(db);

  return db;
}

function seedProducts(db: Database.Database): void {
  const row = db.prepare('SELECT COUNT(*) as count FROM products').get() as { count: number };
  if (row.count > 0) return;

  const insert = db.prepare(
    'INSERT INTO products (name, category, price, stock) VALUES (?, ?, ?, ?)'
  );

  const sampleProducts: Array<[string, string, number, number]> = [
    ['AMD Ryzen 7 7800X3D', 'CPU', 399.99, 25],
    ['Intel Core i7-14700K', 'CPU', 409.99, 30],
    ['NVIDIA GeForce RTX 4070', 'GPU', 599.99, 15],
    ['AMD Radeon RX 7800 XT', 'GPU', 499.99, 18],
    ['Corsair Vengeance 32GB DDR5', 'RAM', 109.99, 50],
    ['G.Skill Trident Z5 32GB DDR5', 'RAM', 119.99, 40],
    ['Samsung 990 Pro 2TB NVMe SSD', 'Storage', 179.99, 35],
    ['ASUS ROG Strix B650-A', 'Motherboard', 229.99, 20],
    ['Corsair RM850x 850W PSU', 'Power Supply', 139.99, 22],
    ['NZXT H510 Flow Case', 'Case', 89.99, 28],
  ];

  const insertMany = db.transaction((products: Array<[string, string, number, number]>) => {
    for (const product of products) {
      insert.run(...product);
    }
  });

  insertMany(sampleProducts);
}

export function getDb(): Database.Database {
  if (!dbInstance) {
    dbInstance = createConnection();
  }
  return dbInstance;
}

export default getDb;
