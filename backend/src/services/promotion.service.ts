import prisma from '../config/db';

export class PromotionService {
  async getActivePromotions() {
    return prisma.promotion.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}

export const promotionService = new PromotionService();
