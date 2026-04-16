<?php

declare(strict_types=1);

function loadEnv(string $basePath): void
{
    $envPath = rtrim($basePath, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . '.env';

    if (!file_exists($envPath)) {
        return;
    }

    $values = parse_ini_file($envPath, false, INI_SCANNER_RAW);

    if ($values === false) {
        throw new RuntimeException('Nao foi possivel ler o arquivo .env.');
    }

    foreach ($values as $key => $value) {
        if (!is_string($key)) {
            continue;
        }

        $stringValue = is_string($value) ? trim($value) : '';

        putenv($key . '=' . $stringValue);
        $_ENV[$key] = $stringValue;
        $_SERVER[$key] = $stringValue;
    }
}

function env(string $key, ?string $default = null): ?string
{
    $value = $_ENV[$key] ?? $_SERVER[$key] ?? getenv($key);

    if ($value === false || $value === null || $value === '') {
        return $default;
    }

    return (string) $value;
}
