import { Router } from 'express';
import { createProperty, getProperties, getPropertyById, updateProperty, deleteProperty } from '../controllers/property.controller.ts';
import { authenticate } from '../middleware/auth.ts';
const router = Router();
router.get('/', getProperties);
router.get('/:id', getPropertyById);
router.use(authenticate);
router.post('/', createProperty);
router.put('/:id', updateProperty);
router.delete('/:id', deleteProperty);
export default router;
//# sourceMappingURL=property.routes.js.map