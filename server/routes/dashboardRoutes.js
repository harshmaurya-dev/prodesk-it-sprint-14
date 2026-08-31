import { Router } from 'express';
import { protect } from '../middleware/authMiddleware.js';
const router = Router();
router.get('/', protect, (req, res) => res.json({ message: `Welcome to your protected dashboard, ${req.user.name}!`, user: req.user }));
export default router;
