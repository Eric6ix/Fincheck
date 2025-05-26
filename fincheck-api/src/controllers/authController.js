import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { prisma } from "../lib/prisma.js";

dotenv.config();

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ error: "Fill in all fields" });

    if (password.length < 5) {
      return res
        .status(400)
        .json({ error: "Password must be at least 5 characters" });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser)
      return res.status(400).json({ error: "E-mail Already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, wallet, role: "user" },
    });
    res.status(201).json(`successfully registered user ${name}`);
  } catch (error) {
    res.status(500).json({ error: "Error by registering user" });
    console.log(error);
  }
};

export const login = async (req, res) => {
  
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ error: "Fill in all fields" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: "Credenciais inválidas" });
    

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(400).json({ error: "Credenciais inválidas" });

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Erro ao fazer login" });
  }
};
