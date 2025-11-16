import express from 'express';
import { DishController } from '../controllers/dishController.js';
import { UserController } from '../controllers/userController.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(UserController.authenticateToken);

// Obtener todos los platillos
router.get('/',
    DishController.getAllDishes
);

// Obtener platillos por restaurante
router.get('/restaurant/:restaurantId',
    DishController.getDishesByRestaurant
);

// Obtener un platillo por ID
router.get('/:id',
    DishController.getDishById
);

// Crear un nuevo platillo
router.post('/',
    UserController.authorizeAdmin,
    DishController.createDish
);

// Actualizar un platillo
router.put('/:id',
    UserController.authorizeAdmin,
    DishController.updateDish
);

// Eliminar un platillo (soft delete)
router.delete('/:id',
    UserController.authorizeAdmin,
    DishController.deleteDish
);

export default router;
