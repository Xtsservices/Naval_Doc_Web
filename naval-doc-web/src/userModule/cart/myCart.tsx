import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  clearCart,
  fetchCartData,
  removeCartItem,
} from "../service/cartHelpers";
import { useNavigate } from "react-router-dom";
import { CartData, CartItem } from "../userModuleTypes/cartTypes";
import UserHeader from "../userComponents/UserHeader";
import { BASE_URL } from "../../constants/api";
import { AppState } from "../../store/storeTypes";
import { useSelector } from "react-redux";

const MyCart: React.FC = () => {
  const navigation = useNavigate();
  const [cartData, setCartData] = useState<CartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingItems, setUpdatingItems] = useState<number[]>([]);

  const loadCartData = async () => {
    try {
      setLoading(true);
      const data = await fetchCartData();
      setCartData(data);
      setError("");
    } catch (err) {
      setError("Failed to fetch cart data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCartData();
  }, []);

  const updateItemQuantity = async (
    cartItem: CartItem,
    newQuantity: number
  ) => {
    console.log("first====================", cartItem, newQuantity);

    try {
      setUpdatingItems((prev) => [...prev, cartItem.id]);
      const body = {
        cartItemId: cartItem.item?.id,
        quantity: newQuantity,
        cartId: cartData?.id,
      };

      const token = localStorage.getItem("Token");
      const resp = await axios.post(`${BASE_URL}/cart/updateCartItem`, body, {
        headers: {
          "Content-Type": "application/json",
          authorization: token ?? "",
        },
      });
      console.log("body===========res=========", resp);

      if (resp?.data?.data) {
        // Update local state only
        setCartData((prev) => {
          if (!prev) return prev;
          const updatedItems = prev.cartItems.map((item) =>
            item.id === cartItem.id
              ? {
                  ...item,
                  quantity: newQuantity,
                  total: newQuantity * item.price,
                }
              : item
          );
          return { ...prev, cartItems: updatedItems };
        });
      }
    } catch (err) {
      setError("Failed to update cart item");
      console.error(err);
    } finally {
      setUpdatingItems((prev) => prev.filter((id) => id !== cartItem.id));
    }
  };
  console.log("cartDatatest==", cartData);
  const handleRemoveItem = async (item: CartItem) => {
    console.log("handleRemoveItem================", item);
    try {
      if (!cartData) return;
      setUpdatingItems((prev) => [...prev, item.id]);
      console.log(
        "handleRemoveItem===========item.cartId,  item.id=====",
        item.cartId,
        item.id
      );

      await removeCartItem(Number(item.cartId), Number(item.itemId));
      setCartData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          cartItems: prev.cartItems.filter((i) => i.id !== item.id),
        };
      });
      //FETECH CART DATA AGAIN
      await loadCartData();
    } catch (err) {
      setError("Failed to remove cart item");
      console.error(err);
    } finally {
      setUpdatingItems((prev) => prev.filter((id) => id !== item.id));
    }
  };

  const handleClearCart = async () => {
    try {
      setLoading(true);
      await clearCart();
      setCartData({} as CartData);
    } catch (err) {
      setError("Failed to clear cart");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const confirmClearCart = () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      handleClearCart();
    }
  };

  const handlePayment = () => {
    navigation("/user/paymentMethod" as never);
  };

  const subtotal =
    cartData?.cartItems.reduce((sum, item) => sum + item.total, 0) ?? 0;
  const gstAndCharges = 0;
  const platformFee = 0;
  const totalAmount = subtotal + gstAndCharges + platformFee;

  return (
    <div
      style={{
        backgroundColor: "#F4F6FB",
        minHeight: "100vh",
        paddingBottom: 400,
      }}
    >
      <UserHeader headerText="My Cart" />

      {loading && (
        <div style={{ textAlign: "center", marginTop: 40, color: "#888" }}>
          Loading...
        </div>
      )}

      {!loading && (!cartData || cartData.cartItems.length === 0) && (
        <div
          style={{
            textAlign: "center",
            marginTop: 100,
            padding: 20,
            color: "#444",
          }}
        >
          <h3 style={{ marginTop: 20, fontWeight: 500 }}>Your cart is empty</h3>
          <button
            onClick={() => navigation("/user/select-menu")}
            style={{
              marginTop: 20,
              padding: "10px 24px",
              backgroundColor: "#1976d2",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            Continue Shopping
          </button>
        </div>
      )}

      {!loading && cartData && cartData.cartItems.length > 0 && (
        <>
          <div style={{ marginTop: 20, padding: "0 10px" }}>
            {cartData.cartItems.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  backgroundColor: "#fff",
                  borderRadius: 12,
                  marginBottom: 14,
                  padding: 12,
                  boxShadow: "0 2px 4px rgba(0,0,0,0.07)",
                  maxWidth: 600,
                  marginLeft: "auto",
                  marginRight: "auto",
                  minHeight: 100, // fixes layout shift
                }}
              >
                <img
                  src={
                    item.item.image
                      ? `data:image/png;base64,${item.item.image}`
                      : "https://via.placeholder.com/80"
                  }
                  alt="item"
                  style={{
                    width: 70,
                    height: 70,
                    borderRadius: 10,
                    backgroundColor: "#e6eaf2",
                    objectFit: "cover",
                  }}
                />
                <div style={{ flex: 1, marginLeft: 14 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <p
                      style={{
                        fontSize: 16,
                        fontWeight: 600,
                        color: "#222",
                        margin: 0,
                      }}
                    >
                      {item.item.name}
                    </p>
                    <button
                      onClick={() => handleRemoveItem(item)}
                      style={{
                        backgroundColor: "#ffeded",
                        borderRadius: 12,
                        padding: 4,
                        border: "none",
                        cursor: "pointer",
                      }}
                      disabled={updatingItems.includes(item.id)}
                      title={
                        updatingItems.includes(item.id)
                          ? "Updating..."
                          : "Remove item"
                      }
                    >
                      <span style={{ color: "#ff4d4d", fontWeight: "bold" }}>
                        ✕
                      </span>
                    </button>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      margin: "4px 0",
                    }}
                  >
                    <img
                      src={
                        item.item.type?.toLowerCase() === "veg"
                          ? "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Veg_symbol.svg/1200px-Veg_symbol.svg.png"
                          : "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Non_veg_symbol.svg/1200px-Non_veg_symbol.svg.png"
                      }
                      alt="type"
                      style={{ width: 16, height: 16, marginRight: 4 }}
                    />
                    <span
                      style={{
                        fontSize: 12,
                        color: "#666",
                        fontWeight: 500,
                        userSelect: "none",
                      }}
                    >
                      {item.item.type?.toUpperCase() || "N/A"}
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: "bold",
                        color: "#0014A8",
                      }}
                    >
                      ₹{item.price.toFixed(2)}
                    </span>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 500,
                        color: "#444",
                      }}
                    >
                      Total: ₹{item.total.toFixed(2)}
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginTop: 6,
                    }}
                  >
                    <button
                      style={{
                        backgroundColor: "#0014A8",
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        color: "white",
                        fontWeight: "bold",
                        fontSize: 18,
                        border: "none",
                        cursor: item.quantity === 1 ? "not-allowed" : "pointer",
                        opacity: item.quantity === 1 ? 0.5 : 1,
                      }}
                      disabled={
                        item.quantity === 1 || updatingItems.includes(item.id)
                      }
                      onClick={() =>
                        item.quantity > 1 &&
                        updateItemQuantity(item, item.quantity - 1)
                      }
                      title={
                        updatingItems.includes(item.id)
                          ? "Updating..."
                          : "Decrease quantity"
                      }
                    >
                      -
                    </button>
                    <span
                      style={{
                        margin: "0 16px",
                        fontWeight: "bold",
                        color: "#222",
                      }}
                    >
                      {item.quantity}
                    </span>
                    <button
                      style={{
                        backgroundColor: "#0014A8",
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        color: "white",
                        fontWeight: "bold",
                        fontSize: 18,
                        border: "none",
                        cursor: "pointer",
                      }}
                      disabled={updatingItems.includes(item.id)}
                      onClick={() =>
                        updateItemQuantity(item, item.quantity + 1)
                      }
                      title={
                        updatingItems.includes(item.id)
                          ? "Updating..."
                          : "Increase quantity"
                      }
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              position: "fixed",
              left: 0,
              right: 0,
              bottom: "56px",
              zIndex: 100,
              background: "transparent",
              padding: "0 0 12px 0",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                backgroundColor: "#fff",
                borderRadius: 14,
                width: "95%",
                maxWidth: 420,
                boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
                padding: 16,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <span style={{ color: "#666" }}>Subtotal</span>
                <span style={{ fontWeight: 500 }}>₹{subtotal.toFixed(2)}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  borderTop: "1px solid #e6eaf2",
                  marginTop: 8,
                  paddingTop: 8,
                }}
              >
                <span
                  style={{
                    color: "#0014A8",
                    fontWeight: "bold",
                    fontSize: 17,
                  }}
                >
                  Total
                </span>
                <span
                  style={{
                    color: "#0014A8",
                    fontWeight: "bold",
                    fontSize: 17,
                  }}
                >
                  ₹{totalAmount.toFixed(2)}
                </span>
              </div>
              <button
                style={{
                  backgroundColor: "#0014A8",
                  color: "white",
                  width: "100%",
                  padding: 12,
                  borderRadius: 8,
                  marginTop: 10,
                  fontWeight: "bold",
                  border: "none",
                  fontSize: 16,
                  cursor: "pointer",
                }}
                onClick={handlePayment}
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MyCart;
