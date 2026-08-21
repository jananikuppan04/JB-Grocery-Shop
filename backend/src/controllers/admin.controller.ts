import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const totalOrders = await prisma.order.count();
    const totalProducts = await prisma.product.count();
    const totalCustomers = await prisma.user.count({ where: { role: 'CUSTOMER' } });
    
    const orders = await prisma.order.findMany({
      select: { totalAmount: true }
    });
    
    const totalSales = orders.reduce((acc, order) => acc + order.totalAmount, 0);

    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true } } }
    });

    const lowStockProducts = await prisma.product.findMany({
      where: {
        stock: { lte: 10 } // using a hardcoded threshold for now
      },
      take: 5
    });

    res.json({
      totalOrders,
      totalProducts,
      totalCustomers,
      totalSales,
      recentOrders,
      lowStockProducts
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAdminOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, email: true } },
        items: { include: { product: true } }
      }
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.body;
    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: { status }
    });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await prisma.product.create({
      data: req.body
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    await prisma.product.delete({
      where: { id: req.params.id }
    });
    res.json({ message: 'Product removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getInventory = async (req: Request, res: Response): Promise<void> => {
  try {
    const inventory = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        stock: true,
        minStock: true,
        category: { select: { name: true } }
      }
    });
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const adjustInventory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId, quantity, note } = req.body;
    
    await prisma.product.update({
      where: { id: productId },
      data: { stock: { increment: quantity } }
    });

    const movement = await prisma.stockMovement.create({
      data: {
        productId,
        quantity,
        type: 'ADJUSTMENT',
        note
      }
    });

    res.json(movement);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
