import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Checkbox,
  InputNumber,
  message,
  Button,
  Spin,
  Card,
  Row,
  Col,
  Typography,
  Divider,
  Tag,
} from "antd";
import dayjs from "dayjs";
import { Menu, Item, MenuConfiguration } from "./types";
import {
  itemService,
  menuConfigService,
  menuService,
  canteenService,
} from "../../auth/apiService";

interface EditMenuModalProps {
  visible: boolean;
  menu: Menu;
  onCancel: () => void;
  onSuccess: () => void;
  existingMenuTypes: any;
}

const { Option } = Select;
const { TextArea } = Input;
const { Text, Title } = Typography;

const EditMenuModal: React.FC<EditMenuModalProps> = ({
  visible,
  menu,
  onCancel,
  onSuccess
}) => {
  const [form] = Form.useForm();
  const [items, setItems] = useState<Item[]>([]);
  const [menuConfigurations, setMenuConfigurations] = useState<
    MenuConfiguration[]
  >([]);
  const [canteens, setCanteens] = useState<any[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [loadingItems, setLoadingItems] = useState<boolean>(false);
  const [loadingConfigs, setLoadingConfigs] = useState<boolean>(false);
  const [loadingCanteens, setLoadingCanteens] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (visible) {
      fetchItems();
      fetchMenuConfigurations();
      fetchCanteens();
      initializeForm();
    }
  }, [visible, menu]);

  const initializeForm = () => {
    if (!menu) return;

    const menuItemIds = menu.menuItems?.map((item) => item.itemId);
    setSelectedItems(menuItemIds);

    // Set form values
    form.setFieldsValue({
      description: menu.description,
      menuType: menu.menuConfigurationId,
      canteenId: menu.canteenId,
      startDate: dayjs(menu?.startTime),
      endDate: dayjs(menu?.endTime),
    });

    // Set min/max quantities for each item
    menu?.menuItems?.forEach((menuItem) => {
      form.setFieldsValue({
        [`min_${menuItem.itemId}`]: 1, // Always set to 1
        [`max_${menuItem.itemId}`]: menuItem.maxQuantity,
      });
    });
  };

  const fetchItems = async () => {
    try {
      setLoadingItems(true);
      const response = await itemService.getAllItems();
      if (response && response.data) {
        setItems(response.data);
      }
    } catch (error) {
      console.error("Error fetching items:", error);
      message.error("Failed to load items");
    } finally {
      setLoadingItems(false);
    }
  };

  const fetchMenuConfigurations = async () => {
    try {
      setLoadingConfigs(true);
      const response = await menuConfigService.getAllMenuConfigurations();
      if (response && response.data) {
        setMenuConfigurations(response.data);
      }
    } catch (error) {
      console.error("Error fetching menu configurations:", error);
      message.error("Failed to load menu types");
    } finally {
      setLoadingConfigs(false);
    }
  };

  const fetchCanteens = async () => {
    try {
      setLoadingCanteens(true);
      const response = await canteenService.getAllCanteens();
      if (response && response.data) {
        setCanteens(response.data);
      }
    } catch (error) {
      console.error("Error fetching canteens:", error);
      message.error("Failed to load canteens");
    } finally {
      setLoadingCanteens(false);
    }
  };

  const handleItemSelect = (itemId: number, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, itemId]);
    } else {
      setSelectedItems(selectedItems?.filter((id) => id !== itemId));
    }
  };

  const handleSubmit = async () => {
    try {
      await form.validateFields();
      const values = form.getFieldsValue();

      // Format the items with min and max quantities
      const menuItems = selectedItems?.map((itemId) => {
        return {
          itemId,
          minQuantity: 1, // Always fixed at 1
          maxQuantity: values[`max_${itemId}`] || 10,
        };
      });

      if (menuItems.length === 0) {
        message.error("Please select at least one item");
        return;
      }

      const startDate = values.startDate
        ? dayjs(values.startDate).format("DD-MM-YYYY")
        : undefined;
      const endDate = values.endDate
        ? dayjs(values.endDate).format("DD-MM-YYYY")
        : undefined;

      const menuData = {
        description: values.description,
        menuConfigurationId: values.menuType,
        canteenId: values.canteenId,
        items: menuItems,
        startDate: startDate || "",
        endDate: endDate || "",
      };
console.log("menuData:==========items", menuData.items);
      setSubmitting(true);
      await menuService.updateMenu(menu.id, menuData);
      message.success("Menu updated successfully");
      onSuccess();
    } catch (error) {
      console.error("Error updating menu:", error);
      message.error("Failed to update menu");
    } finally {
      setSubmitting(false);
    }
  };

  const getTagColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case "veg":
        return "green";
      case "non-veg":
        return "red";
      default:
        return "default";
    }
  };

  const modalFooter = [
    <Button key="cancel" onClick={onCancel}>
      Cancel
    </Button>,
    <Button
      key="submit"
      type="primary"
      loading={submitting}
      onClick={handleSubmit}
    >
      Update
    </Button>,
  ];

  return (
    <Modal
      title="Edit Menu"
      open={visible}
      width={1000}
      onCancel={onCancel}
      footer={modalFooter}
      styles={{
        body: { padding: "24px", maxHeight: "80vh", overflow: "auto" },
      }}
    >
      <Form form={form} layout="vertical">
        <Title level={5} style={{ marginTop: 0, marginBottom: "16px" }}>
          Menu Information
        </Title>

        {/* Description and Canteen Selection in same row */}
        <Row gutter={16}>
          <Col xs={24} md={16}>
            <Form.Item
              name="description"
              label="Description"
              rules={[
                { required: true, message: "Please enter a description" },
              ]}
            >
              <TextArea rows={2} placeholder="Menu description" />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              name="canteenId"
              label="Canteen"
              rules={[{ required: true, message: "Please select a canteen" }]}
            >
              {loadingCanteens ? (
                <Spin size="small" />
              ) : (
                <Select placeholder="Select canteen">
                  {canteens?.map((canteen) => (
                    <Option key={canteen.id} value={canteen.id}>
                      {canteen.canteenName}
                    </Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
        </Row>

        {/* Date fields and Meal Type in one row */}
        <Row gutter={16}>
          <Col xs={24} sm={12} md={8}>
            <Form.Item
              name="startDate"
              label="Start Date"
              rules={[{ required: true, message: "Please select start date" }]}
            >
              <DatePicker style={{ width: "100%" }} format="DD-MM-YYYY" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item
              name="endDate"
              label="End Date"
              rules={[{ required: true, message: "Please select end date" }]}
            >
              <DatePicker style={{ width: "100%" }} format="DD-MM-YYYY" />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              name="menuType"
              label="Meal Type"
              rules={[{ required: true, message: "Please select a meal type" }]}
            >
              {loadingConfigs ? (
                <Spin size="small" />
              ) : (
                <Select placeholder="Select meal type">
                  {menuConfigurations?.map((config) => (
                    <Option key={config.id} value={config.id}>
                      {config.name}
                    </Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
        </Row>

        <Divider style={{ margin: "24px 0 16px" }} />

        <div style={{ margin: "0 0 16px" }}>
          <Title level={5} style={{ marginTop: 0, marginBottom: "16px" }}>
            Menu Items
          </Title>

          {loadingItems ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                margin: "32px 0",
              }}
            >
              <Spin size="large" />
            </div>
          ) : (
            <div style={{ maxHeight: "400px" }}>
              <Row gutter={[16, 16]}>
                {items?.map((item) => (
                  <Col xs={24} sm={12} key={item.id}>
                    <Card
                      size="small"
                      hoverable
                      style={{
                        borderColor: selectedItems?.includes(item.id)
                          ? "#1890ff"
                          : "#f0f0f0",
                        backgroundColor: selectedItems?.includes(item.id)
                          ? "#e6f7ff"
                          : "#fff",
                        transition: "all 0.3s ease",
                      }}
                      styles={{ body: { padding: "16px" } }}
                    >
                      <div
                        style={{ display: "flex", alignItems: "flex-start" }}
                      >
                        <Checkbox
                          checked={selectedItems?.includes(item.id)}
                          onChange={(e) =>
                            handleItemSelect(item.id, e.target.checked)
                          }
                          style={{ marginTop: "4px" }}
                        />
                        <div style={{ marginLeft: "8px", flex: 1 }}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Text strong>{item.name}</Text>
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <Tag
                                color={getTagColor(
                                  item?.type ? item?.type : ""
                                )}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  height: "20px",
                                  width: "20px",
                                  padding: 0,
                                  marginRight: "8px",
                                }}
                              >
                                <span
                                  style={{
                                    width: "10px",
                                    height: "10px",
                                    borderRadius: "50%",
                                    backgroundColor:
                                      item.type?.toLowerCase() === "veg"
                                        ? "green"
                                        : "red",
                                    display: "inline-block",
                                  }}
                                />
                              </Tag>
                              {item?.pricing && (
                                <Text
                                  type="secondary"
                                  style={{ fontWeight: "500" }}
                                >
                                  ₹{item?.pricing?.price ?? ""}
                                </Text>
                              )}
                            </div>
                          </div>
                          <Text
                            type="secondary"
                            style={{
                              fontSize: "12px",
                              marginTop: "4px",
                              display: "block",
                            }}
                          >
                            {item.description}
                          </Text>

                          {selectedItems?.includes(item.id) && (
                            <Row gutter={8} style={{ marginTop: "12px" }}>
                              <Col span={12}>
                                <Form.Item
                                  name={`min_${item.id}`}
                                  label="Min Quantity"
                                  initialValue={1}
                                  style={{ marginBottom: 0 }}
                                >
                                  <Input
                                    disabled
                                    value="1"
                                    style={{ width: "100%" }}
                                  />
                                </Form.Item>
                              </Col>
                              <Col span={12}>
                                <Form.Item
                                  name={`max_${item.id}`}
                                  label="Max Quantity"
                                  initialValue={10}
                                  style={{ marginBottom: 0 }}
                                >
                                  <InputNumber
                                    min={1}
                                    precision={0}
                                    style={{ width: "100%" }}
                                  />
                                </Form.Item>
                              </Col>
                            </Row>
                          )}
                        </div>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          )}
        </div>
      </Form>
    </Modal>
  );
};

export default EditMenuModal;
