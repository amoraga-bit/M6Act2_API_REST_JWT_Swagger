const pool = require('../config/db');

async function crearReservacion(req, res) {
  try {
    const { mesa_id, fecha, hora, num_comensales } = req.body;
    if (!mesa_id || !fecha || !hora || !num_comensales) {
      return res.status(400).json({ error: 'mesa_id, fecha, hora y num_comensales son requeridos' });
    }

    const mesa = await pool.query('SELECT * FROM mesas WHERE id = $1 AND activa = TRUE', [mesa_id]);
    if (mesa.rows.length === 0) return res.status(404).json({ error: 'Mesa no disponible' });
    if (num_comensales > mesa.rows[0].capacidad) {
      return res.status(400).json({ error: 'El número de comensales excede la capacidad de la mesa' });
    }

    const ocupada = await pool.query(
      `SELECT id FROM reservaciones WHERE mesa_id = $1 AND fecha = $2 AND hora = $3 AND estado <> 'cancelada'`,
      [mesa_id, fecha, hora]
    );
    if (ocupada.rows.length > 0) return res.status(409).json({ error: 'La mesa ya está reservada en ese horario' });

    const result = await pool.query(
      `INSERT INTO reservaciones (usuario_id, mesa_id, fecha, hora, num_comensales)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [req.usuario.id, mesa_id, fecha, hora, num_comensales]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') return res.status(409).json({ error: 'La mesa ya está reservada en ese horario' });
    res.status(500).json({ error: 'Error al crear reservación' });
  }
}

module.exports = { crearReservacion };