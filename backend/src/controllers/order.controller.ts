import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const createOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { items, totalAmount, deliveryFee, taxAmount, paymentMethod, deliveryAddr } = req.body;
    const userId = req.user.id;

    if (!items || items.length === 0) {
      res.status(400).json({ message: 'No order items' });
      return;
    }

    // Auto-generate a random order number
    const orderNumber = 'ORD-' + Math.floor(100000 + Math.random() * 900000);

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId,
        totalAmount,
        deliveryFee,
        taxAmount,
        paymentMethod,
        deliveryAddr: JSON.stringify(deliveryAddr),
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          }))
        }
      },
      include: {
        items: true
      }
    });

    // Reduce stock and create stock movement
    for (const item of items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } }
      });
      await prisma.stockMovement.create({
        data: {
          productId: item.productId,
          quantity: -item.quantity,
          type: 'SALE',
          note: `Order ${orderNumber}`
        }
      });
    }

    // Clear cart
    await prisma.cartItem.deleteMany({
      where: { cart: { userId } }
    });

    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUserOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: { product: true }
        }
      }
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getOrderById = async (req: Request, res: Response): Promise<void> => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: {
        items: {
          include: { product: true }
        },
        user: {
          select: { name: true, email: true }
        }
      }
    });

    if (order && (order.userId === req.user.id || req.user.role === 'ADMIN')) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
