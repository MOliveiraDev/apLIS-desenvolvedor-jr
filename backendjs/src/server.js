const express = require('express');
const { pool } = require('./config/database');
const PacienteModel = require('./model/PacienteModel');
const PacienteService = require('./service/PacienteService');
const PacienteController = require('./controller/PacienteController');

const app = express();
app.use(express.json());

const port = Number(process.env.PORT || 3001);

const pacienteModel = new PacienteModel(pool);
const pacienteService = new PacienteService(pacienteModel);
const pacienteController = new PacienteController(pacienteService);

app.all('/api/v1/pacientes', (req, res) => {
  pacienteController.handle(req, res);
});

app.use((_req, res) => {
  return res.status(404).json({ message: 'Rota nao encontrada.' });
});

async function bootstrap() {
  try {
    app.listen(port, () => {
      console.log(`API de pacientes rodando na porta ${port}`);
    });
  } catch (error) {
    console.error('Falha ao iniciar API de pacientes:', error.message);
    process.exit(1);
  }
}

bootstrap();
