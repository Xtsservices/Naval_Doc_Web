
import axios from 'axios';
import { use } from 'react';
import { dispatch } from '../../store/store';

// Base API URL
import { BASE_URL } from "../../constants/api";

// Get authorization token
export const getAuthToken = async () => {
  try {
    const token = localStorage.getItem("Token") || "";;
    if (!token) {
      throw new Error('No authentication token found');
    }
    return token;
  } catch (error) {
    console.error('Error getting auth token:', error);
    throw error;
  }
};

// Get cart data
export const fetchCartData = async () => {
  try {
    const token = await getAuthToken();

    const response = await axios.get(`${BASE_URL}/cart/getCart`, {
      headers: {
        'Content-Type': 'application/json',
        authorization: token,
      },
    });
    console.log(response?.data, 'response data cart');

    if (response.data && response.data.data) {
      const cartItemsCount = response?.data?.data?.cartItems? response.data.data.cartItems.length : 0
      dispatch({
      type: "myCartItems",
      payload: cartItemsCount,
    });

    
      return response.data.data;
    } else {
      throw new Error('No cart data found');
    }
  } catch (error) {
    // console.error('Error fetching cart data:', error);
    throw error;
  }
};

// Add item to cart
export const addItemToCart = async (
  itemId: string | number,
  menuId: string | number | undefined,
  menuConfigId: string | number | undefined,
  quantity: number,
) => {
  try {
    const token = await getAuthToken();
    const canteenId =  localStorage.getItem('canteenId');
    const date =  localStorage.getItem('selectedDate');
    console.log("datesssss", date);

    //   {

    //     "itemId": 2,
    //     "quantity": 3,
    //     "menuId": 1,
    //     "canteenId": 1,
    //     "menuConfigurationId": 1
    // }

    const payload = {
      itemId: Number(itemId),
      quantity,
      menuId: Number(menuId),
      canteenId: Number(canteenId) || 1,
      menuConfigurationId: Number(menuConfigId),
      orderDate: date,
    };

    console.log('Add item payload:', payload);
    console.log('Token:', token);

    const response = await axios.post(`${BASE_URL}/cart/add`, payload, {
      headers: {
        'Content-Type': 'application/json',
        authorization: token,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error adding item to cart:', error);
    throw error;
  }
};

// Update cart item quantity
export const updateCartItemQuantity = async (
  cartId: number | string | undefined | null,
  cartItemId: number | string | undefined | null,
  quantity: number,
) => {
  console.log(
    cartId,
    'cartId',
    cartItemId,
    '----cartitemid',
    quantity,
    '----quantity',
  );

  try {
    const token = await getAuthToken();

    const payload = {
      cartId,
      cartItemId,
      quantity,
    };

    console.log('Update payload:', payload);

    const response = await axios.post(
      `${BASE_URL}/cart/updateCartItem`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          authorization: token,
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error('Error updating cart item quantity:', error);
    throw error;
  }
};

// Remove item from cart
export const removeCartItem = async (
  cartId: number,
  cartItemId: number | null | undefined,
) => {
  console.log(cartId, 'cartId', cartItemId, '----cartitemid------cartHelpers');

  try {
    const token = await getAuthToken();

    const payload = {
      cartId,
      cartItemId,
    };

    const response = await axios.post(
      `${BASE_URL}/cart/removeCartItem`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          authorization: token,
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error('Error removing cart item:', error);
    throw error;
  }
};

// Clear cart
export const clearCart = async () => {
  try {
    const token = await getAuthToken();

    const response = await axios.get(`${BASE_URL}/cart/clearCart`, {
      headers: {
        'Content-Type': 'application/json',
        authorization: token,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error clearing cart:', error);
    throw error;
  }
};

// Find cart item by item ID
export const findCartItemByItemId = (
  cartData: any,
  itemId: string | number,
) => {
  if (!cartData || !cartData.cartItems || !cartData.cartItems.length) {
    return null;
  }

  return cartData.cartItems.find(
    (cartItem: any) =>
      String(cartItem.itemId) === String(itemId) ||
      (cartItem.item && String(cartItem.item.id) === String(itemId)),
  );
};

// --------------------------------------------------------------------------------

export const fetchDashboardData = async () => {
  try {
    const token = await getAuthToken();
    const response = await fetch(
      `${BASE_URL}/adminDasboard/dashboard`,
      {
        headers: {
          Authorization: token || '',
        },
      },
    );
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const fetchRecentOrders = async () => {
  try {
    const token = await getAuthToken();
    const response = await fetch(
      `${BASE_URL}/adminDasboard/getTotalOrders`,
      {
        headers: {
          Authorization: token || '',
        },
      },
    );
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
