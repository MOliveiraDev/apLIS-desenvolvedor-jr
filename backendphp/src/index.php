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

try {
    $connection = Database::getConnection();
} catch (Throwable $exception) {
    $startupException = $exception instanceof CustomApiException
        ? $exception
        : new StartupConfigurationException('Falha na inicializacao da API.', [
            'reason' => $exception->getMessage(),
        ]);

    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($startupException->toResponse(), JSON_UNESCAPED_UNICODE);

    return;
}

if ($path === '/api/v1/medicos') {
    $model = new MedicoModel($connection);
    $service = new MedicoService($model);
    $controller = new MedicoController($service);

    $controller->handle($method);

    return;
}

 $notFoundException = new NotFoundException();
http_response_code($notFoundException->status);
header('Content-Type: application/json; charset=utf-8');
echo json_encode($notFoundException->toResponse(), JSON_UNESCAPED_UNICODE);