import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma';


export const createProperty = async (req: Request, res: Response) => {
  try {
    console.log('Create Property endpoint hit');

    const { title, description, address, city, state, price, bedrooms, images } = req.body;
    const landlordId = (req.user as any)?.id;

    if (!title || !description || !address || !city || !state || !price || !bedrooms) {
      return res.status(400).json({ error: 'All property fields are required' });
    }

    const property = await prisma.property.create({
      data: {
        title,
        description,
        address,
        city,
        state,
        price: parseFloat(price),
        bedrooms: parseInt(bedrooms),
        images: images || [],
        landlordId
      },
      select: {
        id: true,
        title: true,
        address: true,
        city: true,
        state: true,
        price: true,
        bedrooms: true,
        createdAt: true,
        landlord: { select: { firstName: true, lastName: true, email: true } }
      }
    });

    res.status(201).json(property);
  } catch (error: any) {
    console.error(error);
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Property with this title already exists' });
    }
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * Get all properties
 */
export const getProperties = async (req: Request, res: Response) => {
  try {
    const { location, minPrice, maxPrice, bedrooms } = req.query;

    const where: any = { status: 'AVAILABLE' };

    if (location) {
      where.OR = [
        { address: { contains: location as string, mode: 'insensitive' } },
        { city: { contains: location as string, mode: 'insensitive' } },
        { state: { contains: location as string, mode: 'insensitive' } }
      ];
    }

    if (minPrice) where.price = { ...where.price, gte: parseFloat(minPrice as string) };
    if (maxPrice) where.price = { ...where.price, lte: parseFloat(maxPrice as string) };
    if (bedrooms) where.bedrooms = parseInt(bedrooms as string);

    const properties = await prisma.property.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        description: true,
        address: true,
        city: true,
        state: true,
        price: true,
        bedrooms: true,
        images: true,
        status: true,
        createdAt: true,
        landlord: { select: { firstName: true, lastName: true } }
      }
    });

    res.json(properties);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};


export const getPropertyById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: 'Property ID is required' });

    const property = await prisma.property.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        address: true,
        city: true,
        state: true,
        price: true,
        bedrooms: true,
        images: true,
        status: true,
        createdAt: true
      }
    });

    if (!property) return res.status(404).json({ error: 'Property not found' });
    res.json(property);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};


export const updateProperty = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, address, city, state, price, bedrooms, images, status } = req.body;

    if (!id) return res.status(400).json({ error: 'Property ID is required' });

    const updated = await prisma.property.update({
      where: { id, landlordId: (req.user as any)?.id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(address && { address }),
        ...(city && { city }),
        ...(state && { state }),
        ...(price && { price: parseFloat(price) }),
        ...(bedrooms && { bedrooms: parseInt(bedrooms) }),
        ...(images && { images }),
        ...(status && { status })
      },
      select: {
        id: true,
        title: true,
        address: true,
        price: true,
        status: true,
        updatedAt: true
      }
    });

    res.json(updated);
  } catch (error: any) {
    console.error(error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Property not found or not owned by you' });
    }
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteProperty = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: 'Property ID is required' });

    await prisma.property.delete({
      where: { id, landlordId: (req.user as any)?.id }
    });

    res.status(204).send();
  } catch (error: any) {
    console.error(error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Property not found or not owned by you' });
    }
    res.status(500).json({ error: 'Server error' });
  }
};
