const fs = require('fs');
const path = require('path');
const { pool } = require('../src/config/database');

async function ensureMigrationsTable() {
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS migrations (
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      migration VARCHAR(255) NOT NULL UNIQUE,
      batch INT UNSIGNED NOT NULL,
      executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);
}

async function getAppliedMigrations() {
  const [rows] = await pool.execute('SELECT migration FROM migrations');
  return rows.map((row) => row.migration);
}

async function getNextBatch() {
  const [rows] = await pool.execute('SELECT COALESCE(MAX(batch), 0) AS maxBatch FROM migrations');
  return Number(rows[0].maxBatch || 0) + 1;
}

async function applyMigration(fileName, sql, batch) {
  await pool.execute(sql);
  await pool.execute('INSERT INTO migrations (migration, batch) VALUES (?, ?)', [fileName, batch]);
}

async function run() {
  try {
    await ensureMigrationsTable();

    const migrationsDir = path.join(__dirname, 'migrations');
    const migrationFiles = fs
      .readdirSync(migrationsDir)
      .filter((fileName) => fileName.endsWith('.sql'))
      .sort();

    if (migrationFiles.length === 0) {
      console.log('Nenhuma migration encontrada.');
      return;
    }

    const appliedMigrations = await getAppliedMigrations();
    const appliedLookup = new Set(appliedMigrations);
    const batch = await getNextBatch();

    let appliedInRun = 0;

    for (const fileName of migrationFiles) {
      if (appliedLookup.has(fileName)) {
        console.log(`- Ja aplicada: ${fileName}`);
        continue;
      }

      const filePath = path.join(migrationsDir, fileName);
      const sql = fs.readFileSync(filePath, 'utf8').trim();

      if (!sql) {
        console.log(`- Ignorada (vazia): ${fileName}`);
        continue;
      }

      await applyMigration(fileName, sql, batch);
      appliedInRun += 1;
      console.log(`+ Aplicada: ${fileName}`);
    }

    if (appliedInRun === 0) {
      console.log('Nada para migrar.');
      return;
    }

    console.log(`Migracoes finalizadas. Total aplicadas: ${appliedInRun}.`);
  } catch (error) {
    console.error(`Erro ao executar migrations: ${error.message}`);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

run();
