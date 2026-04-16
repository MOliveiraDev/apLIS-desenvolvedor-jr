class PacienteController {
  constructor(pacienteService) {
    this.pacienteService = pacienteService;
  }

  async handle(req, res) {
    const result = await this.pacienteService.handle(req.method, req.body || {});
    return res.status(result.statusCode).json(result.payload);
  }
}

module.exports = PacienteController;
