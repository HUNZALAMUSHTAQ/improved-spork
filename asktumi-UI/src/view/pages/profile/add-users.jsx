import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import {
  Col,
  Divider,
  Button,
  message,
  Table,
  Space,
  Tag,
  Modal,
  Form,
  Input,
  Row,
} from "antd";
import { deleteUser } from "../../../redux/auth/authActions";
import axios from "axios";
import { RiCloseFill } from "react-icons/ri";
const columns = [
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Email Verified",
    dataIndex: "isEmailVerified",
    key: "isEmailVerified",
    render: (isEmailVerified) => (
      <Tag color={isEmailVerified ? "green" : "red"}>
        {isEmailVerified ? "Verified" : "Not Verified"}
      </Tag>
    ),
  },

  {
    title: "First Name",
    dataIndex: "firstName",
    key: "firstName",
  },
  {
    title: "Last Name",
    dataIndex: "lastName",
    key: "lastName",
  },

  {
    title: "Action",
    key: "action",
    render: (_, record) => (
      <Space size="middle">
        <a>Delete</a>
      </Space>
    ),
  },
];
export default function AddUsers() {
  const dividerClass = "hp-border-color-black-40 hp-border-color-dark-80";
  const localUser = localStorage.getItem("userData");
  const data = JSON.parse(localUser);
  const dispatch = useDispatch();
  const history = useHistory();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const onFinish = (values) => {
    console.log("Success:", values);
    addUser();
    // Add your form submission logic here
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const [userData, setUserData] = useState([]);
  useEffect(() => {
    fetchUsersData();
  }, []);
  const fetchUsersData = async () => {
    try {
      const authToken = await localStorage.getItem("token");
      const config = {
        headers: { Authorization: `Bearer ${authToken}` },
      };

      const response = await axios.get(
        `http://localhost:3001/v1/users/allUsers`,
        config
      );
      console.log(response);
      setUserData(response?.data);
    } catch (error) {
      console.error("Error fetching projects:", error?.message);
    }
  };
  const addUser = async () => {
    try {
      const authToken = await localStorage.getItem("token");
      const config = {
        headers: { Authorization: `Bearer ${authToken}` },
      };

      const userData = {
        email,
        firstName,
        lastName,
      };

      const response = await axios.post(
        "http://localhost:3001/v1/users/createUser",
        userData,
        config
      );
      console.log(response, "asddddddddd")
      if (response.status == 201) {
        message.success("Email Sent to User Succesfully!.");
      } else {
        message.error(response?.message);
      }

      console.log(response);

      fetchUsersData();
      handleCancel();
    } catch (error) {
      console.error("Error adding user:", error);

        message.error("Error Sending email or email already exists!");
    }
  };
  const deleteAccount = async () => {
    const response = await dispatch(deleteUser({ id: data.user?.id }));
    if (response) {
      message.success("User deleted Successfully !");
      history.push("/pages/authentication/login");
    }
  };
  return (
    <div className="hp-profile-security">
      <Modal
        title="Add Experience"
        width={800}
        centered
        visible={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        closeIcon={
          <RiCloseFill className="remix-icon text-color-black-100" size={24} />
        }
      >
        <Form
          layout="vertical"
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                type: "email",
                message: "Please enter a valid email address",
              },
              {
                required: true,
                message: "Email is required",
              },
            ]}
          >
            <Input value={email} onChange={(e) => setEmail(e.target.value)} />
          </Form.Item>

          <Form.Item
            label="First Name"
            name="firstName"
            rules={[
              {
                required: true,
                message: "First Name is required",
              },
            ]}
          >
            <Input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            label="Last Name"
            name="lastName"
            rules={[
              {
                required: true,
                message: "Last Name is required",
              },
            ]}
          >
            <Input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </Form.Item>

          <Row>
            <Col md={12} span={24} className="hp-pr-sm-0 hp-pr-12">
              <Button block type="primary" htmlType="submit">
                Add
              </Button>
            </Col>
            <Col md={12} span={24} className="hp-mt-sm-12 hp-pl-sm-0 hp-pl-12">
              <Button block onClick={handleCancel}>
                Cancel
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal>

      <h2>Add Users</h2>
      <p className="hp-p1-body hp-mb-0">Add Users to your company</p>
      <Col className="hp-mt-md-24">
        <Button className="hp-mt-8" type="primary" onClick={showModal}>
          Add Users
        </Button>
      </Col>
      <Table columns={columns} dataSource={userData} />

      <Divider className={dividerClass} />
    </div>
  );
}
