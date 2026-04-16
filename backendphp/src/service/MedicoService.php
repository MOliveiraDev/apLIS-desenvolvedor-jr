<?php

declare(strict_types=1);

require_once __DIR__ . '/../model/MedicoModel.php';

final class MedicoService
{
    public function __construct(private readonly MedicoModel $medicoModel)
    {
    }

    public function handle(string $method, string $rawBody): array
    {
        try {
            if ($method === 'GET') {
                return [
                    'statusCode' => 200,
                    'payload' => $this->listMedicos(),
                ];
            }

            if ($method === 'POST') {
                $payload = $this->parsePayload($rawBody);
                $this->createMedico($payload);

                return [
                    'statusCode' => 201,
                    'payload' => [
                        'message' => 'Médico criado com sucesso',
                    ],
                ];
            }

            return [
                'statusCode' => 405,
                'payload' => [
                    'message' => 'Metodo nao permitido.',
                ],
            ];
        } catch (InvalidArgumentException $exception) {
            return [
                'statusCode' => 422,
                'payload' => [
                    'message' => $exception->getMessage(),
                ],
            ];
        } catch (Throwable $exception) {
            return [
                'statusCode' => 500,
                'payload' => [
                    'message' => 'Erro interno no servidor.',
                    'error' => $exception->getMessage(),
                ],
            ];
        }
    }

    private function listMedicos(): array
    {
        return $this->medicoModel->findAll();
    }

    private function createMedico(array $payload): void
    {
        $nome = trim((string) ($payload['nome'] ?? ''));
        $crm = trim((string) ($payload['CRM'] ?? ''));
        $ufcrm = strtoupper(trim((string) ($payload['UFCRM'] ?? '')));

        if ($nome === '' || $crm === '' || $ufcrm === '') {
            throw new InvalidArgumentException('Campos obrigatorios: nome, CRM e UFCRM.');
        }

        if (strlen($ufcrm) !== 2) {
            throw new InvalidArgumentException('UFCRM deve conter 2 caracteres.');
        }

        $this->medicoModel->create([
            'nome' => $nome,
            'CRM' => $crm,
            'UFCRM' => $ufcrm,
        ]);
    }

    private function parsePayload(string $rawBody): array
    {
        $decoded = json_decode($rawBody !== '' ? $rawBody : '{}', true);

        if (!is_array($decoded)) {
            throw new InvalidArgumentException('Body deve ser um JSON valido.');
        }

        return $decoded;
    }
}