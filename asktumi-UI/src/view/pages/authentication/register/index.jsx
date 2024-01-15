import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Row, Col, Form, Input, Button, message, Tabs, Modal } from "antd";
import {
  RiCheckboxCircleLine
} from "react-icons/ri";
import LeftContent from "../leftContent";
import Footer from "../footer";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../../../redux/auth/authActions";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { FormattedMessage } from "react-intl";
import GoogleLogo from "../../../../assets/images/dasboard/logo-google.svg";
import FacebookLogo from "../../../../assets/images/dasboard/logo-facebook.svg";
import LinkedinLogo from "../../../../assets/images/dasboard/logo-linkedin.svg";
import axiosInterceptor from "../../../../services/axiosInterceptor";
import { useGoogleLogin } from '@react-oauth/google';


export default function SignUp() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const loading = useSelector((state) => state.auth.loading);
  const authMessage = useSelector((state) => state.auth.message);
  const { TabPane } = Tabs;

  console.log(auth);
  const [form] = Form.useForm();
  const history = useHistory();

  const successMessage = () => {
    Modal.success({
      icon: (
        <span className="remix-icon">
          <RiCheckboxCircleLine />
        </span>
      ),
      title: (
        <h5 className="hp-mb-0 hp-font-weight-500">Thank you for choosing AskTumi!</h5>
      ),
      content: (
        <div>
          <p className="hp-p1-body">Your registration is confirmed, and we're excited to empower your document search and discovery journey. Explore the possibilities, ask away, and unlock the power of generative AI with AskTumi,</p>
          <p className="hp-p1-body">If you ever need assistance, out support teams is here for you.</p>
        </div>
      ),
      afterClose: () => history.push("/pages/authentication/login")
    });
  }

  const googleLogin = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: async (codeResponse) => {
      console.log(codeResponse);
      try {
        const response = await axiosInterceptor.post(
          '/v1/auth/google', {
              code: codeResponse.code,
          });
        if(response.data.status){
          successMessage();
        } else {
          message.warning(response.data.message)
        }
      } catch (error) {
        console.log(error);
        message.warning(error.message);
      }
    },
    onError: errorResponse => console.log(errorResponse),
  });

  const googleSignIn = async () => {
    googleLogin();
  };



  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [website, setWebsite] = useState("");
  const [taxID, setTaxID] = useState("");
  const [tel, setTel] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [accountType, setAccountType] = useState("personal");

  const onFinishFailed = () => {
    message.error("Submit failed!");
  };

  const register = async () => {
    let newUser;
    if (accountType === "personal")
      newUser = { firstName, lastName, email, password, accountType };

    if (accountType === "company")
      newUser = {
        firstName,
        lastName,
        email,
        password,
        accountType,
        company: { name: companyName, taxID, website, telephone: tel, email },
      };
    const response = await dispatch(registerUser(newUser));
    if (response) {
      successMessage();
      history.push("/pages/authentication/login");
    }
  };

  const handleTabChange = (val) => {
    setAccountType(val);
  };
  return (
    <Row gutter={[32, 0]} className="hp-authentication-page">
      <LeftContent />

      <Col lg={12} span={24} className="hp-py-sm-0 hp-py-md-64">
        <Row className="hp-h-100" align="middle" justify="center">
          <Col
            xxl={11}
            xl={15}
            lg={20}
            md={20}
            sm={24}
            className="hp-px-sm-8 hp-pt-24 hp-pb-48"
          >
            <span className="hp-d-block hp-p1-body hp-text-color-dark-0 hp-text-color-black-100 hp-font-weight-500 hp-mb-6">
              <FormattedMessage id="signup-free" />
            </span>
            <h1>Create Account</h1>
            <p className="hp-mt-8 hp-text-color-black-60">
              <FormattedMessage
                id={
                  accountType === "personal"
                    ? "signup-intro"
                    : accountType === "company"
                    ? "signup-company-intro"
                    : "signup-intro"
                }
              />
            </p>
            <Tabs defaultActiveKey={accountType} onChange={handleTabChange}>
              <TabPane tab="Personal" key="personal">
                <Form
                  layout="vertical"
                  name="basic"
                  form={form}
                  className="hp-mt-sm-16 hp-mt-32"
                  onFinish={register}
                  onFinishFailed={onFinishFailed}
                >
                  <Form.Item
                    label={<FormattedMessage id="first-name" />}
                    name="firstName"
                    rules={[{ required: true }, { type: "string", min: 4 }]}
                  >
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </Form.Item>

                  <Form.Item
                    label={<FormattedMessage id="last-name" />}
                    name="lastName"
                    rules={[{ required: true }, { type: "string", min: 4 }]}
                  >
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </Form.Item>

                  <Form.Item
                    label="E-mail :"
                    name="email"
                    rules={[
                      {
                        type: "email",
                        message: "The input is not valid E-mail!",
                      },
                      {
                        required: true,
                        message: "Please input your E-mail!",
                      },
                    ]}
                  >
                    <Input
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Form.Item>

                  <Form.Item
                    label="Password :"
                    name="password"
                    rules={[
                      {
                        required: true,
                      },
                      {
                        type: "string",
                        min: 6,
                      },
                      {
                        validator: (_, value) =>
                          /^(?=.*[A-Z])(?=.*\d).+$/.test(value)
                            ? Promise.resolve()
                            : Promise.reject(
                                new Error(
                                  "Password must contain at least one uppercase letter and one number."
                                )
                              ),
                      },
                    ]}
                  >
                    <Input.Password
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </Form.Item>

                  <Form.Item
                    label="Confirm Password :"
                    name="confirm-password"
                    rules={[
                      {
                        required: true,
                      },
                      {
                        type: "string",
                        min: 6,
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue("password") === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error(
                              "The new password that you entered do not match!"
                            )
                          );
                        },
                      }),
                    ]}
                  >
                    <Input.Password
                      id="confirm-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </Form.Item>
                  {/* {loading && <Spin />} */}
                  <Form.Item className="hp-mt-16 hp-mb-8">
                    <Button
                      loading={loading}
                      block
                      type="primary"
                      htmlType="submit"
                    >
                      Sign up
                    </Button>
                  </Form.Item>
                </Form>
              </TabPane>
              <TabPane tab="Company" key="company">
                <Form
                  layout="vertical"
                  name="basic"
                  form={form}
                  className="hp-mt-sm-16 hp-mt-32"
                  onFinish={register}
                  onFinishFailed={onFinishFailed}
                >
                  <Form.Item
                    label={<FormattedMessage id="first-name" />}
                    name="firstName"
                    rules={[{ required: true }, { type: "string", min: 4 }]}
                  >
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </Form.Item>

                  <Form.Item
                    label={<FormattedMessage id="last-name" />}
                    name="lastName"
                    rules={[{ required: true }, { type: "string", min: 4 }]}
                  >
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </Form.Item>
                  {accountType === "company" && (
                    <>
                      <Form.Item
                        label={<FormattedMessage id="company-name" />}
                        name="companyName"
                        rules={[{ required: true }, { type: "string", min: 4 }]}
                      >
                        <Input
                          id="companyName"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                        />
                      </Form.Item>
                      <Form.Item
                        label={<FormattedMessage id="tax-id" />}
                        name="taxID"
                        rules={[{ required: true }, { type: "string" }]}
                      >
                        <Input
                          id="taxID"
                          value={taxID}
                          onChange={(e) => setTaxID(e.target.value)}
                        />
                      </Form.Item>
                      <Form.Item
                        label={<FormattedMessage id="website" />}
                        name="website"
                        rules={[{ type: "string" }]}
                      >
                        <Input
                          id="website"
                          value={website}
                          onChange={(e) => setWebsite(e.target.value)}
                        />
                      </Form.Item>
                      <Form.Item
                        label={<FormattedMessage id="tel" />}
                        name="tel"
                        rules={[{ type: "string", min: 4 }]}
                      >
                        <Input
                          id="tel"
                          value={tel}
                          onChange={(e) => setTel(e.target.value)}
                        />
                      </Form.Item>
                    </>
                  )}
                  <Form.Item
                    label="E-mail :"
                    name="email"
                    rules={[
                      {
                        type: "email",
                        message: "The input is not valid E-mail!",
                      },
                      {
                        required: true,
                        message: "Please input your E-mail!",
                      },
                    ]}
                  >
                    <Input
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Form.Item>

                  <Form.Item
                    label="Password :"
                    name="password"
                    rules={[
                      {
                        required: true,
                      },
                      {
                        type: "string",
                        min: 6,
                      },
                      {
                        validator: (_, value) =>
                          /^(?=.*[A-Z])(?=.*\d).+$/.test(value)
                            ? Promise.resolve()
                            : Promise.reject(
                                new Error(
                                  "Password must contain at least one uppercase letter and one number."
                                )
                              ),
                      },
                    ]}
                  >
                    <Input.Password
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </Form.Item>

                  <Form.Item
                    label="Confirm Password :"
                    name="confirm-password"
                    rules={[
                      {
                        required: true,
                      },
                      {
                        type: "string",
                        min: 6,
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue("password") === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error(
                              "The new password that you entered do not match!"
                            )
                          );
                        },
                      }),
                    ]}
                  >
                    <Input.Password
                      id="confirm-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </Form.Item>
                  {/* {loading && <Spin />} */}
                  <Form.Item className="hp-mt-16 hp-mb-8">
                    <Button
                      loading={loading}
                      block
                      type="primary"
                      htmlType="submit"
                    >
                      Sign up
                    </Button>
                  </Form.Item>
                </Form>
              </TabPane>
            </Tabs>

            <div className="hp-form-info hp-text-center">
              <span className="hp-text-color-black-80 hp-text-color-dark-40 hp-caption hp-mr-4">
                <FormattedMessage id="signup-have-account" />
              </span>

              <Link
                to="/pages/authentication/login"
                className="hp-text-color-primary-1 hp-text-color-dark-primary-2 hp-caption"
              >
                Login
              </Link>
            </div>
            {accountType === "personal" && (
              <Row
                align="middle"
                justify="center"
                gutter={[2]}
                className="hp-mt-10"
              >
                <span className="hp-text-color-black-80 hp-text-color-dark-40 hp-caption hp-font-weight-400 hp-mr-4">
                  <FormattedMessage id="login-using-account" />
                </span>
                <Col span={2} align="middle">
                  <img
                    src={GoogleLogo}
                    onClick={googleSignIn}
                    alt="googleLogo"
                    style={{ width: "75%" }}
                  />
                </Col>

                <Col span={2} align="middle">
                  <a href="#" target="_blank">
                    <img
                      src={FacebookLogo}
                      alt="Facebook"
                      style={{ width: "75%" }}
                    />
                  </a>
                </Col>
                <Col span={2} align="middle">
                  <a href="#" target="_blank">
                    <img
                      src={LinkedinLogo}
                      alt="Linkedin"
                      style={{ width: "75%" }}
                    />
                  </a>
                </Col>
              </Row>
            )}
            <Footer />
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
