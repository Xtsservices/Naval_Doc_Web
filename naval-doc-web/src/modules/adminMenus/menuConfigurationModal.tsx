import React, { useState, useEffect } from "react";
import {
  Form,
  TimePicker,
  Select,
  Button,
  Typography,
  Modal,
  Spin,
  Alert,
  Divider,
  Card,
  Row,
  Col,
} from "antd";
import { ClockCircleOutlined, EditOutlined } from "@ant-design/icons";
import { menuConfigService } from "../../auth/apiService";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import Loader from "../../components/common/loader";
import {
  toastError,
  toastSuccess,
} from "../../components/common/toasterMessage";
import { formatUnixToISTTime } from "../../utils/data";

dayjs.extend(customParseFormat);

const { Title, Text } = Typography;
const { Option } = Select;

interface MenuConfiguration {
  id: number;
  name: string;
  defaultStartTime: string;
  defaultEndTime: string;
  status?: string;
}

interface MenuConfigurationModalProps {
  onClose: () => void;
  onSuccess: () => void;
  visible: boolean;
}

const MenuConfigurationModal: React.FC<MenuConfigurationModalProps> = ({
  onClose,
  onSuccess,
  visible,
}) => {
  const [menuConfigurations, setMenuConfigurations] = useState<
    MenuConfiguration[]
  >([]);
  const [name, setName] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("08:00 AM");
  const [endTime, setEndTime] = useState<string>("10:00 AM");
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [configsLoading, setConfigsLoading] = useState<boolean>(true);

  const formatTimeToDateObj = (timeString: string) => {
    return timeString ? dayjs(timeString, "hh:mm A") : null;
  };

  const formatTimeToString = (time: dayjs.Dayjs | null) => {
    if (!time) return "";
    return time.format("hh:mm A");
  };

  const resetForm = () => {
    setName("");
    setStartTime("08:00 AM");
    setEndTime("10:00 AM");
    setEditId(null);
    setError(null);
  };

  useEffect(() => {
    const loadMenuConfigurations = async () => {
      setConfigsLoading(true);
      try {
        const configs = await menuConfigService.getAllMenuConfigurations();
        setMenuConfigurations(configs?.data || []);
      } catch (err) {
        console.error("Failed to load configurations:", err);
      } finally {
        setConfigsLoading(false);
      }
    };

    if (visible) {
      loadMenuConfigurations();
    } else {
      resetForm();
    }
  }, [visible]);

  const handleEdit = (config: MenuConfiguration) => {
    setEditId(config.id);
    setName(config.name);
    // Convert UNIX timestamps to hh:mm A format
    const formattedStartTime = formatUnixToISTTime(config.defaultStartTime);
    const formattedEndTime = formatUnixToISTTime(config.defaultEndTime);
    setStartTime(formattedStartTime || "08:00 AM");
    setEndTime(formattedEndTime || "10:00 AM");
    setError(null);
  };

  const handleSubmit = async () => {
    if (!name) {
      setError("Please select a menu type");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (editId) {
        // Update existing configuration
        await menuConfigService.updateMenuConfiguration({
          id: editId,
          defaultStartTime: startTime,
          defaultEndTime: endTime,
        });
      } else {
        // Create new configuration
        await menuConfigService.createMenuConfiguration({
          name,
          defaultStartTime: startTime,
          defaultEndTime: endTime,
        });
      }
      onSuccess();
      resetForm();
      // Reload configurations
      const configs = await menuConfigService.getAllMenuConfigurations();
      setMenuConfigurations(configs?.data || []);
    } catch (err) {
      const errorMessage = editId
        ? "Failed to update menu configuration!!"
        : "Failed to create menu configuration!!";
      toastError(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    resetForm();
  };

  return (
    <Modal
      title={editId ? "Edit Menu Configuration" : "Menu Configuration"}
      open={visible}
      onCancel={() => {
        onClose();
        resetForm();
      }}
      footer={null}
      width={850}
      destroyOnClose
      style={{ top: 64 }}
      styles={{ mask: { backdropFilter: "blur(2px)" } }}
    >
      <div style={{ marginBottom: "20px" }}>
        <Title level={5} style={{ marginBottom: "12px" }}>
          Existing Configurations
        </Title>
        {configsLoading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "16px",
            }}
          >
            <Spin size="small" />
          </div>
        ) : menuConfigurations.length > 0 ? (
          <div style={{ maxHeight: "140px", overflowY: "auto" }}>
            <Row gutter={[8, 8]} style={{ marginLeft: 0, marginRight: 0 }}>
              {menuConfigurations.map((config) => (
                <Col xs={12} sm={6} key={config.id}>
                  <Card
                    size="small"
                    style={{
                      backgroundColor: "#f5f5f5",
                      borderRadius: "4px",
                      height: "100%",
                    }}
                    styles={{ body: { padding: "10px" } }}
                    actions={[
                      <EditOutlined
                        key="edit"
                        onClick={() => handleEdit(config)}
                        style={{ color: "#1890ff" }}
                      />,
                    ]}
                  >
                    <div style={{ fontWeight: 500 }}>{config.name}</div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: "4px",
                      }}
                    >
                      <ClockCircleOutlined
                        style={{
                          fontSize: "12px",
                          marginRight: "4px",
                          color: "#8c8c8c",
                        }}
                      />
                      <Text type="secondary" style={{ fontSize: "12px" }}>
                        {formatUnixToISTTime(config.defaultStartTime)} -{" "}
                        {formatUnixToISTTime(config.defaultEndTime)}
                      </Text>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        ) : (
          <Text type="secondary" style={{ display: "block", padding: "8px 0" }}>
            No configurations found
          </Text>
        )}
      </div>

      <Divider style={{ margin: "12px 0" }} />

      <Form layout="vertical">
        <Form.Item
          label={
            <span style={{ color: "#000" }}>
              <span style={{ color: "#ff4d4f", marginRight: "4px" }}>*</span>
              Menu Type
            </span>
          }
          style={{ marginBottom: "16px" }}
        >
          <Select
            value={name || undefined}
            onChange={setName}
            placeholder="Select menu type"
            style={{ width: "100%" }}
          >
            <Option value="Breakfast">Breakfast</Option>
            <Option value="Lunch">Lunch</Option>
            <Option value="Snack">Snack</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label={
            <span style={{ color: "#000" }}>
              <span style={{ color: "#ff4d4f", marginRight: "4px" }}>*</span>
              Default Start Time
            </span>
          }
          style={{ marginBottom: "16px" }}
        >
          <TimePicker
            use12Hours
            format="h:mm A"
            value={formatTimeToDateObj(startTime)}
            onChange={(time) => setStartTime(formatTimeToString(time))}
            style={{ width: "100%" }}
            placeholder="08:00 AM"
            allowClear={false}
          />
        </Form.Item>

        <Form.Item
          label={
            <span style={{ color: "#000" }}>
              <span style={{ color: "#ff4d4f", marginRight: "4px" }}>*</span>
              Default End Time
            </span>
          }
          style={{ marginBottom: "16px" }}
        >
          <TimePicker
            use12Hours
            format="h:mm A"
            value={formatTimeToDateObj(endTime)}
            onChange={(time) => setEndTime(formatTimeToString(time))}
            style={{ width: "100%" }}
            placeholder="10:00 AM"
            allowClear={false}
          />
        </Form.Item>

        {error && (
          <Alert
            message={error}
            type="error"
            style={{ marginBottom: "16px" }}
            showIcon
          />
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "8px",
            marginTop: "24px",
          }}
        >
          {editId && (
            <Button onClick={handleClear} disabled={loading}>
              Clear
            </Button>
          )}
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="primary" onClick={handleSubmit} disabled={loading}>
            {editId ? "Update Configuration" : "Create Configuration"}
          </Button>
        </div>
      </Form>
      {loading && <Loader />}
    </Modal>
  );
};

export default MenuConfigurationModal;
