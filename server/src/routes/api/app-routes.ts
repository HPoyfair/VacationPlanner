import express from 'express';
import type { Request, Response } from 'express';
import { User, FavoriteSearch } from '../../models/index.js';
import { jwtDecode } from 'jwt-decode';

interface UserInfo {
    id: number;
    username: string;
}

const router = express.Router();

// Store a favorite search for the authenticated user
router.post('/favorite', async (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(' ')[1];
    const id = jwtDecode<UserInfo>(token!).id;

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

            res.status(200).json({ message: 'Favorite search saved' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

// Retrieve all favorite searches for the authenticated user
router.get('/favorites', async (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(' ')[1];
    const id = jwtDecode<UserInfo>(token!).id;

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
router.get('/favorite/:favoriteId', async (req: Request, res: Response) => {
    const { favoriteId } = req.params;

    const token = req.headers.authorization?.split(' ')[1];
    const id = jwtDecode<UserInfo>(token!).id;

    try {
        const favorite = await FavoriteSearch.findByPk(favoriteId);

        // Prevent a user from retrieving another user's favorite
        if (favorite && favorite.userId === id) {
            res.status(200).json(favorite);
        } else {
            res.status(404).json({ message: 'Record not found' });
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

// Delete a favorite search for a user
router.delete('/favorite/:favoriteId', async (req: Request, res: Response) => {
    const { favoriteId } = req.params;

    const token = req.headers.authorization?.split(' ')[1];
    const id = jwtDecode<UserInfo>(token!).id;

    try {
        const user = await User.findByPk(id);

        if (user) {
            const favorite = await FavoriteSearch.findByPk(favoriteId);

            // Prevent a user from deleting another user's favorite
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
