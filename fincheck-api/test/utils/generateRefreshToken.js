import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js"; // ajuste o caminho conforme sua estrutura

export async function generateRefreshToken(userId) {
  const expiresIn = 60 * 60 * 24 * 7; // 7 dias

  const token = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn,
  });

  // Salva ou atualiza o token no banco
  const existingToken = await prisma.refreshToken.findUnique({
    where: { userId },
  });

  if (existingToken) {
    return await prisma.refreshToken.update({
      where: { userId },
      data: {
        token,
        expiresIn: new Date(Date.now() + expiresIn * 1000),
      },
    });
  }

  const refreshToken = await prisma.refreshToken.create({
    data: {
      userId,
      token,
      expiresIn: new Date(Date.now() + expiresIn * 1000),
    },
  });

  return refreshToken;
}
