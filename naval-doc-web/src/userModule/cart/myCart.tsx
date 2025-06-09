import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  clearCart,
  fetchCartData,
  removeCartItem,
} from "../service/cartHelpers";
import { useNavigate } from "react-router-dom";
import { CartData, CartItem } from "../userModuleTypes/cartTypes";

const MyCart = () => {
  const navigation = useNavigate();
  const [cartData, setCartData] = useState<CartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingItems, setUpdatingItems] = useState<number[]>([]);

  const loadCartData = async () => {
    try {
      setLoading(true);
      const data = await fetchCartData();
      console.log("Fetched cart data:", data);
      setCartData(data);
    } catch (err) {
      // setError('Failed to fetch cart data');
      // console.error('Error fetching cart data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCartData();
  }, [updatingItems]);

  const updateItemQuantity = async (
    cartItem: CartItem,
    newQuantity: number
  ) => {
    console.log("Updating item quantity:", cartItem, newQuantity);

    try {
      // Add item ID to updating state
      setUpdatingItems((prev) => [...prev, cartItem.id]);
      const body = {
        cartItemId: cartItem.item?.id,
        quantity: newQuantity,
        cartId: cartData?.id,
      };

      console.log("Request body:", body);
      const token = localStorage.getItem("Token");
      const API_BASE_URL = "https://server.welfarecanteen.in/api";
      await axios.post(`${API_BASE_URL}/cart/updateCartItem`, body, {
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
      });

      await loadCartData();
    } catch (err) {
      setError("Failed to update cart item");
      console.error("Error updating cart item:", err);
    } finally {
      // Remove item ID from updating state
      setUpdatingItems((prev) => prev.filter((id) => id !== cartItem.id));
    }
  };

  const handleRemoveItem = async (item: any) => {
    console.log(item, "itemmm");

    try {
      if (!cartData) return;

      setUpdatingItems((prev) => [...prev, item?.item?.id]);
      const body = {
        cartId: cartData?.id,
        cartItemId: item?.item?.id,
      };
      console.log("Request body:", body);

      await removeCartItem(item?.cartId, item?.item?.id);

      // Refresh cart data
      await loadCartData();
    } catch (err) {
      setError("Failed to remove cart item");
      console.error("Error removing cart item:", err);
    } finally {
      setUpdatingItems((prev) => prev.filter((id) => id !== item?.item?.id));
    }
  };

  const handleClearCart = async () => {
    try {
      setLoading(true);
      await clearCart();
      setCartData({} as CartData);
    } catch (err) {
      setError("Failed to clear cart");
      console.error("Error clearing cart:", err);
    } finally {
      setLoading(false);
    }
  };

  const confirmClearCart = () => {
    const confirmed = window.confirm(
      "Are you sure you want to clear your cart?"
    );
    if (confirmed) {
      handleClearCart();
    }
  };

  const handlePayment = () => {
    navigation("/user/paymentMethod" as never);
  };

  const calculateGSTAndCharges = (subtotal: number) => {
    return subtotal * 0.0; // 7% GST
  };

  const calculatePlatformFee = () => {
    return 0; // Fixed platform fee
  };

  const subtotal =
    cartData?.cartItems.reduce((sum, item) => sum + item.total, 0) ?? 0;
  const gstAndCharges = 0;
  const platformFee = 0;
  const totalAmount = subtotal + gstAndCharges + platformFee;

  // Loading state
//   if (loading) {
//     return (
//       <div style={{ textAlign: "center", marginTop: 40, color: "#888" }}>
//         Loading...
//       </div>
//     );
//   }

  // Error state
  //   if (error) {
  //     return (
  //       <Box textAlign="center" mt={10}>
  //         <Typography color="error">{error}</Typography>
  //         <Button onClick={loadCartData}>Try Again</Button>
  //       </Box>
  //     );
  //   }

  // Empty cart
  if (!cartData || cartData.cartItems.length === 0) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <img
          src="https://img.icons8.com/ios/100/000000/empty-cart.png"
          alt="Empty Cart"
          width={80}
        />
        <h3 style={{ marginTop: "20px" }}>Your cart is empty</h3>
        <button
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            backgroundColor: "#1976d2",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
  <div style={{ padding: 16, backgroundColor: '#F4F6FB', minHeight: '100vh' }}>
    {/* Header */}
    <div style={{
      display: 'flex',
      alignItems: 'center',
      backgroundColor: '#0014A8',
      padding: '20px 16px',
      borderBottomLeftRadius: 18,
      borderBottomRightRadius: 18,
      justifyContent: 'space-between'
    }}>
      <img src="https://welfarecanteen.in/public/Naval.jpg" alt="Logo" style={{ width: 38, height: 38, borderRadius: 8, backgroundColor: '#fff' }} />
      <h2 style={{ color: '#fff', flex: 1, textAlign: 'center', margin: 0 }}>My Cart</h2>
      <div style={{ display: 'flex' }}>
        <button style={{ marginLeft: 10, backgroundColor: '#fff', borderRadius: 20, padding: 5 }}>
          <img src="https://creazilla-store.fra1.digitaloceanspaces.com/icons/3235242/wallet-icon-sm.png" style={{ width: 26, height: 26 }} />
        </button>
        <button style={{ marginLeft: 10, backgroundColor: '#fff', borderRadius: 20, padding: 5 }}>
          <img src="https://images.rawpixel.com/image_png_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTAxL3JtNjA5LXNvbGlkaWNvbi13LTAwMi1wLnBuZw.png" style={{ width: 26, height: 26 }} />
        </button>
      </div>
    </div>

    {/* Cart Items */}
    <div style={{ marginTop: 20 }}>
      {cartData?.cartItems?.map(item => (
        <div key={item.id} style={{
          display: 'flex',
          backgroundColor: '#fff',
          borderRadius: 12,
          marginBottom: 14,
          padding: 12,
          boxShadow: '0 2px 4px rgba(0,0,0,0.07)'
        }}>
          <img
            src={item.item.image ? `data:image/png;base64,${item.item.image}` : 'https://via.placeholder.com/80'}
            alt="item"
            style={{ width: 70, height: 70, borderRadius: 10, backgroundColor: '#e6eaf2' }}
          />
          <div style={{ flex: 1, marginLeft: 14 }}>
            {/* Title + Remove */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ fontSize: 16, fontWeight: 600, color: '#222', margin: 0 }}>{item.item.name}</p>
              <button onClick={() => handleRemoveItem(item)} style={{ backgroundColor: '#ffeded', borderRadius: 12, padding: 4, border: 'none' }}>
                <span style={{ color: '#ff4d4d', fontWeight: 'bold' }}>✕</span>
              </button>
            </div>

            {/* Type */}
            <div style={{ display: 'flex', alignItems: 'center', margin: '4px 0' }}>
              <img
                src={item.item.type?.toLowerCase() === 'veg'
                  ? 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Veg_symbol.svg/1200px-Veg_symbol.svg.png'
                  : 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Non_veg_symbol.svg/1200px-Non_veg_symbol.svg.png'}
                alt="type"
                style={{ width: 16, height: 16, marginRight: 4 }}
              />
              <span style={{ fontSize: 12, color: '#666', fontWeight: 500 }}>{item.item.type?.toUpperCase() || 'N/A'}</span>
            </div>

            {/* Price & Total */}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 14, fontWeight: 'bold', color: '#0014A8' }}>₹{item.price.toFixed(2)}</span>
              <span style={{ fontSize: 13, fontWeight: 500, color: '#444' }}>Total: ₹{item.total.toFixed(2)}</span>
            </div>

            {/* Quantity */}
            <div style={{ display: 'flex', alignItems: 'center', marginTop: 6 }}>
              <button
                style={{
                  backgroundColor: '#0014A8',
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: 18,
                  border: 'none',
                  cursor: item.quantity === 1 ? 'not-allowed' : 'pointer',
                  opacity: item.quantity === 1 ? 0.5 : 1
                }}
                disabled={item.quantity === 1}
                onClick={() => item.quantity > 1 && updateItemQuantity(item, item.quantity - 1)}
              >-</button>
              <span style={{ margin: '0 16px', fontWeight: 'bold', color: '#222' }}>{item.quantity}</span>
              <button
                style={{
                  backgroundColor: '#0014A8',
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: 18,
                  border: 'none',
                  cursor: 'pointer'
                }}
                onClick={() => updateItemQuantity(item, item.quantity + 1)}
              >+</button>
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
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
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
          <span style={{ color: "#0014A8", fontWeight: "bold", fontSize: 17 }}>Total</span>
          <span style={{ color: "#0014A8", fontWeight: "bold", fontSize: 17 }}>
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
  </div>
);

};

export default MyCart;
