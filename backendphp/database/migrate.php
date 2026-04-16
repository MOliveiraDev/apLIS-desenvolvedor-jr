<?php

declare(strict_types=1);

require_once __DIR__ . '/../src/config/database.php';

const MIGRATIONS_TABLE = 'migrations_php';

function ensureMigrationsTable(PDO $connection): void
{
    $connection->exec(
        'CREATE TABLE IF NOT EXISTS ' . MIGRATIONS_TABLE . ' (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            migration VARCHAR(255) NOT NULL UNIQUE,
            batch INT UNSIGNED NOT NULL,
            executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci'
    );
}

function getAppliedMigrations(PDO $connection): array
{
    $statement = $connection->query('SELECT migration FROM ' . MIGRATIONS_TABLE);

    return $statement->fetchAll(PDO::FETCH_COLUMN) ?: [];
}

function getNextBatch(PDO $connection): int
{
    $statement = $connection->query('SELECT COALESCE(MAX(batch), 0) AS max_batch FROM ' . MIGRATIONS_TABLE);
    $row = $statement->fetch();

    return ((int) ($row['max_batch'] ?? 0)) + 1;
}

function applyMigration(PDO $connection, string $migrationName, string $sql, int $batch): void
{
    $connection->exec($sql);

    $insert = $connection->prepare(
        'INSERT INTO ' . MIGRATIONS_TABLE . ' (migration, batch) VALUES (:migration, :batch)'
    );
    $insert->execute([
        'migration' => $migrationName,
        'batch' => $batch,
    ]);
}

try {
    $connection = Database::getConnection();
    ensureMigrationsTable($connection);

    $migrationsPath = __DIR__ . '/migrations';
    $migrationFiles = glob($migrationsPath . '/*.sql') ?: [];
    sort($migrationFiles);

    if ($migrationFiles === []) {
        echo "Nenhuma migration encontrada.\n";
        exit(0);
    }

    $appliedMigrations = getAppliedMigrations($connection);
    $appliedLookup = array_flip($appliedMigrations);
    $batch = getNextBatch($connection);
    $appliedInRun = 0;

    foreach ($migrationFiles as $migrationFile) {
        $migrationName = basename($migrationFile);

        if (isset($appliedLookup[$migrationName])) {
            echo "- Ja aplicada: {$migrationName}\n";
            continue;
        }

        $sql = trim((string) file_get_contents($migrationFile));

        if ($sql === '') {
            echo "- Ignorada (vazia): {$migrationName}\n";
            continue;
        }

        applyMigration($connection, $migrationName, $sql, $batch);
        $appliedInRun++;

        echo "+ Aplicada: {$migrationName}\n";
    }

    if ($appliedInRun === 0) {
        echo "Nada para migrar.\n";
        exit(0);
    }

    echo "Migracoes finalizadas. Total aplicadas: {$appliedInRun}.\n";
} catch (Throwable $exception) {
    fwrite(STDERR, "Erro ao executar migrations: {$exception->getMessage()}\n");
    exit(1);
}
