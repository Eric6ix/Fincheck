export function authorizeRole(...allowedRoles) {
  return (req, res, next) => {
    const userRole = req.user.role; // pegamos do token

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ error: "Acesso negado" });
    }

    next();
  };
}
