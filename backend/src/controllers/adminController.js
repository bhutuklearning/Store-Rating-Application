import bcrypt from 'bcryptjs';
import prisma from '../utils/prisma.js';

export const getAdminDashboard = async (req, res, next) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalStores = await prisma.store.count();
    const totalRatings = await prisma.rating.count();

    res.status(200).json({
      totalUsers,
      totalStores,
      totalRatings
    });
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const { name, email, password, address, role } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        address,
        role,
      },
    });

    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      address: user.address,
      createdAt: user.createdAt
    });
  } catch (error) {
    next(error);
  }
};

export const createStore = async (req, res, next) => {
  try {
    const { name, email, address, ownerId } = req.body;

    const owner = await prisma.user.findUnique({ where: { id: ownerId } });
    if (!owner) {
      return res.status(400).json({ message: 'Owner user not found' });
    }

    if (owner.role !== 'STORE_OWNER') {
      return res.status(400).json({ message: 'The selected user must have the STORE_OWNER role' });
    }

    const existingStore = await prisma.store.findUnique({ where: { ownerId } });
    if (existingStore) {
      return res.status(400).json({ message: 'This store owner already owns a store' });
    }

    const store = await prisma.store.create({
      data: {
        name,
        email,
        address,
        ownerId,
      },
    });

    res.status(201).json(store);
  } catch (error) {
    next(error);
  }
};

export const listUsers = async (req, res, next) => {
  try {
    const { name, email, address, role, sortBy, sortOrder } = req.query;

    const where = {};

    if (name) {
      where.name = { contains: name, mode: 'insensitive' };
    }
    if (email) {
      where.email = { contains: email, mode: 'insensitive' };
    }
    if (address) {
      where.address = { contains: address, mode: 'insensitive' };
    }
    if (role) {
      where.role = role;
    }

    const orderBy = {};
    if (sortBy && ['name', 'email', 'address', 'role', 'createdAt'].includes(sortBy)) {
      orderBy[sortBy] = sortOrder === 'desc' ? 'desc' : 'asc';
    } else {
      orderBy.createdAt = 'desc';
    }

    const users = await prisma.user.findMany({
      where,
      orderBy,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        address: true,
        createdAt: true,
      },
    });

    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const listStores = async (req, res, next) => {
  try {
    const { name, email, address, sortBy, sortOrder } = req.query;

    const where = {};
    if (name) {
      where.name = { contains: name, mode: 'insensitive' };
    }
    if (email) {
      where.email = { contains: email, mode: 'insensitive' };
    }
    if (address) {
      where.address = { contains: address, mode: 'insensitive' };
    }

    const stores = await prisma.store.findMany({
      where,
      include: {
        ratings: true,
        owner: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    let storesWithAvg = stores.map((store) => {
      const count = store.ratings.length;
      const averageRating = count > 0 ? store.ratings.reduce((sum, r) => sum + r.value, 0) / count : 0;
      return {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        ownerId: store.ownerId,
        ownerName: store.owner?.name || 'Unknown',
        createdAt: store.createdAt,
        averageRating,
      };
    });

    if (sortBy === 'averageRating') {
      storesWithAvg.sort((a, b) => {
        return sortOrder === 'desc' ? b.averageRating - a.averageRating : a.averageRating - b.averageRating;
      });
    } else if (sortBy && ['name', 'email', 'address', 'createdAt'].includes(sortBy)) {
      storesWithAvg.sort((a, b) => {
        let valA = a[sortBy];
        let valB = b[sortBy];
        if (typeof valA === 'string') {
          valA = valA.toLowerCase();
          valB = valB.toLowerCase();
        }
        if (valA < valB) return sortOrder === 'desc' ? 1 : -1;
        if (valA > valB) return sortOrder === 'desc' ? -1 : 1;
        return 0;
      });
    }

    res.status(200).json(storesWithAvg);
  } catch (error) {
    next(error);
  }
};

export const getUserDetail = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        store: {
          include: {
            ratings: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let averageRating = null;
    let storeInfo = null;

    if (user.role === 'STORE_OWNER' && user.store) {
      const ratings = user.store.ratings;
      averageRating = ratings.length > 0 ? ratings.reduce((sum, r) => sum + r.value, 0) / ratings.length : 0;
      storeInfo = {
        id: user.store.id,
        name: user.store.name,
        email: user.store.email,
        address: user.store.address,
        averageRating,
      };
    }

    res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      address: user.address,
      createdAt: user.createdAt,
      store: storeInfo,
    });
  } catch (error) {
    next(error);
  }
};
