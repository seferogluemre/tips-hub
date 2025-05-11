import prisma from "../../core/prisma";
import { BookmarkCreatePayload } from "./types";

export const BookmarkService = {
  async create(userId: string, data: BookmarkCreatePayload) {
    // İpucunun varlığını kontrol et
    const tip = await prisma.tip.findUnique({
      where: { id: data.tipId },
    });

    if (!tip) {
      throw new Error("Kaydedilmek istenen ipucu bulunamadı");
    }

    // Zaten kaydedilmiş mi kontrol et
    const existingBookmark = await prisma.bookmark.findUnique({
      where: {
        userId_tipId: {
          userId,
          tipId: data.tipId,
        },
      },
    });

    if (existingBookmark) {
      throw new Error("Bu ipucu zaten kaydedilmiş");
    }

    // Bookmark oluştur
    return await prisma.bookmark.create({
      data: {
        userId,
        tipId: data.tipId,
      },
      include: {
        tip: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  },

  async getByUser(userId: string) {
    // Kullanıcının tüm bookmarkları
    return await prisma.bookmark.findMany({
      where: { userId },
      include: {
        tip: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        user: {
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
  },

  async getById(id: string) {
    return prisma.bookmark.findUnique({
      where: { id },
      include: {
        tip: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  },

  async delete(id: string) {
    // İlişkili kayıt varsa sil
    return prisma.bookmark.delete({
      where: { id },
    });
  },

  async deleteByTipAndUser(userId: string, tipId: string) {
    // Kullanıcı ve ipucu ID'sine göre sil
    return prisma.bookmark.delete({
      where: {
        userId_tipId: {
          userId,
          tipId,
        },
      },
    });
  },
};
