import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Layout,
  Empty,
  message,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import AddCanteenModal from "./addCanteenModal";
import { canteenService, adminDashboardService } from "../../auth/apiService";
import BackHeader from "../../components/common/backHeader";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/common/loader";
import CanteenOrdersDisplay from "../admin/canteenOrders";

const { Content } = Layout;

interface CanteenProps {
  id: number;
  name: string;
  location?: string;
  image: string;
  code: string;
}

const CanteenList: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [canteens, setCanteens] = useState<CanteenProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const [countsData, setCountsData] = React.useState<any>([]);
  const [selectedCanteen, setSelectedCanteen] = useState<CanteenProps | null>(null);

  useEffect(() => {
    fetchCanteens();
  }, []);

  useEffect(() => {
    adminDashboardService
      .getOrdersByCanteen()
      .then((response) => {
        setCountsData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const fetchCanteens = async () => {
    try {
      setLoading(true);
      const response = await canteenService.getAllCanteens();

      if (response && response.data) {
        const formattedCanteens = response.data.map((canteen: any) => ({
          id: canteen.id,
          name: canteen.canteenName,
          code: canteen.canteenCode,
          location: canteen.location || "Not specified",
          image: canteen.canteenImage || "/api/placeholder/250/150",
        }));

        setCanteens(formattedCanteens);
      } else {
        setCanteens([]);
      }
    } catch (error) {
      console.error("Error fetching canteens:", error);
      message.error("Failed to load canteens. Please try again.");
      setCanteens([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCanteenClick = (canteenId: number, canteenName: string) => {
    console.log(`Navigating to canteen with ID: ${canteenId}`);
    console.log(canteenId, "canteeId", canteenName, "canteenName");
    navigate(`/canteens-list/canteen-dashboard/${canteenId}/${canteenName}`);
  };

  const handleAddCanteen = () => {
    setSelectedCanteen(null);
    setIsModalOpen(true);
  };

  const handleEditCanteen = (canteen: CanteenProps) => {
    setSelectedCanteen(canteen);
    setIsModalOpen(true);
  };

  const handleCancelModal = () => {
    setIsModalOpen(false);
    setSelectedCanteen(null);
  };

  const handleSubmitCanteen = (values: any) => {
    console.log("Submitted values:", values);
    setSelectedCanteen(null);
  };

  const EmptyState = () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 16px",
        textAlign: "center",
      }}
    >
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description="No Canteens Added Yet"
        style={{ marginBottom: "20px" }}
      />
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={handleAddCanteen}
        size="large"
        style={{
          width: "100%",
          maxWidth: "280px",
          height: "48px",
        }}
      >
        Add Your First Canteen
      </Button>
    </div>
  );

  return (
    <Layout>
      <Content
        style={{
          maxWidth: "100%",
          marginLeft: window.innerWidth <= 768 ? "8px" : "25px",
          marginRight: window.innerWidth <= 768 ? "8px" : "25px",
          padding: window.innerWidth <= 480 ? "0 4px" : "0",
        }}
      >
        <BackHeader path="/dashboard" title="Canteens Management" />
        {countsData?.length !== 0 && <CanteenOrdersDisplay data={countsData} />}
        
        {loading ? (
          <Loader />
        ) : canteens.length === 0 ? (
          <EmptyState />
        ) : (
          <Row 
            gutter={[
              window.innerWidth <= 480 ? 8 : window.innerWidth <= 768 ? 12 : 16, 
              window.innerWidth <= 480 ? 8 : window.innerWidth <= 768 ? 12 : 16
            ]}
            style={{ 
              margin: window.innerWidth <= 480 ? "0 -4px" : "0 -8px" 
            }}
          >
            {/* Add New Canteen Card */}
            <Col xs={24} sm={12} md={8} lg={6} xl={4}>
              <Card
                hoverable
                style={{
                  height: window.innerWidth <= 480 ? "200px" : "240px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                  border: "1px dashed #d9d9d9",
                  backgroundColor: "#fafafa",
                  cursor: "pointer",
                }}
                styles={{
                  body: {
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    width: "100%",
                    padding: window.innerWidth <= 480 ? "16px" : "24px",
                  },
                }}
                onClick={handleAddCanteen}
              >
                <div style={{ marginBottom: "8px" }}>
                  <PlusOutlined
                    style={{ 
                      fontSize: window.innerWidth <= 480 ? "24px" : "32px", 
                      color: "#52c41a" 
                    }}
                  />
                </div>
                <Typography.Text 
                  strong
                  style={{
                    fontSize: window.innerWidth <= 480 ? "12px" : "14px",
                    lineHeight: 1.2,
                  }}
                >
                  Add New Canteen
                </Typography.Text>
              </Card>
            </Col>

            {/* Canteen Cards */}
            {canteens.map((canteen) => (
              <Col xs={24} sm={12} md={8} lg={6} xl={4} key={canteen.id}>
                <Card
                  hoverable
                  style={{ 
                    height: window.innerWidth <= 480 ? "320px" : "360px",
                    display: "flex",
                    flexDirection: "column",
                    cursor: "pointer",
                  }}
                  styles={{
                    body: {
                      padding: window.innerWidth <= 480 ? "12px" : "16px",
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                    },
                  }}
                  onClick={() =>
                    handleCanteenClick(
                      canteen.id,
                      canteen?.name?.charAt(0).toUpperCase() +
                        canteen.name.slice(1)
                    )
                  }
                  cover={
                    <div
                      style={{
                        height: window.innerWidth <= 480 ? "120px" : "150px",
                        overflow: "hidden",
                      }}
                    >
                      <img
                        alt={canteen.name}
                        src={canteen.image}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  }
                >
                  <div
                    style={{
                      textAlign: "center",
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography.Title
                      level={window.innerWidth <= 480 ? 5 : 4}
                      style={{
                        marginBottom: window.innerWidth <= 480 ? "8px" : "12px",
                        fontSize: window.innerWidth <= 480 ? "14px" : "16px",
                        lineHeight: 1.2,
                      }}
                    >
                      {canteen?.name
                        ? canteen.name.charAt(0).toUpperCase() +
                          canteen.name.slice(1)
                        : ""}
                    </Typography.Title>
                    
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <Button
                        type="primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCanteenClick(
                            canteen.id,
                            canteen?.name?.charAt(0).toUpperCase() +
                              canteen.name.slice(1)
                          );
                        }}
                        style={{
                          width: "100%",
                          height:
                            window.innerWidth <= 480
                              ? "36px"
                              : window.innerWidth <= 768
                              ? "38px"
                              : "40px",
                          fontSize:
                            window.innerWidth <= 480
                              ? "12px"
                              : window.innerWidth <= 768
                              ? "13px"
                              : "14px",
                          whiteSpace: "normal",
                          padding: "0 8px",
                          lineHeight: "1.2",
                        }}
                      >
                        Go to Canteen Dashboard
                      </Button>
                      <Button
                        type="default"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditCanteen(canteen);
                        }}
                        style={{
                          width: "100%",
                          height:
                            window.innerWidth <= 480
                              ? "36px"
                              : window.innerWidth <= 768
                              ? "38px"
                              : "40px",
                          fontSize:
                            window.innerWidth <= 480
                              ? "12px"
                              : window.innerWidth <= 768
                              ? "13px"
                              : "14px",
                          whiteSpace: "normal",
                          padding: "0 8px",
                          lineHeight: "1.2",
                        }}
                      >
                        Edit Canteen
                      </Button>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        <AddCanteenModal
          isOpen={isModalOpen}
          onCancel={handleCancelModal}
          onSubmit={handleSubmitCanteen}
          onSuccess={fetchCanteens}
          initialData={selectedCanteen}
        />
      </Content>
    </Layout>
  );
};

export default CanteenList;