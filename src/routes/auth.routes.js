const express = require('express');
const router = express.Router();
const { register, login, perfil } = require('../controllers/auth.controller');
const { verificarToken } = require('../middleware/auth');

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registro de nuevo usuario (cliente)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre, email, password]
 *             properties:
 *               nombre: { type: string, example: "Ana Torres" }
 *               email: { type: string, example: "ana.torres@example.com" }
 *               password: { type: string, example: "MiPassword123!" }
 *     responses:
 *       201: { description: Usuario creado }
 *       400: { description: Faltan campos requeridos }
 *       409: { description: El email ya está registrado }
 */
router.post('/register', register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login — devuelve JWT firmado
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, example: "ana.torres@example.com" }
 *               password: { type: string, example: "MiPassword123!" }
 *     responses:
 *       200: { description: Login exitoso, devuelve token JWT y datos del usuario }
 *       400: { description: Faltan campos requeridos }
 *       401: { description: Credenciales inválidas }
 */
router.post('/login', login);

/**
 * @swagger
 * /api/auth/perfil:
 *   get:
 *     summary: Datos del usuario autenticado
 *     tags: [Auth]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Datos del perfil }
 *       401: { description: Token no proporcionado }
 *       403: { description: Token inválido o expirado }
 */
router.get('/perfil', verificarToken, perfil);

module.exports = router;