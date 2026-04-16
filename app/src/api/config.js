export const API = {
  medicos: import.meta.env.VITE_API_MEDICOS_URL || 'http://localhost:8000/api/v1/medicos',
  pacientes: import.meta.env.VITE_API_PACIENTES_URL || 'http://localhost:3001/api/v1/pacientes',
}
