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

async function misReservaciones(req, res) {
  try {
    const result = await pool.query(
      'SELECT * FROM reservaciones WHERE usuario_id = $1 ORDER BY fecha, hora',
      [req.usuario.id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener reservaciones' });
  }
}

async function listarTodas(req, res) {
  try {
    const { estado, fecha } = req.query;
    const condiciones = [];
    const valores = [];
    if (estado) { valores.push(estado); condiciones.push(`estado = $${valores.length}`); }
    if (fecha) { valores.push(fecha); condiciones.push(`fecha = $${valores.length}`); }
    const where = condiciones.length ? `WHERE ${condiciones.join(' AND ')}` : '';

    const result = await pool.query(
      `SELECT r.*, u.nombre AS cliente, m.numero AS mesa_numero
       FROM reservaciones r
       JOIN usuarios u ON u.id = r.usuario_id
       JOIN mesas m ON m.id = r.mesa_id
       ${where}
       ORDER BY fecha, hora`,
      valores
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al listar reservaciones' });
  }
}

const ESTADOS_VALIDOS = ['pendiente', 'confirmada', 'cancelada', 'completada'];

async function cambiarEstado(req, res) {
  try {
    const { estado } = req.body;
    if (!ESTADOS_VALIDOS.includes(estado)) {
      return res.status(400).json({ error: `estado debe ser uno de: ${ESTADOS_VALIDOS.join(', ')}` });
    }
    const result = await pool.query('UPDATE reservaciones SET estado = $1 WHERE id = $2 RETURNING *', [estado, req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Reservación no encontrada' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al cambiar estado' });
  }
}

async function cancelarPropia(req, res) {
  try {
    const result = await pool.query(
      `UPDATE reservaciones SET estado = 'cancelada' WHERE id = $1 AND usuario_id = $2 RETURNING *`,
      [req.params.id, req.usuario.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Reservación no encontrada o no pertenece al usuario' });
    }
    res.json({ mensaje: 'Reservación cancelada', reservacion: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Error al cancelar reservación' });
  }
}

module.exports = { crearReservacion, misReservaciones, listarTodas, cambiarEstado, cancelarPropia };