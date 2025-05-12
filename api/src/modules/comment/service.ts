import prisma from "../../core/prisma";
import { CommentCreatePayload, CommentUpdatePayload } from "./types";

export const CommentService = {
  async create(data: CommentCreatePayload) {
    const tip = await prisma.tip.findUnique({
      where: { id: data.tipId },
    });
    const user = await prisma.user.findUnique({
      where: { id: data.authorId },
    });

    if (!user) {
      throw new Error("User not found");
    }

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
    const comment = await prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) {
      throw new Error("Comment not found");
    }

    const updateData: { content?: string } = {};

    if (data.content !== undefined) {
      updateData.content = data.content;
    }

    if (Object.keys(updateData).length === 0) {
      return this.getById(id);
    }

    const updatedComment = await prisma.comment.update({
      where: { id },
      data: updateData,
    });

    return {
      ...updatedComment,
      createdAt: updatedComment.createdAt || new Date(),
    };
  },

  async delete(id: string) {
    return prisma.comment.delete({
      where: { id },
    });
  },
};
