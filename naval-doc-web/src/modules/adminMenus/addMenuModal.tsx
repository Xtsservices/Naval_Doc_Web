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
} from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import {
  canteenService,
  itemService,
  menuConfigService,
  menuService,
} from "../../auth/apiService";
import { CreateMenuPayload, Item, MenuConfiguration } from "./types";
import Loader from "../../components/common/loader";
import { toastError } from "../../components/common/toasterMessage";

interface AddMenuModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  existingMenuTypes: any;
}

const { Option } = Select;
const { TextArea } = Input;
const { Text } = Typography;

const AddMenuModal: React.FC<AddMenuModalProps> = ({
  visible,
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
      const values = form.getFieldsValue();

      const menuItems = selectedItems.map((itemId) => {
        return {
          itemId,
          minQuantity: 1, // Always fixed at 1
          maxQuantity: values[`max_${itemId}`] || 10,
        };
      });

      const startDate = values.startDate
        ? dayjs(values.startDate).format("DD-MM-YYYY")
        : undefined;
      const endDate = values.endDate
        ? dayjs(values.endDate).format("DD-MM-YYYY")
        : undefined;

      const menuData: CreateMenuPayload = {
        menuConfigurationId: values.menuType,
        canteenId: values.canteenId,
        description: values.description,
        items: menuItems,
        startTime: startDate || "",
        endTime: endDate || "",
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

  return (
    <Modal
      title="Add Menu"
      open={visible}
      width={1000}
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
        body: { maxHeight: "80vh", overflow: "auto", padding: "24px" },
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
          <Col span={16}>
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
          <Col span={8}>
            <Form.Item
              name="canteenId"
              label="Select Canteen"
              rules={[{ required: true, message: "Please select a canteen" }]}
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
          <Col span={8}>
            <Form.Item
              name="startDate"
              label="Booking Start Date"
              rules={[{ required: true, message: "Please select start date" }]}
            >
              <DatePicker style={{ width: "100%" }} format="DD-MM-YYYY" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="endDate"
              label="Booking End Date"
              rules={[{ required: true, message: "Please select end date" }]}
            >
              <DatePicker style={{ width: "100%" }} format="DD-MM-YYYY" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="menuType"
              label="Assign To"
              rules={[{ required: true, message: "Please select a meal type" }]}
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
            <div style={{ maxHeight: "400px", marginTop: "16px" }}>
              <Row gutter={[16, 16]}>
                {items.map((item) => {
                  return (
                    <Col span={12} key={item.id}>
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
                        styles={{ body: { padding: "16px" } }}
                      >
                        <div
                          style={{ display: "flex", alignItems: "flex-start" }}
                        >
                          <Checkbox
                            checked={selectedItems.includes(item.id)}
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
                                style={{
                                  display: "flex",
                                  alignItems: "center",
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
                                <Col span={12}>
                                  <Form.Item
                                    name={`min_${item.id}`}
                                    label="Min Allowed Booking Per Person"
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
                                    label="Max Allowed Booking Per Person"
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
