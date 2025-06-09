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
  }, [updatingItems]);

  const updateItemQuantity = async (cartItem: CartItem, newQuantity: number) => {
    try {
      setUpdatingItems((prev) => [...prev, cartItem.id]);
      const body = {
        cartItemId: cartItem.item?.id,
        quantity: newQuantity,
        cartId: cartData?.id,
      };
      const token = localStorage.getItem("Token");
      const API_BASE_URL = "http://192.168.1.12:3002/api";
      await axios.post(`${API_BASE_URL}/cart/updateCartItem`, body, {
        headers: {
          "Content-Type": "application/json",
          authorization: token ?? "",
        },
      });
      await loadCartData();
    } catch (err) {
      setError("Failed to update cart item");
      console.error(err);
    } finally {
      setUpdatingItems((prev) => prev.filter((id) => id !== cartItem.id));
    }
  };

  const handleRemoveItem = async (item: CartItem) => {
    try {
      if (!cartData) return;
      setUpdatingItems((prev) => [...prev, item.id]);
      await removeCartItem(cartData.id, typeof item.item?.id === "number" ? item.item.id : item.id);
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
    <div style={{ backgroundColor: "#F4F6FB", minHeight: "100vh", paddingBottom: 140 }}>
      {/* Header */}
      <UserHeader headerText="My Cart" />

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: "center", marginTop: 40, color: "#888" }}>
          Loading...
        </div>
      )}

      {/* Error */}
      {error && (
        <div
          style={{
            color: "red",
            textAlign: "center",
            marginTop: 20,
            marginBottom: 20,
          }}
        >
          {error}
          <br />
          <button
            onClick={loadCartData}
            style={{
              marginTop: 10,
              padding: "8px 16px",
              cursor: "pointer",
              borderRadius: 6,
              border: "none",
              backgroundColor: "#1976d2",
              color: "white",
            }}
          >
            Retry
          </button>
        </div>
      )}

      {/* If cart is empty */}
      {!loading && (!cartData || cartData.cartItems.length === 0) && (
        <div
          style={{
            textAlign: "center",
            marginTop: 100,
            padding: 20,
            color: "#444",
          }}
        >
          <img
            src="https://img.icons8.com/ios/100/000000/empty-cart.png"
            alt="Empty Cart"
            width={80}
            height={80}
            style={{ opacity: 0.6 }}
          />
          <h3 style={{ marginTop: 20, fontWeight: 500 }}>
            Your cart is empty
          </h3>
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

      {/* Cart Items + Summary */}
      {!loading && cartData && cartData.cartItems.length > 0 && (
        <>
          {/* Cart Items */}
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
                  {/* Title + Remove */}
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

                  {/* Type */}
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

                  {/* Price & Total */}
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

                  {/* Quantity */}
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
                      disabled={item.quantity === 1 || updatingItems.includes(item.id)}
                      onClick={() =>
                        item.quantity > 1 &&
                        updateItemQuantity(item, item.quantity - 1)
                      }
                      title={updatingItems.includes(item.id) ? "Updating..." : "Decrease quantity"}
                    >
                      -
                    </button>
                    <span
                      style={{ margin: "0 16px", fontWeight: "bold", color: "#222" }}
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
                      onClick={() => updateItemQuantity(item, item.quantity + 1)}
                      title={updatingItems.includes(item.id) ? "Updating..." : "Increase quantity"}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bill Summary - Fixed Bottom */}
          <div
            style={{
              position: "fixed",
              left: 0,
              right: 0,
              bottom: 0,
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
                  marginTop: 16,
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
