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
app.use(express.json());

const port = Number(process.env.PORT || 3001);

const pacienteModel = new PacienteModel(pool);
const pacienteService = new PacienteService(pacienteModel);
const pacienteController = new PacienteController(pacienteService);

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
