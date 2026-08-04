function requireRole(...rolesPermitidos) {
  return (req, res, next) => {
    if (!req.usuario || !rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).json({ error: `Acceso denegado: se requiere rol ${rolesPermitidos.join(' o ')}` });
    }
    next();
  };
}

module.exports = { requireRole };