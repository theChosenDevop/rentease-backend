import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { createProperty, getProperties, getPropertyById, updateProperty, deleteProperty } from '../controllers/property.controller';
import { authenticate } from '../middleware/auth';
import { validate, createPropertySchema, updatePropertySchema } from '../utils/validation'

const router = Router();

/**
 * @swagger
 * /api/properties:
 *   get:
 *     summary: Get all available properties
 *     description: Public endpoint to list properties with optional filters
 *     parameters:
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Search in address, city, or state (case-insensitive)
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum monthly price
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum monthly price
 *       - in: query
 *         name: bedrooms
 *         schema:
 *           type: integer
 *         description: Number of bedrooms
 *     responses:
 *       200:
 *         description: A list of properties
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Property'
 */
router.get('/', asyncHandler(getProperties));

/**
 * @swagger
 * /api/properties/{id}:
 *   get:
 *     summary: Get a single property by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Property UUID
 *     responses:
 *       200:
 *         description: Property details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Property'
 *       404:
 *         description: Property not found
 */
router.get('/:id', getPropertyById);

/**
 * @swagger
 * /api/properties:
 *   post:
 *     summary: Create a new property (Landlord only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePropertyInput'
 *     responses:
 *       201:
 *         description: Property created 
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Property'
 *       400:
 *         description: Validation error
 *       403:
 *         description: Unauthorized (not a landlord)
 */
router.post('/', authenticate,validate(createPropertySchema), asyncHandler(createProperty));

/**
 * @swagger
 * /api/properties/{id}:
 *   put:
 *     summary: Update a property (Owner only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePropertyInput'
 *     responses:
 *       200:
 *         description: Property updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Property'
 *       400:
 *         description: Not the property owner
 *       404:
 *         description: Property not found
 */
router.put('/:id', authenticate,validate(updatePropertySchema), asyncHandler(updateProperty));



/**
 * @swagger
 * /api/properties/{id}:
 *   delete:
 *     summary: Delete a property (Owner only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Property deleted successfully
 *       403:
 *         description: Not the owner of the property
 *       404:
 *         description: Property not found
 */

router.delete('/:id', authenticate, asyncHandler(deleteProperty));

export default router;
