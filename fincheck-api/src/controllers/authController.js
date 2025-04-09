import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const prisma = new PrismaClient()


export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body

    // Verificar se o e-mail já está cadastrado
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) return res.status(400).json({ error: 'E-mail já cadastrado!' })

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10)

    // Criar usuário
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    })

    res.status(201).json({ message: 'Usuário registrado com sucesso!' })
  } catch (error) {
    res.status(500).json({ error: 'Erro ao registrar usuário' })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Buscar usuário no banco
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return res.status(400).json({ error: 'E-mail ou senha inválidos!' })

    // Verificar senha
    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) return res.status(400).json({ error: 'E-mail ou senha inválidos!' })

    // Gerar token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '30d' })

    res.json({ token, user: { id: user.id, name: user.name, email: user.email } })
  } catch (error) {
    res.status(500).json({ error: 'Erro ao fazer login' })
  }
}
