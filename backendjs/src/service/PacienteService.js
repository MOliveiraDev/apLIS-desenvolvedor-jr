const PacienteDTO = require('../dto/PacienteDTO');

class PacienteService {
  constructor(pacienteModel) {
    this.pacienteModel = pacienteModel;
  }

  async handle(method, payload) {
    try {
      if (method === 'GET') {
        const pacientes = await this.pacienteModel.findAll();

        return {
          statusCode: 200,
          payload: pacientes.map((paciente) => paciente.toResponse()),
        };
      }

      if (method === 'POST') {
        const pacienteDTO = PacienteDTO.fromRequest(payload);
        await this.pacienteModel.create(pacienteDTO);

        return {
          statusCode: 201,
          payload: { message: 'Paciente criado com sucesso' },
        };
      }

      return {
        statusCode: 405,
        payload: { message: 'Metodo nao permitido.' },
      };
    } catch (error) {
      if (error && error.name === 'ValidationError') {
        return {
          statusCode: 422,
          payload: { message: error.message },
        };
      }

      if (error && error.code === 'ER_DUP_ENTRY') {
        return {
          statusCode: 409,
          payload: { message: 'Paciente com CPF ou carteirinha ja cadastrado.' },
        };
      }

      return {
        statusCode: 500,
        payload: {
          message: 'Erro interno no servidor.',
          error: error && error.message ? error.message : 'Erro desconhecido.',
        },
      };
    }
  }
}

module.exports = PacienteService;
