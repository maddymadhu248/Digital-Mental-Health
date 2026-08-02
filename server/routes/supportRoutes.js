import express from 'express';
import { aiSupport, getProfile, saveAssessment, saveMood } from '../controllers/supportController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/mood', authMiddleware, saveMood);
router.post('/assessment', authMiddleware, saveAssessment);
router.get('/profile', authMiddleware, getProfile);
router.post('/ai', authMiddleware, aiSupport);

export default router;
