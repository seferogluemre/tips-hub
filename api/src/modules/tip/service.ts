import prisma from "../../core/prisma";
import { TipCreatePayload, TipUpdatePayload } from "./types";

export const TipService = {
  async create(data: TipCreatePayload) {
    return await prisma.tip.create({
      data: {
        title: data.title,
        content: data.content,
        authorId: data.authorId,
      },
      include: {
        tags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  },

  async getAll() {
    const tips = await prisma.tip.findMany({
      include: {
        tags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return tips.map((tip) => ({
      ...tip,
      tags: tip.tags.map((t) => t.tag),
      author: {
        id: tip.author.id,
        name: tip.author.name || "",
      },
    }));
  },

  async getById(id: string) {
    return prisma.tip.findUnique({
      where: { id },
      include: {
        tags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  },

  async update(id: string, data: TipUpdatePayload) {
    return prisma.tip.update({
      where: { id },
      data: {
        title: data.title,
        content: data.content,
      },
      include: {
        tags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  },

  async delete(id: string) {
    return prisma.tip.delete({
      where: { id },
    });
  },
};
