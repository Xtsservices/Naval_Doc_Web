import { Layout } from "antd";
import AdminsHeader from "./header";
import StudentAppSidebar from "./sidebar";
import UserHeader from "../userLayouts/header";
const { Content, Footer } = Layout;

import StyledHeader from "../userLayouts/styleHeader";

interface LayoutWrapperProps {
  children: React.ReactNode;
  pageTitle: string;
}

const LayoutWrapper = ({ children, pageTitle }: LayoutWrapperProps) => {
  const currentYear = new Date().getFullYear();

  return (
    <Layout
      style={{
        minHeight: "100vh",
        display: "flex",
        overflowX: "hidden",
        background: "white",
      }}
    >
      <StudentAppSidebar />
      <Layout>
        {/* <AdminsHeader title={pageTitle} /> */}
      {/* <UserHeader title={pageTitle}/> */}
      <StyledHeader/>

        <Content
          style={{
            padding: "20px",
            background: "white",
            overflow: "auto",
            flex: 1,
          }}
        >
          {children}
        </Content>
        <Footer
          style={{
            textAlign: "center",
            background: "#fff",
            borderTop: "1px solid #e8e8e8",
            padding: "12px 0",
            fontSize: "14px",
            color: "#666",
          }}
        >
          © {currentYear} Borigam Institution. All rights reserved. | Powered by{" "}
          {""}
          <strong>XTS</strong>
        </Footer>
      </Layout>
    </Layout>
  );
};

export default LayoutWrapper;
