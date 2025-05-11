import prisma from "../../core/prisma";
import { UserCreatePayload, UserUpdatePayload } from "./types";

export const UserService = {
  async create(data: UserCreatePayload) {
    if (!data.name || data.name.trim() === "") {
      throw new Error("Name is required");
    }

    if (!data.email || data.email.trim() === "") {
      throw new Error("Email is required");
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error("Email address is already in use");
    }

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
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
      ];
    }

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
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        tips: {
          select: {
            id: true,
            title: true,
            createdAt: true,
          },
        },
        comments: {
          select: {
            id: true,
            content: true,
            createdAt: true,
          },
        },
      },
    });

    if (!user) return null;

    return {
      ...user,
      createdAt: user.createdAt || new Date(),
    };
  },

  async update(id: string, data: UserUpdatePayload) {
    const currentUser = await prisma.user.findUnique({
      where: { id },
      select: { email: true, name: true },
    });

    if (!currentUser) {
      throw new Error("User not found");
    }

    if (data.email && data.email !== currentUser.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
      });

      if (existingUser) {
        throw new Error("Email address is already in use");
      }
    }

    const updateData: { email?: string; name?: string | null } = {};

    if (data.email !== undefined) {
      updateData.email = data.email;
    }

    if (data.name !== undefined) {
      updateData.name = data.name;
    }

    if (Object.keys(updateData).length === 0) {
      return this.getById(id);
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
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
