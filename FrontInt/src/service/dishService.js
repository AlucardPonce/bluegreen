import api from './api';

export const listDishes = async () => {
    const resp = await api.get('/dishes');
    return resp.data;
};

export const getDishesByRestaurant = async (restaurantId) => {
    const resp = await api.get(`/dishes/restaurant/${restaurantId}`);
    return resp.data;
};

export const getDish = async (id) => {
    const resp = await api.get(`/dishes/${id}`);
    return resp.data;
};

export const createDish = async (dishData) => {
    const resp = await api.post('/dishes', dishData);
    return resp.data;
};

export const updateDish = async (id, dishData) => {
    const resp = await api.put(`/dishes/${id}`, dishData);
    return resp.data;
};

export const deleteDish = async (id) => {
    const resp = await api.delete(`/dishes/${id}`);
    return resp.data;
};

export default {
    listDishes,
    getDishesByRestaurant,
    getDish,
    createDish,
    updateDish,
    deleteDish
};
