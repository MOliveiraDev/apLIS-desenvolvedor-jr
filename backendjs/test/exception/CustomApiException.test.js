const CustomApiException = require('../../src/exception/CustomApiException');
const { ValidationException } = require('../../src/exception/BackendExceptions');

describe('CustomApiException', () => {
  test('toResponse deve incluir campos esperados', () => {
    const exception = new CustomApiException({
      message: 'Erro interno no servidor.',
      details: { reason: 'Falha de teste' },
      status: 500,
      code: 'INTERNAL_ERROR',
    });

    const payload = exception.toResponse();

    expect(payload.message).toBe('Erro interno no servidor.');
    expect(payload.code).toBe('INTERNAL_ERROR');
    expect(payload.status).toBe(500);
    expect(payload.details).toEqual({ reason: 'Falha de teste' });
    expect(typeof payload.timestamp).toBe('string');
  });

  test('ValidationException deve manter status e code corretos', () => {
    const exception = new ValidationException('Payload invalido.');
    const payload = exception.toResponse();

    expect(payload.message).toBe('Payload invalido.');
    expect(payload.code).toBe('VALIDATION_ERROR');
    expect(payload.status).toBe(422);
  });
});
