import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

export const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')
  if (!token) return res.status(401).json({ error: 'Acesso negado!' })

  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET)
    req.user = decoded
    next()
    return req.user
  } catch (error) {
    res.status(401).json({ error: 'Token inválido ou expirado! faça login novamnete.' })
  }
}
