import bcrypt from "bcrypt";
import prisma from "../../core/prisma";
import { UserCreatePayload, UserUpdatePayload } from "./types";

export const UserService = {
  async create(data: UserCreatePayload) {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error("Email address is already in use");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: hashedPassword,
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
        tips: true,
        comments: true,
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
      include: { tips: true, comments: true },
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

    const updateData: {
      email?: string;
      name?: string | null;
      password?: string;
    } = {};

    const user = await prisma.user.update({
      where: { id },
      data,
      include: {
        tips: {
          select: {
            id: true,
            createdAt: true,
            title: true,
          },
        },
        comments: {
          select: {
            id: true,
            createdAt: true,
            content: true,
          },
        },
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
