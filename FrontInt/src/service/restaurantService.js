import api from './api';

export const listRestaurants = async () => {
  const resp = await api.get('/restaurants');
  return resp.data;
};

export const getRestaurant = async (id) => {
  const resp = await api.get(`/restaurants/${id}`);
  return resp.data;
};

export const createRestaurant = async (restaurantData) => {
  const resp = await api.post('/restaurants', restaurantData);
  return resp.data;
};

export const updateRestaurant = async (id, restaurantData) => {
  const resp = await api.put(`/restaurants/${id}`, restaurantData);
  return resp.data;
};

export const deleteRestaurant = async (id) => {
  const resp = await api.delete(`/restaurants/${id}`);
  return resp.data;
};

export default {
  listRestaurants,
  getRestaurant,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant
};
