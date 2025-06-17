import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Card, Typography, Space } from "antd";
import canteenImg from "../../assets/images/canteens.jpg";
import menuImage from "../../assets/images/menu.jpg";
import ordersImage from "../../assets/images/orders.jpg";
import itemsImage from "../../assets/images/items.jpg";
import { adminDashboardService } from "../../auth/apiService";

const { Title, Text } = Typography;

const SuperAdminDashboard: React.FC = () => {
  const navigate = useNavigate();
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
  },[])
  

  const handleCardClick = (cardName: string) => {
    if (cardName === "Canteens") {
      navigate("/canteens-list");
    } else if (cardName === "Items") {
      navigate("/items-list");
    } else if (cardName === "Menu") {
      navigate("/menus-list");
    } else if (cardName === "Orders") {
      navigate("/orders");
    }
  };

  const statCards = [
    { title: "TOTAL CANTEENS", value: countsData.totalCanteens },
    { title: "TOTAL ITEMS", value: countsData.totalItems },
    { title: "TOTAL ORDERS", value: countsData.totalOrders },
    { title: "REVENUE", value: countsData.totalAmount !== null && countsData.totalAmount !== undefined ? `₹ ${countsData.totalAmount}` : "₹ 0" },
  ];

  const featureCards = [
    { title: "Canteens", image: canteenImg },
    { title: "Items", image: itemsImage },
    { title: "Menu", image: menuImage },
    { title: "Orders", image: ordersImage },
  ];

  return (
    <div
      style={{
        // height: "calc(100vh - 64px)",
        // height: "75vh",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ padding: "20px", paddingBottom: 0, flexGrow: 1 }}>
        <Row gutter={[16, 16]} style={{ marginBottom: "30px" }}>
          {statCards.map((stat, index) => (
            <Col xs={24} sm={12} md={6} xl={6} key={index}>
              <Card
                hoverable
                style={{
                  textAlign: "center",
                  borderRadius: "10px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  height: "100%",
                }}
                onClick={() => handleCardClick(stat.title)}
              >
                <Title level={4} style={{ margin: 0, color: "#333" }}>
                  {stat.title}
                </Title>

                <Text
                  style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    color: "#4caf50",
                  }}
                >
                  {stat.value}
                </Text>
              </Card>
            </Col>
          ))}
        </Row>

        <Row gutter={[16, 16]}>
          {featureCards.map((feature, index) => (
            <Col xs={24} sm={12} md={6} key={index}>
              <Space
                direction="vertical"
                style={{ width: "100%", textAlign: "center" }}
              >
                <Card
                  hoverable
                  style={{
                    borderRadius: "10px",
                    padding: 0,
                    overflow: "hidden",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    height: "288px",
                  }}
                  styles={{body:{padding:0}}}
                  cover={
                    <div
                      style={{
                        height: "100%",
                        width: "100%",
                        overflow: "hidden",
                      }}
                    >
                      <img
                        alt={feature.title}
                        src={feature.image}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  }
                  onClick={() => handleCardClick(feature.title)}
                />
                <Title
                  level={5}
                  style={{ margin: "8px 0 0", textAlign: "center" }}
                >
                  {feature.title}
                </Title>
              </Space>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;