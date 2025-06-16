import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CartData, CartItemsState } from "../userModuleTypes/cartTypes";
import {
  addItemToCart,
  fetchCartData,
  findCartItemByItemId,
  removeCartItem,
  updateCartItemQuantity,
} from "../service/cartHelpers";
import UserHeader from "../userComponents/UserHeader";
import axios from "axios";
import { useDispatch } from "react-redux";

import { BASE_URL } from "../../constants/api";


interface Pricing {
  id: number;
  price: number;
  currency: string;
}

interface Item {
  id: number;
  name: string;
  description: string;
  image: string;
  pricing: Pricing;
}

interface MenuItem {
  id: number;
  menuId: number;
  itemId: number;
  minQuantity: number;
  maxQuantity: number;
  status: string;
  createdById: number | null;
  updatedById: number | null;
  createdAt: number;
  updatedAt: number;
  item: Item;
}

const MenuByItems: React.FC = () => {
  const [menuData, setMenuData] = useState<any>(null); // Full menu data
  const [items, setItems] = useState<MenuItem[]>([]);
  const [cartData, setCartData] = useState<CartData | null>(null);
  const [cartItems, setCartItems] = useState<CartItemsState>({});
  const [cartUpdated, setCartUpdated] = useState(false);
  const [updateLoading, setUpdateLoading] = useState<string | null>(null);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { id } = useParams();
  const menuId = id;
  const token = localStorage.getItem("Token") || "";
 
  // Increment quantity
  const increaseQuantity = async (item: MenuItem) => {
    setCartUpdated(true);
    try {
      setUpdateLoading(String(item.id));
      // console.log(item, "itemm---------increasingg");
      const cartItemId22 = cartData?.cartItems.find(
        (cartItem) => cartItem.itemId === item.item.id
      )?.item?.id;
      console.log(cartItemId22, "cartItemId---increase-quantity");
      // we get cartItemId from cardData only ###

      const itemId = item.item.id;
      const itemKey = String(itemId);
      console.log(cartItems, "cartItems---i");

      // Check if item exists in cart
      if (!cartItems[itemKey]) {
        await addToCart(item, menuData);
        return;
      }

      const currentQty = cartItems[itemKey]?.quantity;
      console.log(currentQty, "currentQty---====");

      const maxQty = Number(item.maxQuantity) || 10;

      if (currentQty >= maxQty) {
        alert("Maximum quantity reached");
        setUpdateLoading(null);
        return;
      }

      const newQty = currentQty + 1;
      const cartItemId = cartItems[itemKey].cartItemId;
      const body = {
        cartId: cartData?.id,
        cartItemId: cartItemId22,
        quantity: newQty,
      };
      console.log(body, "body---increase-quantity");

      //   {
      //     "cartId":3,"cartItemId":2,"quantity":5
      // }
      const cartId = cartData?.id ? cartData?.id : "";
      await updateCartItemQuantity(
        cartId,
        parseInt(cartItemId22?.toString() || "0"),
        newQty
      );

      // Refresh cart data
      const updatedCartData = await fetchCartData();

      setCartData(updatedCartData);

      // Update cart items state
      setCartItems((prev) => ({
        ...prev,
        [itemKey]: {
          ...prev[itemKey],
          quantity: newQty,
        },
      }));

      setUpdateLoading(null);
    } catch (err) {
      setError("Failed to update quantity");
      console.error("Error updating quantity:", err);
      setUpdateLoading(null);
    }
  };
  
    const decreaseQuantity = async (cartItem: MenuItem) => {
    try {
      // Add item ID to updating state
          const itemId = cartItem.item.id;
      const itemKey = String(itemId);
      const currentQty = cartItems[itemKey].quantity;
      const body = {
        cartItemId: cartItem.item?.id,
        quantity: currentQty-1,
        cartId: cartData?.id,
      };

      console.log("Request body:", body);
      const token = localStorage.getItem("Token");
      await axios.post(`${BASE_URL}/cart/updateCartItem`, body, {
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
      });
 // Refresh cart data
      const updatedCartData = await fetchCartData();
      setCartData(updatedCartData);

      // Update cart items state
      setCartItems(prev => ({
        ...prev,
        [itemKey]: {
          ...prev[itemKey],
          quantity: currentQty-1,
        },
      }));

      setUpdateLoading(null);
    } catch (err) {
      setError("Failed to update cart item");
      console.error("Error updating cart item:", err);
    } 
  };

  const fetchMenuItems = async () => {
    try {
      const res = await fetch(
        `${BASE_URL}/menu/getMenuById?id=${menuId}`,
        {
          headers: {
        Authorization: token,
          },
        }
      );
      const data = await res.json();
      setMenuData(data.data); // Save full menu data
      setItems(data.data?.menuItems || []);
    } catch (error) {
      console.error("Failed to fetch menu data:", error);
    }
  };

  const getCartData = async () => {
    try {
      const data = await fetchCartData();
      setCartData(data);

      // Initialize cartItems state from cart data
      const cartItemsMap: CartItemsState = {};

      if (data && data.cartItems && Array.isArray(data.cartItems)) {
        data.cartItems.forEach((cartItem: any) => {
          const itemIdKey = String(cartItem.itemId);
          cartItemsMap[itemIdKey] = {
            quantity: cartItem.quantity,
            cartItemId: cartItem.id,
          };
        });
      }

      console.log(cartItemsMap, "cartItemsMap---menuItemsByMenuIdScreenNew");

      setCartItems(cartItemsMap);
    } catch (err) {
      // console.error('Error fetching cart data:', err);
    }
  };

  useEffect(() => {
    if (!menuId || !token) {
      console.error("Missing menu ID or token");
      return;
    }
    // Fetch menu items when the component mounts
    fetchMenuItems();
    // Fetch cart data when the component mounts
    getCartData();
  }, [cartUpdated, id]);

  const addToCart = async (item: any, menudata: any) => {
    console.log("Adding to cart:", item);
    console.log("menudata:", menudata);
    try {
      setUpdateLoading(item.id);
      const minQty = 1;

      const result = await addItemToCart(
        item.item.id,
        // menuData?.id || '',
        item?.menuId || "",
        menuData?.menuConfigurationId || "",
        minQty
      );

      // Refresh cart data
      const updatedCartData = await fetchCartData();
      setCartData(updatedCartData);

      // Find the cart item that was just added
      const cartItem = findCartItemByItemId(updatedCartData, item.item.id);
      console.log(cartItem, "cartItem---added-to-cart");

      if (cartItem) {
        // Update cart items state
        setCartItems((prev) => ({
          ...prev,
          [item.item.id]: {
            quantity: cartItem.quantity,
            cartItemId: cartItem.id,
          },
        }));
      }

      setUpdateLoading(null);
    } catch (err) {
      setError("Failed to add item to cart");
      console.error("Error adding to cart:", err);
      setUpdateLoading(null);
    }
  };

  console.log(cartItems, "cartItems");
  console.log(items, "items");
  return (
    <div style={styles.container}>
      <UserHeader headerText={menuData?.name || "Menu"} />

      <div>
        {items.map((menuItem) => (
          <div key={menuItem.id} style={styles.card}>
            <img
              src={`data:image/jpeg;base64,${menuItem.item.image}`}
              alt={menuItem.item.name}
              style={styles.image}
            />
            <div style={styles.info}>
              <div style={styles.row}>
                <span style={styles.name}>{menuItem.item.name}</span>
                <span style={styles.price}>₹{menuItem.item.pricing.price}</span>
              </div>
              <div style={styles.desc}>{menuItem.item.description}</div>
              {!cartItems[menuItem.item.id] ? (
                <div style={styles.row}>
                  <button
                    onClick={() => addToCart(menuItem, menuData)}
                    style={styles.addBtn}
                  >
                    ADD
                  </button>
                </div>
              ) : (
                <div style={styles.row}>
                  <button
                    onClick={() => decreaseQuantity(menuItem)}
                    disabled={updateLoading === String(menuItem.id)}
                    style={{ ...styles.addBtn, opacity: 0.8 }}
                  >
                    -
                  </button>
                  <span>{cartItems[menuItem.item.id]?.quantity || 0}</span>
                  <button
                    onClick={() => increaseQuantity(menuItem)}
                    disabled={updateLoading === String(menuItem.id)}
                    style={{ ...styles.addBtn, opacity: 0.8 }}
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div style={{ textAlign: "center", marginTop: 40 }}>
            No items selected.
          </div>
        )}
      </div>
      {Object.keys(cartItems).length > 0 ? (
        <button
          style={{
            position: "fixed",
            bottom: 65,
            right: 6,
            backgroundColor: "#071ea0",
            color: "#fff",
            border: "none",
            borderRadius: 30,
            padding: "12px 24px",
            fontSize: 16,
            fontWeight: 600,
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            zIndex: 1000,
            cursor: "pointer",
          }}
          onClick={() => {
            // Navigate to cart page or handle logic
            navigate("/user/myCart");
            console.log("Go to Cart clicked");
          }}
        >
          Go to Cart ({Object.keys(cartItems).length})
        </button>
      ) : null}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    background: "#f7f8fa",
    minHeight: "100vh",
    fontFamily: "sans-serif",
  },
  header: {
    background: "#071ea0",
    color: "#fff",
    padding: "24px 16px 16px 16px",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 16,
  },
  title: {
    margin: 0,
    fontSize: 28,
    fontWeight: 700,
  },
  card: {
    background: "#fff",
    borderRadius: 16,
    boxShadow: "0 2px 8px #0001",
    display: "flex",
    alignItems: "flex-start",
    padding: 16,
    margin: "12px 16px",
    gap: 16,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 12,
    objectFit: "cover",
  },
  info: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    fontWeight: 600,
    fontSize: 18,
  },
  price: {
    color: "#071ea0",
    fontWeight: 700,
    fontSize: 18,
  },
  desc: {
    color: "#555",
    fontSize: 14,
    marginBottom: 8,
  },
  addBtn: {
    background: "#071ea0",
    color: "#fff",
    border: "none",
    borderRadius: 22,
    padding: "8px 32px",
    fontWeight: 600,
    fontSize: 16,
    alignSelf: "flex-start",
    marginTop: 4,
    cursor: "pointer",
    opacity: 1,
  },
};

export default MenuByItems;
