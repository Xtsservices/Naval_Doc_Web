import React from "react";
import { Layout, Card, Row, Col, Button, Typography } from "antd";
import {
  MenuOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  AppstoreOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Header, Content } = Layout;
const { Title } = Typography;

const AdminDB: React.FC = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      icon: <MenuOutlined style={{ fontSize: "40px" }} />,
      title: "Menu",
      path: "/admin/menu",
    },
    {
      icon: <ShoppingCartOutlined style={{ fontSize: "40px" }} />,
      title: "Orders",
      path: "/admin/orders",
    },
    {
      icon: <UserOutlined style={{ fontSize: "40px" }} />,
      title: "Users",
      path: "/admin/users",
    },
    {
      icon: <AppstoreOutlined style={{ fontSize: "40px" }} />,
      title: "Inventories",
      path: "/admin/inventories",
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          background: "transparent",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "end",
        }}
      >
        <Button
          type="primary"
          icon={<PlusOutlined />}
          style={{
            background: "#fff",
            color: "#1a237e",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            marginTop: "32px",
            padding: "20px",
            fontWeight: "bold",
          }}
        >
          ADD Canteen USER
        </Button>
      </Header>

      <Content style={{ padding: "24px", background: "#f0f2f5" }}>
        <Row gutter={[24, 24]} justify="center">
          {menuItems.map((item, index) => (
            <Col xs={24} sm={12} md={6} key={index}>
              <Card
                hoverable
                style={{
                  textAlign: "center",
                  height: "200px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                }}
                onClick={() => navigate(item.path)}
              >
                {item.icon}
                {/* <Title level={5} style={{ marginTop: "16px" }}>
                  {item.title}
                </Title> */}
              </Card>
              <Title level={5} style={{ marginTop: "16px" }}> {item.title}</Title>
            </Col>
          ))}
        </Row>
      </Content>
    </Layout>
  );
};

export default AdminDB;


