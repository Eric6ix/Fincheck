import { prisma } from "../../src/lib/prisma.js"; // ajuste o caminho conforme seu projeto
import jwt from "jsonwebtoken";

export const generateRefreshToken = async (userId) => {
  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_SECRET, {
    expiresIn: "7d",
  });

  // Salva no banco (você pode criar uma tabela RefreshToken com userId e token)
  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId,
    },
  });

  return refreshToken;
};
