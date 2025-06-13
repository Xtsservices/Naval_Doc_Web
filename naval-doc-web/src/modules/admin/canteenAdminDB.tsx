import { useNavigate, useParams } from "react-router-dom";
import menuImage from "../../assets/images/menu.jpg";
import ordersImage from "../../assets/images/orders.jpg";
import itemsImage from "../../assets/images/items.jpg";
import { Card, Col, Row, Space, Typography } from "antd";
import BackHeader from "../../components/common/backHeader";
const { Title } = Typography;

const CanteenAdminDB = () => {
  const navigate = useNavigate();
  const route = useParams();
  console.log(route, "routee");

  const featureCards = [
    { title: "Menu", image: menuImage },
    { title: "Orders", image: ordersImage },
    { title: "Users", image: itemsImage },
  ];

  const handleCardClick = (cardName: string) => {
    if (cardName === "Canteens") {
      navigate("/canteens-dashboard");
    } else if (cardName === "Items") {
      navigate("/items-list");
    } else if (cardName === "Menu") {
      navigate(`/canteens-list/canteen-dashboard/${route?.canteenId}/${route?.canteenName}/menu`);
    } else if (cardName === "Users") {
      navigate(
        `/canteens-list/canteen-dashboard/${route?.canteenId}/users-list`
      );
    } else if (cardName === "Orders") {
      navigate(`/canteens-list/canteen-dashboard/${route?.canteenId}/${route?.canteenName}/orders`);
    }
  };

  return (
    <div>
      <BackHeader
        path="/canteens-list"
        title={
          route?.canteenName
            ? `${route.canteenName}`
            : "Canteen Dashboard"
        }
        styles={{
          marginLeft: "22px",
        }}
      />

      <div style={{ padding: "20px 57px", paddingBottom: 0, paddingTop: 0 }}>
        <Row
          gutter={[16, 16]}
          style={{ display: "flex", justifyContent: "space-between" }}
        >
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
                  styles={{ body: { padding: "0px" } }}
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

export default CanteenAdminDB;
