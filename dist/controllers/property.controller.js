import { prisma } from '../lib/prisma.ts';
export const createProperty = async (req, res) => {
    const { title, description, address, city, state, price, bedrooms, images } = req.body;
    const landlordId = req.user.id;
    try {
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
                landlord: {
                    select: { firstName: true, lastName: true, email: true }
                }
            }
        });
    }
    catch (error) {
        if (error.code === 'P2002') {
            return res.status(400).json({ error: 'Property with this title already exists' });
        }
    }
};
export const getProperties = async (req, res) => {
    const { location, minPrice, maxPrice, bedrooms } = req.query;
    try {
        const where = { status: 'AVAILABLE' };
        // Location search (case-insensitive, anywhere in address/city/state)
        if (location) {
            where.OR = [
                { address: { contains: location, mode: 'insensitive' } },
                { city: { contains: location, mode: 'insensitive' } },
                { state: { contains: location, mode: 'insensitive' } }
            ];
        }
        // Price filters
        if (minPrice)
            where.price = { ...where.price, gte: parseFloat(minPrice) };
        if (maxPrice)
            where.price = { ...where.price, lte: parseFloat(maxPrice) };
        // Bedrooms
        if (bedrooms)
            where.bedrooms = parseInt(bedrooms);
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
                landlord: {
                    select: { firstName: true, lastName: true }
                }
            }
        });
        res.json(properties);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};
export const getPropertyById = async (req, res) => {
    const { id } = req.params;
    if (!id)
        return res.status(400).json({ error: 'Property ID is required' });
    try {
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
                createdAt: true,
            }
        });
        if (!property)
            return res.status(404).json({ error: 'Property not found' });
        res.json(property);
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
export const updateProperty = async (req, res) => {
    const { id } = req.params;
    const { title, description, address, city, state, price, bedrooms, images, status } = req.body;
    if (!id)
        return res.status(400).json({ error: 'Property ID is required' });
    try {
        const updated = await prisma.property.update({
            where: { id, landlordId: req.user.id },
            data: {
                ...title && { title },
                ...description && { description },
                ...address && { address },
                ...city && { city },
                ...state && { state },
                ...price && { price: parseFloat(price) },
                ...bedrooms && { bedrooms: parseInt(bedrooms) },
                ...images && { images },
                ...status && { status }
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
    }
    catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Property not found or property not owned by you' });
        }
        res.status(500).json({ error: 'Server error' });
    }
};
export const deleteProperty = async (req, res) => {
    const { id } = req.params;
    if (!id)
        return res.status(400).json({ message: 'Property ID is required' });
    try {
        await prisma.property.delete({
            where: { id, landlordId: req.user.id }
        });
        res.status(204).send();
    }
    catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Property not found or owned by you' });
        }
        res.status(500).json({ error: 'Server error' });
    }
};
//# sourceMappingURL=property.controller.js.map