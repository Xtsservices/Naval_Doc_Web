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
        margin: "10px 0",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        borderRadius: "4px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
      }}
      styles={{
        body: {
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        },
      }}
    >
      <div
        style={{
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          border: "1px solid #f0f0f0",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "10px",
          fontSize: "24px",
          color: "#666",
        }}
      >
        {icon}
      </div>
      <div
        style={{
          fontSize: "24px",
          fontWeight: "bold",
          marginBottom: "5px",
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: "14px",
          color: "#666",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
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

  return (
    <div style={{ padding: "20px", paddingTop: "2px" }}>
      <BackHeader
        // path={`/canteens-list/canteen-dashboard/${1}`}
        path={
          route?.canteenName && route?.canteenId
            ? `/canteens-list/canteen-dashboard/${route?.canteenId}/${route?.canteenName}`
            : `/dashboard`
        }
        title={
          route?.canteenName
            ? `Orders Dashboard  |  ${route.canteenName}`
            : "Orders Dashboard"
        }
        styles={{ marginBottom: "16px" }}
      />
      <Row gutter={[17, 17]}>
        <Col xs={24} sm={12} md={5} lg={4}>
          <StatCard
            icon={<DollarCircleOutlined />}
            // value="₹ 10,000"
            value={`₹ ${countsData?.totalAmount || 0}`}
            title="Total Revenue"
          />
        </Col>
        <Col xs={24} sm={12} md={5} lg={4}>
          <StatCard
            icon={<ShoppingCartOutlined />}
            value={`${countsData?.totalOrders || 0}`}
            title="Total Orders"
          />
        </Col>
        <Col xs={24} sm={12} md={5} lg={4}>
          <StatCard
            icon={<CheckCircleOutlined />}
            value={`${countsData?.completedOrders || 0}`}
            title="Total Delivered"
          />
        </Col>
        <Col xs={24} sm={12} md={5} lg={4}>
          <StatCard
            icon={<CloseCircleOutlined />}
            value={`${countsData?.cancelledOrders || 0}`}
            title="Total Canceled"
          />
        </Col>
        <Col xs={24} sm={12} md={5} lg={4}>
          <StatCard icon={<BankOutlined />} value={`${countsData?.totalCanteens || 0}`} title="Total Canteens" />
        </Col>
      </Row>

      <Row style={{ marginTop: "35px" }}>
        <Col span={24}>
          <Button
            type="default"
            size="large"
            block
            style={{
              height: "60px",
              fontSize: "18px",
              borderRadius: "4px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
              backgroundColor: "#fff",
            }}
          >
            View Item Wise List
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default OrdersDashboard;
