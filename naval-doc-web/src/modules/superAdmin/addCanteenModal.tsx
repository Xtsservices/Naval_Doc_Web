import React, { useState, useEffect } from "react";
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

interface CanteenProps {
  id: number;
  name: string;
  location?: string;
  image: string;
  code: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  adminMobile?: string;
}

interface AddCanteenModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  onSuccess: () => void;
  initialData?: CanteenProps | null;
}

const AddCanteenModal: React.FC<AddCanteenModalProps> = ({
  isOpen,
  onCancel,
  onSubmit,
  onSuccess,
  initialData,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<any[]>([]);
  const isEditMode = !!initialData;

  useEffect(() => {
    if (isEditMode && initialData) {
      form.setFieldsValue({
        canteenName: initialData.name,
        canteenCode: initialData.code,
        firstName: initialData.firstName || "",
        lastName: initialData.lastName || "",
        emailId: initialData.email || "",
        mobileNumber: initialData.adminMobile || "",
        canteenImage: initialData.image
          ? [{ uid: "-1", name: "image", status: "done", url: initialData.image }]
          : [],
      });
      setFileList(
        initialData.image
          ? [{ uid: "-1", name: "image", status: "done", url: initialData.image }]
          : []
      );
    } else {
      form.resetFields();
      setFileList([]);
    }
  }, [initialData, isEditMode, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      const formData = new FormData();

      if (!isEditMode) {
        formData.append("canteenName", values.canteenName.trim());
        formData.append("canteenCode", values.canteenCode.trim());
      }
      formData.append("firstName", values.firstName.trim());
      formData.append("lastName", values.lastName.trim());
      formData.append("email", values.emailId.trim());
      formData.append("mobile", values.mobileNumber.trim());
     
      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append("canteenImage", fileList[0].originFileObj);
      }

      if (isEditMode && initialData) {
        formData.append("canteenId", initialData.id.toString());
        await canteenService.updateCanteen(initialData.id, formData);
        toastSuccess("Canteen Updated Successfully!!");
      } else {
        await canteenService.createCanteen(formData);
        toastSuccess("Canteen Added Successfully!!");
      }

      form.resetFields();
      setFileList([]);
      onSubmit(values);
      onSuccess();
      onCancel();
    } catch (error) {
      toastError(isEditMode ? "Failed to update canteen!" : "Failed to add canteen!");
      console.error("Error:", error);
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

  const handleFileChange = async ({ fileList }: any) => {
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
      title={isEditMode ? "Edit Canteen" : "Add Canteen"}
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
        name="canteen_form"
        validateTrigger={["onBlur", "onChange"]}
      >
        <Row gutter={24}>
          <Col xs={24} sm={12} style={{ marginBottom: "16px" }}>
            <Form.Item
              name="canteenName"
              label="Canteen Name"
              rules={
                !isEditMode
                  ? [
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
                    ]
                  : []
              }
              style={formItemStyle}
            >
              <Input
                placeholder="Enter Canteen name"
                style={inputStyle}
                disabled={isEditMode}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} style={{ marginBottom: "16px" }}>
            <Form.Item
              name="canteenCode"
              label="Canteen CODE"
              rules={!isEditMode ? [{ validator: validateCanteenCode }] : []}
              style={formItemStyle}
            >
              <Input
                placeholder="Enter Canteen Code"
                style={inputStyle}
                disabled={isEditMode}
              />
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
                { min: 2, message: "Last name must be at least 2 characters" },
                { max: 30, message: "Last name cannot exceed 30 characters" },
                {
                  pattern: /^[A-Za-z\s]+$/,
                  message: "Last name should contain only letters",
                },
                {
                  whitespace: true,
                  message: "Last name cannot be empty spaces",
                },
              ]}
              style={formItemStyle}
            >
              <Input placeholder="Enter Last Name" style={inputStyle} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          
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
        </Row>

        <Row gutter={24}>
          
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
                  if (!isLt2M) {
                    message.error("Image must be smaller than 2MB!");
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

        <Row justify="center" style={{ marginTop: "6px", marginBottom: "-19px" }}>
          <Col xs={24} sm={12} md={8}>
            <Button
              type="primary"
              block
              onClick={handleOk}
              style={{ height: "40px" }}
              disabled={loading}
            >
              {loading ? "Processing..." : isEditMode ? "Update" : "Confirm"}
            </Button>
          </Col>
        </Row>
      </Form>
      {loading && <Loader />}
    </Modal>
  );
};

export default AddCanteenModal;