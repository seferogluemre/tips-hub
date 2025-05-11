import prisma from "../../core/prisma";
import { CommentCreatePayload, CommentUpdatePayload } from "./types";

export const CommentService = {
  async create(data: CommentCreatePayload) {
    const comment = await prisma.comment.create({
      data: {
        content: data.content,
        tipId: data.tipId,
        authorId: data.authorId,
      },
    });
    return {
      ...comment,
      createdAt: comment.createdAt || new Date(),
    };
  },

  async getAll({
    tipId,
    authorId,
  }: { tipId?: string; authorId?: string } = {}) {
    const where = {
      ...(tipId ? { tipId } : {}),
      ...(authorId ? { authorId } : {}),
    };

    const comments = await prisma.comment.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
    });

    return comments.map((comment) => ({
      ...comment,
      createdAt: comment.createdAt || new Date(),
    }));
  },

  async getById(id: string) {
    const comment = await prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) return null;

    return {
      ...comment,
      createdAt: comment.createdAt || new Date(),
    };
  },

  async update(id: string, data: CommentUpdatePayload) {
    const comment = await prisma.comment.update({
      where: { id },
      data: {
        ...(data.content !== undefined ? { content: data.content } : {}),
      },
    });

    return {
      ...comment,
      createdAt: comment.createdAt || new Date(),
    };
  },

  async delete(id: string) {
    return prisma.comment.delete({
      where: { id },
    });
  },
};
