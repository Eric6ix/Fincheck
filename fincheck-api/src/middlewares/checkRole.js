export function checkRole(...allowedRoles) {
  return (req, res, next) => {
    const { role } = req.user; // vem do JWT
    if (!allowedRoles.includes(role)) {
      return res.status(403).json({ error: "Acesso negado" });
    }
    next();
  };
}

export default checkRole;
