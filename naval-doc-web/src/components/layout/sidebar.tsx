import {
  DatabaseOutlined,
  HomeOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MoneyCollectOutlined
} from "@ant-design/icons";
import { Button, Layout, Menu, Modal } from "antd";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const { Sider } = Layout;

interface StudentAppSidebarProps {
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
}

const StudentAppSidebar: React.FC<StudentAppSidebarProps> = ({
  collapsed,
  onCollapsedChange,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const getSelectedKey = () => {
    const path = location.pathname;
    if (path.includes("dashboard")) return "home";
    if (path.includes("finance-management")) return "finance_management";
    if (path.includes("inventory-management")) return "inventory_management";
    return "home";
  };

  const [selectedKey, setSelectedKey] = useState<string>(getSelectedKey());

  useEffect(() => {
    setSelectedKey(getSelectedKey());
  }, [location.pathname]);


  const handleOk = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    setIsModalOpen(false);
    navigate("/");
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const toggleSidebar = () => {
    onCollapsedChange(!collapsed);
  };

  const menuItems = [
    {
      key: "home",
      label: "Dashboard",
      icon: HomeOutlined,
      path: "/dashboard",
    },
    
    // {
    //   key: "finance_management",
    //   label: "Finance ",
    //   icon: MoneyCollectOutlined,
    //   path: "/finance-management",
    // },
    // {
    //   key: "inventory_management",
    //   label: "Inventory ",
    //   icon: DatabaseOutlined,
    //   path: "/inventory-management",
    // },
  ];

  return (
    <Sider
      width={200}
      collapsedWidth={70}
      collapsible
      collapsed={collapsed}
      trigger={null}
      className="custom-sidebar"
      style={{
        backgroundColor: "#010080",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 1000,
        borderRight: "1px solid #f0f0f0",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        overflow: "hidden",
      }}
    >
      <div style={{ width: "100%" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            padding: "16px 16px 26px",
            marginBottom: "20px",
            borderBottom: "1px solid rgb(222 222 224 / 21%)",
          }}
        >
          <Button
            type="text"
            icon={
              collapsed ? (
                <MenuUnfoldOutlined
                  style={{ color: "white", fontSize: "25px" }}
                />
              ) : (
                <MenuFoldOutlined
                  style={{ color: "white", fontSize: "25px" }}
                />
              )
            }
            onClick={toggleSidebar}
            style={{
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "20px",
            }}
          />
        </div>

        <div style={{ paddingBottom: "20px" }}>
          <Menu
            mode="inline"
            theme="light"
            className="custom-menu"
            style={{
              background: "transparent",
              paddingLeft: "5px",
              paddingRight: "5px",
              textAlign: "center",
              justifyContent: "center",
            }}
            inlineCollapsed={collapsed}
            selectedKeys={[selectedKey]}
            onClick={({ key }) => setSelectedKey(key)}
            items={menuItems.map((item) => ({
              key: item.key,
              icon: (
                <item.icon
                  style={{
                    fontSize: "20px",
                    margin:"0px",
                    color: selectedKey === item.key ? "black" : "white",
                    backgroundColor: selectedKey === item.key ? "" : "transparent",
                    paddingLeft: "0px",
                    justifyContent: "center",
                  }}
                />
              ),
              label: item.label,
              onClick: () => navigate(item.path),
              style: {
                color: selectedKey === item.key ? "black" : "white",
                textAlign:"left",
                marginBottom:"25px",
              },
            }))}
          />
        </div>
      </div>

      <div
        style={{
          padding: "16px",
          textAlign: "center",
          marginTop: "auto",
        }}
      >
        {/* <Button
          type="text"
          icon={<LogoutOutlined style={{ fontSize: "16px" }} />}
          onClick={handleLogout}
          style={{
            color: "white",
            width: "100%",
            height: "48px",
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "flex-start",
            gap: "8px",
            padding: collapsed ? "0" : "0 16px",
          }}
        >
          {!collapsed && "Logout"}
        </Button> */}
        <Modal
          title="Confirm Logout"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <p>Are you sure you want to logout?</p>
        </Modal>
      </div>
    </Sider>
  );
};

export default StudentAppSidebar;
