import Database from 'better-sqlite3';

export class SqliteDatabase {
  private static instance: Database.Database;

  static getInstance = (): Database.Database => {
    if (!SqliteDatabase.instance) {
      SqliteDatabase.instance = new Database('acceso_corporativo.db');
      SqliteDatabase.instance.pragma('journal_mode = WAL');
    }

    return SqliteDatabase.instance;
  };
}
