import {
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Row,
  Select,
  Spin,
  Tag,
  Typography,
  Grid,
} from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState, useRef } from "react";
import {
  canteenService,
  itemService,
  menuConfigService,
  menuService,
} from "../../auth/apiService";
import { CreateMenuPayload, Item, MenuConfiguration } from "./types";
import Loader from "../../components/common/loader";
import { toastError } from "../../components/common/toasterMessage";

const { useBreakpoint } = Grid;
const { Option } = Select;
const { TextArea } = Input;
const { Text } = Typography;

interface AddMenuModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  existingMenuTypes: any;
}

const AddMenuModal: React.FC<AddMenuModalProps> = ({
  visible,
  onCancel,
  onSuccess
}) => {
  const [form] = Form.useForm();
  const [items, setItems] = useState<Item[]>([]);
  const [menuConfigurations, setMenuConfigurations] = useState<MenuConfiguration[]>([]);
  const [canteens, setCanteens] = useState<any[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [loadingItems, setLoadingItems] = useState<boolean>(false);
  const [loadingConfigs, setLoadingConfigs] = useState<boolean>(false);
  const [loadingCanteens, setLoadingCanteens] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const screens = useBreakpoint();
  const itemSectionRef = useRef<HTMLDivElement | null>(null);
const [showItemError, setShowItemError] = useState(false);


  useEffect(() => {
    if (visible) {
      fetchItems();
      fetchMenuConfigurations();
      fetchCanteens();
    }
  }, [visible]);

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
        if (response.data.length > 0) {
          form.setFieldsValue({ canteenId: response.data[0].id });
        }
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
      setSelectedItems(selectedItems.filter((id) => id !== itemId));
    }
  };

  const handleSubmit = async () => {
  try {
    await form.validateFields();

    if (selectedItems.length === 0) {
      setShowItemError(true);
      toastError("Please select at least one item before submitting.");
      setTimeout(() => {
        itemSectionRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
      return;
    }

    setShowItemError(false);
    const values = form.getFieldsValue();

    const menuItems = selectedItems.map((itemId) => ({
      itemId,
      minQuantity: 1,
      maxQuantity: values[`max_${itemId}`] || 10,
    }));

    const startDate = dayjs(values.startDate).format("DD-MM-YYYY");
    const endDate = dayjs(values.endDate).format("DD-MM-YYYY");

    const menuData: CreateMenuPayload = {
      menuConfigurationId: values.menuType,
      canteenId: values.canteenId,
      description: values.description,
      items: menuItems,
      startTime: startDate,
      endTime: endDate,
    };

    setSubmitting(true);
    await menuService.createMenuWithItems(menuData);
    onSuccess();
    resetForm();
  } catch (error) {
    toastError("Failed to create menu");
    console.error("Error creating menu:", error);
  } finally {
    setSubmitting(false);
  }
};

  const resetForm = () => {
    form.resetFields();
    setSelectedItems([]);
  };

  const handleCancel = () => {
    resetForm();
    onCancel();
  };

  const getTagColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "veg":
        return "green";
      case "non-veg":
        return "red";
      default:
        return "default";
    }
  };

  // Responsive layout configurations
  const modalWidth = screens.xl ? 1000 : screens.lg ? 900 : screens.md ? 800 : '100%';
  const cardSpan = screens.xs ? 24 : 12;
  const datePickerSpan = screens.xs ? 24 : screens.sm ? 12 : 8;
  const formItemLayout = screens.xs ? { labelCol: { span: 24 }, wrapperCol: { span: 24 } } : {};

  return (
    <Modal
      title="Add Menu"
      open={visible}
      width={modalWidth}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={submitting}
          onClick={handleSubmit}
        >
          Submit
        </Button>,
      ]}
      styles={{
        body: { 
          maxHeight: "80vh", 
          overflow: "auto", 
          padding: screens.xs ? "16px" : "24px" 
        },
      }}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          description: "",
          startDate: dayjs(),
          endDate: dayjs().add(1, "day"),
        }}
        validateMessages={{
          required: "${label} is required!",
        }}
      >
        <Row gutter={16}>
          <Col xs={24} md={16}>
            <Form.Item
              name="description"
              label="Description"
              rules={[
                { required: true, message: "Please enter a description" },
              ]}
              {...formItemLayout}
            >
              <TextArea rows={2} placeholder="Menu description" />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              name="canteenId"
              label="Select Canteen"
              rules={[{ required: true, message: "Please select a canteen" }]}
              {...formItemLayout}
            >
              {loadingCanteens ? (
                <Spin size="small" />
              ) : (
                <Select placeholder="Select canteen">
                  {canteens.map((canteen) => (
                    <Option key={canteen.id} value={canteen.id}>
                      {canteen.canteenName}
                    </Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={datePickerSpan} sm={datePickerSpan} md={datePickerSpan}>
            <Form.Item
              name="startDate"
              label="Booking Start Date"
              rules={[{ required: true, message: "Please select start date" }]}
              {...formItemLayout}
            >
              <DatePicker style={{ width: "100%" }} format="DD-MM-YYYY" />
            </Form.Item>
          </Col>
          <Col xs={datePickerSpan} sm={datePickerSpan} md={datePickerSpan}>
            <Form.Item
              name="endDate"
              label="Booking End Date"
              rules={[{ required: true, message: "Please select end date" }]}
              {...formItemLayout}
            >
              <DatePicker style={{ width: "100%" }} format="DD-MM-YYYY" />
            </Form.Item>
          </Col>
          <Col xs={datePickerSpan} sm={datePickerSpan} md={datePickerSpan}>
            <Form.Item
              name="menuType"
              label="Assign To"
              rules={[{ required: true, message: "Please select a meal type" }]}
              {...formItemLayout}
            >
              {loadingConfigs ? (
                <Spin size="small" />
              ) : (
                <Select placeholder="Select meal type">
                  {menuConfigurations.map((config) => (
                    <Option key={config.id} value={config.id}>
                      {config.name}
                    </Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
        </Row>

        <div style={{ margin: "16px 0 8px 0" }}>
          <Text strong style={{ fontSize: "16px" }}>
            Select Items
          </Text>
          {selectedItems.length === 0 && (
            <div
              style={{ color: "#ff4d4f", fontSize: "14px", marginTop: "4px" }}
            >
              Please select at least one item
            </div>
          )}
          {loadingItems ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                margin: "16px 0",
              }}
            >
              <Spin />
            </div>
          ) : (
            <div style={{ marginTop: "16px" }}>
              <Row gutter={[16, 16]}>
                {items.map((item) => {
                  return (
                    <Col xs={24} sm={cardSpan} key={item.id}>
                      <Card
                        size="small"
                        style={{
                          borderColor: selectedItems.includes(item.id)
                            ? "#1890ff"
                            : "#f0f0f0",
                          backgroundColor: selectedItems.includes(item.id)
                            ? "#e6f7ff"
                            : "#fff",
                        }}
                        styles={{ body: { padding: screens.xs ? "12px" : "16px" } }}
                      >
                        <div
                          style={{ 
                            display: "flex", 
                            alignItems: "flex-start",
                            flexDirection: screens.xs ? "column" : "row"
                          }}
                        >
                          <Checkbox
                            checked={selectedItems.includes(item.id)}
                            onChange={(e) =>
                              handleItemSelect(item.id, e.target.checked)
                            }
                            style={{ 
                              marginTop: "4px",
                              marginBottom: screens.xs ? "8px" : 0
                            }}
                          />
                          <div style={{ 
                            marginLeft: screens.xs ? 0 : "8px", 
                            flex: 1,
                            width: screens.xs ? "100%" : "auto"
                          }}>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                flexDirection: screens.xs ? "column" : "row",
                                alignItems: screens.xs ? "flex-start" : "center"
                              }}
                            >
                              <Text strong>{item.name}</Text>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  marginTop: screens.xs ? "4px" : 0
                                }}
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
                                        item.type.toLowerCase() === "veg"
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
                              style={{ fontSize: "12px", marginTop: "4px" }}
                            >
                              {item.description}
                            </Text>

                            {selectedItems.includes(item.id) && (
                              <Row gutter={8} style={{ marginTop: "12px" }}>
                                <Col xs={24} sm={12}>
                                  <Form.Item
                                    name={`min_${item.id}`}
                                    label="Min Allowed Booking Per Person"
                                    initialValue={1}
                                    style={{ marginBottom: 0 }}
                                    {...formItemLayout}
                                  >
                                    <Input
                                      disabled
                                      value="1"
                                      style={{ width: "100%" }}
                                    />
                                  </Form.Item>
                                </Col>
                                <Col xs={24} sm={12}>
                                  <Form.Item
                                    name={`max_${item.id}`}
                                    label="Max Allowed Booking Per Person"
                                    initialValue={10}
                                    style={{ marginBottom: 0 }}
                                    {...formItemLayout}
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
                  );
                })}
              </Row>
            </div>
          )}
        </div>
        {submitting && <Loader />}
      </Form>
    </Modal>
  );
};

export default AddMenuModal;