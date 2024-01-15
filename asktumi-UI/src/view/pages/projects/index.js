import React, { useState, useEffect } from "react";
import { Button, Form, Input, Typography, Table, message, Card } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  getProjects,
  addProject,
} from "../../../redux/projects/projectsActions";

const { Title } = Typography;
const { TextArea } = Input;

const Projects = () => {
  const projects = useSelector((state) => state.projects?.allProjects);
  const loading = useSelector((state) => state.projects.loading);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getProjects());
  }, []);
  const [project, setProject] = useState({ name: "", description: "" });
  const [form] = Form.useForm();

  const add = () => {
    const response = dispatch(addProject(project));
    setProject({ name: "", description: "" });
  };
  const onFinishFailed = () => {
    message.error("Submit failed!");
  };
  const formItemLayout = {
    labelCol: {
      span: 4,
    },
    wrapperCol: {
      span: 12,
    },
  };

  const buttonItemLayout = {
    wrapperCol: {
      span: 14,
      offset: 4,
    },
  };
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Action",
      dataIndex: "",
      key: "x",
      render: () => <a>Delete</a>,
    },
  ];

  return (
    <>
      <Title level={4}>Add new Project</Title>
      <Card style={{ background: "white", marginBottom: "20px" }}>
        <Form
          {...formItemLayout}
          layout="horizontal"
          form={form}
          onFinish={add}
          onFinishFailed={onFinishFailed}
          style={{
            maxWidth: 800,
            paddingBottom: "0px",
          }}
        >
          <Form.Item label="Name">
            <Input
              placeholder="Project Name"
              value={project.name}
              onChange={(e) => setProject({ ...project, name: e.target.value })}
            />
          </Form.Item>
          <Form.Item label="Description">
            <TextArea
              value={project.description}
              onChange={(e) =>
                setProject({ ...project, description: e.target.value })
              }
              rows={4}
            />
          </Form.Item>
          <Form.Item {...buttonItemLayout}>
            <Button loading={loading} type="primary" htmlType="submit">
              Add
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <Title level={5}>All Project</Title>
      <Table columns={columns} dataSource={projects} bordered />
    </>
  );
};
export default Projects;
