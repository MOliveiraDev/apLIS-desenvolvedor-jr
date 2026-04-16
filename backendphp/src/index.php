<?php

declare(strict_types=1);

require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/controller/MedicoController.php';
require_once __DIR__ . '/model/MedicoModel.php';
require_once __DIR__ . '/service/MedicoService.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$requestUri = $_SERVER['REQUEST_URI'] ?? '/';
$path = (string) parse_url($requestUri, PHP_URL_PATH);

if ($path === '/api/v1/medicos') {
    $connection = Database::getConnection();
    $model = new MedicoModel($connection);
    $service = new MedicoService($model);
    $controller = new MedicoController($service);

    $controller->handle($method);

    return;
}

http_response_code(404);
header('Content-Type: application/json; charset=utf-8');
echo json_encode([
    'message' => 'Rota nao encontrada.',
], JSON_UNESCAPED_UNICODE);