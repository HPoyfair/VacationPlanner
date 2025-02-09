import express from 'express';
import type { Request, Response } from 'express';
import { User, FavoriteSearch } from '../../models/index.js';

const router = express.Router();

// Store a favorite search for a user
router.post('/:id/favorite', async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const user = await User.findByPk(id);

        if (user) {
            const { destination, date, weatherResponse, placesResponse } = req.body;
            await FavoriteSearch.create({
                destination,
                date,
                weatherResponse,
                placesResponse,
                userId: user.id
            });

            res.status(200);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

// Retrieve all favorite searches for a user
router.get('/:id/favorites', async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const user = await User.findByPk(id);

        if (user) {
            const favorites = await FavoriteSearch.findAll({
                where: { userId: user.id }
            });

            res.status(200).json(favorites);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

// Retrieve a favorite by it's ID
router.get('/favorites/:favoriteId', async (req: Request, res: Response) => {
    const { favoriteId } = req.params;
    try {
        const favorite = await FavoriteSearch.findByPk(favoriteId);

        if (favorite) {
            res.status(200).json(favorite);
        } else {
            res.status(404).json({ message: 'Record not found' });
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

// Delete a favorite search for a user
router.delete('/:id/favorite/:favoriteId', async (req: Request, res: Response) => {
    const { id, favoriteId } = req.params;
    try {
        const user = await User.findByPk(id);

        if (user) {
            const favorite = await FavoriteSearch.findByPk(favoriteId);

            if (favorite && favorite.userId === user.id) {
                await favorite.destroy();
                res.status(200).json({ message: 'Record deleted' });
                return;
            }
        }

        res.status(404).json({ message: 'Record not found' });
    } catch (err) {
        res.status(500).json(err);
    }
});

export { router as appRoutes };
