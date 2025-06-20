import React from "react";
import { Card, Row, Col, Typography } from "antd";
import corpImage from "../images/Tiffin.png";
import snakImage from "../images/AfternoonSnack.png"
// import industrialImage from "../images/Morning snack.png";
import healthcareImage from "../images/Lunch.png";

const { Title, Paragraph } = Typography;

const services = [
  {
    title: "🍽️ Breakfast",
    subtitle: "🕢 7:30 AM – 8:15 AM",
    description: "A warm and nutritious start to the day with a balanced breakfast served fresh every morning.",
    image: corpImage,
  },
  // {
  //   title: "🍌 Morning Snack",
  //   subtitle: "🕙 10:00 AM – 10:15 AM",
  //   description: "A quick and healthy bite to keep hunger at bay and maintain energy levels before lunch.",
  //   image: industrialImage,
  // },

  {
    title: "🥗 Lunch",
    subtitle: "🕛 12:15 PM - 1:00 PM",
    description: "A hearty and balanced lunch featuring a variety of delicious and nutritious food options.",
    image: healthcareImage,
  },
  {
    title: "🍪 Afternoon Snacks",
    subtitle: "🕞 3:30 PM - 3:45 PM",
    description: "A light snack to recharge and refresh for the rest of the day’s activities.",
    image: snakImage,
  },
];

const ServicesSection: React.FC = () => {
  return (
    <section
      id="services"
      style={{
        marginTop: "-80px",
        padding: "5rem 2rem",
        background: "#fff",
        textAlign: "center",
      }}
    >
      <div style={{ marginBottom: "40px" }}>
        <Title
          level={4}
          style={{
            color: "#010080",
            fontWeight: 500,
            fontSize: "20px",
            marginBottom: "10px",
          }}
        >
         🥗 Our Daily Meal Services
        </Title>
        <Title
          level={2}
          style={{ fontSize: "28px", fontWeight: 600, color: "#000" }}
        >
         Below is our daily meal schedule
        </Title>
      </div>
      <Row gutter={[30, 30]} justify="center">
        {services.map((service, index) => (
          <Col key={index} xs={24} sm={12} md={8} lg={6}>
            <Card
              hoverable
              cover={
                <img
                  src={service.image}
                  alt={service.title}
                  style={{ height: "180px", objectFit: "cover" }}
                />
              }
              style={{
                borderRadius: "4px",
                overflow: "hidden",
                boxShadow: "0 2px 12px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Title level={4} style={{ fontSize: "16px", fontWeight: 600 }}>
                {service.title}
              </Title>
              {service.subtitle && (
                <Paragraph
                  style={{
                    fontSize: "13px",
                    color: "#888",
                    marginBottom: "8px",
                  }}
                >
                  {service.subtitle}
                </Paragraph>
              )}
              <Paragraph style={{ fontSize: "13px", color: "#444" }}>
                {service.description}
              </Paragraph>
            </Card>
          </Col>
        ))}
      </Row>
    </section>
  );
};

export default ServicesSection;
