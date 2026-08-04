const jwt = require('jsonwebtoken');

function verificarToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer <token>"

  if (!token) return res.status(401).json({ error: 'Token no proporcionado' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      const mensaje = err.name === 'TokenExpiredError' ? 'Token expirado' : 'Token inválido';
      return res.status(403).json({ error: mensaje });
    }
    req.usuario = decoded; // { id, rol }
    next();
  });
}

module.exports = { verificarToken };