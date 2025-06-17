import React, { useState, useEffect } from "react";
import {
  Layout,
  Avatar,
  Typography,
  Row,
  Col,
  Menu,
  Drawer,
  Popover,
  Badge,
} from "antd";
import {
  UserOutlined,
  UnorderedListOutlined,
  ShoppingCartOutlined,
  LogoutOutlined,
  WalletOutlined,
  HomeOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import navyLogo from "/public/Naval.jpg";
import { useNavigate } from "react-router-dom";
import { fetchCartData } from "../service/cartHelpers";
import { useSelector } from "react-redux";
import { AppState } from "../../store/storeTypes";

const { Header } = Layout;
const { Text } = Typography;

interface HeaderProps {
  headerText?: string;
}

const UserHeader: React.FC<HeaderProps> = ({ headerText }) => {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const navigate = useNavigate();
  const myCartItems = useSelector((state: AppState) => state.myCartItems);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    GetCartDate();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const GetCartDate = async () => {
     await fetchCartData();
  };

  const handleNavigation = (path: string) => {
    if (navigate) navigate(path);
    else window.location.href = path;

    if (drawerVisible) setDrawerVisible(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("Token");
    handleNavigation("/");
  };

  const profileMenu = (
    <Menu style={{ width: 200 }}>
      {isMobile ? (
        <>
          {/* <Menu.Item
            key="profile"
            icon={<UserOutlined />}
            onClick={() => handleNavigation("/profile")}
          >
            Profile
          </Menu.Item> */}
          <Menu.Item
            key="help"
            icon={<QuestionCircleOutlined />}
            onClick={() => handleNavigation("/contact-support")}
          >
            Help & Support
          </Menu.Item>
          <Menu.Item
            key="logout"
            icon={<LogoutOutlined />}
            onClick={handleLogout}
          >
            Logout
          </Menu.Item>
        </>
      ) : (
        <>
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

            {/* <Badge count={myCartItems}>
                  <ShoppingCartOutlined
                    style={{ fontSize: "22px", color: "white" }}
                  />
                </Badge> */}
            Cart
          </Menu.Item>
          <Menu.Item
            key="wallet"
            icon={<WalletOutlined />}
            onClick={() => handleNavigation("/user/wallet")}
          >
            Wallet
          </Menu.Item>
          <Menu.Item
            key="help"
            icon={<QuestionCircleOutlined />}
            onClick={() => handleNavigation("/user/contact-support")}
          >
            Help & Support
          </Menu.Item>
          <Menu.Item
            key="logout"
            icon={<LogoutOutlined />}
            onClick={handleLogout}
          >
            Logout
          </Menu.Item>
        </>
      )}
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
                cursor: "pointer",
              }}
              onClick={() => navigate("/user/select-canteen")}
            >
              <img
                src={navyLogo}
                style={{ height: "80px", width: "120px", marginTop: "-5px" }}
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

      {/* Mobile Bottom Footer */}
      {isMobile && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            width: "100%",
            backgroundColor: "rgb(1, 0, 128)",
            borderTop: "1px solid #ccc",
            zIndex: 999,
          }}
        >
          <Row
            justify="space-around"
            align="middle"
            style={{ padding: "8px 0" }}
          >
            <Col onClick={() => handleNavigation("/user/select-canteen")}>
              <div style={{ textAlign: "center", cursor: "pointer" }}>
                <HomeOutlined style={{ fontSize: "22px", color: "white" }} />
                <div style={{ fontSize: "12px", color: "white" }}>Home</div>
              </div>
            </Col>
            <Col onClick={() => handleNavigation("/user/orders")}>
              <div style={{ textAlign: "center", cursor: "pointer" }}>
                <UnorderedListOutlined
                  style={{ fontSize: "22px", color: "white" }}
                />
                <div style={{ fontSize: "12px", color: "white" }}>Orders</div>
              </div>
            </Col>
            <Col onClick={() => handleNavigation("/user/myCart")}>
              <div style={{ textAlign: "center", cursor: "pointer" }}>
                <Badge count={myCartItems}>
                  <ShoppingCartOutlined
                    style={{ fontSize: "22px", color: "white" }}
                  />
                </Badge>
                <div style={{ fontSize: "12px", color: "white", }}>Cart</div>
              </div>
            </Col>
            <Col onClick={() => handleNavigation("/user/wallet")}>
              <div style={{ textAlign: "center", cursor: "pointer" }}>
                <WalletOutlined style={{ fontSize: "22px", color: "white" }} />
                <div style={{ fontSize: "12px", color: "white" }}>Wallet</div>
              </div>
            </Col>
          </Row>
        </div>
      )}

      <Drawer
        title="Menu"
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={250}
      >
        <Menu mode="vertical" style={{ border: "none" }}>
          <Menu.Item
            key="profile"
            icon={<UserOutlined />}
            onClick={() => handleNavigation("/profile")}
          >
            Profile
          </Menu.Item>
          <Menu.Item
            key="help"
            icon={<QuestionCircleOutlined />}
            onClick={() => handleNavigation("/user/help-support")}
          >
            Help & Support
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
