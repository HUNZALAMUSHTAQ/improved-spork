import React, { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";

import {
  Row,
  Col,
  Divider,
  Form,
  Input,
  DatePicker,
  TimePicker,
  Button,
  Modal,
  Table,
} from "antd";

import { RiCloseFill, RiCalendarLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import {
  updateUser,
  updateUserInformation,
} from "../../../redux/auth/authActions";

export default function InfoProfile() {
  const user = useSelector((state) => state.auth?.user);
  const dispatch = useDispatch();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");

  const [contactModalVisible, setContactModalVisible] = useState(false);
  const [preferanceModalVisible, setPreferanceModalVisible] = useState(false);
  const transactionHistory = [];
  const listTitle = "hp-p1-body";
  const listResult =
    "hp-mt-sm-4 hp-p1-body hp-text-color-black-100 hp-text-color-dark-0";
  const dividerClass = "hp-border-color-black-40 hp-border-color-dark-80";
  const columns = [
    {
      title: "Tokens used",
      dataIndex: "tokensUsed",
    },
    {
      title: "Date",
      dataIndex: "updatedAt",
    },
  ];
  useEffect(() => {
    setFirstName(user?.firstName || "");
    setLastName(user?.lastName || "");
    setPhoneNumber(user?.phoneNumber || "");
    setAddress(user?.address || "");
  }, []);

  const updateUserInfo = () => {
    const obj = { id: user?.id };
    if (firstName) {
      obj.firstName = firstName;
    }
    if (lastName) {
      obj.lastName = lastName;
    }
    if (phoneNumber) {
      obj.phoneNumber = phoneNumber;
    }
    if (address) {
      obj.address = address;
    }
    dispatch(updateUserInformation(obj));
    setAddress("");
    setFirstName("");
    setLastName("");
    setPhoneNumber("");
    contactModalCancel();
  };
  const contactModalShow = () => {
    setContactModalVisible(true);
  };

  const contactModalCancel = () => {
    setContactModalVisible(false);
  };

  const preferanceModalShow = () => {
    setPreferanceModalVisible(true);
  };

  const preferanceModalCancel = () => {
    setPreferanceModalVisible(false);
  };

  return (
    <div>
      <Modal
        title="Contact Edit"
        width={416}
        centered
        visible={contactModalVisible}
        onCancel={contactModalCancel}
        footer={null}
        closeIcon={
          <RiCloseFill className="remix-icon text-color-black-100" size={24} />
        }
      >
        <Form
          layout="vertical"
          name="basic"
          initialValues={{
            remember: true,
            firstName,
            lastName,
            address,
            phoneNumber,
          }}
        >
          <Form.Item label="First Name" name="firstName">
            <Input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </Form.Item>

          <Form.Item label="Last Name" name="lastName">
            <Input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </Form.Item>

          <Form.Item label="Phone" name="phone">
            <Input
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </Form.Item>

          {/* <Form.Item label="Date of Birth" name="dateofbirth">
            <DatePicker
              className="hp-w-100"
              suffixIcon={
                <RiCalendarLine className="remix-icon hp-text-color-black-60" />
              }
            />
          </Form.Item> */}

          <Form.Item label="Address" name="address">
            <Input.TextArea
              rows={3}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </Form.Item>

          <Row>
            <Col md={12} span={24} className="hp-pr-sm-0 hp-pr-12">
              <Button
                block
                type="primary"
                htmlType="submit"
                onClick={updateUserInfo}
              >
                Edit
              </Button>
            </Col>

            <Col md={12} span={24} className="hp-mt-sm-12 hp-pl-sm-0 hp-pl-12">
              <Button block onClick={contactModalCancel}>
                Cancel
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal>

      <Modal
        title="Preferance Edit"
        width={316}
        centered
        visible={preferanceModalVisible}
        onCancel={preferanceModalCancel}
        footer={null}
        closeIcon={
          <RiCloseFill className="remix-icon text-color-black-100" size={24} />
        }
      >
        <Form layout="vertical" name="basic" initialValues={{ remember: true }}>
          <Form.Item label="Language" name="language">
            <Input />
          </Form.Item>

          <Form.Item label="Date Format" name="dateformat">
            <DatePicker
              className="hp-w-100"
              suffixIcon={
                <RiCalendarLine className="remix-icon hp-text-color-black-60" />
              }
            />
          </Form.Item>

          <Form.Item label="Timezone" name="timezone">
            <TimePicker className="hp-w-100" />
          </Form.Item>

          <Row>
            <Col md={12} span={24} className="hp-pr-sm-0 hp-pr-12">
              <Button
                block
                type="primary"
                htmlType="submit"
                onClick={preferanceModalCancel}
              >
                Edit
              </Button>
            </Col>

            <Col md={12} span={24} className="hp-mt-sm-12 hp-pl-sm-0 hp-pl-12">
              <Button block onClick={preferanceModalCancel}>
                Cancel
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal>

      <Divider className={dividerClass} />

      <Row align="middle" justify="space-between">
        <Col md={12} span={24}>
          <h3>
            <FormattedMessage id="sidebar-apps-contact" />
          </h3>
        </Col>

        <Col md={12} span={24} className="hp-profile-action-btn hp-text-right">
          <Button type="primary" ghost onClick={contactModalShow}>
            Edit
          </Button>
        </Col>

        <Col
          span={24}
          className="hp-profile-content-list hp-mt-8 hp-pb-sm-0 hp-pb-42"
        >
          <ul>
            <li>
              <span className={listTitle}>
                <FormattedMessage id="pi-fname" />
              </span>
              <span className={listResult}>
                {user?.firstName} {user?.lastName}
              </span>
            </li>

            <li>
              <span className={listTitle}>
                <FormattedMessage id="pi-fn" />
              </span>
              <span className={listResult}>{user?.firstName}</span>
            </li>
            <li>
              <span className={listTitle}>
                <FormattedMessage id="pi-ln" />
              </span>
              <span className={listResult}>{user?.lastName}</span>
            </li>

            <li className="hp-mt-18">
              <span className={listTitle}>
                <FormattedMessage id="pi-email" />
              </span>
              <span className={listResult}>{user?.email}</span>
            </li>

            <li className="hp-mt-18">
              <span className={listTitle}>
                <FormattedMessage id="pi-phone" />
              </span>
              <a className={listResult} href="tel:+900374323">
                {user?.phoneNumber}
              </a>
            </li>

            <li className="hp-mt-18">
              <span className={listTitle}>
                <FormattedMessage id="pi-address" />
              </span>
              <span className={listResult}>{user?.address}</span>
            </li>
          </ul>
        </Col>
      </Row>

      <Divider className={dividerClass} />
      <Row align="middle" justify="space-between">
        <Col md={12} span={24}>
          <h3>
            <FormattedMessage id="tokens" />
          </h3>
        </Col>

        <Col
          span={24}
          className="hp-profile-content-list hp-mt-8 hp-pb-sm-0 hp-pb-42"
        >
          <ul>
            <li>
              <span className={listTitle}>
                <FormattedMessage id="total-tokens" />
              </span>
              <span className={listResult}>{user?.tokens}</span>
            </li>
          </ul>
        </Col>
      </Row>
      <Divider className={dividerClass} />
      <Row align="middle" justify="space-between">
        <Col md={12} span={24}>
          <h3>
            <FormattedMessage id="transaction-history" />
          </h3>
        </Col>

        <Col
          span={24}
          className="hp-profile-content-list hp-mt-8 hp-pb-sm-0 hp-pb-42"
        >
          <Table
            columns={columns}
            dataSource={transactionHistory || []}
            bordered
          />
        </Col>
      </Row>
    </div>
  );
}
