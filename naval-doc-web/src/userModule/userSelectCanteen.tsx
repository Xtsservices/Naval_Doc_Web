import React, { useEffect, useState } from "react";
import { Card, Row, Col, Typography, Spin, message, Button } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const { Title, Text } = Typography;

interface Canteen {
  id: number;
  canteenName: string;
  canteenCode: string;
  canteenImage: string;
}

const API_URL = "http://192.168.1.24:3002/api/user/getAllCanteens";

const UserSelectCanteen: React.FC = () => {
  const [canteens, setCanteens] = useState<Canteen[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCanteens = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("Token");
        if (!token) {
          message.error("No token found. Please login.");
          return;
        }
        const res = await axios.get(API_URL, {
          headers: { Authorization: token },
        });
        setCanteens(res.data.data || []);

        console.log("Fetched canteens:", res.data.data);
      } catch (err) {
        message.error("Failed to fetch canteens.");
      } finally {
        setLoading(false);
      }
    };
    fetchCanteens();
  }, []);

  const handleSelect = (canteen: Canteen) => {
    localStorage.setItem("canteenId", JSON.stringify(canteen.id));
    message.success(`Selected ${canteen.canteenName}`);
    navigate("/user/select-menu");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
        padding: "32px 8px",
      }}
    >
      <div
        style={{
          maxWidth: 600,
          margin: "0 auto",
          background: "rgba(255,255,255,0.95)",
          borderRadius: 24,
          boxShadow: "0 8px 32px rgba(60,60,120,0.10)",
          padding: 32,
        }}
      >
        <Title
          level={2}
          style={{
            textAlign: "center",
            marginBottom: 32,
            fontWeight: 700,
            letterSpacing: 1,
            color: "#2d3748",
          }}
        >
          🍽️ Select Your Canteen
        </Title>
        {loading ? (
          <Spin
            size="large"
            style={{ display: "block", margin: "40px auto" }}
          />
        ) : (
          <Row gutter={[24, 24]} justify="center">
            {canteens.map((canteen) => (
              <Col xs={24} sm={12} md={8} key={canteen.id}>
                <Card
                  hoverable
                  style={{
                    borderRadius: 20,
                    boxShadow: "0 4px 16px #e0e0e0",
                    textAlign: "center",
                    border: "none",
                    background:
                      "linear-gradient(135deg, #f8fafc 60%, #e0e7ff 100%)",
                    transition: "transform 0.2s",
                  }}
                  bodyStyle={{ padding: 18 }}
                  onClick={() => handleSelect(canteen)}
                  cover={
                    <img
                      alt={canteen.canteenName}
                      src={canteen.canteenImage}
                      style={{
                        width: "100%",
                        height: 140,
                        objectFit: "cover",
                        borderRadius: "20px 20px 0 0",
                        background: "#f6f6f6",
                        borderBottom: "2px solid #e0e7ff",
                      }}
                    />
                  }
                >
                  <Title
                    level={5}
                    style={{
                      marginBottom: 2,
                      fontWeight: 600,
                      color: "#374151",
                    }}
                  >
                    {canteen.canteenName}
                  </Title>
                  <Text
                    type="secondary"
                    style={{
                      fontSize: 14,
                      color: "#6366f1",
                      fontWeight: 500,
                      letterSpacing: 0.5,
                    }}
                  >
                    Code: {canteen.canteenCode}
                  </Text>
                  <div style={{ marginTop: 16 }}>
                    <Button
                      type="primary"
                      shape="round"
                      size="middle"
                      style={{
                        width: "100%",
                        background:
                          "linear-gradient(90deg, #6366f1 0%, #60a5fa 100%)",
                        border: "none",
                        fontWeight: 600,
                        letterSpacing: 1,
                        boxShadow: "0 2px 8px #c7d2fe",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelect(canteen);
                      }}
                    >
                      Select
                    </Button>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
};

export default UserSelectCanteen;
