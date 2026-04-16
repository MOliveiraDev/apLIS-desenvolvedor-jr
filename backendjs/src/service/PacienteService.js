const PacienteDTO = require('../dto/PacienteDTO');
const {
  DuplicateResourceException,
  InternalServerException,
  MethodNotAllowedException,
} = require('../exception/BackendExceptions');
const CustomApiException = require('../exception/CustomApiException');

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

      throw new MethodNotAllowedException();
    } catch (error) {
      if (error instanceof CustomApiException) {
        throw error;
      }

      if (error && error.code === 'ER_DUP_ENTRY') {
        throw new DuplicateResourceException('Paciente com CPF ou carteirinha ja cadastrado.');
      }

      throw new InternalServerException(
        'Erro interno no servidor.',
        error && error.message ? error.message : 'Erro desconhecido.'
      );
    }
  }
}

module.exports = PacienteService;
