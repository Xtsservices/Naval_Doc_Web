import React from "react";
import { Card, Row, Col, Typography } from "antd";

interface Canteen {
  id?: string;
  canteenName: string;
  totalOrders: number;
  totalAmount: number;
}

interface CanteenOrdersDisplayProps {
  data: Canteen[];
}

const CanteenOrdersDisplay: React.FC<CanteenOrdersDisplayProps> = ({ data }) => {
  const containerStyle = {
    padding: "24px 0",
  };

  const cardStyle = {
    height: "100%",
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center" as const,
    background: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
    padding: "24px",
    transition: "all 0.3s ease",
    border: "1px solid rgba(0, 0, 0, 0.06)",
    minHeight: "180px",
  };

  const nameStyle = {
    fontSize: "18px",
    fontWeight: 600,
    color: "#262626",
    marginBottom: "12px",
    whiteSpace: "nowrap" as const,
    overflow: "hidden",
    textOverflow: "ellipsis",
  };

  const labelCountWrapper = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    justifyContent: "center",
    flexWrap: "wrap" as const,
  };

  const ordersLabelStyle = {
    fontSize: "18px",
    color: "#1890ff",
    fontWeight: 500,
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
    margin: 0,
  };

  const ordersCountStyle = {
    fontSize: "28px",
    fontWeight: 700,
    color: "#f5222d",
    margin: 0,
  };

  const getCardBackground = (index: number) => {
    const gradients: Record<number, string> = {
      0: "linear-gradient(135deg, #ffffff 0%, #f9f9ff 100%)",
      1: "linear-gradient(135deg, #ffffff 0%, #f9fffd 100%)",
      2: "linear-gradient(135deg, #ffffff 0%, #fff9f9 100%)",
    };

    return {
      background: gradients[index % 3] || "#ffffff",
    };
  };

  return (
    <div style={containerStyle}>
      <Row gutter={[24, 24]}>
        {data.map((canteen, index) => (
          <Col
            key={canteen.id || index}
            xs={24}
            sm={12}
            md={8}
            lg={6}
            xl={6}
          >
            <Card
              style={{ ...cardStyle, ...getCardBackground(index) }}
              hoverable
            >
              <Typography.Text style={nameStyle}>
                {canteen?.canteenName}
              </Typography.Text>
              <div style={labelCountWrapper}>
                <Typography.Text style={ordersLabelStyle}>
                  Orders:
                </Typography.Text>
                <Typography.Text style={ordersCountStyle}>
                  {canteen.totalOrders}
                </Typography.Text>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default CanteenOrdersDisplay;
