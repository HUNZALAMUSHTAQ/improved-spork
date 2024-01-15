import React, { useEffect, useState } from "react";
import { Typography, Tabs, message, Select, Form } from "antd";
import { RiFileCopyLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { getProjects } from "../../../redux/projects/projectsActions";

const { TabPane } = Tabs;
const { Title } = Typography;

function Embed() {
  const projects = useSelector((state) => state.projects?.allProjects);
  const [selectedProject, setSelectedProject] = useState({});
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [html, setHtml] = useState("");
  const [text, setText] = useState("");
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getProjects());
  }, []);

  useEffect(() => {
    let popupHtml = `<script type="module">
    ${"\u2003"}import Chatbot from "http://${window.location.host}/web.js";
    ${"\u2003"}Chatbot.init({
    ${"\u2003"}${"\u2003"}chatflowid: "${selectedProject?.chatBotId}",
    ${"\u2003"}${"\u2003"}apiHost: "http://${window.location.host}",
    ${"\u2003"}})\n</script>`;
    const formattedPopupHtml = popupHtml.split("\n").map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));
    setText(popupHtml);
    setHtml(formattedPopupHtml);
  }, [selectedProject]);

  const handleTabChange = (val) => {
    let popupHtml = `<script type="module">
    ${"\u2003"}import Chatbot from "http://${window.location.host}/web.js";
    ${"\u2003"}Chatbot.init({
    ${"\u2003"}${"\u2003"}chatflowid: "${selectedProject?.chatBotId}",
    ${"\u2003"}${"\u2003"}apiHost: "http://${window.location.host}",
    ${"\u2003"}})\n</script>`;

    let fullHtml = `<flowise-fullchatbot></flowise-fullchatbot>\n<script type="module">
    ${"\u2003"}import Chatbot from "http://${window.location.host}/web.js";
    ${"\u2003"}Chatbot.initFull({
    ${"\u2003"}${"\u2003"}chatflowid: "${selectedProject?.chatBotId}",
    ${"\u2003"}${"\u2003"}apiHost: "http://${window.location.host}",
    ${"\u2003"}})\n</script>`;

    const formattedPopupHtml = popupHtml.split("\n").map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));
    const formattedfullHtml = fullHtml.split("\n").map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));
    if (val == 1) {
      setHtml(formattedPopupHtml);
      setText(popupHtml);
    }
    if (val == 2) {
      setHtml(formattedfullHtml);
      setText(fullHtml);
    }
  };

  let firstLine = `Paste this anywhere in the <body> tag of your  html file.`;

  const onChangeCheckBox = (e) => {
    console.log(`checked = ${e.target.checked}`);
  };

  const handleChange = (value) => {
    setSelectedProjectId(value);
    setSelectedProject(projects.find((p) => p.id === value));
  };

  return (
    <>
      <Title level={3}>Embed</Title>

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
      {selectedProjectId && (
        <Tabs defaultActiveKey="1" onChange={handleTabChange}>
          <TabPane tab="Popup Html" key="1">
            <h5>{firstLine}</h5>
            <div style={{ background: "black" }}>
              <div style={{ position: "relative" }}>
                <p style={{ color: "white" }}>{html}</p>
                <RiFileCopyLine
                  size={24}
                  onClick={() => {
                    navigator.clipboard.writeText(
                      text.replace(/\\u2003|\n/g, "")
                    );

                    message.info("Code copied succesfully");
                  }}
                  style={{
                    position: "absolute",
                    top: "0",
                    right: "0%",
                    cursor: "pointer",
                  }}
                />
              </div>
            </div>
          </TabPane>
          <TabPane tab="Fullpage Html" key="2">
            <h5>{firstLine}</h5>
            <div style={{ background: "black" }}>
              <div style={{ position: "relative" }}>
                <p style={{ color: "white" }}>{html}</p>
                <RiFileCopyLine
                  size={24}
                  onClick={() => {
                    navigator.clipboard.writeText(
                      text.replace(/\\u2003|\n/g, "")
                    );

                    message.info("Code copied succesfully");
                  }}
                  style={{
                    position: "absolute",
                    top: "0",
                    right: "0",
                    cursor: "pointer",
                  }}
                />
              </div>
              {/* <div>
      </div> */}
            </div>
            {/* <Checkbox onChange={onChangeCheckBox}>
      Show Embed Chat Config
    </Checkbox>{" "} */}
          </TabPane>
          {/* Add more TabPanes as needed */}
        </Tabs>
      )}
    </>
  );
}

export default Embed;
