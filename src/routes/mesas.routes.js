const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/mesas.controller');
const { verificarToken } = require('../middleware/auth');
const { requireRole } = require('../middleware/role');

router.get('/', ctrl.listarMesas);
router.get('/:id', ctrl.obtenerMesa);
router.post('/', verificarToken, requireRole('admin'), ctrl.crearMesa);
router.put('/:id', verificarToken, requireRole('admin'), ctrl.actualizarMesa);
router.delete('/:id', verificarToken, requireRole('admin'), ctrl.desactivarMesa);

module.exports = router;