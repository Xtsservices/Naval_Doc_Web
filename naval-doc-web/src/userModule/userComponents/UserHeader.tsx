import React, { useState, useEffect } from "react";
import {
  Layout,
  Button,
  Avatar,
  Typography,
  Badge,
  Row,
  Col,
  Menu,
  Drawer,
  Popover,
  Modal,
} from "antd";
import {
  UserOutlined,
  UnorderedListOutlined,
  ShoppingCartOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import NotificationsDropdown from "../../modules/notifications/notificationDropdown";
import navyLogo from "/public/Naval.jpg";
import { useNavigate } from "react-router-dom";

const { Header } = Layout;
const { Text } = Typography;

interface HeaderProps {
  headerText?: string;
}

const UserHeader: React.FC<HeaderProps> = ({ headerText }) => {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  const handleNavigation = (path: string) => {
    if (navigate) {
      navigate(path);
    } else {
      window.location.href = path;
    }

    if (drawerVisible) {
      setDrawerVisible(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("Token");
    handleNavigation("/");
  };

  const profileMenu = (
    <Menu style={{ width: 200 }}>
      <Menu.Item
        key="profile"
        icon={<UserOutlined />}
        onClick={() => handleNavigation("/profile")}
      >
        Profile
      </Menu.Item>

      <Menu.Item
        key="Orders"
        icon={<UnorderedListOutlined />}
        onClick={() => handleNavigation("/user/orders")}
      >
        Orders
      </Menu.Item>

      <Menu.Item
        key="Cart"
        icon={<ShoppingCartOutlined />}
        onClick={() => handleNavigation("/user/myCart")}
      >
        Cart
      </Menu.Item>

      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  

  return (
    <>
      <Header
        className="site-header"
        style={{
          backgroundColor: "rgb(1, 0, 128)",
          padding: "0 18px",
          height: "100px",
          position: "sticky",
          top: 0,
          zIndex: 999,
          width: "100%",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
        }}
      >
        <Row align="middle" style={{ height: "100%" }}>
          <Col xs={6} sm={6} md={5} lg={4}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <img
                src={navyLogo}
                style={{ height: "90px", width: "150px", marginTop: "-5px" }}
              />
            </div>
          </Col>

          <Col xs={12} sm={12} md={12} lg={12}>
            <div
              style={{
                display: "flex",
                justifyContent: isMobile ? "flex-start" : "center",
                alignItems: "center",
                height: "100%",
                marginLeft: isMobile ? "5px" : "7rem",
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: isMobile ? "20px" : "30px",
                  marginLeft: "40px",
                  fontWeight: "bold",
                  whiteSpace: "nowrap",
                }}
              >
                {headerText}
              </Text>
            </div>
          </Col>

          <Col xs={6} sm={6} md={7} lg={8}>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                gap: "20px",
              }}
            >
              <Popover
                content={profileMenu}
                trigger="click"
                placement="bottomRight"
              >
                <Avatar
                  size="large"
                  icon={<UserOutlined style={{ color: "#3F51B5" }} />}
                  style={{ background: "white", cursor: "pointer" }}
                />
              </Popover>
            </div>
          </Col>
        </Row>
      </Header>

      <Drawer
        title="Menu"
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={250}
      >
        <Menu mode="vertical" style={{ border: "none" }}>
          <Menu.Divider />
          <Menu.Item
            key="profile"
            icon={<UserOutlined />}
            onClick={() => handleNavigation("/profile")}
          >
            Profile
          </Menu.Item>
          <Menu.Item
            key="logout"
            icon={<LogoutOutlined />}
            onClick={handleLogout}
          >
            Logout
          </Menu.Item>
        </Menu>
      </Drawer>
    </>
  );
};

export default UserHeader;
