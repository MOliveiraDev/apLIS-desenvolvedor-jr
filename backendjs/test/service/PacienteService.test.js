const PacienteService = require('../../src/service/PacienteService');
const { MethodNotAllowedException, DuplicateResourceException } = require('../../src/exception/BackendExceptions');

describe('PacienteService', () => {
  test('handle GET deve retornar lista mapeada para response DTO', async () => {
    const fakePaciente = {
      toResponse: jest.fn().mockReturnValue({ id: 1, nome: 'Maria Souza' }),
    };

    const model = {
      findAll: jest.fn().mockResolvedValue([fakePaciente]),
      create: jest.fn(),
    };

    const service = new PacienteService(model);
    const result = await service.handle('GET', {});

    expect(model.findAll).toHaveBeenCalledTimes(1);
    expect(result.statusCode).toBe(200);
    expect(result.payload).toEqual([{ id: 1, nome: 'Maria Souza' }]);
  });

  test('handle POST deve criar paciente e retornar 201', async () => {
    const model = {
      findAll: jest.fn(),
      create: jest.fn().mockResolvedValue(undefined),
    };

    const service = new PacienteService(model);

    const result = await service.handle('POST', {
      nome: 'Joao da Silva',
      dataNascimento: '2026-01-01',
      carteirinha: '123456',
      cpf: '12345678909',
    });

    expect(model.create).toHaveBeenCalledTimes(1);
    expect(result.statusCode).toBe(201);
    expect(result.payload).toEqual({ message: 'Paciente criado com sucesso' });
  });

  test('handle metodo invalido deve lançar MethodNotAllowedException', async () => {
    const model = {
      findAll: jest.fn(),
      create: jest.fn(),
    };

    const service = new PacienteService(model);

    await expect(service.handle('PATCH', {})).rejects.toBeInstanceOf(MethodNotAllowedException);
  });

  test('handle POST com duplicidade deve lançar DuplicateResourceException', async () => {
    const duplicateError = new Error('Duplicate entry');
    duplicateError.code = 'ER_DUP_ENTRY';

    const model = {
      findAll: jest.fn(),
      create: jest.fn().mockRejectedValue(duplicateError),
    };

    const service = new PacienteService(model);

    await expect(
      service.handle('POST', {
        nome: 'Joao da Silva',
        dataNascimento: '2026-01-01',
        carteirinha: '123456',
        cpf: '12345678909',
      })
    ).rejects.toBeInstanceOf(DuplicateResourceException);
  });
});
