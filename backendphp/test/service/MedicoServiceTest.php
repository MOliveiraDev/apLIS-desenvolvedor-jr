<?php

declare(strict_types=1);

use PHPUnit\Framework\TestCase;

final class MedicoServiceTest extends TestCase
{
    private function makeService(): MedicoService
    {
        $connection = $this->makeTestConnection();
        $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $this->recreateMedicosTable($connection);

        return new MedicoService(new MedicoModel($connection));
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

    public function testHandleGetReturnsEmptyPayloadInitially(): void
    {
        $service = $this->makeService();

        $result = $service->handle('GET', '{}');

        $this->assertSame(200, $result['statusCode']);
        $this->assertSame([], $result['payload']);
    }

    public function testHandlePostCreatesMedicoAndCanBeListed(): void
    {
        $service = $this->makeService();

        $postResult = $service->handle('POST', json_encode([
            'nome' => 'Joao da Silva',
            'CRM' => '123456',
            'UFCRM' => 'ce',
        ], JSON_THROW_ON_ERROR));

        $this->assertSame(201, $postResult['statusCode']);
        $this->assertSame('Médico criado com sucesso', $postResult['payload']['message']);

        $listResult = $service->handle('GET', '{}');

        $this->assertSame(200, $listResult['statusCode']);
        $this->assertCount(1, $listResult['payload']);
        $this->assertSame('Joao da Silva', $listResult['payload'][0]['nome']);
        $this->assertSame('CE', $listResult['payload'][0]['UFCRM']);
    }

    public function testHandleInvalidMethodThrowsMethodNotAllowedException(): void
    {
        $service = $this->makeService();

        $this->expectException(MethodNotAllowedException::class);
        $service->handle('PATCH', '{}');
    }
}
