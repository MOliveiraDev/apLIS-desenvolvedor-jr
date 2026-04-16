<?php

declare(strict_types=1);

final class MedicoDTO
{
    public function __construct(
        public readonly ?int $id,
        public readonly string $nome,
        public readonly string $crm,
        public readonly string $ufcrm
    ) {
    }

    public static function fromRequest(array $payload): self
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

        return new self(null, $nome, $crm, $ufcrm);
    }

    public static function fromDatabase(array $row): self
    {
        return new self(
            isset($row['id']) ? (int) $row['id'] : null,
            (string) ($row['nome'] ?? ''),
            (string) ($row['CRM'] ?? ''),
            (string) ($row['UFCRM'] ?? '')
        );
    }

    public function toPersistence(): array
    {
        return [
            'nome' => $this->nome,
            'CRM' => $this->crm,
            'UFCRM' => $this->ufcrm,
        ];
    }

    public function toResponse(): array
    {
        return [
            'id' => $this->id,
            'nome' => $this->nome,
            'CRM' => $this->crm,
            'UFCRM' => $this->ufcrm,
        ];
    }
}
