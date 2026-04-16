<?php

declare(strict_types=1);

final class MedicoModel
{
    public function __construct(private readonly PDO $connection)
    {
    }

    public function findAll(): array
    {
        $query = 'SELECT id, nome, crm AS CRM, ufcrm AS UFCRM FROM medicos ORDER BY id ASC';
        $statement = $this->connection->query($query);

        return $statement->fetchAll();
    }

    public function create(array $medico): void
    {
        $query = 'INSERT INTO medicos (nome, crm, ufcrm) VALUES (:nome, :crm, :ufcrm)';
        $statement = $this->connection->prepare($query);
        $statement->bindValue(':nome', $medico['nome']);
        $statement->bindValue(':crm', $medico['CRM']);
        $statement->bindValue(':ufcrm', $medico['UFCRM']);
        $statement->execute();
    }
}