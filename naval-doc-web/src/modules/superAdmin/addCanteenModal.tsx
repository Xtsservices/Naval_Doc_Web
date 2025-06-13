import React, { useState } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  Row,
  Col,
  Typography,
  Upload,
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { canteenService } from "../../auth/apiService";
import Loader from "../../components/common/loader";
import { toastError, toastSuccess } from "../../components/common/toasterMessage";

const { Option } = Select;
const { Text } = Typography;

interface AddCanteenModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  onSuccess: () => void;
}

const AddCanteenModal: React.FC<AddCanteenModalProps> = ({
  isOpen,
  onCancel,
  onSubmit,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<any[]>([]);

  const handleOk = async () => {
    console.log("first",100)
    try {
      const values = await form.validateFields();
      console.log("firstName", values);
      return
      setLoading(true);
      const formData = new FormData();
      formData.append("canteenName", values.canteenName.trim());
      formData.append("canteenCode", values.canteenCode.trim());
      formData.append("adminFirstName", values.firstName.trim());
      formData.append("adminLastName", values.lastName.trim());
      formData.append("adminEmail", values.emailId.trim());
      formData.append("adminMobile", values.mobileNumber.trim());
      if (values.dob) {
        formData.append("adminDob", values.dob.format("YYYY-MM-DD"));
      }
      if (values.gender) {
        formData.append("adminGender", values.gender);
      }
      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append("canteenImage", fileList[0].originFileObj);
      }

      await canteenService.createCanteen(formData);
      toastSuccess("Canteen Added Successfully!!");
      form.resetFields();
      setFileList([]);
      onSubmit(values);
      onSuccess();
      onCancel();
    } catch (error) {
      toastError("Failed to add canteen!!");
      console.error("Failed to add canteen:", error);
    } finally {
      setLoading(false);
    }
  };

  const formItemStyle = {
    marginBottom: "16px",
  };

  const inputStyle = {
    width: "100%",
    height: "40px",
  };

  const handleFileChange = async({ fileList }: any) => {
    console.log("sample enter")
    setFileList(fileList);
    await form.validateFields();
     return Promise.resolve();
  };

  const validateFileUpload = () => {
    if (fileList.length === 0) {
      return Promise.reject("Please upload a canteen image");
    }

    const file = fileList[0]?.originFileObj;
    if (file) {
      const isImage = file.type.startsWith("image/");
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isImage) {
        return Promise.reject("You can only upload image files!");
      }
      if (!isLt2M) {
        return Promise.reject("Image must be smaller than 2MB!");
      }
    }

    return Promise.resolve();
  };

  const validateCanteenCode = (_: any, value: string) => {
    if (!value) {
      return Promise.reject("Please enter canteen code");
    }

    const pattern = /^[A-Za-z0-9]+$/;
    if (!pattern.test(value)) {
      return Promise.reject("Canteen code must be alphanumeric only");
    }

    return Promise.resolve();
  };

  

  return (
    <Modal
      className="add-canteen-modal"
      title="Add Canteen"
      open={isOpen}
      onCancel={onCancel}
      width={920}
      centered
      footer={null}
      styles={{
        body: { maxHeight: "75vh", overflowY: "auto", padding: "24px" },
      }}
    >
      <Form
        form={form}
        layout="vertical"
        name="add_canteen_form"
        validateTrigger={["onBlur", "onChange"]}
      >
        <Row gutter={24}>
          <Col xs={24} sm={12} style={{ marginBottom: "16px" }}>
            <Form.Item
              name="canteenName"
              label="Canteen Name"
              rules={[
                { required: true, message: "Please enter canteen name" },
                {
                  min: 3,
                  message: "Canteen name must be at least 3 characters",
                },
                {
                  max: 50,
                  message: "Canteen name cannot exceed 50 characters",
                },
                {
                  whitespace: true,
                  message: "Canteen name cannot be empty spaces",
                },
              ]}
              style={formItemStyle}
            >
              <Input placeholder="Enter Canteen name" style={inputStyle} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} style={{ marginBottom: "16px" }}>
            <Form.Item
              name="canteenCode"
              label="Canteen CODE"
              rules={[{ validator: validateCanteenCode }]}
              style={formItemStyle}
            >
              <Input placeholder="Enter Canteen Code" style={inputStyle} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col xs={24} sm={12} style={{ marginBottom: "16px" }}>
            <Form.Item
              name="firstName"
              label="Admin FirstName"
              rules={[
                { required: true, message: "Please enter first name" },
                { min: 2, message: "First name must be at least 2 characters" },
                { max: 30, message: "First name cannot exceed 30 characters" },
                {
                  pattern: /^[A-Za-z\s]+$/,
                  message: "First name should contain only letters",
                },
                {
                  whitespace: true,
                  message: "First name cannot be empty spaces",
                },
              ]}
              style={formItemStyle}
            >
              <Input placeholder="Enter First Name" style={inputStyle} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} style={{ marginBottom: "16px" }}>
            <Form.Item
              name="lastName"
              label="Admin LastName"
              rules={[
                { required: true, message: "Please enter last name" },
                { min: 2, message: "Admin Last name must be at least 2 characters" },
                { max: 30, message: "Admin Last name cannot exceed 30 characters" },
                {
                  pattern: /^[A-Za-z\s]+$/,
                  message: "Admin Last name should contain only letters",
                },
                {
                  whitespace: true,
                  message: "Admin Last name cannot be empty spaces",
                },
              ]}
              style={formItemStyle}
            >
              <Input placeholder="Enter Admin Last Name" style={inputStyle} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col xs={24} sm={12} style={{ marginBottom: "16px" }}>
            <Form.Item
              name="gender"
              label="Gender"
              rules={[{ required: true, message: "Please select gender" }]}
              style={formItemStyle}
            >
              <Select placeholder="Select Gender" style={inputStyle}>
                <Option value="male">Male</Option>
                <Option value="female">Female</Option>
                <Option value="other">Other</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} style={{ marginBottom: "16px" }}>
            <Form.Item
              name="mobileNumber"
              label="Mobile Number"
              rules={[
                { required: true, message: "Please enter mobile number" },
                {
                  pattern: /^[0-9]{10}$/,
                  message: "Please enter a valid 10-digit mobile number",
                },
                {
                  validator: (_, value) => {
                    if (!value) return Promise.resolve();
                    if (!/^[6-9]\d{9}$/.test(value)) {
                      return Promise.reject(
                        "Mobile number must start with 6, 7, 8, or 9"
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
              style={formItemStyle}
              validateFirst={true}
            >
              <Input placeholder="Enter Mobile Number" style={inputStyle} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col xs={24} sm={12} style={{ marginBottom: "16px" }}>
            <Form.Item
              name="emailId"
              label="Email ID"
              rules={[
                { required: true, message: "Please enter email ID" },
                { type: "email", message: "Please enter a valid email" },
                { max: 50, message: "Email cannot exceed 50 characters" },
              ]}
              style={formItemStyle}
              validateFirst={true}
            >
              <Input placeholder="Enter Email ID" style={inputStyle} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} style={{ marginBottom: "16px" }}>
            <Form.Item
              name="canteenImage"
              label="Canteen Image"
              rules={[{ validator: validateFileUpload }]}
              style={formItemStyle}
            >
              <Upload
                listType="picture"
                maxCount={1}
                fileList={fileList}
                onChange={handleFileChange}
                beforeUpload={(file) => {
                  const isImage = file.type.startsWith("image/");
                  if (!isImage) {
                    message.error("You can only upload image files!");
                  }
                  const isLt2M = file.size / 1024 / 1024 < 2;
                  console.log("isLt2M",isLt2M)
                  if (!isLt2M) {
                    message.error("Image must be smaller than 2MB!===");
                  }
                  return false;
                }}
              >
                <Button icon={<UploadOutlined />}>Upload Canteen Image</Button>
              </Upload>
              <Text type="secondary" style={{ marginLeft: 8 }}>
                Supported formats: JPG, PNG. Max size: 2MB
              </Text>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}></Row>

        <Row justify="center" style={{ marginTop: "6px",marginBottom:"-19px" }}>
          <Col xs={24} sm={12} md={8}>
            <Button
              type="primary"
              block
              onClick={handleOk}
              style={{ height: "40px" }}
              disabled={loading}
            >
              {loading ? "Processing..." : "Confirm"}
            </Button>
          </Col>
        </Row>
      </Form>
      {loading && <Loader />}
    </Modal>
  );
};

export default AddCanteenModal;
