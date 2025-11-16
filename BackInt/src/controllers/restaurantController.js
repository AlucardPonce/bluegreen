import restaurantService from '../services/restaurantService.js';

export class RestaurantController {
    // GET /restaurants - Obtener todos los restaurantes
    static async getAllRestaurants(req, res) {
        try {
            const restaurants = await restaurantService.getAllRestaurants();
            res.status(200).json({
                success: true,
                data: restaurants
            });
        } catch (error) {
            console.error('Error obteniendo restaurantes:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener restaurantes'
            });
        }
    }

    // GET /restaurants/:id - Obtener un restaurante por ID
    static async getRestaurantById(req, res) {
        try {
            const { id } = req.params;
            const restaurant = await restaurantService.getRestaurantById(id);

            res.status(200).json({
                success: true,
                data: restaurant
            });
        } catch (error) {
            console.error('Error obteniendo restaurante:', error);

            if (error.message === 'Restaurante no encontrado') {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }

            res.status(500).json({
                success: false,
                message: 'Error al obtener restaurante'
            });
        }
    }

    // POST /restaurants - Crear nuevo restaurante
    static async createRestaurant(req, res) {
        try {
            const { name, schedule, latitude, longitude } = req.body;

            const newRestaurant = await restaurantService.createRestaurant({
                name,
                schedule,
                latitude,
                longitude
            });

            res.status(201).json({
                success: true,
                message: 'Restaurante creado exitosamente',
                data: newRestaurant
            });
        } catch (error) {
            console.error('Error creando restaurante:', error);

            if (error.message.includes('requerido') || error.message.includes('inválida')) {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }

            res.status(500).json({
                success: false,
                message: 'Error al crear restaurante'
            });
        }
    }

    // PUT /restaurants/:id - Actualizar restaurante
    static async updateRestaurant(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;

            const updatedRestaurant = await restaurantService.updateRestaurant(id, updateData);

            res.status(200).json({
                success: true,
                message: 'Restaurante actualizado exitosamente',
                data: updatedRestaurant
            });
        } catch (error) {
            console.error('Error actualizando restaurante:', error);

            if (error.message === 'Restaurante no encontrado') {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }

            res.status(500).json({
                success: false,
                message: 'Error al actualizar restaurante'
            });
        }
    }

    // DELETE /restaurants/:id - Eliminar restaurante (soft delete)
    static async deleteRestaurant(req, res) {
        try {
            const { id } = req.params;

            await restaurantService.deleteRestaurant(id);

            res.status(200).json({
                success: true,
                message: 'Restaurante eliminado exitosamente'
            });
        } catch (error) {
            console.error('Error eliminando restaurante:', error);

            if (error.message === 'Restaurante no encontrado') {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }

            res.status(500).json({
                success: false,
                message: 'Error al eliminar restaurante'
            });
        }
    }
}
