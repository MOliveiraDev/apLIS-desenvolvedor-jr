<?php

declare(strict_types=1);

require_once __DIR__ . '/../exception/BackendExceptions.php';
require_once __DIR__ . '/../service/MedicoService.php';

final class MedicoController
{
    public function __construct(private readonly MedicoService $medicoService)
    {
    }

    public function handle(string $method): void
    {
        try {
            $rawBody = (string) file_get_contents('php://input');
            $result = $this->medicoService->handle($method, $rawBody);

            $this->jsonResponse($result['statusCode'], $result['payload']);
        } catch (CustomApiException $exception) {
            $this->jsonResponse($exception->status, $exception->toResponse());
        } catch (Throwable $exception) {
            $apiException = new InternalServerException('Erro interno no servidor.', [
                'reason' => $exception->getMessage(),
            ]);

            $this->jsonResponse($apiException->status, $apiException->toResponse());
        }
    }

    private function jsonResponse(int $statusCode, array $payload): void
    {
        http_response_code($statusCode);
        header('Content-Type: application/json; charset=utf-8');

        echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    }
}