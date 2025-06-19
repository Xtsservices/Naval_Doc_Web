import React, { useEffect, useState } from "react";
import {
  Card,
  Typography,
  Button,
  Row,
  Col,
  Form,
  Input,
  Select,
  DatePicker,
} from "antd";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { AppState } from "../../store/storeTypes";

const { Text } = Typography;

interface ProfileData {
  name: string;
  gender: string;
  dateOfBirth: string;
  mobileNo: string;
  emailId: string;
}

const ProfileDetails: React.FC = () => {
  const user = useSelector((state: AppState) => state.currentUserData);
  console.log("user", user);

  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "",
    gender: "",
    dateOfBirth: "",
    mobileNo: "",
    emailId: "",
  });

  // Load profile data from localStorage on initial mount
  useEffect(() => {
    const storedProfile = localStorage.getItem("profileData");
    if (storedProfile) {
      setProfileData(JSON.parse(storedProfile));
    }
  }, []);

  const handleEdit = () => {
    form.setFieldsValue({
      name: profileData.name !== "" ? profileData.name : "",
      gender: profileData.gender !== "" ? profileData.gender : undefined,
      dateOfBirth:
        profileData.dateOfBirth !== ""
          ? dayjs(profileData.dateOfBirth)
          : undefined,
      mobileNo: profileData.mobileNo !== "" ? profileData.mobileNo : "",
      emailId: profileData.emailId !== "" ? profileData.emailId : "",
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    form.resetFields();
  };

  const handleSubmit = (values: any) => {
    const newProfile: ProfileData = {
      name: values.name,
      gender: values.gender,
      dateOfBirth: values.dateOfBirth
        ? values.dateOfBirth.format("YYYY-MM-DD")
        : "-",
      mobileNo: values.mobileNo,
      emailId: values.emailId,
    };

    setProfileData(newProfile);
    localStorage.setItem("profileData", JSON.stringify(newProfile)); // Save to localStorage
    setIsEditing(false);
  };

  const cardStyle: React.CSSProperties = {
    borderRadius: "20px",
    border: "2px solid #2657BC",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
    marginBottom: "20px",
    width: "100%",
    maxWidth: "100%",
    overflow: "hidden",
  };

  const titleStyle: React.CSSProperties = {
    color: "#2657BC",
    fontSize: "clamp(18px, 4vw, 22px)",
    fontWeight: 700,
    marginBottom: "20px",
    textAlign: "center",
  };

  const fieldStyle: React.CSSProperties = {
    marginBottom: "20px",
    fontSize: "14px",
  };

  const labelStyle: React.CSSProperties = {
    color: "#333",
    fontSize: "clamp(14px, 3.5vw, 16px)",
    fontWeight: "bold",
    textAlign: "left",
    display: "block",
    wordBreak: "break-word",
    marginBottom: "4px",
  };

  const valueStyle: React.CSSProperties = {
    color: "#666",
    fontSize: "clamp(14px, 3.5vw, 16px)",
    wordBreak: "break-word",
  };

  const getResponsiveLayout = () => {
    if (window.innerWidth < 576) {
      return {
        labelCol: { span: 24 },
        valueCol: { span: 24 },
        showSeparator: false,
        containerStyle: { padding: "12px" },
      };
    } else if (window.innerWidth < 768) {
      return {
        labelCol: { span: 10 },
        valueCol: { span: 14 },
        showSeparator: false,
        containerStyle: { padding: "16px" },
      };
    } else {
      return {
        labelCol: { span: 6 },
        valueCol: { span: 17 },
        separatorCol: { span: 1 },
        showSeparator: true,
        containerStyle: { padding: "16px" },
      };
    }
  };

  const layout = getResponsiveLayout();

  const profileFields = [
    {
      label: "Name",
      value: profileData.name || "-",
      editField: (
        <Form.Item
          name="name"
          rules={[{ required: true, message: "Please enter your name" }]}
          style={{ margin: 0 }}
        >
          <Input size="large" />
        </Form.Item>
      ),
    },
    {
      label: "Gender",
      value: profileData.gender || "-",
      editField: (
        <Form.Item
          name="gender"
          rules={[{ required: true, message: "Please select your gender" }]}
          style={{ margin: 0 }}
        >
          <Select size="large">
            <Select.Option value="Male">Male</Select.Option>
            <Select.Option value="Female">Female</Select.Option>
            <Select.Option value="Other">Other</Select.Option>
          </Select>
        </Form.Item>
      ),
    },
    {
      label: "Date Of Birth",
      value: profileData.dateOfBirth || "-",
      editField: (
        <Form.Item
          name="dateOfBirth"
          rules={[
            { required: true, message: "Please select your date of birth" },
          ]}
          style={{ margin: 0 }}
        >
          <DatePicker size="large" style={{ width: "100%" }} />
        </Form.Item>
      ),
    },
    {
      label: "Mobile No",
      value: profileData.mobileNo || "-",
      editField: (
        <Form.Item
          name="mobileNo"
          rules={[
            { required: true, message: "Please enter your mobile number" },
            {
              pattern: /^\d{10}$/,
              message: "Please enter a valid 10-digit mobile number",
            },
          ]}
          style={{ margin: 0 }}
        >
          <Input size="large" />
        </Form.Item>
      ),
    },
    {
      label: "Email Id",
      value: profileData.emailId || "-",
      editField: (
        <Form.Item
          name="emailId"
          rules={[
            { required: true, message: "Please enter your email" },
            { type: "email", message: "Please enter a valid email" },
          ]}
          style={{ margin: 0 }}
        >
          <Input size="large" />
        </Form.Item>
      ),
    },
  ];

  return (
    <div style={{ padding: "8px", maxWidth: "100vw", overflow: "hidden" }}>
      <Card style={cardStyle} styles={{ body: layout.containerStyle }}>
        <Typography.Title level={4} style={titleStyle}>
          Profile Details
        </Typography.Title>

        {!isEditing ? (
          <>
            {profileFields.map((field, index) => (
              <Row key={index} style={fieldStyle} gutter={[8, 4]}>
                <Col {...layout.labelCol} style={{ paddingLeft: "4px" }}>
                  <Text style={labelStyle}>{field.label}</Text>
                </Col>

                {layout.showSeparator && layout.separatorCol && (
                  <Col {...layout.separatorCol} style={{ textAlign: "center" }}>
                    <Text style={valueStyle}>:-</Text>
                  </Col>
                )}

                <Col {...layout.valueCol}>
                  <Text style={valueStyle}>{field.value}</Text>
                </Col>
              </Row>
            ))}

            <div
              style={{
                textAlign: "right",
                marginTop: "24px",
                borderTop: "1px solid #e0e0e0",
                paddingTop: "16px",
              }}
            >
              <Button
                type="text"
                onClick={handleEdit}
                size="large"
                style={{
                  color: "#2657BC",
                  padding: "8px 20px",
                  height: "auto",
                  fontSize: "clamp(14px, 3.5vw, 16px)",
                  border: "1px solid #2657BC",
                  fontWeight: "500",
                  minWidth: "80px",
                }}
              >
                Edit
              </Button>
            </div>
          </>
        ) : (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            style={{ marginTop: "8px" }}
          >
            {profileFields.map((field, index) => (
              <div key={index} style={{ marginBottom: "20px" }}>
                {window.innerWidth < 768 ? (
                  <div>
                    <Text style={{ ...labelStyle, marginBottom: "8px" }}>
                      {field.label}
                    </Text>
                    {field.editField}
                  </div>
                ) : (
                  <Row gutter={[16, 8]} align="middle">
                    <Col {...layout.labelCol} style={{ paddingLeft: "4px" }}>
                      <Text style={labelStyle}>{field.label}</Text>
                    </Col>

                    {layout.showSeparator && layout.separatorCol && (
                      <Col {...layout.separatorCol} style={{ textAlign: "center" }}>
                        <Text style={valueStyle}>:-</Text>
                      </Col>
                    )}

                    <Col {...layout.valueCol}>{field.editField}</Col>
                  </Row>
                )}
              </div>
            ))}

            <div
              style={{
                textAlign: "right",
                marginTop: "20px",
                display: "flex",
                justifyContent: "flex-end",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              <Button
                onClick={handleCancel}
                size="large"
                style={{
                  padding: "8px 20px",
                  height: "auto",
                  fontSize: "clamp(14px, 3.5vw, 16px)",
                  minWidth: "80px",
                }}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                style={{
                  background: "#2657BC",
                  padding: "8px 20px",
                  height: "auto",
                  fontSize: "clamp(14px, 3.5vw, 16px)",
                  minWidth: "80px",
                }}
              >
                Save
              </Button>
            </div>
          </Form>
        )}
      </Card>
    </div>
  );
};

export default ProfileDetails;
