import Database from 'better-sqlite3';

export type DB = Database.Database;

export function createDb(filename: string = ':memory:'): DB {
  const db = new Database(filename);
  db.exec(`
    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      capacity INTEGER NOT NULL,
      registered INTEGER NOT NULL DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS participants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_id TEXT NOT NULL,
      email TEXT NOT NULL,
      paid INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (event_id) REFERENCES events(id)
    );
  `);
  return db;
}

export function seed(db: DB): void {
  const insert = db.prepare('INSERT OR REPLACE INTO events (id, name, capacity, registered) VALUES (?, ?, ?, ?)');
  insert.run('marathon-paris', 'Marathon de Paris', 100, 0);
  insert.run('trail-chamonix', 'Trail de Chamonix', 2, 2);
  insert.run('semi-lyon', 'Semi-marathon de Lyon', 50, 10);
}
