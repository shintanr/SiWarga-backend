import * as MemberController from '../controllers/memberController.js';
import express from 'express';

const router = express.Router({ mergeParams: true });

router.get('/', MemberController.getMembersByFamilyId);
router.get('/:id', MemberController.getMemberById);
router.post('/', MemberController.createMember);
router.put('/:id', MemberController.updateMember);
router.delete('/:id', MemberController.deleteMember);

export default router;
