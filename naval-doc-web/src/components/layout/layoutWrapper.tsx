import React, { useState } from "react";
import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import StudentAppSidebar from "./sidebar";
import Footer from "./footer";
import StyledHeader from "../userLayouts/styleHeader";

const { Content } = Layout;

interface AppLayoutProps {
  pageTitle?: string;
}

const LayoutWrapper: React.FC<AppLayoutProps> = ({
  pageTitle = "Dashboard",
}) => {
  const [collapsed, setCollapsed] = useState(true);

  const handleToggleSidebar = (collapsed: boolean) => {
    setCollapsed(collapsed);
  };

  return (
    <Layout className="app-layout">
      <StudentAppSidebar
        collapsed={collapsed}
        onCollapsedChange={handleToggleSidebar}
      />
      <Layout
        className={`site-layout ${collapsed ? "collapsed" : ""} ${pageTitle}`}
        style={{
          marginLeft: collapsed ? "63px" : "187px",
          transition: "all 0.2s ease-in-out",
          // marginTop: "-10px",
          // marginRight: "-8px",
          display: "flex",
          flexDirection: "column",
          // height: "100vh",
          overflowY: "auto",
        }}
      >
        <StyledHeader />
        <Content
          className="site-content"
          style={{
            flex: "1 0 auto",
            padding: "20px",
            // overflow: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ flex: "1 0 auto" }}>
            <Outlet />
          </div>
        </Content>
        <Footer />
      </Layout>
    </Layout>
  );
};

export default LayoutWrapper;
