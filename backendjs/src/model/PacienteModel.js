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

    return rows;
  }

  async create({ nome, dataNascimento, carteirinha, cpf }) {
    await this.pool.execute(
      `INSERT INTO pacientes (nome, data_nascimento, carteirinha, cpf)
       VALUES (?, ?, ?, ?)`,
      [nome, dataNascimento, carteirinha, cpf]
    );
  }
}

module.exports = PacienteModel;
