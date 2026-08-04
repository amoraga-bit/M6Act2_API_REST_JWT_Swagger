const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/reservaciones.controller');
const { verificarToken } = require('../middleware/auth');
const { requireRole } = require('../middleware/role');

router.post('/', verificarToken, requireRole('cliente'), ctrl.crearReservacion);

module.exports = router;