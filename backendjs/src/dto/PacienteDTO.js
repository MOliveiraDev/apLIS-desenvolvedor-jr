const { ValidationException } = require('../exception/BackendExceptions');

class PacienteDTO {
  constructor({ id = null, nome, dataNascimento, carteirinha, cpf }) {
    this.id = id;
    this.nome = nome;
    this.dataNascimento = dataNascimento;
    this.carteirinha = carteirinha;
    this.cpf = cpf;
  }

  static fromRequest(payload) {
    const nome = String((payload && payload.nome) || '').trim();
    const dataNascimento = String((payload && payload.dataNascimento) || '').trim();
    const carteirinha = String((payload && payload.carteirinha) || '').trim();
    const cpf = String((payload && payload.cpf) || '').trim();

    if (!nome || !dataNascimento || !carteirinha || !cpf) {
      PacienteDTO.throwValidationError('Campos obrigatorios: nome, dataNascimento, carteirinha e cpf.');
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(dataNascimento)) {
      PacienteDTO.throwValidationError('dataNascimento deve estar no formato YYYY-MM-DD.');
    }

    if (!/^\d{11}$/.test(cpf)) {
      PacienteDTO.throwValidationError('cpf deve conter 11 digitos numericos.');
    }

    return new PacienteDTO({
      nome,
      dataNascimento,
      carteirinha,
      cpf,
    });
  }

  static fromDatabase(row) {
    return new PacienteDTO({
      id: row.id,
      nome: row.nome,
      dataNascimento: row.dataNascimento,
      carteirinha: row.carteirinha,
      cpf: row.cpf,
    });
  }

  toResponse() {
    return {
      id: this.id,
      nome: this.nome,
      dataNascimento: this.dataNascimento,
      carteirinha: this.carteirinha,
      cpf: this.cpf,
    };
  }

  toPersistence() {
    return {
      nome: this.nome,
      dataNascimento: this.dataNascimento,
      carteirinha: this.carteirinha,
      cpf: this.cpf,
    };
  }

  static throwValidationError(message) {
    throw new ValidationException(message);
  }
}

module.exports = PacienteDTO;
