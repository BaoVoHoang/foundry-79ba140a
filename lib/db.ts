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
    ['AMD Ryzen 9 7950X', 'CPU', 549.99, 12],
    ['Intel Core i9-14900K', 'CPU', 589.99, 10],
    ['AMD Ryzen 5 7600X', 'CPU', 229.99, 40],
    ['Intel Core i5-14600K', 'CPU', 319.99, 33],
    ['AMD Ryzen 9 7900X3D', 'CPU', 449.99, 0],
    ['Intel Core i3-14100', 'CPU', 129.99, 55],
    ['NVIDIA GeForce RTX 4070', 'GPU', 599.99, 15],
    ['AMD Radeon RX 7800 XT', 'GPU', 499.99, 18],
    ['NVIDIA GeForce RTX 4090', 'GPU', 1599.99, 5],
    ['NVIDIA GeForce RTX 4080', 'GPU', 1099.99, 8],
    ['AMD Radeon RX 7900 XTX', 'GPU', 949.99, 7],
    ['NVIDIA GeForce RTX 4060 Ti', 'GPU', 399.99, 22],
    ['AMD Radeon RX 6600', 'GPU', 229.99, 0],
    ['NVIDIA GeForce RTX 4070 Ti', 'GPU', 799.99, 11],
    ['Corsair Vengeance 32GB DDR5', 'RAM', 109.99, 50],
    ['G.Skill Trident Z5 32GB DDR5', 'RAM', 119.99, 40],
    ['Kingston Fury Beast 16GB DDR5', 'RAM', 59.99, 60],
    ['Corsair Dominator Platinum 64GB DDR5', 'RAM', 249.99, 15],
    ['Crucial 32GB DDR4', 'RAM', 89.99, 45],
    ['G.Skill Ripjaws V 16GB DDR4', 'RAM', 49.99, 0],
    ['Samsung 990 Pro 2TB NVMe SSD', 'Storage', 179.99, 35],
    ['Western Digital Black 1TB NVMe SSD', 'Storage', 99.99, 42],
    ['Crucial MX500 2TB SATA SSD', 'Storage', 129.99, 28],
    ['Seagate Barracuda 4TB HDD', 'Storage', 79.99, 33],
    ['Samsung 870 EVO 1TB SSD', 'Storage', 89.99, 39],
    ['Kingston NV2 500GB NVMe SSD', 'Storage', 39.99, 0],
    ['Seagate FireCuda 2TB NVMe SSD', 'Storage', 189.99, 20],
    ['ASUS ROG Strix B650-A', 'Motherboard', 229.99, 20],
    ['MSI MAG Z790 Tomahawk', 'Motherboard', 259.99, 18],
    ['Gigabyte B550 Aorus Elite', 'Motherboard', 149.99, 25],
    ['ASRock X670E Taichi', 'Motherboard', 399.99, 6],
    ['MSI Pro Z790-A', 'Motherboard', 189.99, 0],
    ['ASUS TUF Gaming B760M', 'Motherboard', 159.99, 30],
    ['Corsair RM850x 850W PSU', 'Power Supply', 139.99, 22],
    ['EVGA SuperNOVA 750 G5', 'Power Supply', 119.99, 26],
    ['Seasonic Focus GX-650', 'Power Supply', 99.99, 31],
    ['Corsair RM1000x 1000W PSU', 'Power Supply', 189.99, 9],
    ['be quiet! Straight Power 11 850W', 'Power Supply', 149.99, 0],
    ['Thermaltake Toughpower GF1 750W', 'Power Supply', 109.99, 17],
    ['NZXT H510 Flow Case', 'Case', 89.99, 28],
    ['Corsair 4000D Airflow', 'Case', 104.99, 24],
    ['Lian Li PC-O11 Dynamic', 'Case', 149.99, 14],
    ['Fractal Design Meshify C', 'Case', 99.99, 19],
    ['Cooler Master MasterBox TD500', 'Case', 94.99, 0],
    ['Phanteks Eclipse P400A', 'Case', 79.99, 21],
    ['Noctua NH-D15', 'Cooling', 99.99, 30],
    ['Corsair iCUE H150i Elite', 'Cooling', 179.99, 16],
    ['be quiet! Dark Rock Pro 4', 'Cooling', 89.99, 25],
    ['NZXT Kraken X63', 'Cooling', 159.99, 12],
    ['Arctic Liquid Freezer II 280', 'Cooling', 109.99, 0],
    ['Cooler Master Hyper 212', 'Cooling', 34.99, 45],
    ['Logitech G502 Hero', 'Peripherals', 49.99, 60],
    ['Razer DeathAdder V3', 'Peripherals', 69.99, 50],
    ['Corsair K95 RGB Platinum', 'Peripherals', 189.99, 20],
    ['SteelSeries Apex Pro', 'Peripherals', 199.99, 15],
    ['Logitech MX Master 3S', 'Peripherals', 99.99, 0],
    ['HyperX Cloud II', 'Peripherals', 79.99, 35],
    ['ASUS ROG Swift PG279Q', 'Monitor', 499.99, 8],
    ['LG UltraGear 27GP850', 'Monitor', 449.99, 10],
    ['Samsung Odyssey G7', 'Monitor', 599.99, 6],
    ['Dell UltraSharp U2723QE', 'Monitor', 649.99, 0],
    ['Acer Predator XB273K', 'Monitor', 699.99, 4],
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
