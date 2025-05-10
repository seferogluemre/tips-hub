import prisma from "../../core/prisma";
import { TipCreatePayload } from "./types";

export const TipService = {
  async create(data: TipCreatePayload) {
    return await prisma.tip.create({
      data: {
        title: data.title,
        content: data.content,
        author: {
          connect: {
            id: "default-author-id",
          },
        },
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

  async update(id: string, data: Partial<TipCreatePayload>) {
    return prisma.tip.update({
      where: { id },
      data: {
        title: data.title,
        content: data.content,
        tags: data.tags
          ? {
              set: [],
              connect: data.tags.map((id: number) => ({ id })),
            }
          : undefined,
      },
      include: {
        tags: {
          select: {
            id: true,
            name: true,
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
