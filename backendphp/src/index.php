<?php

declare(strict_types=1);

require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/controller/MedicoController.php';
require_once __DIR__ . '/exception/BackendExceptions.php';
require_once __DIR__ . '/model/MedicoModel.php';
require_once __DIR__ . '/service/MedicoService.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$requestUri = $_SERVER['REQUEST_URI'] ?? '/';
$path = (string) parse_url($requestUri, PHP_URL_PATH);

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET,POST,OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=utf-8');

if ($method === 'OPTIONS') {
    http_response_code(204);

    return;
}

if ($path === '/health' && $method === 'GET') {
    echo json_encode([
        'status' => 'ok',
        'service' => 'backendphp',
        'timestamp' => (new DateTimeImmutable())->format(DATE_ATOM),
    ], JSON_UNESCAPED_UNICODE);

    return;
}

try {
    $connection = Database::getConnection();
} catch (Throwable $exception) {
    $startupException = $exception instanceof CustomApiException
        ? $exception
        : new StartupConfigurationException('Falha na inicializacao da API.', [
            'reason' => $exception->getMessage(),
        ]);

    http_response_code(500);
    echo json_encode($startupException->toResponse(), JSON_UNESCAPED_UNICODE);

    return;
}

// deveria ter GET /api/v1/medicos e POST /api/1/medicos
if ($path === '/api/v1/medicos') {
    $model = new MedicoModel($connection);
    $service = new MedicoService($model);
    $controller = new MedicoController($service);

    $controller->handle($method);

    return;
}

 $notFoundException = new NotFoundException();
http_response_code($notFoundException->status);
echo json_encode($notFoundException->toResponse(), JSON_UNESCAPED_UNICODE);