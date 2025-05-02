import { generateRefreshToken } from "../../test/utils/tokens.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { prisma } from "../lib/prisma.js";

dotenv.config();


export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Verificar se o e-mail já está cadastrado
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser)
      return res.status(400).json({ error: "E-mail já cadastrado!" });

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar usuário
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role:"user" },
    });

    res
      .status(201)
      .json({ message: `${user.role} ${user.name} registrado com sucesso!` });
  } catch (error) {
    res.status(500).json({ error: "Erro ao registrar usuário" });
    console.log(error);
  }
};

    // Gera e salva o Refresh Token
export const refreshToken = async (req, res) => {
  const token = req.cookies?.refreshToken;

  if (!token) return res.status(401).json({ error: "Token ausente" });

  try {
    const decoded = jwt.verify(token, process.env.REFRESH_SECRET);

    const newAccessToken = generateAccessToken(decoded.userId);

    res.json({ token: newAccessToken });
  } catch (err) {
    res.status(403).json({ error: "Token inválido ou expirado" });
  }
};


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
      return res.status(400).json({ error: "E-mail ou senha inválidos!" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(400).json({ error: "E-mail ou senha inválidos!" });

    // Access Token com expiração curta
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1m" }
    );

    // Gera e salva o Refresh Token
    const refreshToken = await generateRefreshToken(user.id);

    res.json({
      token,
      refreshToken, // envia para o frontend
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao fazer login" });
  }
};
