import * as FamilyController from '../controllers/familyController.js';
import express from 'express';

const router = express.Router();

router.get('/', FamilyController.getAllFamilies);
router.get('/:id', FamilyController.getFamilyById);
router.post('/', FamilyController.createFamily);
router.put('/:id', FamilyController.updateFamily);
router.delete('/:id', FamilyController.deleteFamily);

export default router;
