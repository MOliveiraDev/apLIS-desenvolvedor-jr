<?php

declare(strict_types=1);

require_once __DIR__ . '/../exception/BackendExceptions.php';
require_once __DIR__ . '/env.php';

final class Database
{
    public static function validateConfiguration(): void
    {
        $rootPath = dirname(__DIR__, 2);
        loadEnv($rootPath);

        $requiredKeys = [
            'DB_HOST',
            'DB_PORT',
            'DB_DATABASE',
            'DB_USERNAME',
            'DB_CHARSET',
        ];

        $missingKeys = [];

        foreach ($requiredKeys as $key) {
            if (env($key) === null) {
                $missingKeys[] = $key;
            }
        }

        if ($missingKeys !== []) {
            throw new StartupConfigurationException(
                'Variaveis obrigatorias ausentes no .env: ' . implode(', ', $missingKeys),
                ['missingKeys' => $missingKeys]
            );
        }
    }

    public static function getConnection(): PDO
    {
        self::validateConfiguration();

        $host = env('DB_HOST', '127.0.0.1');
        $port = env('DB_PORT', '3306');
        $database = env('DB_DATABASE');
        $username = env('DB_USERNAME');
        $password = env('DB_PASSWORD', '');
        $charset = env('DB_CHARSET', 'utf8mb4');

        $dsn = sprintf(
            'mysql:host=%s;port=%s;dbname=%s;charset=%s',
            $host,
            $port,
            $database,
            $charset
        );

        return new PDO(
            $dsn,
            $username,
            $password,
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ]
        );
    }
}
