import React, { useEffect, useState } from "react";
import {
  Empty,
  message,
  Card,
  Button,
  Typography,
  Tag,
  Row,
  Col,
  Space,
  Tooltip,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SettingOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import {
  adminDashboardService,
  menuConfigService,
  menuService,
} from "../../auth/apiService";
import { Menu, MenuTiming } from "./types";
import AddMenuModal from "./addMenuModal";
import EditMenuModal from "./editMenuModal";
import ViewMenuModal from "./viewMenuModal";
import MenuConfigurationModal from "./menuConfigurationModal";
import dayjs from "dayjs";
import lunchImage from "../../assets/images/menu_lunch.avif";
import tiffinImage from "../../assets/images/menu_tiffin.avif";
import snacksImage from "../../assets/images/menu_snacks.jpg";
import BackHeader from "../../components/common/backHeader";
import Loader from "../../components/common/loader";
import { useParams } from "react-router-dom";
import { toastSuccess } from "../../components/common/toasterMessage";

const { Paragraph, Text } = Typography;

const MenuList: React.FC = () => {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAddModalVisible, setIsAddModalVisible] = useState<boolean>(false);
  const [isViewOpen, setIsViewOpen] = useState<boolean>(false);
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  const [, setEditMode] = useState<boolean>(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [existingMenuTypes, setExistingMenuTypes] = useState<string[] | any>(
    []
  );
  const isCanteenDashboard =
    window.location.pathname.includes("canteen-dashboard");
  console.log("isCanteenDashboard", isCanteenDashboard);

  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isSmallMobile, setIsSmallMobile] = useState<boolean>(false);
  const route = useParams();
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsSmallMobile(width < 480);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    fetchMenus();
  }, []);

  useEffect(() => {
    if (menus && menus.length > 0) {
      const menuTypes = menus
        .filter((menu) => menu.menuConfiguration && menu.menuConfiguration.name)
        .map((menu) => menu?.menuConfiguration?.name);
      setExistingMenuTypes(menuTypes);
    } else {
      setExistingMenuTypes([]);
    }
  }, [menus]);

  const fetchMenus = async () => {
    try {
      setLoading(true);

      const response = route?.canteenId
        ? await adminDashboardService.getTotalMenus(Number(route.canteenId))
        : await menuService.getAllMenus();

      if (response?.data) {
        setMenus(response.data);
      }
    } catch (error) {
      console.error("Error fetching menus:", error);
      message.error("Failed to load menus");
    } finally {
      setLoading(false);
    }
  };

  const handleAddMenu = () => {
    setIsAddModalVisible(true);
  };

  const handleAddModalCancel = () => {
    setIsAddModalVisible(false);
  };

  const handleAddMenuSuccess = () => {
    setIsAddModalVisible(false);
    fetchMenus();
    toastSuccess("Menu Added Successfully!!");
  };

  const handleViewMenu = (menu: Menu) => {
    setSelectedMenu(menu);
    setEditMode(false);
    setIsViewOpen(true);
  };

  const handleEditMenu = (menu: Menu) => {
    setSelectedMenu(menu);
    setEditMode(true);
    setIsEditOpen(true);
  };

  const handleDeleteMenu = async (menuId: number) => {
    try {
     const res =  await menuService.deleteMenu(menuId);
     console.log("Menu deleted successfully:", res);
      fetchMenus();
      message.success("Menu deleted successfully");
    } catch (error) {
      console.error("Error deleting menu:", error);
      message.error("Failed to delete menu");
    }
  };

  const handleEditModalCancel = () => {
    setIsEditOpen(false);
    setSelectedMenu(null);
  };

  const handleViewModalCancel = () => {
    setIsViewOpen(false);
    setSelectedMenu(null);
  };

  const handleUpdateMenuSuccess = () => {
    setIsEditOpen(false);
    setSelectedMenu(null);
    fetchMenus();
    toastSuccess("Menu Updated Successfully!!");
  };

  const formatDate = (timestamp: number) => {
    if (!timestamp) return "N/A";
    return dayjs(timestamp * 1000).format("hh:mm A");
  };

  const getCardHeight = () => {
    if (isSmallMobile) return "280px";
    if (isMobile) return "320px";
    return "380px";
  };

  const getImageHeight = () => {
    if (isSmallMobile) return "120px";
    if (isMobile) return "150px";
    return "192px";
  };

  const getAddCardPadding = () => {
    if (isSmallMobile) return "24px 16px";
    if (isMobile) return "32px 20px";
    return "48px 24px";
  };

  console.log("all menus,", menus);
  return (
    <div
      style={{
        maxWidth: "100%",
        marginLeft: window.innerWidth <= 768 ? "8px" : "25px",
        marginRight: window.innerWidth <= 768 ? "8px" : "25px",
        padding: window.innerWidth <= 480 ? "0 4px" : "0",
      }}
    >
      {/* Header Section */}
      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between",
          alignItems: isMobile ? "stretch" : "center",
          marginBottom: isMobile ? "16px" : "24px",
          gap: isMobile ? "12px" : "0",
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <BackHeader
            path={
              route?.canteenName && route?.canteenId
                ? `/canteens-list/canteen-dashboard/${route?.canteenId}/${route?.canteenName}`
                : `/dashboard`
            }
            title={
              route?.canteenName
                ? `Menu Management${
                    isMobile ? "" : `  |  ${route.canteenName}`
                  }`
                : "Menu Management"
            }
          />
          {/* Show canteen name on separate line for mobile */}
          {isMobile && route?.canteenName && (
            <Text
              type="secondary"
              style={{
                fontSize: "14px",
                display: "block",
                marginTop: "4px",
                marginLeft: "40px", // Align with back header
              }}
            >
              {route.canteenName}
            </Text>
          )}
        </div>

        <Button
          type="default"
          icon={<SettingOutlined />}
          onClick={() => setIsConfigModalOpen(true)}
          style={{
            fontWeight: "bold",
            border: "1px solid",
            alignSelf: isMobile ? "flex-end" : "flex-start",
            marginTop: isMobile ? "0" : "-18px",
            width: isMobile ? "100%" : "auto",
            height: isMobile ? "40px" : "auto",
          }}
          size={isMobile ? "large" : "middle"}
        >
          {isSmallMobile ? "Menu Configuration" : "Menu Configuration"}
        </Button>
      </div>

      {/* Menu Grid */}
      <Row
        gutter={[
          isSmallMobile ? 8 : isMobile ? 12 : 24,
          isSmallMobile ? 8 : isMobile ? 12 : 24,
        ]}
      >
        {/* Add New Menu Card */}
        <Col xs={24} sm={12} md={8} lg={8} xl={6}>
          <Card
            hoverable
            style={{
              height: getCardHeight(),
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
              border: "1px dashed #d9d9d9",
              backgroundColor: "#fafafa",
            }}
            styles={{
              body: {
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                width: "100%",
                padding: getAddCardPadding(),
              },
            }}
            onClick={handleAddMenu}
          >
            <PlusOutlined
              style={{
                fontSize: isSmallMobile ? "24px" : isMobile ? "28px" : "32px",
                color: "#bfbfbf",
                marginBottom: "8px",
              }}
            />
            <Paragraph
              style={{
                marginBottom: 0,
                fontSize: isSmallMobile ? "12px" : "14px",
                textAlign: "center",
              }}
            >
              Add New Menu
            </Paragraph>
          </Card>
        </Col>

        {/* Menu Cards */}
        {menus.map((menu) => (
          <Col xs={24} sm={12} md={8} lg={8} xl={6} key={menu.id}>
            <Card
              style={{
                height: getCardHeight(),
                display: "flex",
                flexDirection: "column",
              }}
              cover={
                <div style={{ height: getImageHeight(), overflow: "hidden" }}>
                  <img
                    alt={menu.name}
                    src={
                      menu?.name === "Lunch"
                        ? lunchImage
                        : menu?.name === "Snack"
                        ? snacksImage
                        : menu?.name === "Breakfast"
                        ? tiffinImage
                        : lunchImage
                    }
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
              }
              styles={{
                body: {
                  padding: isSmallMobile ? "12px" : "16px",
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                },
              }}
            >
              <div style={{ flex: 1 }}>
                {/* Menu Title and Items Count */}
                <div style={{ textAlign: "center", marginBottom: "12px" }}>
                 

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexWrap: "wrap",
                      gap: "4px",
                    }}
                  >
                    <ClockCircleOutlined
                      style={{
                        marginRight: "4px",
                        fontSize: isSmallMobile ? "12px" : "14px",
                      }}
                    />
                    <Text
                      type="secondary"
                      style={{
                        fontWeight: "700",
                        fontSize: isSmallMobile ? "12px" : "14px",
                        textAlign: "center",
                        wordBreak: "break-word",
                      }}
                    >
                      {menu?.name}
                    </Text>
                  </div>
                  <Tag
                    color="blue"
                    style={{
                      marginTop: "4px",
                      fontSize: isSmallMobile ? "10px" : "12px",
                    }}
                  >
                    {menu.menuItems ? menu.menuItems.length : 0} items
                  </Tag>
                </div>

                {/* Time Display */}

                <div style={{ textAlign: "center", marginBottom: "12px" }}>
                  <Space
                    direction="vertical"
                    size="small"
                    style={{ width: "100%" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexWrap: "wrap",
                      }}
                    >
                      <CalendarOutlined
                        style={{
                          marginRight: "4px",
                          fontSize: isSmallMobile ? "12px" : "14px",
                        }}
                      />
                      <Text
                        type="secondary"
                        style={{
                          fontWeight: "700",
                          fontSize: isSmallMobile ? "11px" : "13px",
                          textAlign: "center",
                        }}
                      >
                        {formatDate(
                          menu?.menuMenuConfiguration?.defaultStartTime ?? 0
                        )}
                        {" - "}
                        {formatDate(
                          menu?.menuMenuConfiguration?.defaultEndTime ?? 0
                        )}
                      </Text>
                    </div>
                  </Space>
                </div>

                 {/* canteenName */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexWrap: "wrap",
                      gap: "4px",
                    }}
                  >
                    
                    <Text
                      style={{
                        fontWeight: "700",
                        fontSize: isSmallMobile ? "12px" : "14px",
                        textAlign: "center",
                        wordBreak: "break-word",
                      }}
                    >
                      {menu?.canteenMenu?.canteenName
                        ? menu?.canteenMenu?.canteenName
                        : "Canteen Name Not Available"}
                    </Text>
                  </div>

              </div>

              {/* Action Buttons */}
              <div
                style={{
                  borderTop: "1px solid #f0f0f0",
                  paddingTop: "12px",
                  display: "flex",
                  justifyContent: "center",
                  gap: isSmallMobile ? "4px" : "8px",
                }}
              >
                {isMobile ? (
                  // Mobile: Stacked buttons or compact layout
                  <Space size={isSmallMobile ? 4 : 8}>
                    <Tooltip title="View">
                      <Button
                        icon={<EyeOutlined />}
                        type="text"
                        onClick={() => handleViewMenu(menu)}
                        style={{
                          color: "#1890ff",
                          padding: isSmallMobile ? "4px" : "4px 8px",
                        }}
                        size={isSmallMobile ? "small" : "middle"}
                      />
                    </Tooltip>
                    {isCanteenDashboard && (
                      <>
                        <Tooltip title="Edit">
                          <Button
                            icon={<EditOutlined />}
                            type="text"
                            onClick={() => handleEditMenu(menu)}
                            style={{
                              color: "#52c41a",
                              padding: isSmallMobile ? "4px" : "4px 8px",
                            }}
                            size={isSmallMobile ? "small" : "middle"}
                          />
                        </Tooltip>
                        <Tooltip title="Delete">
                          <Button
                            icon={<DeleteOutlined />}
                            type="text"
                            danger
                            onClick={() => handleDeleteMenu(menu.id)}
                            style={{
                              padding: isSmallMobile ? "4px" : "4px 8px",
                            }}
                            size={isSmallMobile ? "small" : "middle"}
                          />
                        </Tooltip>
                      </>
                    )}
                  </Space>
                ) : (
                  // Desktop: Original layout
                  <Space>
                    <Tooltip title="View Details">
                      <Button
                        icon={<EyeOutlined />}
                        type="text"
                        onClick={() => handleViewMenu(menu)}
                        style={{ color: "#1890ff" }}
                      />
                    </Tooltip>
                    {isCanteenDashboard && (
                      <>
                        <Tooltip title="Edit">
                          <Button
                            icon={<EditOutlined />}
                            type="text"
                            onClick={() => handleEditMenu(menu)}
                            style={{ color: "#52c41a" }}
                          />
                        </Tooltip>
                        <Tooltip title="Delete">
                          <Button
                            icon={<DeleteOutlined />}
                            type="text"
                            danger
                            onClick={() => handleDeleteMenu(menu.id)}
                          />
                        </Tooltip>
                      </>
                    )}
                  </Space>
                )}
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Empty State */}
      {menus.length === 0 && !loading && (
        <div
          style={{
            padding: isMobile ? "40px 16px" : "60px 0",
            textAlign: "center",
          }}
        >
          <Empty
            description="No menus found"
            style={{
              marginTop: "32px",
            }}
            imageStyle={{
              height: isMobile ? 60 : 100,
            }}
          >
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddMenu}
              size={isMobile ? "large" : "middle"}
              style={{
                marginTop: "16px",
                width: isMobile ? "100%" : "auto",
                maxWidth: isMobile ? "280px" : "none",
              }}
            >
              Add Your First Menu
            </Button>
          </Empty>
        </div>
      )}

      {/* Modals */}
      <AddMenuModal
        visible={isAddModalVisible}
        onCancel={handleAddModalCancel}
        onSuccess={handleAddMenuSuccess}
        existingMenuTypes={existingMenuTypes}
      />

      {selectedMenu && (
        <EditMenuModal
          visible={isEditOpen}
          menu={selectedMenu}
          onCancel={handleEditModalCancel}
          onSuccess={handleUpdateMenuSuccess}
          existingMenuTypes={existingMenuTypes.filter(
            (type: string | any) =>
              type !== selectedMenu.menuConfiguration?.name
          )}
        />
      )}

      {selectedMenu && (
        <ViewMenuModal
          visible={isViewOpen}
          menu={selectedMenu}
          onCancel={handleViewModalCancel}
        />
      )}

      {isConfigModalOpen && (
        <MenuConfigurationModal
          visible={isConfigModalOpen}
          onClose={() => setIsConfigModalOpen(false)}
          onSuccess={() => {
            setIsConfigModalOpen(false);
            toastSuccess("Menu Configuration Updated Successfully!!");
          }}
        />
      )}

      {loading && <Loader />}
    </div>
  );
};

export default MenuList;
