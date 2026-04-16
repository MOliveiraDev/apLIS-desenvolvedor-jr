<?php

declare(strict_types=1);

require_once __DIR__ . '/../dto/MedicoDTO.php';
require_once __DIR__ . '/../exception/BackendExceptions.php';
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

            throw new MethodNotAllowedException();
        } catch (PDOException $exception) {
            if ($this->isDuplicateError($exception)) {
                throw new DuplicateResourceException('Medico com CRM e UFCRM ja cadastrado.');
            }

            throw new InternalServerException('Erro interno no servidor.', [
                'reason' => $exception->getMessage(),
            ]);
        } catch (CustomApiException $exception) {
            throw $exception;
        } catch (Throwable $exception) {
            throw new InternalServerException('Erro interno no servidor.', [
                'reason' => $exception->getMessage(),
            ]);
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
            throw new ValidationException('Body deve ser um JSON valido.');
        }

        return $decoded;
    }

    private function isDuplicateError(PDOException $exception): bool
    {
        $sqlState = $exception->getCode();
        $driverCode = $exception->errorInfo[1] ?? null;

        return $sqlState === '23000' && (int) $driverCode === 1062;
    }
}