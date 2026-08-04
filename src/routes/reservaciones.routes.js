const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/reservaciones.controller');
const { verificarToken } = require('../middleware/auth');
const { requireRole } = require('../middleware/role');

/**
 * @swagger
 * /api/reservaciones:
 *   post:
 *     summary: Crear reservación (valida disponibilidad, cliente)
 *     tags: [Reservaciones]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [mesa_id, fecha, hora, num_comensales]
 *             properties:
 *               mesa_id: { type: integer, example: 2 }
 *               fecha: { type: string, format: date, example: "2026-08-10" }
 *               hora: { type: string, example: "20:00" }
 *               num_comensales: { type: integer, example: 3 }
 *     responses:
 *       201: { description: Reservación creada }
 *       400: { description: Datos faltantes o comensales exceden capacidad }
 *       403: { description: Acceso denegado, requiere rol cliente }
 *       404: { description: Mesa no disponible }
 *       409: { description: La mesa ya está reservada en ese horario }
 *   get:
 *     summary: Todas las reservaciones con filtros (admin)
 *     tags: [Reservaciones]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: estado
 *         schema: { type: string, enum: [pendiente, confirmada, cancelada, completada] }
 *       - in: query
 *         name: fecha
 *         schema: { type: string, format: date }
 *     responses:
 *       200: { description: Lista de reservaciones con datos de cliente y mesa }
 *       403: { description: Acceso denegado, requiere rol admin }
 */
router.post('/', verificarToken, requireRole('cliente'), ctrl.crearReservacion);
router.get('/', verificarToken, requireRole('admin'), ctrl.listarTodas);

/**
 * @swagger
 * /api/reservaciones/mis:
 *   get:
 *     summary: Mis reservaciones (usuario autenticado, cliente)
 *     tags: [Reservaciones]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Lista de reservaciones del usuario actual }
 *       403: { description: Acceso denegado, requiere rol cliente }
 */
router.get('/mis', verificarToken, requireRole('cliente'), ctrl.misReservaciones);

/**
 * @swagger
 * /api/reservaciones/{id}/estado:
 *   put:
 *     summary: Cambiar estado de reservación (admin)
 *     tags: [Reservaciones]
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
 *             required: [estado]
 *             properties:
 *               estado:
 *                 type: string
 *                 enum: [pendiente, confirmada, cancelada, completada]
 *     responses:
 *       200: { description: Estado actualizado }
 *       400: { description: Estado inválido }
 *       403: { description: Acceso denegado, requiere rol admin }
 *       404: { description: Reservación no encontrada }
 */
router.put('/:id/estado', verificarToken, requireRole('admin'), ctrl.cambiarEstado);

/**
 * @swagger
 * /api/reservaciones/{id}:
 *   delete:
 *     summary: Cancelar propia reservación (cliente)
 *     tags: [Reservaciones]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Reservación cancelada }
 *       403: { description: Acceso denegado, requiere rol cliente }
 *       404: { description: Reservación no encontrada o no pertenece al usuario }
 */
router.delete('/:id', verificarToken, requireRole('cliente'), ctrl.cancelarPropia);

module.exports = router;