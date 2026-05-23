import prisma from '../utils/prisma.js';

export const getOwnerDashboard = async (req, res, next) => {
  try {
    const ownerId = req.user.id;

    // Find the store associated with this owner
    const store = await prisma.store.findUnique({
      where: { ownerId },
      include: {
        ratings: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!store) {
      return res.status(404).json({ message: 'Store not found for this owner' });
    }

    const ratings = store.ratings;
    const count = ratings.length;
    const averageRating = count > 0 ? ratings.reduce((sum, r) => sum + r.value, 0) / count : 0;

    const reviewers = ratings.map((r) => ({
      name: r.user.name,
      email: r.user.email,
      rating: r.value,
      date: r.createdAt,
    }));

    res.status(200).json({
      storeName: store.name,
      averageRating,
      reviewers,
    });
  } catch (error) {
    next(error);
  }
};
