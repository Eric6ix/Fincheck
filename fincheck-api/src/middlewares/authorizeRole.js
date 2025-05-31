import { authMiddleware } from "./authMiddleware";

export function authorizeRole(...allowedRoles) {
  return (req, res, next) => {
    req.user.role = authMiddleware(req, res, () => {});
    console.log(req.user.role);
    const userRole = req.user.role; // pegamos do token

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ error: "Acesso negado" });
    }

    next();
  };
}
