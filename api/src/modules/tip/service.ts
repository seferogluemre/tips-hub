import prisma from '../../core/prisma';
import { TipCreatePayload } from './types';


export const TipService = {
    async create(data: TipCreatePayload) {
        return prisma.tip.create({
            data: {
                title: data.title,
                content: data.content,
                tags: {
                    connect: data.tags?.map((id: number) => ({ id })),
                },
            },
            include: {
                tags: true,
            },
        });
    },

    async getAll() {
        return prisma.tip.findMany({
            include: {
                tags: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    },

    async getById(id: string) {
        return prisma.tip.findUnique({
            where: { id },
            include: {
                tags: true,
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
                tags: true,
            },
        });
    },

    async delete(id: string) {
        return prisma.tip.delete({
            where: { id },
        });
    },
};
