import React, { useEffect, useState } from "react";
import {
  Card,
  List,
  Typography,
  Button,
  message,
  Modal,
} from "antd";
import UserHeader from "../userComponents/UserHeader";
import axios from "axios";

const { Title, Text } = Typography;

import { BASE_URL } from "../../constants/api";


interface OrderItem {
  id: number;
  itemId: number;
  quantity: number;
  price: number;
  total: number;
  menuItemItem: {
    id: number;
    name: string;
    description: string;
  };
}

interface Payment {
  id: number;
  amount: number;
  status: string;
  paymentMethod: string;
}

interface Order {
  id: number;
  status: string;
  orderDate: number;
  totalAmount: number;
  qrCode: string;
  orderItems: OrderItem[];
  payment: Payment[];
}

const MyOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [cancellingOrders, setCancellingOrders] = useState<Set<number>>(new Set());
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<{ id: number; status: string } | null>(null);

  const token = localStorage.getItem("Token");

  const handleCancelClick = (orderId: number, currentStatus: string) => {
    if (currentStatus.toLowerCase() === "cancelled") {
      message.info("This order has already been cancelled.");
      return;
    }

    setSelectedOrder({ id: orderId, status: currentStatus });
    setCancelModalVisible(true);
  };

  const confirmCancelOrder = async () => {
    if (!selectedOrder) return;
    const { id: orderId } = selectedOrder;

    try {
      setCancellingOrders((prev) => new Set(prev).add(orderId));

      const response = await axios.post(
        `${BASE_URL}/order/cancelOrder`,
        { orderId },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: token || "",
          },
        }
      );

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: "cancelled" } : order
        )
      );

      message.success("Order cancelled successfully");
    } catch (error: any) {
      console.error("Failed to cancel order", error);
      let errorMessage = "Failed to cancel order";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      message.error(errorMessage);
    } finally {
      setCancellingOrders((prev) => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
        return newSet;
      });
      setCancelModalVisible(false);
      setSelectedOrder(null);
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/order/listOrders`, {
          headers: {
            authorization: token || "",
          },
        });

        if (response?.data?.data) {
          const sortedOrders = [...response.data.data].sort(
            (a, b) => b.orderDate - a.orderDate
          );
          setOrders(sortedOrders);
        }
      } catch (error: any) {
        console.error("Failed to fetch orders", error);
      }
    };

    fetchOrders();
  }, [token]);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  };

  return (
    <div style={{ background: "#F8F9FB", minHeight: "100vh", padding: 0 }}>
      <UserHeader headerText="My Orders" />
      <Title level={3} style={{ marginTop: 16 , marginLeft: 16}}>
        Orders History
      </Title>

      <List
        grid={{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 2 }}
        dataSource={orders}
        renderItem={(order) => (
          <List.Item>
            <Card
              title={`Order ID: NV${order.id}`}
              extra={
                <Text
                  type={
                    order.status.toUpperCase() === "PLACED"
                      ? "success"
                      : "danger"
                  }
                >
                  {order.status.toUpperCase()}
                </Text>
              }
              style={{ width: "100%" }}
            >
              <Text strong>Date:</Text>{" "}
              <Text>{formatDate(order.orderDate)}</Text>
              <br />
              <Text strong>Total:</Text> ₹{order.totalAmount}
              <br />
              <Text strong>Payment:</Text>{" "}
              {order.payment?.[0]?.paymentMethod ?? "N/A"}
              <br />
              <Text strong>Items:</Text>
              <ul style={{ paddingLeft: 20, marginTop: 4 }}>
                {order.orderItems.map((item, index) => (
                  <li key={index}>
                    {item.menuItemItem.name} × {item.quantity}
                  </li>
                ))}
              </ul>

              {order.status.toUpperCase() === "PLACED" && (
                <>
                  <Button
                    danger
                    block
                    loading={cancellingOrders.has(order.id)}
                    style={{ marginTop: 12 }}
                    onClick={() => handleCancelClick(order.id, order.status)}
                  >
                    Cancel Order
                  </Button>

                  <div style={{ marginTop: 16, textAlign: "center" }}>
                    <a href={order.qrCode} download={`order_${order.id}_qr.png`}>
                      <img
                        src={order.qrCode}
                        alt={`QR for order #${order.id}`}
                        style={{ width: 150, height: 150, cursor: "pointer" }}
                      />
                    </a>
                    <div style={{ marginTop: 4 }}>
                      <Text type="secondary">Tap QR to Download</Text>
                    </div>
                  </div>
                </>
              )}
            </Card>
          </List.Item>
        )}
      />

      {/* Modal rendered here in JSX */}
      <Modal
        title="Cancel Order"
        open={cancelModalVisible}
        onOk={confirmCancelOrder}
        confirmLoading={
          selectedOrder ? cancellingOrders.has(selectedOrder.id) : false
        }
        onCancel={() => {
          setCancelModalVisible(false);
          setSelectedOrder(null);
        }}
        okText="Yes, Cancel"
        cancelText="No"
      >
        <p>Are you sure you want to cancel this order?</p>
        <p>
          <strong>Order Status:</strong>{" "}
          {selectedOrder?.status?.toUpperCase()}
        </p>
        <p style={{ color: "red" }}>
          Note: Cancelled orders cannot be undone.
        </p>
      </Modal>
    </div>
  );
};

export default MyOrders;
