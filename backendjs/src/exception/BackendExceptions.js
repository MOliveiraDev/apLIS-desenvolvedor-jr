const CustomApiException = require('./CustomApiException');

class ValidationException extends CustomApiException {
  constructor(message, details = '') {
    super({
      message,
      details,
      status: 422,
      code: 'VALIDATION_ERROR',
    });
  }
}

class MethodNotAllowedException extends CustomApiException {
  constructor(message = 'Metodo nao permitido.', details = '') {
    super({
      message,
      details,
      status: 405,
      code: 'METHOD_NOT_ALLOWED',
    });
  }
}

class DuplicateResourceException extends CustomApiException {
  constructor(message, details = '') {
    super({
      message,
      details,
      status: 409,
      code: 'DUPLICATE_RESOURCE',
    });
  }
}

class NotFoundException extends CustomApiException {
  constructor(message = 'Rota nao encontrada.', details = '') {
    super({
      message,
      details,
      status: 404,
      code: 'NOT_FOUND',
    });
  }
}

class StartupConfigurationException extends CustomApiException {
  constructor(message, details = '') {
    super({
      message,
      details,
      status: 500,
      code: 'STARTUP_CONFIGURATION_ERROR',
    });
  }
}

class InternalServerException extends CustomApiException {
  constructor(message = 'Erro interno no servidor.', details = '') {
    super({
      message,
      details,
      status: 500,
      code: 'INTERNAL_ERROR',
    });
  }
}

module.exports = {
  DuplicateResourceException,
  InternalServerException,
  MethodNotAllowedException,
  NotFoundException,
  StartupConfigurationException,
  ValidationException,
};
