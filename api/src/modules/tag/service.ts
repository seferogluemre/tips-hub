import prisma from "../../core/prisma";
import { TagCreatePayload, TagUpdatePayload } from "./types";

export const TagService = {
  async create(data: TagCreatePayload) {
    const tag = await prisma.tag.create({
      data: {
        name: data.name,
      },
    });
    return {
      ...tag,
      createdAt: tag.createdAt || new Date(),
    };
  },

  async getAll() {
    const tags = await prisma.tag.findMany({
      orderBy: {
        name: "asc",
      },
    });
    return tags.map((tag) => ({
      ...tag,
      createdAt: tag.createdAt || new Date(),
    }));
  },

  async getById(id: string) {
    const tag = await prisma.tag.findUnique({
      where: { id },
    });
    if (!tag) return null;
    return {
      ...tag,
      createdAt: tag.createdAt || new Date(),
    };
  },

  async update(id: string, data: TagUpdatePayload) {
    const tag = await prisma.tag.update({
      where: { id },
      data: {
        name: data.name,
      },
    });
    return {
      ...tag,
      createdAt: tag.createdAt || new Date(),
    };
  },

  async delete(id: string) {
    return prisma.tag.delete({
      where: { id },
    });
  },
};
