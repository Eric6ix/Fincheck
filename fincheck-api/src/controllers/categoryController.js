import { prisma } from "../lib/prisma.js";

export const createCategory = async (req, res) => {
  const { name } = req.body;
  const userId = req.user.userId;

  try {
    const category = await prisma.category.create({
      data: {
        name,
        userId, // Relaciona corretamente o user via ID
      },
    });

    res.status(201).json(category);
  } catch (error) {
    console.error("Erro ao criar categoria:", error);
    res.status(500).json({ error: "Erro ao criar categoria" });
  }
};

export const getCategory = async (req, res) => {
  const userId = req.user.userId;
  const { name } = req.query;

  try {
    const filter = {
      userId, // ← Busca apenas categorias do usuário autenticado
      ...(name && { name: { contains: name, mode: "insensitive" } }) // ← Filtro opcional por nome
    };

    const category = await prisma.category.findMany({
      where: filter,
      orderBy: { name: "asc" }, // ← Melhor ordenar por nome nesse caso
    });

    res.status(200).json(category)
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar categorias" });
    console.error(error);
  }
};

export const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const existing = await prisma.category.findUnique({ where: { id } });

    if (!existing) {
      return res.status(404).json({ error: "Categoria não encontrada" });
    }

    const updated = await prisma.category.update({
      where: { id },
      data: { name },
    });

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao atualizar Categoria" });
  }
};


export const deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const existing = await prisma.category.findUnique({ where: { id } });

    if (!existing) {
      return res.status(404).json({ error: "Categoria não encontrada" });
    }

    await prisma.category.delete({ where: { id } });

    console.log(`Categoria "${existing.name}" deletada com sucesso`);
    res.status(204).end(); // 204 = No Content
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar categoria" });
  }
};

