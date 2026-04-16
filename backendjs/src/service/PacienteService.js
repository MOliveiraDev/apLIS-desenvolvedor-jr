class PacienteService {
  constructor(pacienteModel) {
    this.pacienteModel = pacienteModel;
  }

  async handle(method, payload) {
    try {
      if (method === 'GET') {
        return {
          statusCode: 200,
          payload: await this.pacienteModel.findAll(),
        };
      }

      if (method === 'POST') {
        const validated = this.validatePaciente(payload);
        await this.pacienteModel.create(validated);

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

  validatePaciente(payload) {
    const nome = String((payload && payload.nome) || '').trim();
    const dataNascimento = String((payload && payload.dataNascimento) || '').trim();
    const carteirinha = String((payload && payload.carteirinha) || '').trim();
    const cpf = String((payload && payload.cpf) || '').trim();

    if (!nome || !dataNascimento || !carteirinha || !cpf) {
      this.throwValidationError('Campos obrigatorios: nome, dataNascimento, carteirinha e cpf.');
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(dataNascimento)) {
      this.throwValidationError('dataNascimento deve estar no formato YYYY-MM-DD.');
    }

    if (!/^\d{11}$/.test(cpf)) {
      this.throwValidationError('cpf deve conter 11 digitos numericos.');
    }

    return { nome, dataNascimento, carteirinha, cpf };
  }

  throwValidationError(message) {
    const error = new Error(message);
    error.name = 'ValidationError';
    throw error;
  }
}

module.exports = PacienteService;
