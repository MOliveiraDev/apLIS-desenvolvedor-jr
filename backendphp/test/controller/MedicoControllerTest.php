<?php

declare(strict_types=1);

use PHPUnit\Framework\TestCase;

final class MedicoControllerTest extends TestCase
{
    private function makeController(): MedicoController
    {
        $connection = $this->makeTestConnection();
        $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $this->recreateMedicosTable($connection);
        $connection->exec(
            "INSERT INTO medicos (nome, crm, ufcrm) VALUES ('Maria Souza', '999999', 'SP')"
        );

        $service = new MedicoService(new MedicoModel($connection));

        return new MedicoController($service);
    }

    private function makeTestConnection(): PDO
    {
        $env = parse_ini_file(__DIR__ . '/../../.env', false, INI_SCANNER_RAW) ?: [];

        $host = (string) ($env['DB_HOST'] ?? '127.0.0.1');
        $port = (string) ($env['DB_PORT'] ?? '3306');
        $username = (string) ($env['DB_USERNAME'] ?? 'root');
        $password = (string) ($env['DB_PASSWORD'] ?? '');
        $charset = (string) ($env['DB_CHARSET'] ?? 'utf8mb4');
        $baseDatabase = (string) ($env['DB_DATABASE'] ?? 'hospital_db');
        $testDatabase = preg_replace('/[^a-zA-Z0-9_]/', '_', $baseDatabase . '_test') ?: 'hospital_db_test';

        $adminDsn = sprintf('mysql:host=%s;port=%s;charset=%s', $host, $port, $charset);
        $admin = new PDO($adminDsn, $username, $password, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
        $admin->exec(
            sprintf(
                'CREATE DATABASE IF NOT EXISTS `%s` CHARACTER SET %s COLLATE %s_unicode_ci',
                $testDatabase,
                $charset,
                $charset
            )
        );

        $dsn = sprintf('mysql:host=%s;port=%s;dbname=%s;charset=%s', $host, $port, $testDatabase, $charset);

        return new PDO($dsn, $username, $password, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
    }

    private function recreateMedicosTable(PDO $connection): void
    {
        $connection->exec('DROP TABLE IF EXISTS medicos');
        $connection->exec(
            'CREATE TABLE medicos (
                id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                nome VARCHAR(255) NOT NULL,
                crm VARCHAR(20) NOT NULL,
                ufcrm CHAR(2) NOT NULL,
                UNIQUE KEY uk_medicos_crm_ufcrm (crm, ufcrm)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci'
        );
    }

    public function testHandleGetReturnsJsonResponse(): void
    {
        $controller = $this->makeController();

        ob_start();
        $controller->handle('GET');
        $output = (string) ob_get_clean();

        $decoded = json_decode($output, true);

        $this->assertIsArray($decoded);
        $this->assertCount(1, $decoded);
        $this->assertSame('Maria Souza', $decoded[0]['nome']);
    }

    public function testHandleInvalidMethodReturnsApiExceptionPayload(): void
    {
        $controller = $this->makeController();

        ob_start();
        $controller->handle('PUT');
        $output = (string) ob_get_clean();

        $decoded = json_decode($output, true);

        $this->assertSame('METHOD_NOT_ALLOWED', $decoded['code']);
        $this->assertSame(405, $decoded['status']);
        $this->assertArrayHasKey('timestamp', $decoded);
    }
}
