<?php

declare(strict_types=1);

require_once __DIR__ . '/../service/MedicoService.php';

final class MedicoController
{
    public function __construct(private readonly MedicoService $medicoService)
    {
    }

    public function handle(string $method): void
    {
        $rawBody = (string) file_get_contents('php://input');
        $result = $this->medicoService->handle($method, $rawBody);

        $this->jsonResponse($result['statusCode'], $result['payload']);
    }

    private function jsonResponse(int $statusCode, array $payload): void
    {
        http_response_code($statusCode);
        header('Content-Type: application/json; charset=utf-8');

        echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    }
}