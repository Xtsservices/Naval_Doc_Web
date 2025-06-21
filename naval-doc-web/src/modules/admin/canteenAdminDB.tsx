import { useNavigate, useParams } from "react-router-dom";
import menuImage from "../../assets/images/menu.jpg";
import ordersImage from "../../assets/images/orders.jpg";
import { Card, Col, Row, Space, Typography } from "antd";
import BackHeader from "../../components/common/backHeader";
const { Title } = Typography;

const CanteenAdminDB = () => {
  const navigate = useNavigate();
  const route = useParams();

  const featureCards = [
    { title: "Menu", image: menuImage },
    { title: "Orders", image: ordersImage },
  ];

  const handleCardClick = (cardName: string) => {
    if (cardName === "Menu") {
      navigate(
        `/canteens-list/canteen-dashboard/${route?.canteenId}/${route?.canteenName}/menu`
      );
    } else if (cardName === "Orders") {
      navigate(
        `/canteens-list/canteen-dashboard/${route?.canteenId}/${route?.canteenName}/orders`
      );
    }
  };

  return (
    <div>
      <BackHeader
        path="/canteens-list"
        title={
          route?.canteenName ? `${route.canteenName}` : "Canteen Dashboard"
        }
        styles={{
          marginLeft: "22px",
        }}
      />

      <div
        style={{
          padding: "20px 16px",
          paddingBottom: 0,
          paddingTop: 0,
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        <Row
          gutter={[24, 24]}
          justify="center"
        >
          {featureCards.map((feature, index) => (
            <Col
              key={index}
              xs={24}
              sm={12}
              md={8}
              lg={6}
              style={{ display: "flex", justifyContent: "center" }}
            >
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
                    width: "100%",
                    maxWidth: 300,
                    minHeight: 220,
                  }}
                  bodyStyle={{ padding: 0 }}
                  cover={
                    <div
                      style={{
                        height: "180px",
                        width: "100%",
                        overflow: "hidden",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "#f5f5f5",
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

export default CanteenAdminDB;
