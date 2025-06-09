// apiService.ts
import axios from "axios";

// Base URL for API requests
const BASE_URL = "https://server.welfarecanteen.in/api";

// Get token from localStorage or wherever you store it
const getToken = () => {
  return localStorage.getItem("Token") || "";
};
// console.log(getToken(), "tokennn");

// Create axios instance with default configurations
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to add auth token for each request
apiClient.interceptors.request.use(
  (config) => {
    config.headers.Authorization = `${getToken()}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Canteen API services
export const canteenService = {
  // Fetch all canteens
  getAllCanteens: async () => {
    try {
      const response = await apiClient.get("/canteen/getAllCanteens");
      return response.data;
    } catch (error) {
      console.error("Error fetching canteens:", error);
      throw error;
    }
  },

  // Create a new canteen
  createCanteen: async (canteenData: FormData) => {
    try {
      const response = await apiClient.post(
        "/canteen/createCanteen",
        canteenData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating canteen:", error);
      throw error;
    }
  },

  // Get single canteen by ID
  getCanteenById: async (canteenId: number) => {
    try {
      const response = await apiClient.get(`/canteen/${canteenId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching canteen with ID ${canteenId}:`, error);
      throw error;
    }
  },

  // Update canteen
  updateCanteen: async (canteenId: number, canteenData: FormData) => {
    try {
      const response = await apiClient.put(
        `/canteen/${canteenId}`,
        canteenData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating canteen with ID ${canteenId}:`, error);
      throw error;
    }
  },

  // Delete canteen
  deleteCanteen: async (canteenId: number) => {
    try {
      const response = await apiClient.delete(`/canteen/${canteenId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting canteen with ID ${canteenId}:`, error);
      throw error;
    }
  },
};

// Item API services
export const itemService = {
  // Create a new item
  createItem: async (itemData: FormData) => {
    try {
      const response = await apiClient.post("/item/createItem", itemData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error creating item:", error);
      throw error;
    }
  },

  // Get all items
  getAllItems: async () => {
    try {
      const response = await apiClient.get("/item/getItems");
      return response.data;
    } catch (error) {
      console.error("Error fetching items:", error);
      throw error;
    }
  },

  // Get single item by ID
  getItemById: async (itemId: number) => {
    try {
      const response = await apiClient.get(`/item/${itemId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching item with ID ${itemId}:`, error);
      throw error;
    }
  },

  // Update item
  updateItem: async (itemId: number, itemData: FormData) => {
    try {
      const response = await apiClient.put(`/item/${itemId}`, itemData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating item with ID ${itemId}:`, error);
      throw error;
    }
  },

  // Delete item
  deleteItem: async (itemId: number) => {
    try {
      const response = await apiClient.delete(`/item/${itemId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting item with ID ${itemId}:`, error);
      throw error;
    }
  },

  // Get items by canteen ID
  getItemsByCanteen: async (canteenId: number) => {
    try {
      const response = await apiClient.get(`/item/byCanteen/${canteenId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching items for canteen ID ${canteenId}:`, error);
      throw error;
    }
  },
};

// Menu API services
export const menuService = {
  // Create menu with items
  createMenuWithItems: async (menuData: {
    menuConfigurationId: number;
    canteenId: number;
    description: string;
    items: Array<{
      itemId: number;
      minQuantity: number;
      maxQuantity: number;
    }>;
  }) => {
    try {
      const response = await apiClient.post("/menu/createMenuWithItems", menuData);
      return response.data;
    } catch (error) {
      console.error("Error creating menu with items:", error);
      throw error;
    }
  },
  
  // Get all menus
  getAllMenus: async () => {
    try {
      const response = await apiClient.get("/menu/getAllMenus");
      return response.data;
    } catch (error) {
      console.error("Error fetching menus:", error);
      throw error;
    }
  },
  
  // Get menu by ID
  getMenuById: async (menuId: number) => {
    try {
      const response = await apiClient.get(`/menu/${menuId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching menu with ID ${menuId}:`, error);
      throw error;
    }
  },
  
  // Update menu
  updateMenu: async (menuId: number, menuData: any) => {
    try {
      const response = await apiClient.put(`/menu/${menuId}`, menuData);
      return response.data;
    } catch (error) {
      console.error(`Error updating menu with ID ${menuId}:`, error);
      throw error;
    }
  },
  
  // Delete menu
  deleteMenu: async (menuId: number) => {
    try {
      const response = await apiClient.delete(`/menu/${menuId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting menu with ID ${menuId}:`, error);
      throw error;
    }
  }
};

// Menu Configuration API services
export const menuConfigService = {
  // Create a new menu configuration
  createMenuConfiguration: async (menuConfigurationData: any) => {
    try {
      const response = await apiClient.post("/menuconfig/createMenuConfiguration", menuConfigurationData);
      return response.data;
    } catch (error) {
      console.error("Error creating menu configuration:", error);
      throw error;
    }
  },
  // Get all menu configurations
  getAllMenuConfigurations: async () => {
    try {
      const response = await apiClient.get("/menuconfig/getAllMenuConfigurations");
      return response.data;
    } catch (error) {
      console.error("Error fetching menu configurations:", error);
      throw error;
    }
  }
};

export const adminDashboardService = {
  getDashboardMainCounts: async () => {
    try {
      const response = await apiClient.get("/adminDasboard/dashboard");
      return response.data;
    } catch (error) {
      console.error("Error fetching dashboard orders and revenue counts:", error);
      throw error;
    }
  },
  
  // Get Orders count by canteen 
  getOrdersByCanteen: async () => {
    try {
      const response = await apiClient.get(`/order/getOrdersByCanteen`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching orders`, error);
      throw error;
    }
  },

  // Get total menus count (with optional canteenId filter)
  getTotalMenus: async (canteenId?: number) => {
    try {
      const url = canteenId 
        ? `/adminDasboard/getTotalMenus?canteenId=${canteenId}`
        : `/adminDasboard/getTotalMenus`;
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error("Error fetching total menus count:", error);
      throw error;
    }
  },

  // Get total orders count (with optional canteenId filter)
  getTotalOrders: async (canteenId?: number) => {
    try {
      const url = canteenId 
        ? `/adminDasboard/getTotalOrders?canteenId=${canteenId}`
        : `/adminDasboard/getTotalOrders`;
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error("Error fetching total orders count:", error);
      throw error;
    }
  },

  // Get total canteens count
  getTotalCanteens: async () => {
    try {
      const response = await apiClient.get("/adminDasboard/getTotalCanteens");
      return response.data;
    } catch (error) {
      console.error("Error fetching total canteens count:", error);
      throw error;
    }
  },
};

