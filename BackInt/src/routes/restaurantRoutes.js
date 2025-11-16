import express from 'express';
import { RestaurantController } from '../controllers/restaurantController.js';
import { UserController } from '../controllers/userController.js';

const router = express.Router();

// Rutas de restaurantes (todas requieren autenticación y rol admin)
router.get(
    '/',
    UserController.authenticateToken,
    RestaurantController.getAllRestaurants
);

router.get(
    '/:id',
    UserController.authenticateToken,
    RestaurantController.getRestaurantById
);

router.post(
    '/',
    UserController.authenticateToken,
    UserController.authorizeAdmin,
    RestaurantController.createRestaurant
);

router.put(
    '/:id',
    UserController.authenticateToken,
    UserController.authorizeAdmin,
    RestaurantController.updateRestaurant
);

router.delete(
    '/:id',
    UserController.authenticateToken,
    UserController.authorizeAdmin,
    RestaurantController.deleteRestaurant
);

export default router;
