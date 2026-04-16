# Backend JS (gerenciamento de pacientes)

Este backend cuida da API de pacientes.

## Tecnologias
- Node.js
- Express
- MySQL (mysql2)
- Arquitetura simples com controller, service, model, dto e exception

## Principais Endpoints
- `GET /api/v1/pacientes`
- `POST /api/v1/pacientes`

## Estrutura basica
- `src/server.js`: entrada da API e rotas
- `src/controller`: camada HTTP
- `src/service`: regra de negocio
- `src/model`: acesso ao banco
- `src/dto`: validacao/mapeamento
- `src/exception`: erros padronizados
- `database/migrate.js`: runner de migration
- `database/migrations`: arquivos SQL

## Como rodar local (sem Docker)
1. Entrar na pasta:
```bash
cd backendjs
```

2. Criar `.env`:
```bash
cp .env.example .env
```

3. Ajustar variaveis do banco no `.env`.

4. Instalar dependencias:
```bash
npm install
```

5. Rodar migration:
```bash
npm run migrate
```

6. Subir servidor:
```bash
npm run start
```

## Como testar
### Healthcheck
```bash
curl http://localhost:3001/health
```

### Listar pacientes
```bash
curl http://localhost:3001/api/v1/pacientes
```

### Criar paciente
```bash
curl -X POST http://localhost:3001/api/v1/pacientes \
  -H "Content-Type: application/json" \
  -d '{"nome":"Carlos","idade":32}'
```

## Testes
```bash
npm run test
```

## Rodando com Docker
Da raiz do projeto:
```bash
docker compose up -d --build
```

A API Node sobe na porta `3001`.

## Observacoes
- CORS habilitado.
- Respostas de erro seguem padrao com `message`, `code`, `status`, `timestamp` e `details` (quando existir).
