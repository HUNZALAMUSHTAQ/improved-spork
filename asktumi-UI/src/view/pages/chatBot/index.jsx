import React, { useEffect, useState } from "react";
import Chatbot from "./web.js";
import { Button, Select, Form } from "antd";
import ProtectedAppPage from "../../pages/Protected.jsx";
import { useDispatch, useSelector } from "react-redux";
import { getProjects } from "../../../redux/projects/projectsActions.jsx";

function ChatBot() {
  const [selectedProject, setSelectedProject] = useState({});
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const projects = useSelector((state) => state.projects?.allProjects);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getProjects());
  }, []);

  useEffect(() => {
    if (selectedProjectId) {
      Chatbot.initFull({
        chatflowid: selectedProject?.chatBotId,
        apiHost: process.env.REACT_APP_BASE_URL,
      });
    }
  }, [selectedProjectId]);

  const handleChange = (value) => {
    setSelectedProjectId(value);
    setSelectedProject(projects.find((p) => p.id === value));
  };
  return (
    <div>
      <h3>Asktumi ChatBot</h3>
      <div>
        {" "}
        <Button
          type="primary"
          className="hp-mb-1"
          style={{
            marginBottom: 32,
          }}
          disabled={true}
        >
          HR Policies and Procedure
        </Button>
      </div>
      <ProtectedAppPage />
      <Form
        labelCol={{ span: 2.5 }}
        wrapperCol={{ span: 6 }}
        layout="horizontal"
      >
        <Form.Item label="Select Project">
          <Select
            value={selectedProjectId}
            onChange={handleChange}
            options={projects.map((item) => ({
              value: item?.id,
              label: item?.name,
            }))}
          ></Select>
        </Form.Item>
      </Form>
      {selectedProjectId && <flowise-fullchatbot />}
    </div>
  );
}

export default ChatBot;
