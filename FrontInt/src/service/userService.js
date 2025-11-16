import api from './api';

export const listUsers = async () => {
  const resp = await api.get('/users/admin');
  return resp.data;
};

export const getUser = async (id) => {
  const resp = await api.get(`/users/admin/${id}`);
  return resp.data;
};

export const createUser = async (userData) => {
  const resp = await api.post('/users/admin', userData);
  return resp.data;
};

export const updateUser = async (id, userData) => {
  const resp = await api.put(`/users/admin/${id}`, userData);
  return resp.data;
};

export const deleteUser = async (id) => {
  const resp = await api.delete(`/users/admin/${id}`);
  return resp.data;
};

export default {
  listUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
};
