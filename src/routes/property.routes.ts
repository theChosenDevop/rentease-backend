import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { createProperty, getProperties } from '../controllers/property.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', asyncHandler(getProperties));
router.post('/', authenticate, asyncHandler(createProperty));

export default router;
