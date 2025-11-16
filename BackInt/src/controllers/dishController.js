import * as dishService from '../services/dishService.js';

export class DishController {
    /**
     * Obtener todos los platillos
     */
    static async getAllDishes(req, res) {
        try {
            const dishes = await dishService.getAllDishes();
            res.status(200).json({
                success: true,
                data: dishes
            });
        } catch (error) {
            console.error('Error obteniendo platillos:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener platillos',
                error: error.message
            });
        }
    }

    /**
     * Obtener platillos por restaurante
     */
    static async getDishesByRestaurant(req, res) {
        try {
            const { restaurantId } = req.params;
            const dishes = await dishService.getDishesByRestaurant(restaurantId);
            res.status(200).json({
                success: true,
                data: dishes
            });
        } catch (error) {
            console.error('Error obteniendo platillos del restaurante:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener platillos del restaurante',
                error: error.message
            });
        }
    }

    /**
     * Obtener un platillo por ID
     */
    static async getDishById(req, res) {
        try {
            const { id } = req.params;
            const dish = await dishService.getDishById(id);
            res.status(200).json({
                success: true,
                data: dish
            });
        } catch (error) {
            console.error('Error obteniendo platillo:', error);
            res.status(error.message === 'Platillo no encontrado' ? 404 : 500).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Crear un nuevo platillo
     */
    static async createDish(req, res) {
        try {
            const dishData = req.body;
            const newDish = await dishService.createDish(dishData);
            res.status(201).json({
                success: true,
                message: 'Platillo creado exitosamente',
                data: newDish
            });
        } catch (error) {
            console.error('Error creando platillo:', error);
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Actualizar un platillo
     */
    static async updateDish(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;
            const updatedDish = await dishService.updateDish(id, updateData);
            res.status(200).json({
                success: true,
                message: 'Platillo actualizado exitosamente',
                data: updatedDish
            });
        } catch (error) {
            console.error('Error actualizando platillo:', error);
            res.status(error.message === 'Platillo no encontrado' ? 404 : 400).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Eliminar un platillo (soft delete)
     */
    static async deleteDish(req, res) {
        try {
            const { id } = req.params;
            const result = await dishService.deleteDish(id);
            res.status(200).json({
                success: true,
                message: result.message
            });
        } catch (error) {
            console.error('Error eliminando platillo:', error);
            res.status(error.message === 'Platillo no encontrado' ? 404 : 500).json({
                success: false,
                message: error.message
            });
        }
    }
}

export default DishController;
