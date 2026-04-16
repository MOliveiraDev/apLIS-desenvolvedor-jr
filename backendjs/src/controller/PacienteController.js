const {
  InternalServerException,
} = require('../exception/BackendExceptions');
const CustomApiException = require('../exception/CustomApiException');

class PacienteController {
  constructor(pacienteService) {
    this.pacienteService = pacienteService;
  }

  async handle(req, res) {
    try {
      const result = await this.pacienteService.handle(req.method, req.body || {});
      return res.status(result.statusCode).json(result.payload);
    } catch (error) {
      const apiError = error instanceof CustomApiException
        ? error
        : new InternalServerException(
            'Erro interno no servidor.',
            error && error.message ? error.message : 'Erro desconhecido.'
          );

      return res.status(apiError.status).json(apiError.toResponse());
    }
  }
}

module.exports = PacienteController;
