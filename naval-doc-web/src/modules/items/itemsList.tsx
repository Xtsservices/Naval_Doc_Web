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
  Tag,
  Modal,
  Tooltip,
  Space,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import AddItemModal from "./addItemModal";
import { itemService } from "../../auth/apiService";
import BackHeader from "../../components/common/backHeader";
import Loader from "../../components/common/loader";

const { Title, Text } = Typography;
const { Content } = Layout;

interface ItemProps {
  id: number;
  name: string;
  description: string;
  type: string;
  quantity: number;
  quantityUnit: string;
  price: number;
  currency: string;
  startDate: string;
  endDate: string;
  image: string;
  status: string;
}

const getImageSrc = (base64String: string) => {
  if (base64String.startsWith('data:image')) {
    return base64String;
  }
  return `data:image/png;base64,${base64String}`;
};

const ItemsList: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [items, setItems] = useState<ItemProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [viewModalVisible, setViewModalVisible] = useState<boolean>(false);
  const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<ItemProps | null>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await itemService.getAllItems();

      if (response && response.data) {
        const formattedItems = response.data.map((item: any) => {
          let image = getImageSrc(item.image);

          return {
            id: item.id,
            name: item.name,
            description: item.description,
            type: item.type,
            quantity: item.quantity,
            quantityUnit: item.quantityUnit,
            price: item.pricing?.price || 0,
            currency: item.pricing?.currency || "INR",
            startDate: item.pricing?.startDate || "",
            endDate: item.pricing?.endDate || "",
            image: image,
            status: item.status,
          };
        });

        setItems(formattedItems);
      } else {
        setItems([]);
      }
    } catch (error) {
      console.error("Error fetching items:", error);
      message.error("Failed to load items. Please try again.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = () => {
    setIsModalOpen(true);
  };

  const handleCancelModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmitItem = (values: any) => {
    console.log("Submitted values:", values);
  };

  const handleViewItem = (item: ItemProps) => {
    setSelectedItem(item);
    setViewModalVisible(true);
  };

  const handleEditItem = (item: ItemProps) => {
    setSelectedItem(item);
    setEditModalVisible(true);
  };

  const handleDeleteItem = (item: ItemProps) => {
    setSelectedItem(item);
    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    if (!selectedItem) return;

    try {
      // await itemService.deleteItem(selectedItem.id);
      message.success(`${selectedItem.name} has been deleted successfully`);
      fetchItems();
    } catch (error) {
      console.error("Error deleting item:", error);
      message.error("Failed to delete item. Please try again.");
    } finally {
      setDeleteModalVisible(false);
      setSelectedItem(null);
    }
  };

  const getTagColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "veg":
        return "green";
      case "non-veg":
        return "red";
      case "beverage":
        return "blue";
      case "dessert":
        return "purple";
      default:
        return "default";
    }
  };

  const EmptyState = () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 0",
      }}
    >
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description="No Items Added Yet"
        style={{ marginBottom: "20px" }}
      />
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={handleAddItem}
        size="large"
      >
        Add Your First Item
      </Button>
    </div>
  );

  return (
    <Layout>
      <Content
        style={{
          maxWidth: "100%",
          marginLeft: "25px",
          marginRight: "25px",
        }}
      >
        <BackHeader path="/dashboard" title="Items Management" />

        {loading ? (
          <Loader/>
        ) : items.length === 0 ? (
          <EmptyState />
        ) : (
          <Row gutter={[16, 16]}>
            <Col xs={12} sm={8} md={6} lg={4}>
              <Card
                hoverable
                style={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                  border: "1px dashed #d9d9d9",
                  backgroundColor: "#fafafa",
                  cursor: "pointer",
                }}
                styles={{body:{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  width: "100%",
                  padding: "30px",
                }}}
                onClick={handleAddItem}
              >
                <div style={{ marginBottom: "8px" }}>
                  <PlusOutlined
                    style={{ fontSize: "32px", color: "#52c41a" }}
                  />
                </div>
                <Typography.Text strong>Add New Item</Typography.Text>
              </Card>
            </Col>
            {items.map((item) => (
              <Col
                xs={12}
                sm={8}
                md={6}
                lg={4}
                key={item.id}
                style={{ paddingLeft: "12px", paddingRight: "12px" }}
              >
                <Card
                  hoverable
                  className="item-card-meta"
                  style={{ height: "100%" }}
                  cover={
                    <img
                      alt={item.name}
                      src={item.image}
                      style={{
                        height: "150px",
                        objectFit: "cover",
                      }}
                    />
                  }
                >
                  <Card.Meta
                    style={{ padding: "9px" }}
                    title={
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <span style={{ marginRight: "7px" }}>
                          {item?.name
                            ? item.name.charAt(0).toUpperCase() +
                              item.name.slice(1)
                            : ""}
                        </span>
                        <Tag
                          color={getTagColor(item.type)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "26px",
                            width: "26px",
                            padding: 0,
                          }}
                        >
                          <span
                            style={{
                              width: "10px",
                              height: "10px",
                              borderRadius: "50%",
                              backgroundColor:
                                item.type.toLowerCase() === "veg"
                                  ? "green"
                                  : "red",
                              display: "inline-block",
                            }}
                          />
                        </Tag>
                      </div>
                    }
                    description={
                      <div style={{ marginTop: 8, marginBottom: 12 , display:"flex", justifyContent:"center", alignItems:"center"}}>
                        <Text strong style={{ fontSize: "16px" }}>
                          {item.currency === "INR" ? "₹" : "$"}
                          {item.price}
                        </Text>
                        <Text style={{ marginLeft: 8 }}>
                          • {item.quantity} {item.quantityUnit}
                        </Text>
                      </div>
                    }
                  />

                  <Space 
                      style={{ 
                        width: '100%', 
                        justifyContent: 'center', 
                        marginTop: 17,
                        borderTop: '1px solid #f0f0f0',
                        paddingTop: 11
                      }}
                    >
                      <Tooltip title="View Details">
                        <Button 
                          icon={<EyeOutlined />} 
                          type="text" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewItem(item);
                          }}
                          style={{ color: '#1890ff' }}
                        />
                      </Tooltip>
                      <Tooltip title="Edit">
                        <Button 
                          icon={<EditOutlined />} 
                          type="text" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditItem(item);
                          }}
                          style={{ color: '#52c41a' }}
                        />
                      </Tooltip>
                      <Tooltip title="Delete">
                        <Button 
                          icon={<DeleteOutlined />} 
                          type="text" 
                          danger 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteItem(item);
                          }}
                        />
                      </Tooltip>
                    </Space>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        <AddItemModal
          isOpen={isModalOpen}
          onCancel={handleCancelModal}
          onSubmit={handleSubmitItem}
          onSuccess={fetchItems} 
        />

        <Modal
          title={`Item Details - ${selectedItem?.name || ""}`}
          visible={viewModalVisible}
          onCancel={() => setViewModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setViewModalVisible(false)}>
              Close
            </Button>,
          ]}
          width={600}
        >
          {selectedItem && (
            <div>
              <div style={{ textAlign: "center", marginBottom: 20 }}>
                <img
                  src={selectedItem.image}
                  alt={selectedItem.name}
                  style={{
                    maxWidth: "100%",
                    maxHeight: 300,
                    objectFit: "contain",
                  }}
                />
              </div>

              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Title level={4}>{selectedItem.name}</Title>
                  <Tag
                    color={getTagColor(selectedItem.type)}
                    style={{ marginBottom: 10 }}
                  >
                    {selectedItem.type}
                  </Tag>
                </Col>

                <Col span={24}>
                  <Text strong>Description:</Text>
                  <p>{selectedItem.description}</p>
                </Col>

                <Col span={12}>
                  <Text strong>Price:</Text>
                  <p>
                    {selectedItem.currency === "INR" ? "₹" : "$"}
                    {selectedItem.price}
                  </p>
                </Col>

                <Col span={12}>
                  <Text strong>Quantity:</Text>
                  <p>
                    {selectedItem.quantity} {selectedItem.quantityUnit}
                  </p>
                </Col>

                <Col span={12}>
                  <Text strong>Start Date:</Text>
                  <p>
                    {selectedItem.startDate
                      ? new Date(
                          parseInt(selectedItem.startDate)
                        ).toLocaleDateString()
                      : "N/A"}
                  </p>
                </Col>

                <Col span={12}>
                  <Text strong>End Date:</Text>
                  <p>
                    {selectedItem.endDate
                      ? new Date(
                          parseInt(selectedItem.endDate)
                        ).toLocaleDateString()
                      : "N/A"}
                  </p>
                </Col>

                <Col span={12}>
                  <Text strong>Status:</Text>
                  <p>
                    {selectedItem.status === "active" ? (
                      <Tag color="green">Active</Tag>
                    ) : (
                      <Tag color="red">Inactive</Tag>
                    )}
                  </p>
                </Col>
              </Row>
            </div>
          )}
        </Modal>

        <Modal
          title={`Edit Item - ${selectedItem?.name || ""}`}
          visible={editModalVisible}
          onCancel={() => setEditModalVisible(false)}
          footer={null}
        >
          {selectedItem && (
            <p>Edit form would go here, populated with selectedItem data</p>
          )}
        </Modal>

        <Modal
          title="Confirm Deletion"
          visible={deleteModalVisible}
          onCancel={() => setDeleteModalVisible(false)}
          onOk={confirmDelete}
          okText="Delete"
          okButtonProps={{ danger: true }}
        >
          <p>
            Are you sure you want to delete "{selectedItem?.name}"? This action
            cannot be undone.
          </p>
        </Modal>
      </Content>
    </Layout>
  );
};

export default ItemsList;
