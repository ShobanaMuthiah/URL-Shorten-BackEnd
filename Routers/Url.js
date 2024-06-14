import express from 'express';
import { createShortURL, redirectURL } from '../Controllers/URLController.js';
import { authMiddleware } from '../Middleware/AuthMiddleware.js';

const router = express.Router();

router.post('/shorten', authMiddleware, createShortURL);
router.get('/:shortUrl', redirectURL);

export default router;
