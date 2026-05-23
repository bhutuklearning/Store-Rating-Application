import prisma from '../utils/prisma.js';

export const upsertRating = async (req, res, next) => {
  try {
    const { storeId, value } = req.body;
    const userId = req.user.id;

    // Check if store exists
    const store = await prisma.store.findUnique({ where: { id: storeId } });
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    const rating = await prisma.rating.upsert({
      where: {
        userId_storeId: {
          userId,
          storeId,
        },
      },
      update: {
        value,
      },
      create: {
        userId,
        storeId,
        value,
      },
    });

    res.status(200).json(rating);
  } catch (error) {
    next(error);
  }
};
