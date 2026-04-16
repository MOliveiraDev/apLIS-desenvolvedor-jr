const express = require('express');
const { assertDatabaseConnection, pool } = require('./config/database');
const PacienteModel = require('./model/PacienteModel');
const PacienteService = require('./service/PacienteService');
const PacienteController = require('./controller/PacienteController');
const {
  InternalServerException,
  NotFoundException,
  StartupConfigurationException,
} = require('./exception/BackendExceptions');
const CustomApiException = require('./exception/CustomApiException');

const app = express();
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).send();
  }

  return next();
});
app.use(express.json());

const port = Number(process.env.PORT || 3001);

const pacienteModel = new PacienteModel(pool);
const pacienteService = new PacienteService(pacienteModel);
const pacienteController = new PacienteController(pacienteService);

app.get('/health', (_req, res) => {
  return res.status(200).json({
    status: 'ok',
    service: 'backendjs',
    timestamp: new Date().toISOString(),
  });
});

app.all('/api/v1/pacientes', async (req, res) => {
  await pacienteController.handle(req, res);
});

app.use((_req, res) => {
  const exception = new NotFoundException();
  return res.status(exception.status).json(exception.toResponse());
});

async function bootstrap() {
  try {
    await assertDatabaseConnection();
    app.listen(port, () => {
      console.log(`API de pacientes rodando na porta ${port}`);
    });
  } catch (error) {
    const startupError = error instanceof CustomApiException
      ? error
      : new StartupConfigurationException(
          'Falha na inicializacao da API.',
          error && error.message ? error.message : 'Erro desconhecido.'
        );
    const details = startupError.details
      ? ` | details: ${JSON.stringify(startupError.details)}`
      : '';

    console.error(
      `Falha na inicializacao da API. code=${startupError.code}: ${startupError.message}${details}`
    );
    process.exit(1);
  }
}

bootstrap();
