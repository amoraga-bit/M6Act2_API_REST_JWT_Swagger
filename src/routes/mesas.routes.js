const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/mesas.controller');
const { verificarToken } = require('../middleware/auth');
const { requireRole } = require('../middleware/role');

/**
 * @swagger
 * /api/mesas:
 *   get:
 *     summary: Listar mesas activas (con filtro de disponibilidad opcional)
 *     tags: [Mesas]
 *     parameters:
 *       - in: query
 *         name: disponible
 *         schema: { type: boolean }
 *         description: Si es true, filtra solo mesas libres en fecha/hora dadas
 *       - in: query
 *         name: fecha
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: hora
 *         schema: { type: string, example: "19:00" }
 *     responses:
 *       200:
 *         description: Lista de mesas activas
 *   post:
 *     summary: Crear mesa (admin)
 *     tags: [Mesas]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [numero, capacidad]
 *             properties:
 *               numero: { type: integer, example: 8 }
 *               capacidad: { type: integer, example: 4 }
 *               ubicacion: { type: string, example: "Terraza" }
 *     responses:
 *       201: { description: Mesa creada }
 *       400: { description: Datos faltantes o inválidos }
 *       403: { description: Acceso denegado, requiere rol admin }
 *       409: { description: Ya existe una mesa con ese número }
 */
router.get('/', ctrl.listarMesas);
router.post('/', verificarToken, requireRole('admin'), ctrl.crearMesa);

/**
 * @swagger
 * /api/mesas/{id}:
 *   get:
 *     summary: Obtener detalle de una mesa
 *     tags: [Mesas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Detalle de la mesa }
 *       404: { description: Mesa no encontrada }
 *   put:
 *     summary: Actualizar datos de mesa (admin)
 *     tags: [Mesas]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               numero: { type: integer }
 *               capacidad: { type: integer }
 *               ubicacion: { type: string }
 *               activa: { type: boolean }
 *     responses:
 *       200: { description: Mesa actualizada }
 *       403: { description: Acceso denegado, requiere rol admin }
 *       404: { description: Mesa no encontrada }
 *   delete:
 *     summary: Desactivar mesa (soft delete, admin)
 *     tags: [Mesas]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Mesa desactivada }
 *       403: { description: Acceso denegado, requiere rol admin }
 *       404: { description: Mesa no encontrada }
 */
router.get('/:id', ctrl.obtenerMesa);
router.put('/:id', verificarToken, requireRole('admin'), ctrl.actualizarMesa);
router.delete('/:id', verificarToken, requireRole('admin'), ctrl.desactivarMesa);

module.exports = router;