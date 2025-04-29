import axios from 'axios';

 const API_BASE_URL = 'http://127.0.0.1:8000';
// const API_BASE_URL = "https://hiagox26n3.execute-api.us-east-1.amazonaws.com";

const api = {
  getOrders: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/orders`);
      return response.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  
  getOrderById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/orders/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching order ${id}:`, error);
      throw error;
    }
  },
  getProducts: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/products`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching order `, error);
      throw error;
    }
  },

  createOrder: async (orderData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/orders`, orderData);
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  updateOrder: async (id, updatedData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/orders/${id}`, updatedData);
      return response.data;
    } catch (error) {
      console.error(`Error updating order ${id}:`, error);
      throw error;
    }
  },


  deleteOrder: async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/orders/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error updating order ${id}:`, error);
      throw error;
    }
  }

};

export default api;
