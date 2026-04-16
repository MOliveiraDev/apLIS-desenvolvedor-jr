const PacienteController = require('../../src/controller/PacienteController');
const { MethodNotAllowedException } = require('../../src/exception/BackendExceptions');

describe('PacienteController', () => {
  function makeRes() {
    return {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  }

  test('handle deve responder sucesso quando service resolve', async () => {
    const service = {
      handle: jest.fn().mockResolvedValue({
        statusCode: 200,
        payload: [{ id: 1, nome: 'Maria Souza' }],
      }),
    };

    const controller = new PacienteController(service);
    const req = { method: 'GET', body: {} };
    const res = makeRes();

    await controller.handle(req, res);

    expect(service.handle).toHaveBeenCalledWith('GET', {});
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([{ id: 1, nome: 'Maria Souza' }]);
  });

  test('handle deve serializar CustomApiException quando service rejeita', async () => {
    const service = {
      handle: jest.fn().mockRejectedValue(new MethodNotAllowedException()),
    };

    const controller = new PacienteController(service);
    const req = { method: 'PUT', body: {} };
    const res = makeRes();

    await controller.handle(req, res);

    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Metodo nao permitido.',
        code: 'METHOD_NOT_ALLOWED',
        status: 405,
      })
    );
  });
});
