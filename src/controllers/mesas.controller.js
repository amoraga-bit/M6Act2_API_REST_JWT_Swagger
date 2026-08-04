const pool = require('../config/db');

async function listarMesas(req, res) {
  try {
    const { disponible, fecha, hora } = req.query;
    let mesas;

    if (disponible === 'true' && fecha && hora) {
      const result = await pool.query(
        `SELECT m.* FROM mesas m
         WHERE m.activa = TRUE
         AND m.id NOT IN (
           SELECT mesa_id FROM reservaciones
           WHERE fecha = $1 AND hora = $2 AND estado <> 'cancelada'
         )
         ORDER BY m.numero`,
        [fecha, hora]
      );
      mesas = result.rows;
    } else {
      const result = await pool.query('SELECT * FROM mesas WHERE activa = TRUE ORDER BY numero');
      mesas = result.rows;
    }
    res.json(mesas);
  } catch (error) {
    res.status(500).json({ error: 'Error al listar mesas' });
  }
}

async function obtenerMesa(req, res) {
  try {
    const result = await pool.query('SELECT * FROM mesas WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Mesa no encontrada' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener mesa' });
  }
}

async function crearMesa(req, res) {
  try {
    const { numero, capacidad, ubicacion } = req.body;
    if (!numero || !capacidad) return res.status(400).json({ error: 'numero y capacidad son requeridos' });

    const result = await pool.query(
      `INSERT INTO mesas (numero, capacidad, ubicacion) VALUES ($1, $2, $3) RETURNING *`,
      [numero, capacidad, ubicacion]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') return res.status(409).json({ error: 'Ya existe una mesa con ese número' });
    res.status(500).json({ error: 'Error al crear mesa' });
  }
}

async function actualizarMesa(req, res) {
  try {
    const { numero, capacidad, ubicacion, activa } = req.body;
    const result = await pool.query(
      `UPDATE mesas SET
         numero = COALESCE($1, numero),
         capacidad = COALESCE($2, capacidad),
         ubicacion = COALESCE($3, ubicacion),
         activa = COALESCE($4, activa)
       WHERE id = $5 RETURNING *`,
      [numero, capacidad, ubicacion, activa, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Mesa no encontrada' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar mesa' });
  }
}

async function desactivarMesa(req, res) {
  try {
    const result = await pool.query(`UPDATE mesas SET activa = FALSE WHERE id = $1 RETURNING *`, [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Mesa no encontrada' });
    res.json({ mensaje: 'Mesa desactivada', mesa: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Error al desactivar mesa' });
  }
}

module.exports = { listarMesas, obtenerMesa, crearMesa, actualizarMesa, desactivarMesa };