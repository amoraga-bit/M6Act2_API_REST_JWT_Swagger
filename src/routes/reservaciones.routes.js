const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/reservaciones.controller');
const { verificarToken } = require('../middleware/auth');
const { requireRole } = require('../middleware/role');

router.post('/', verificarToken, requireRole('cliente'), ctrl.crearReservacion);
router.get('/mis', verificarToken, requireRole('cliente'), ctrl.misReservaciones);
router.get('/', verificarToken, requireRole('admin'), ctrl.listarTodas);
router.put('/:id/estado', verificarToken, requireRole('admin'), ctrl.cambiarEstado);
router.delete('/:id', verificarToken, requireRole('cliente'), ctrl.cancelarPropia);

module.exports = router;