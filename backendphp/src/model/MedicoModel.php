<?php

declare(strict_types=1);

require_once __DIR__ . '/../dto/MedicoDTO.php';

final class MedicoModel
{
    public function __construct(private readonly PDO $connection)
    {
    }

    public function findAll(): array
    {
        $query = 'SELECT id, nome, crm AS CRM, ufcrm AS UFCRM FROM medicos ORDER BY id ASC';
        $statement = $this->connection->query($query);

        $rows = $statement->fetchAll();

        return array_map(
            static fn (array $row): MedicoDTO => MedicoDTO::fromDatabase($row),
            $rows
        );
    }

    public function create(MedicoDTO $medicoDTO): void
    {
        $payload = $medicoDTO->toPersistence();
        $query = 'INSERT INTO medicos (nome, crm, ufcrm) VALUES (:nome, :crm, :ufcrm)';
        $statement = $this->connection->prepare($query);
        $statement->bindValue(':nome', $payload['nome']);
        $statement->bindValue(':crm', $payload['CRM']);
        $statement->bindValue(':ufcrm', $payload['UFCRM']);
        $statement->execute();
    }
}