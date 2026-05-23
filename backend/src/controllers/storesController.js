import prisma from '../utils/prisma.js';

export const listStores = async (req, res, next) => {
  try {
    const { name, address, search } = req.query;
    const userId = req.user.id;

    const where = {};

    if (name) {
      where.name = { contains: name, mode: 'insensitive' };
    }
    if (address) {
      where.address = { contains: address, mode: 'insensitive' };
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
      ];
    }

    const stores = await prisma.store.findMany({
      where,
      include: {
        ratings: true,
      },
    });

    const storesWithDetails = stores.map((store) => {
      const ratings = store.ratings;
      const count = ratings.length;
      const averageRating = count > 0 ? ratings.reduce((sum, r) => sum + r.value, 0) / count : 0;
      
      const userRatingObj = ratings.find((r) => r.userId === userId);
      const userRating = userRatingObj ? userRatingObj.value : null;

      return {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        averageRating,
        userRating,
      };
    });

    res.status(200).json(storesWithDetails);
  } catch (error) {
    next(error);
  }
};
