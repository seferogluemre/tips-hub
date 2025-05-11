import prisma from "../../core/prisma";
import { TipTagCreatePayload } from "./types";

export const TipTagService = {
  async create(data: TipTagCreatePayload) {
    // İlişkili tip ve tag varlık kontrolü
    const tip = await prisma.tip.findUnique({
      where: { id: data.tipId },
    });

    if (!tip) {
      throw new Error("Tip not found");
    }

    const tag = await prisma.tag.findUnique({
      where: { id: data.tagId },
    });

    if (!tag) {
      throw new Error("Tag not found");
    }

    // Duplicate ilişki kontrolü - aynı tip ve tag'e sahip ilişki var mı?
    const existingTipTag = await prisma.tipTag.findFirst({
      where: {
        tipId: data.tipId,
        tagId: data.tagId,
      },
    });

    if (existingTipTag) {
      return existingTipTag; // Zaten var, mevcut ilişkiyi döndür
    }

    // Yeni TipTag ilişkisi oluştur
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
      include: {
        tip: true,
        tag: true,
      },
    });

    return tipTags;
  },

  async getById(id: string) {
    const tipTag = await prisma.tipTag.findUnique({
      where: { id },
      include: {
        tip: true,
        tag: true,
      },
    });

    if (!tipTag) return null;

    return tipTag;
  },

  async delete(id: string) {
    // Önce varlık kontrolü
    const tipTag = await prisma.tipTag.findUnique({
      where: { id },
    });

    if (!tipTag) {
      throw new Error("Tip-tag relation not found");
    }

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

    if (!tipTag) {
      throw new Error("Tip-tag relation not found");
    }

    return prisma.tipTag.delete({
      where: { id: tipTag.id },
    });
  },
};
