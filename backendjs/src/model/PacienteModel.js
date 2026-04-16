const PacienteDTO = require('../dto/PacienteDTO');

class PacienteModel {
  constructor(pool) {
    this.pool = pool;
  }

  async findAll() {
    const [rows] = await this.pool.execute(
      `SELECT
        id,
        nome,
        DATE_FORMAT(data_nascimento, '%Y-%m-%d') AS dataNascimento,
        carteirinha,
        cpf
      FROM pacientes
      ORDER BY id ASC`
    );

    return rows.map((row) => PacienteDTO.fromDatabase(row));
  }

  async create(pacienteDTO) {
    const payload = pacienteDTO.toPersistence();

    await this.pool.execute(
      `INSERT INTO pacientes (nome, data_nascimento, carteirinha, cpf)
       VALUES (?, ?, ?, ?)`,
      [payload.nome, payload.dataNascimento, payload.carteirinha, payload.cpf]
    );
  }
}

module.exports = PacienteModel;
