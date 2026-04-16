# Backend PHP (gerenciamento de médicos)

Este backend cuida da API de medicos.

## Tecnologias
- PHP 8.3
- PDO + MySQL
- Estrutura MVC simples (controller, service, model, dto, exception)

## Principais Endpoints
- `GET /api/v1/medicos`
- `POST /api/v1/medicos`

## Estrutura basica
- `src/index.php`: entrada da API e roteamento
- `src/controller`: camada HTTP
- `src/service`: regra de negocio
- `src/model`: acesso ao banco
- `src/dto`: validacao/mapeamento de dados
- `src/exception`: erros padronizados
- `database/migrate.php`: runner de migration
- `database/migrations`: arquivos SQL

## Como rodar local (sem Docker)
1. Entrar na pasta:
```bash
cd backendphp
```

2. Criar `.env`:
```bash
cp .env.example .env
```

3. Ajustar variaveis do banco no `.env`.

4. Rodar migration:
```bash
php database/migrate.php
```

5. Subir servidor:
```bash
php -S localhost:8000 src/index.php
```

## Como testar
### Healthcheck
```bash
curl http://localhost:8000/health
```

### Listar medicos
```bash
curl http://localhost:8000/api/v1/medicos
```

### Criar medico
```bash
curl -X POST http://localhost:8000/api/v1/medicos \
  -H "Content-Type: application/json" \
  -d '{"nome":"Dra. Ana","especialidade":"Cardiologia"}'
```

## Testes
```bash
./vendor/bin/phpunit
```

## Rodando com Docker
Da raiz do projeto:
```bash
docker compose up -d --build
```

A API PHP sobe na porta `8000`.

## Observacoes
- CORS habilitado.
- Respostas de erro seguem padrao com `message`, `code`, `status`, `timestamp` e `details` (quando existir).
