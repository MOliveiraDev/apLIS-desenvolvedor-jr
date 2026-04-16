<?php

declare(strict_types=1);

require_once __DIR__ . '/../dto/MedicoDTO.php';
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
        $medicos = $this->medicoModel->findAll();

        return array_map(
            static fn (MedicoDTO $medicoDTO): array => $medicoDTO->toResponse(),
            $medicos
        );
    }

    private function createMedico(array $payload): void
    {
        $medicoDTO = MedicoDTO::fromRequest($payload);
        $this->medicoModel->create($medicoDTO);
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