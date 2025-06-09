import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

type Payment = {
  createdAt: number;
  updatedAt: number;
  id: number;
  orderId: number;
  userId: number;
  paymentMethod: string;
  transactionId: string | null;
  amount: number;
  gatewayPercentage: number;
  gatewayCharges: number;
  totalAmount: number;
  currency: string;
  status: string;
  createdById: number;
  updatedById: number;
};

const PaymentResponse = () => {
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const linkId = searchParams.get("link_id");
    console.log("Link ID from URL:", linkId);
    if (!linkId) {
      setError("No link_id found in URL.");
      setLoading(false);
      return;
    }

    fetch("https://server.welfarecanteen.in/api/order/CashfreePaymentLinkDetails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ linkId }),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch payment details");
        const data = await res.json();
        setPayment(data.data?.payment);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [searchParams]);

  // Show tick if payment is successful
  const showTick =
    payment?.status?.toLowerCase() === "success" ||
    payment?.status?.toLowerCase() === "successful";

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#ffffff",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <header
        style={{
          background: "#000080",
          padding: "12px 0",
          borderBottom: "2px solid #001155",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 20px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              color: "white",
            }}
          >
            <img
              src="https://www.joinindiannavy.gov.in/images/octaginal-crest.png"
              alt="Navy Logo"
              style={{ width: "40px", height: "40px", marginRight: "12px" }}
            />
            <h1
              style={{
                margin: 0,
                fontSize: "20px",
                fontWeight: "700",
                textShadow: "0 2px 4px rgba(0,0,0,0.3)",
              }}
            >
              WELFARE CANTEEN PAYMENT PORTAL
            </h1>
          </div>
          <nav style={{ color: "white" }}>
            <span
              style={{
                margin: "0 15px",
                cursor: "pointer",
                fontSize: "14px",
                opacity: 0.9,
              }}
            >
              Home
            </span>
            <span
              style={{
                margin: "0 15px",
                cursor: "pointer",
                fontSize: "14px",
                opacity: 0.9,
              }}
            >
              Support
            </span>
            <span
              style={{
                margin: "0 15px",
                cursor: "pointer",
                fontSize: "14px",
                opacity: 0.9,
              }}
            >
              Contact
            </span>
          </nav>
        </div>
      </header>

      <main
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          background: "#ffffff",
        }}
      >
        <div
          style={{
            background: "#fff",
            maxWidth: 500,
            width: "100%",
            borderRadius: 15,
            boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
            padding: "24px 20px",
            textAlign: "center",
          }}
        >
          {!loading && !error && payment ? (
            showTick ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  marginBottom: 16,
                  background: "#e8f5e9",
                  borderRadius: 8,
                  padding: "32px 0 28px 0",
                  color: "#388e3c",
                  transition: "all 0.3s",
                }}
              >
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <circle cx="24" cy="24" r="24" fill="#388e3c" />
                  <path
                    d="M34 18L21.5 30.5L14 23"
                    stroke="#fff"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div style={{ fontWeight: 700, fontSize: 18, marginTop: 12 }}>
                  Payment Successful
                </div>
              </div>
            ) : (
              <div
                style={{
                  marginBottom: 16,
                  background: "#000080",
                  borderRadius: 8,
                  padding: "16px 0 12px 0",
                  color: "#fff",
                }}
              >
                <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>
                  WELFARE CANTEEN
                </div>
                <img
                  src="https://www.joinindiannavy.gov.in/images/octaginal-crest.png"
                  alt="Logo"
                  style={{ maxWidth: "10%", maxHeight: "10%", marginBottom: 8 }}
                />
                <div
                  style={{ fontSize: 12, color: "#bbdefb", marginBottom: 4 }}
                >
                  Payment Details
                </div>
              </div>
            )
          ) : (
            <div
              style={{
                marginBottom: 16,
                background: "#000080",
                borderRadius: 8,
                padding: "16px 0 12px 0",
                color: "#fff",
              }}
            >
              <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>
                WELFARE CANTEEN
              </div>
              <img
                src="https://www.joinindiannavy.gov.in/images/octaginal-crest.png"
                alt="Logo"
                style={{ maxWidth: "10%", maxHeight: "10%", marginBottom: 8 }}
              />
              <div style={{ fontSize: 12, color: "#bbdefb", marginBottom: 4 }}>
                Payment Details
              </div>
            </div>
          )}
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div style={{ color: "red" }}>{error}</div>
          ) : payment ? (
            <table
              style={{ margin: "0 auto", textAlign: "left", fontSize: 14 }}
            >
              <tbody>
                <tr>
                  <td style={{ fontWeight: 600, padding: "6px 20px 6px 0" }}>
                    Created At
                  </td>
                  <td>{new Date(payment.createdAt * 1000).toLocaleString()}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600, padding: "6px 20px 6px 0" }}>
                    ID
                  </td>
                  <td>{payment.id}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600, padding: "6px 20px 6px 0" }}>
                    Order ID
                  </td>
                  <td>{payment.orderId}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600, padding: "6px 20px 6px 0" }}>
                    User ID
                  </td>
                  <td>{payment.userId}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600, padding: "6px 20px 6px 0" }}>
                    Payment Method
                  </td>
                  <td>{payment.paymentMethod}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600, padding: "6px 20px 6px 0" }}>
                    Amount
                  </td>
                  <td>₹{payment.amount}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600, padding: "6px 20px 6px 0" }}>
                    Total Amount
                  </td>
                  <td>₹{payment.totalAmount}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600, padding: "6px 20px 6px 0" }}>
                    Currency
                  </td>
                  <td>{payment.currency}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600, padding: "6px 20px 6px 0" }}>
                    Status
                  </td>
                  <td>{payment.status}</td>
                </tr>
              </tbody>
            </table>
          ) : (
            <div>No payment data found.</div>
          )}
        </div>
      </main>

      <footer
        style={{
          background: "#000080",
          color: "white",
          padding: "16px 0",
          borderTop: "2px solid #001155",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <div style={{ fontSize: "12px", opacity: 0.8 }}>
            © 2024 Indian Navy Welfare Canteen. All rights reserved.
          </div>
          <div style={{ fontSize: "12px", opacity: 0.8 }}>
            <span style={{ margin: "0 10px" }}>Privacy Policy</span>
            <span style={{ margin: "0 10px" }}>Terms of Service</span>
            <span style={{ margin: "0 10px" }}>Help Center</span>
          </div>
          <div style={{ fontSize: "12px", opacity: 0.8 }}>
            Secure Payment Gateway | SSL Protected
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PaymentResponse;
