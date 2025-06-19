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
} from "antd";
import {
  QuestionCircleOutlined,
  UserOutlined,
  MenuOutlined,
  BellFilled,
  LogoutOutlined,
  ProfileOutlined,
} from "@ant-design/icons";
// import NotificationsDropdown from "../../modules/notifications/notificationDropdown";
import navyLogo from "/public/Naval.jpg";
import { useNavigate } from "react-router-dom";

const { Header } = Layout;
const { Text } = Typography;

interface HeaderProps {
  brandName?: string;
  navigate?: (path: string) => void;
}

const StyledHeader: React.FC<HeaderProps> = ({
  brandName = "Industrial NDY",
}) => {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isSmallMobile, setIsSmallMobile] = useState<boolean>(false);
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const navigate = useNavigate();
  const [notifications] = useState([
    {
      id: "1",
      message: "Your order #1234 has been confirmed",
      isRead: false,
      timestamp: "2024-03-15T10:30:00",
    },
    {
      id: "2",
      message: "Special offer: 20% off on all meals today!",
      isRead: false,
      timestamp: "2024-03-15T09:15:00",
    },
    {
      id: "3",
      message: "Your order #1233 is ready for pickup",
      isRead: true,
      timestamp: "2024-03-14T15:45:00",
    },
  ]);

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsSmallMobile(width < 480);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  const handleNavigation = (path: string) => {
    setDrawerVisible(false);

    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("Token");
    handleNavigation("/");
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const profileMenu = (
    <Menu style={{ width: 200 }}>
      <Menu.Item
        key="profile"
        icon={<ProfileOutlined />}
        onClick={() => handleNavigation("/profile")}
      >
        Profile
      </Menu.Item>

          <Menu.Item
            key="help"
            icon={<QuestionCircleOutlined />}
            onClick={() => handleNavigation("/contact-support")}
          >
            Help & Support
          </Menu.Item>
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );


  const renderDesktopNavItems = () => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        gap: isMobile ? "16px" : "24px",
      }}
    >
      {/* <Popover
        content={
          <NotificationsDropdown
            notifications={notifications}
            onViewAll={() => handleNavigation("/notifications")}
          />
        }
        trigger="click"
        placement="bottomRight"
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            color: "white",
            cursor: "pointer",
            gap: "5px",
            padding: "4px 8px",
            borderRadius: "4px",
            transition: "background-color 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          <Badge count={unreadCount}>
            <BellFilled 
              style={{ 
                fontSize: isMobile ? "20px" : "25px", 
                color: "ghostwhite" 
              }} 
            />
          </Badge>
          {!isMobile && <span style={{ fontSize: "14px" }}>Notification</span>}
        </div>
      </Popover> */}

      <Popover
        content={
          <Menu style={{ width: 200 }}>
            {/* <Menu.Item
              key="help"
              onClick={() => handleNavigation("/contact-support")}
            >
              Help & Support
            </Menu.Item> */}
            {/* <Menu.Item
              key="help-terms"
              onClick={() => handleNavigation("/terms")}
            >
              WhatsApp Support
            </Menu.Item> */}
          </Menu>
        }
        trigger="click"
        placement="bottomRight"
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            color: "white",
            cursor: "pointer",
            gap: "5px",
            padding: "4px 8px",
            borderRadius: "4px",
            transition: "background-color 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          {/* <QuestionCircleOutlined
            style={{
              fontSize: isMobile ? "20px" : "25px",
              color: "ghostwhite",
            }}
          />
          {!isMobile && <span style={{ fontSize: "14px" }}>Help</span>} */}
        </div>
      </Popover>
    </div>
  );

  const getLogoStyles = () => {
    if (isSmallMobile) {
      return { height: "50px", width: "80px", marginTop: "0px" };
    } else if (isMobile) {
      return { height: "60px", width: "100px", marginTop: "0px" };
    } else {
      return { height: "90px", width: "150px", marginTop: "-5px" };
    }
  };

  const getBrandNameStyles = () => {
    if (isSmallMobile) {
      return {
        fontSize: "14px",
        marginLeft: "8px",
        whiteSpace: "nowrap" as const,
        overflow: "hidden" as const,
        textOverflow: "ellipsis" as const,
        maxWidth: "120px",
      };
    } else if (isMobile) {
      return {
        fontSize: "18px",
        marginLeft: "16px",
        whiteSpace: "nowrap" as const,
      };
    } else {
      return {
        fontSize: "30px",
        marginLeft: "40px",
        whiteSpace: "nowrap" as const,
      };
    }
  };

  const getHeaderHeight = () => {
    if (isSmallMobile) return "70px";
    if (isMobile) return "80px";
    return "100px";
  };

  return (
    <>
      <Header
        className="site-header"
        style={{
          backgroundColor: "rgb(1, 0, 128)",
          padding: isSmallMobile ? "0 8px" : isMobile ? "0 12px" : "0 18px",
          height: getHeaderHeight(),
          position: "sticky",
          top: 0,
          zIndex: 999,
          width: "100%",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
        }}
      >
        <Row align="middle" style={{ height: "100%" }}>
          {/* Logo Section */}
          <Col xs={8} sm={6} md={5} lg={4}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: isSmallMobile ? "4px" : "12px",
              }}
            >
              <img src={navyLogo} style={getLogoStyles()} alt="Navy Logo" />
            </div>
          </Col>

          {/* Brand Name Section */}
          <Col xs={8} sm={12} md={12} lg={12}>
            <div
              style={{
                display: "flex",
                justifyContent: isSmallMobile
                  ? "flex-start"
                  : isMobile
                  ? "flex-start"
                  : "center",
                alignItems: "center",
                height: "100%",
                marginLeft: isSmallMobile ? "0px" : isMobile ? "5px" : "7rem",
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontWeight: "bold",
                  ...getBrandNameStyles(),
                }}
                title={brandName} // Show full text on hover for truncated text
              >
                {brandName}
              </Text>
            </div>
          </Col>

          {/* Navigation Section */}
          <Col xs={8} sm={6} md={7} lg={8}>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                gap: isSmallMobile ? "8px" : "12px",
              }}
            >
              {/* Show desktop nav items on tablet and above, mobile menu on mobile */}
              {isMobile ? (
                <>
                  {/* Show notification icon on mobile tablets but not on small mobile */}
                  {!isSmallMobile && renderDesktopNavItems()}
                  {/* {renderMobileMenu()} */}
                </>
              ) : (
                renderDesktopNavItems()
              )}

              <Popover
                content={profileMenu}
                trigger="click"
                placement="bottomRight"
              >
                <Avatar
                  size={isSmallMobile ? "default" : "large"}
                  icon={<UserOutlined style={{ color: "#3F51B5" }} />}
                  style={{
                    background: "white",
                    cursor: "pointer",
                    flexShrink: 0,
                  }}
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
        width={isMobile ? Math.min(280, window.innerWidth * 0.8) : 250}
        styles={{
          body: { padding: "16px 0" },
        }}
      >
        <Menu mode="vertical" style={{ border: "none" }}>
          <Menu.Item
            key="notification"
            icon={
              <Badge count={unreadCount}>
                <BellFilled style={{ fontSize: "18px" }} />
              </Badge>
            }
            onClick={() => handleNavigation("/notifications")}
            style={{ fontSize: "16px", padding: "12px 16px" }}
          >
            Notifications
          </Menu.Item>

          <Menu.SubMenu
            key="help"
            icon={<QuestionCircleOutlined />}
            title="Help & Support"
            style={{ fontSize: "16px" }}
          >
            <Menu.Item
              key="help-support"
              onClick={() => handleNavigation("/contact-support")}
              style={{ padding: "8px 16px" }}
            >
              Contact Support
            </Menu.Item>
            <Menu.Item
              key="help-terms"
              onClick={() => handleNavigation("/terms")}
              style={{ padding: "8px 16px" }}
            >
              WhatsApp Support
            </Menu.Item>
          </Menu.SubMenu>

          <Menu.Divider />

          <Menu.Item
            key="profile"
            icon={<ProfileOutlined />}
            onClick={() => handleNavigation("/profile")}
            style={{ fontSize: "16px", padding: "12px 16px" }}
          >
            Profile
          </Menu.Item>

          <Menu.Item
            key="logout"
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            style={{ fontSize: "16px", padding: "12px 16px", color: "#ff4d4f" }}
          >
            Logout
          </Menu.Item>
        </Menu>
      </Drawer>
    </>
  );
};

export default StyledHeader;
