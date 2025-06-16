import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom"; // Add this import
import UserHeader from "../userComponents/UserHeader";
import { useDispatch } from "react-redux";
import { fetchCartData } from "../service/cartHelpers";

import { BASE_URL } from "../../constants/api";

// Type definitions
interface PaymentData {
  paymentlink?: string;
  paymentLink?: string;
  payment_link?: string;
  link?: string;
}

interface PaymentInfo {
  remainingAmount?: number;
  walletPaymentAmount?: number;
}

interface OrderResponse {
  id: string;
  totalAmount: number;
  status: string;
  qrCode?: string;
  payments?: PaymentInfo;
  data?: PaymentData;
  paymentLink?: string;
  payment_link?: string;
  link?: string;
}

interface ApiResponse {
  data?: PaymentData;
  paymentLink?: string;
  payment_link?: string;
  link?: string;
  message?: string;
  id: string;
  totalAmount: number;
  status: string;
  qrCode?: string;
  payments?: PaymentInfo;
}

interface PaymentMethodProps {
  // Remove navigation prop since we'll use useNavigate hook
}

type PaymentMethodType = "online" | "cash" | "";

const API_URL = "/order/placeOrder";

const PaymentMethod: React.FC<PaymentMethodProps> = () => {
  // Remove navigation prop
  const navigate = useNavigate(); // Add this hook
  const dispatch = useDispatch();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [orderResponse, setOrderResponse] = useState<OrderResponse | null>(
    null
  );
  const [showOrderDetails, setShowOrderDetails] = useState<boolean>(false);
  const [paymentLink, setPaymentLink] = useState<string | null>(null);
  const [showWebView, setShowWebView] = useState<boolean>(false);
  const qrCodeRef = useRef<HTMLDivElement>(null);

  // Place order and get payment link or order details
  const handlePayment = useCallback(async (): Promise<void> => {
    if (!selectedMethod) {
      alert("Please select a payment method");
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("Token");
      if (!token) {
        alert("Error: No token found");
        setLoading(false);
        return;
      }

      const response = await fetch(BASE_URL + API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
        body: JSON.stringify({ paymentMethod: ["wallet", selectedMethod] }),
      });

      const data: ApiResponse = await response.json();

      console.log("Full API Response========:", data);

      if (response.ok && data.data?.paymentlink) {
        setOrderResponse(data);

        //update redux store with cart items count
         await fetchCartData();

        // Check for payment link with different possible property names
        const possiblePaymentLink =
          data.data?.paymentlink ||
          data.paymentLink ||
          data.payment_link ||
          data.link;

        console.log("Possible Payment Link:", possiblePaymentLink);

        if (selectedMethod === "online" && possiblePaymentLink) {
          console.log("Payment Link Found:", possiblePaymentLink);
          setPaymentLink(possiblePaymentLink);
          setShowOrderDetails(false);
          setTimeout(() => {
            setShowWebView(true);
          }, 100);
        } else if (selectedMethod === "online" && !possiblePaymentLink) {
          console.log("No payment link found in response for online payment");
          alert("Error: Payment link not received from server");
          setShowOrderDetails(true);
        } else {
          setShowOrderDetails(true);
          if (selectedMethod === "cash") {
            alert("Order Placed Successfully");
          }
        }
      } else {
        console.log("API Error Response:", data);
        if (!data?.data?.paymentlink) {
          alert(`Something Went Wrong! Please try again.`);
          return;
        }
        alert(`Payment Failed: ${data.message || "Please try again."}`);
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Error: Could not process payment.");
    } finally {
      setLoading(false);
    }
  }, [selectedMethod]);

  // When coming back from payment, fetch order details again
  const fetchOrderDetails = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authorization");
      if (!token) {
        alert("Error: No token found");
        setLoading(false);
        return;
      }

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
        body: JSON.stringify({ paymentMethod: "online" }),
      });

      const data: ApiResponse = await response.json();
      if (response.ok && data) {
        setOrderResponse(data);
        setShowOrderDetails(true);
        setShowWebView(false);
        setPaymentLink(null);
      } else {
        alert("Failed: Could not fetch order details.");
      }
      console.log("Order Response after payment:", data);
    } catch (error) {
      console.error("Fetch order details error:", error);
      alert("Error: Could not fetch order details.");
    } finally {
      setLoading(false);
    }
  }, []);

  const saveQrToGallery = async (): Promise<void> => {
    try {
      if (orderResponse?.qrCode) {
        const link = document.createElement("a");
        link.href = orderResponse.qrCode;
        link.download = `qr-code-${orderResponse.id}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        alert("Success: QR code downloaded!");
      }
    } catch (error) {
      console.error("Save QR error:", error);
      alert("Error: Failed to download QR code");
    }
  };

  // Reset state when payment method changes
  useEffect(() => {
    setOrderResponse(null);
    setShowOrderDetails(false);
    setPaymentLink(null);
    setShowWebView(false);
  }, [selectedMethod]);

  const handleBackFromWebView = (): void => {
    console.log("Back button pressed in WebView");
    setShowWebView(false);
    setPaymentLink(null);
    if (orderResponse) {
      setShowOrderDetails(true);
    }
  };

  // Debug function to test iframe directly
  const testWebView = (): void => {
    console.log("Testing iframe with google.com");
    setPaymentLink("https://google.com");
    setShowWebView(true);
  };

  const handlePaymentOptionClick = (method: PaymentMethodType): void => {
    setSelectedMethod(method);
  };

  // Handle wallet navigation
  const handleWalletClick = (): void => {
    navigate("/wallet"); // Use navigate instead of navigation
  };

  console.log("Current state:", {
    showWebView,
    paymentLink,
    showOrderDetails,
    selectedMethod,
    hasOrderResponse: !!orderResponse,
  });

  return (
    <div className="payment-container">
      <style>{`
        .payment-container {
          min-height: 100vh;
          background-color: white;
          // padding-top: 50px;
          font-family: Arial, sans-serif;
          position: relative;
        }
        
        .header-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background-color: #0014A8;
          padding: 20px;
          border-bottom-left-radius: 20px;
          border-bottom-right-radius: 20px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        
        .header-left {
          display: flex;
          align-items: center;
        }
        
        .logo-small {
          width: 40px;
          height: 40px;
          object-fit: contain;
          margin-right: 10px;
        }
        
        .header-title {
          color: #fff;
          font-size: 22px;
          font-weight: bold;
          margin: 0;
        }
        
        .header-icons {
          display: flex;
        }
        
        .icon-border {
          background-color: #fff;
          border-radius: 50%;
          padding: 7px;
          margin-left: 10px;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
        }
        
        .icon-small {
          width: 30px;
          height: 30px;
        }
        
        .content-area {
          flex-grow: 1;
          padding-bottom: 90px;
        }
        
        .main-header {
          text-align: center;
          margin-bottom: 20px;
          margin-top: 10px;
        }
        
        .logo-large {
          width: 60px;
          height: 60px;
          object-fit: contain;
        }
        
        .main-title {
          color: #010080;
          font-size: 24px;
          font-weight: bold;
          margin-top: 15px;
          margin-bottom: 0;
        }
        
        .payment-options {
          display: flex;
          justify-content: center;
          margin: 30px 0;
        }
        
        .payment-option {
          background-color: #f0f0f0;
          padding: 15px;
          border-radius: 5px;
          margin: 0 5px;
          width: 90px;
          height: 90px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          border: 2px solid transparent;
          transition: all 0.3s ease;
        }
        
        .payment-option.selected {
          border-color: #000080;
          background-color: #e6eaff;
        }
        
        .payment-icon {
          width: 45px;
          height: 45px;
          object-fit: contain;
        }
        
        .option-text {
          color: #000080;
          font-weight: bold;
          margin-top: 5px;
          font-size: 13px;
        }
        
        .pay-button {
          background-color: #000080;
          padding: 15px;
          border-radius: 5px;
          border: none;
          color: #fff;
          font-weight: bold;
          width: 80%;
          margin: 10px auto 20px;
          display: block;
          cursor: pointer;
          font-size: 16px;
          transition: background-color 0.3s ease;
        }
        
        .pay-button:disabled {
          background-color: #b3b3cc;
          cursor: not-allowed;
        }
        
        .debug-button {
          background-color: orange;
          margin-bottom: 10px;
        }
        
        .order-details {
          background-color: #f9f9f9;
          border-radius: 8px;
          padding: 15px;
          margin: 0 5% 20px;
        }
        
        .detail-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }
        
        .detail-label {
          font-weight: bold;
          color: #333;
          flex: 1;
        }
        
        .detail-value {
          color: #555;
          flex: 1;
          text-align: right;
        }
        
        .qr-code-section {
          text-align: center;
          margin-top: 15px;
        }
        
        .qr-code-title {
          font-weight: bold;
          margin-bottom: 10px;
          color: #333;
        }
        
        .qr-code-image {
          width: 300px;
          height: 300px;
          object-fit: contain;
        }
        
        .download-button {
          margin-top: 20px;
          cursor: pointer;
          display: inline-block;
        }
        
        .download-icon {
          width: 40px;
          height: 40px;
          object-fit: contain;
          filter: hue-rotate(240deg) brightness(0.5);
        }
        
        .webview-container {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #fff;
          z-index: 1000;
        }
        
        .webview-header {
          display: flex;
          align-items: center;
          background-color: #000080;
          padding: 15px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .back-button {
          padding: 8px 12px;
          background-color: rgba(255,255,255,0.2);
          border-radius: 5px;
          margin-right: 15px;
          border: none;
          color: #fff;
          font-weight: bold;
          cursor: pointer;
        }
        
        .webview-title {
          color: #fff;
          font-size: 18px;
          font-weight: bold;
          flex: 1;
          margin: 0;
        }
        
        .payment-iframe {
          width: 100%;
          height: calc(100vh - 60px);
          border: none;
        }
        
        .loading-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: calc(100vh - 60px);
          background-color: #fff;
        }
        
        .loading-text {
          margin-top: 10px;
          color: #000080;
          font-size: 16px;
        }
        
        .spinner {
          border: 4px solid #f3f3f3;
          border-top: 4px solid #000080;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .bottom-navbar {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background-color: #fff;
          padding: 10px 0;
          display: flex;
          justify-content: space-around;
          box-shadow: 0 -2px 4px rgba(0,0,0,0.1);
        }
        
        .nav-item {
          text-align: center;
          color: #666;
          font-size: 14px;
          cursor: pointer;
        }
        
        .nav-item:hover {
          color: #000080;
        }
      `}</style>

      <UserHeader headerText={"Payment Method"} />

      {/* WebView/Iframe for Online Payment - Full Screen when active */}
      {showWebView && paymentLink ? (
        <div className="webview-container">
          {/* <div className="webview-header">
            <button className="back-button" onClick={handleBackFromWebView}>
              ← Back
            </button>
            <h2 className="webview-title">Complete Payment</h2>
          </div> */}
          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p className="loading-text">Loading payment page...</p>
            </div>
          ) : (
            <iframe
              src={paymentLink}
              className="payment-iframe"
              title="Payment Gateway"
            />
          )}
        </div>
      ) : (
        <div className="content-area">
          {/* Payment Options */}
          {!orderResponse && (
            <>
              <div className="payment-options">
                <div
                  className={`payment-option ${
                    selectedMethod === "online" ? "selected" : ""
                  }`}
                  onClick={() => handlePaymentOptionClick("online")}
                >
                  <img
                    src="https://cdn.zeebiz.com/sites/default/files/2024/01/03/274966-upigpay.jpg"
                    alt="UPI"
                    className="payment-icon"
                  />
                  <span className="option-text">UPI</span>
                </div>
              </div>
              <button
                className="pay-button"
                onClick={handlePayment}
                disabled={loading || !selectedMethod}
              >
                {loading ? "Processing..." : "PAY"}
              </button>
            </>
          )}

          {/* Order Details */}
          {orderResponse && showOrderDetails && (
            <div className="order-details">
              <div className="detail-row">
                <span className="detail-label">Order ID:</span>
                <span className="detail-value">{orderResponse.id}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Total Amount:</span>
                <span className="detail-value">
                  ₹{orderResponse.totalAmount}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Status:</span>
                <span className="detail-value">{orderResponse.status}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Remaining Amount:</span>
                <span className="detail-value">
                  ₹{orderResponse.payments?.remainingAmount || 0}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Wallet Payment:</span>
                <span className="detail-value">
                  ₹{orderResponse.payments?.walletPaymentAmount || 0}
                </span>
              </div>

              {orderResponse.qrCode && (
                <div ref={qrCodeRef} className="qr-code-section">
                  <p className="qr-code-title">Order QR Code:</p>
                  <img
                    src={orderResponse.qrCode}
                    alt="QR Code"
                    className="qr-code-image"
                  />
                  <div className="download-button" onClick={saveQrToGallery}>
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/724/724933.png"
                      alt="Download"
                      className="download-icon"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Bottom Navigation - Only show when not in WebView */}
      {!showWebView && (
        <div className="bottom-navbar">
          <div className="nav-item">Home</div>
          <div className="nav-item">Orders</div>
          <div className="nav-item">Profile</div>
        </div>
      )}
    </div>
  );
};

export default PaymentMethod;
