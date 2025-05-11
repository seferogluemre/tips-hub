import prisma from "../../core/prisma";
import { TipTagCreatePayload } from "./types";

export const TipTagService = {
  async create(data: TipTagCreatePayload) {
    // Check if the relationship already exists to avoid duplicates
    const existingTipTag = await prisma.tipTag.findFirst({
      where: {
        tipId: data.tipId,
        tagId: data.tagId,
      },
    });

    if (existingTipTag) {
      return existingTipTag;
    }

    const tipTag = await prisma.tipTag.create({
      data: {
        tipId: data.tipId,
        tagId: data.tagId,
      },
    });

    return tipTag;
  },

  async getAll({ tipId, tagId }: { tipId?: string; tagId?: string } = {}) {
    const where = {
      ...(tipId ? { tipId } : {}),
      ...(tagId ? { tagId } : {}),
    };

    const tipTags = await prisma.tipTag.findMany({
      where,
    });

    return tipTags;
  },

  async getById(id: string) {
    const tipTag = await prisma.tipTag.findUnique({
      where: { id },
    });

    if (!tipTag) return null;

    return tipTag;
  },

  async delete(id: string) {
    return prisma.tipTag.delete({
      where: { id },
    });
  },

  async deleteByTipAndTag(tipId: string, tagId: string) {
    const tipTag = await prisma.tipTag.findFirst({
      where: {
        tipId,
        tagId,
      },
    });

    if (!tipTag) return null;

    return prisma.tipTag.delete({
      where: { id: tipTag.id },
    });
  },
};
