import { Col, Row, Form, Input, Button, message } from "antd";
import axios from "axios";
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import WorldtekLogo from "../components/common/worldTekLogo";
import { languageTexts } from "../utils/data";
import { toastError } from "../components/common/toasterMessage";
import "/public/Naval1.png";
import { useDispatch } from "react-redux";

import { BASE_URL } from "../constants/api";


const LoginScreen: React.FC = () => {
  const [form] = Form.useForm();
  const [otpValues, setOtpValues] = useState<string[]>(Array(6).fill(""));
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpButtonDisabled, setOtpButtonDisabled] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // Create refs for each OTP input field
  const otpRefs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null));

  const API_URL_SEND = "/login";
  const API_URL_VERIFY = "/verifyOtp";

  const mobileValue = Form.useWatch("mobile", form); // ✅ Watching mobile field

  const validateMobile = (mobile: string) => {
    const indianMobilePattern = /^[6-9]\d{9}$/;
    return indianMobilePattern.test(mobile);
  };

  const handleSendOtp = async () => {
    try {
      await form.validateFields(["mobile"]);
      const mobileValue = form.getFieldValue("mobile");
      setLoading(true);
      setOtpButtonDisabled(true);

      try {
        const response = await axios.post(`${BASE_URL}${API_URL_SEND}`, {
          mobile: mobileValue,
        });

        if (response.status === 200) {
          setOtpSent(true);
          message.success("OTP Sent Successfully");
          setOtpValues(Array(6).fill(""));
          setTimeout(() => {
            if (otpRefs.current[0]) {
              otpRefs.current[0].focus();
            }
          }, 100);
        } else {
          message.error("Failed to send OTP");
          setOtpButtonDisabled(false);
        }
      } catch (error) {
        console.error("Error sending OTP:", error);
        message.error("Error sending OTP");
        setOtpButtonDisabled(false);
      } finally {
        setLoading(false);
      }
    } catch (err) {
      setOtpButtonDisabled(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    const sanitizedValue = value.replace(/\D/g, "");
    const newOtpValues = [...otpValues];
    newOtpValues[index] = sanitizedValue;
    setOtpValues(newOtpValues);
    form.setFieldsValue({ otp: newOtpValues.join("") });

    if (sanitizedValue && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .substring(0, 6);

    if (pastedData) {
      const newOtpValues = [...otpValues];
      for (let i = 0; i < pastedData.length; i++) {
        if (i < 6) {
          newOtpValues[i] = pastedData[i];
        }
      }
      setOtpValues(newOtpValues);
      form.setFieldsValue({ otp: newOtpValues.join("") });

      const nextEmptyIndex = newOtpValues.findIndex((value) => !value);
      if (nextEmptyIndex !== -1 && nextEmptyIndex < 6) {
        otpRefs.current[nextEmptyIndex]?.focus();
      } else {
        otpRefs.current[5]?.focus();
      }
    }
  };

  const handleLogin = async () => {
    try {
      await form.validateFields(["otp"]);

      setLoading(true);

      try {
        const response = await axios.post(`${BASE_URL}${API_URL_VERIFY}`, {
          mobile: form.getFieldValue("mobile"),
          otp: form.getFieldValue("otp"),
        });

        console.log("Response from server:", response.data.data.mobile);
        const token = response?.data?.token;
        localStorage.setItem("Token", token);
        //this is admin numbers
        const allowedNumbers = [
          "7093081518",
          "9392392143",
          "9573575468",
          "9052519059",
          
        ];

        if (
          response.status === 200 &&
          response.data.message === "OTP verified successfully"
        ) {
          console.log("currentUserData response.data",response.data)
          dispatch({ type: "currentUserData", payload: response.data.data });
          if (allowedNumbers.includes(response.data.data.mobile)) {
            setTimeout(() => {
              navigate("/dashboard");
            }, 1000);
            setLoading(false);
            return;
          }

          //this is for users
          navigate("/user/select-canteen");
          return;
        } else {
          toastError("Invalid OTP or verification failed.");
          form.setFields([
            {
              name: "otp",
              errors: ["Invalid OTP or verification failed."],
            },
          ]);
        }
      } catch (error) {
        toastError("Verification failed. Try again.");
        console.log("object", error);
        form.setFields([
          {
            name: "otp",
            errors: ["Verification failed. Try again."],
          },
        ]);
      } finally {
        setLoading(false);
      }
    } catch (err) {
      console.log("Validation failed:", err);
    }
  };

  const texts = languageTexts["en"];

  const validateIndianMobile = (_: any, value: string) => {
    if (!value) {
      return Promise.reject(new Error("Please enter your mobile number"));
    }
    if (!validateMobile(value)) {
      return Promise.reject(new Error(texts.invalidMobile));
    }
    return Promise.resolve();
  };

  const validateOtp = (_: any, value: string) => {
    if (!value) {
      return Promise.reject(new Error("Please enter the OTP"));
    }
    if (!/^\d{6}$/.test(value)) {
      return Promise.reject(new Error(texts.invalidOtp));
    }
    return Promise.resolve();
  };

  if (localStorage.getItem("Token")) {
    const token = localStorage.getItem("Token"); 
    console.log("Token", token); 
    // here need to perform navigation based on role
  }

  return (
    <Row style={{ minHeight: "100vh", overflow: "hidden" }}>
      <Col
        xs={24}
        sm={24}
        md={12}
        lg={12}
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
          overflow: "auto",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "400px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: "100%",
              background: "#fff",
              padding: "24px",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              border: " 4px solid #010080",
            }}
          >
            <h1
              style={{
                textAlign: "center",
                fontSize: "24px",
                fontWeight: "bold",
                marginBottom: "24px",
              }}
            >
              {texts.login}
            </h1>

            <Form
              form={form}
              layout="vertical"
              initialValues={{ mobile: "", otp: "" }}
              style={{ width: "100%" }}
            >
              <Form.Item
                name="mobile"
                label={texts.mobileNumber}
                rules={[{ validator: validateIndianMobile }]}
                validateTrigger={["onBlur", "onChange"]}
              >
                <Input
                  addonBefore="+91"
                  type="tel"
                  maxLength={10}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    form.setFieldsValue({ mobile: value });
                  }}
                  placeholder="9876543210"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  className="send-otp-button"
                  type="primary"
                  onClick={handleSendOtp}
                  loading={loading}
                  disabled={
                    otpButtonDisabled ||
                    !mobileValue ||
                    mobileValue.length !== 10
                  }
                  block
                  style={{
                    marginBottom: otpSent ? "-3px" : "0",
                    fontSize: "16px",
                    fontWeight: "500",
                    padding: "20px",
                    backgroundColor: "#010080",
                    color: "white",
                  }}
                >
                  {texts.sendOtp}
                </Button>
              </Form.Item>

              {otpSent && (
                <>
                  <Form.Item
                    name="otp"
                    label={texts.enterOtp}
                    rules={[{ validator: validateOtp }]}
                    validateTrigger={["onBlur", "onChange"]}
                    style={{ display: "none" }}
                  >
                    <Input type="hidden" />
                  </Form.Item>

                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", marginBottom: "8px" }}>
                      {texts.enterOtp}
                    </label>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "8px",
                      }}
                    >
                      {Array(6)
                        .fill(0)
                        .map((_, index) => (
                          <Input
                            key={index}
                            ref={(el: any) => (otpRefs.current[index] = el)}
                            type="tel"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={1}
                            style={{
                              width: "40px",
                              height: "40px",
                              textAlign: "center",
                              padding: "4px",
                              fontSize: "16px",
                              borderRadius: "4px",
                            }}
                            value={otpValues[index]}
                            onChange={(e) =>
                              handleOtpChange(index, e.target.value)
                            }
                            onKeyDown={(e) => handleOtpKeyDown(index, e)}
                            onPaste={index === 0 ? handleOtpPaste : undefined}
                          />
                        ))}
                    </div>
                    {form.getFieldError("otp") && (
                      <div
                        style={{
                          color: "#ff4d4f",
                          fontSize: "14px",
                          marginTop: "8px",
                        }}
                      >
                        {form.getFieldError("otp")}
                      </div>
                    )}
                  </div>

                  <Form.Item style={{ marginBottom: "10px" }}>
                    <Button
                      type="link"
                      onClick={handleSendOtp}
                      loading={loading}
                      style={{ paddingLeft: 0 }}
                    >
                      {texts.resendOtp}
                    </Button>
                  </Form.Item>

                  <Form.Item style={{ marginBottom: "10px" }}>
                    <Button
                      type="primary"
                      onClick={handleLogin}
                      loading={loading}
                      style={{
                        backgroundColor: "#010080",
                        color: "white",
                        fontSize: "16px",
                        fontWeight: "500",
                        padding: "20px",
                      }}
                      disabled={otpValues.join("").length !== 6}
                      block
                    >
                      {texts.loginButton}
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form>
          </div>

          <div style={{ marginTop: "13px" }}>
            <WorldtekLogo />
          </div>
        </div>
      </Col>

      <Col
        xs={0}
        sm={0}
        md={12}
        lg={12}
        style={{
          backgroundColor: "#00205B",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img
          src="/public/Naval1.png"
          alt="Logo"
          style={{ maxWidth: "120%", maxHeight: "120%" }}
        />
      </Col>
    </Row>
  );
};

export default LoginScreen;
