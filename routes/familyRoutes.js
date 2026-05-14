import * as FamilyController from '../controllers/familyController.js';
import express from 'express';
import upload from '../middlewares/upload.js';

const router = express.Router({ mergeParams: true });

router.get('/', FamilyController.getAllFamilies);
router.get('/:id', FamilyController.getFamilyById);
router.post('/', FamilyController.createFamily);
router.put('/:id', FamilyController.updateFamily);
router.delete('/:id', FamilyController.deleteFamily);
router.post('/:familyId/upload-kk', upload.single('kk_file'), FamilyController.uploadKkFile);

export default router;
