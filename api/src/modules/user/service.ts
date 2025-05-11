import prisma from "../../core/prisma";
import { UserCreatePayload, UserUpdatePayload } from "./types";

export const UserService = {
  async create(data: UserCreatePayload) {
    const user = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
      },
    });
    return {
      ...user,
      createdAt: user.createdAt || new Date(),
    };
  },

  async getAll(search?: string) {
    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};

    const users = await prisma.user.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
    });

    return users.map((user) => ({
      ...user,
      createdAt: user.createdAt || new Date(),
    }));
  },

  async getById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) return null;

    return {
      ...user,
      createdAt: user.createdAt || new Date(),
    };
  },

  async update(id: string, data: UserUpdatePayload) {
    const user = await prisma.user.update({
      where: { id },
      data: {
        ...(data.email ? { email: data.email } : {}),
        ...(data.name !== undefined ? { name: data.name } : {}),
      },
    });

    return {
      ...user,
      createdAt: user.createdAt || new Date(),
    };
  },

  async delete(id: string) {
    return prisma.user.delete({
      where: { id },
    });
  },
};
