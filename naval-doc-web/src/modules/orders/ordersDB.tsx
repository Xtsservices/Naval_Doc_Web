import React, { useEffect, useState } from "react";
import { Card, Row, Col, Button } from "antd";
import {
  DollarCircleOutlined,
  ShoppingCartOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  BankOutlined,
} from "@ant-design/icons";
import BackHeader from "../../components/common/backHeader";
import { useParams } from "react-router-dom";
import { adminDashboardService } from "../../auth/apiService";

interface StatCardProps {
  icon: React.ReactNode;
  value: string | number;
  title: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, value, title }) => {
  return (
    <Card
      style={{
        margin: "0",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        border: "1px solid #f0f0f0",
        transition: "all 0.3s ease",
        cursor: "pointer",
      }}
      styles={{
        body: {
          padding: "clamp(16px, 4vw, 24px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          minHeight: "120px",
          justifyContent: "center",
        },
      }}
      hoverable
    >
      <div
        style={{
          width: "clamp(50px, 12vw, 60px)",
          height: "clamp(50px, 12vw, 60px)",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "clamp(8px, 2vw, 12px)",
          fontSize: "clamp(20px, 5vw, 24px)",
          color: "#1890ff",
        }}
      >
        {icon}
      </div>
      <div
        style={{
          fontSize: "clamp(18px, 5vw, 24px)",
          fontWeight: "bold",
          marginBottom: "clamp(4px, 1vw, 6px)",
          color: "#262626",
          lineHeight: "1.2",
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: "clamp(11px, 3vw, 14px)",
          color: "#8c8c8c",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
          fontWeight: "500",
          lineHeight: "1.3",
          textAlign: "center",
          wordBreak: "break-word",
        }}
      >
        {title}
      </div>
    </Card>
  );
};

const OrdersDashboard: React.FC = () => {
  const route = useParams();
  const [, setOrders] = useState([]);
  const [, setLoading] = useState(false);

  const [countsData, setCountsData] = React.useState<any>({});

  useEffect(() => {
    adminDashboardService
      .getDashboardMainCounts()
      .then((response) => {
        setCountsData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      let response;
      if (route?.canteenId) {
        response = await adminDashboardService.getTotalOrders(
          parseInt(route?.canteenId)
        );
      } else {
        response = await adminDashboardService.getTotalOrders();
      }

      if (response && response?.data) {
        setOrders(response.data);
      }
    } catch (error) {
      console.error("Error fetching menus:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      icon: <DollarCircleOutlined />,
      value: `₹ ${countsData?.totalAmount || 0}`,
      title: "Total Revenue",
    },
    {
      icon: <ShoppingCartOutlined />,
      value: `${countsData?.totalOrders || 0}`,
      title: "Total Orders",
    },
    {
      icon: <CheckCircleOutlined />,
      value: `${countsData?.completedOrders || 0}`,
      title: "Total Delivered",
    },
    {
      icon: <CloseCircleOutlined />,
      value: `${countsData?.cancelledOrders || 0}`,
      title: "Total Canceled",
    },
    {
      icon: <BankOutlined />,
      value: `${countsData?.totalCanteens || 0}`,
      title: "Total Canteens",
    },
  ];

  return (
    <div 
      style={{ 
        padding: "clamp(12px, 3vw, 20px)", 
        paddingTop: "2px",
        maxWidth: "100vw",
        overflow: "hidden"
      }}
    >
      <BackHeader
        path={
          route?.canteenName && route?.canteenId
            ? `/canteens-list/canteen-dashboard/${route?.canteenId}/${route?.canteenName}`
            : `/dashboard`
        }
        title={
          route?.canteenName
            ? `Orders Dashboard | ${route.canteenName}`
            : "Orders Dashboard"
        }
        styles={{ 
          marginBottom: "clamp(12px, 3vw, 20px)",
        }}
      />
      
      {/* Stats Grid */}
      <Row 
        gutter={[
          { xs: 12, sm: 16, md: 20, lg: 24 }, 
          { xs: 12, sm: 16, md: 20, lg: 24 }
        ]}
        style={{ marginBottom: "clamp(20px, 5vw, 35px)" }}
      >
        {statCards.map((card, index) => (
          <Col 
            key={index}
            xs={12} // 2 cards per row on mobile
            sm={12} // 2 cards per row on small tablets
            md={8}  // 3 cards per row on medium screens
            lg={6}  // 4 cards per row on large screens
            xl={4}  // 5 cards per row on extra large screens (original layout)
            xxl={4}
          >
            <StatCard
              icon={card.icon}
              value={card.value}
              title={card.title}
            />
          </Col>
        ))}
      </Row>

      {/* Action Button
      <Row>
        <Col span={24}>
          <Button
            type="default"
            size="large"
            block
            style={{
              height: "clamp(50px, 12vw, 60px)",
              fontSize: "clamp(14px, 4vw, 18px)",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              backgroundColor: "#fff",
              border: "1px solid #d9d9d9",
              fontWeight: "500",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#1890ff";
              e.currentTarget.style.color = "#1890ff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#d9d9d9";
              e.currentTarget.style.color = "rgba(0, 0, 0, 0.85)";
            }}
          >
            View Item Wise List
          </Button>
        </Col>
      </Row> */}
    </div>
  );
};

export default OrdersDashboard;