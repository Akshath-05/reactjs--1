import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

export const getCategories = async () => {
  const response = await api.get('/categories');
  return response.data;
};

export const getProducts = async (categoryId = null) => {
  const url = categoryId ? `/products/${categoryId}` : '/products';
  const response = await api.get(url);
  return response.data;
};

export const createOrder = async (orderData) => {
  const response = await api.post('/order', orderData);
  return response.data;
};

export const getOrders = async () => {
  const response = await api.get('/orders');
  return response.data;
};

export const validateCoupon = async (code) => {
  const response = await api.post('/coupons/validate', { code });
  return response.data;
};

export default api;
