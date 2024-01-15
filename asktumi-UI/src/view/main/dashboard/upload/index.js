import React, { useState, useEffect } from "react";
import { Upload, message, Input, Select, Form, Row } from "antd";
import {
  RiUploadCloud2Line,
  RiCheckboxCircleLine,
  RiCloseCircleLine,
} from "react-icons/ri";
import axiosInterceptor from "../../../../services/axiosInterceptor";
import ProtectedAppPage from "../../../pages/Protected";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getProjects } from "../../../../redux/projects/projectsActions";

const { Dragger } = Upload;
const { Search } = Input;

const props = {
  name: "file",
  multiple: false,
};

function UploadFile() {
  const [actionUrl, setActionUrl] = useState([]);
  const [selectedProject, setSelectedProject] = useState({});
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const projects = useSelector((state) => state.projects?.allProjects);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getProjects());
  }, []);

  const isValidUrl = async (value, _e, info) => {
    var inputElement = document.createElement("input");
    inputElement.type = "url";
    inputElement.value = value;

    if (value === "") {
      alert("URL cannot be empty. Please enter a URL.");
      return false;
    } else if (!inputElement.checkValidity()) {
      alert("You entered an incorrect URL");
    } else {
      await axiosInterceptor.post(`/v1/bot/generate?action=url`, {
        url: value,
        chatBotId: selectedProject?.chatBotId,
      });
    }
  };
  const handleChange = (value) => {
    setSelectedProjectId(value);
    setSelectedProject(projects.find((p) => p.id === value));
  };
  return (
    <div>
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
      <br></br>
      <Dragger
        {...props}
        accept=".doc, .docx, .pdf, .csv, .txt"
        showUploadList={{
          showRemoveIcon: false,
        }}
        disabled={!selectedProjectId}
        customRequest={async (info) => {
          console.log(info);
          const { type } = info.file;

          try {
            const { data } = await axiosInterceptor.get(
              `/v1/users/getPresignedUrl?fileType=${type}`
            );
            await axios.put(data.url, info.file);
            await axiosInterceptor.post(
              `/v1/bot/generate?fileType=${type}&action=file`,
              {
                url: data.url,
                chatBotId: selectedProject?.chatBotId,
              }
            );
            console.log("File uploaded to S3");
            message.success({
              content: info.file.name + " file uploaded successfully.",
              icon: <RiCheckboxCircleLine className="remix-icon" />,
            });

            info.onSuccess(() => {
              message.success({
                content: info.file.name + " file uploaded successfully.",
                icon: <RiCheckboxCircleLine className="remix-icon" />,
              });
            });
          } catch (err) {
            console.error("Error uploading file to S3:", err);
            if (err) {
              console.log(err);
              message.error({
                content: err + " file upload failed.",
                icon: <RiCloseCircleLine className="remix-icon" />,
              });

              info.onError((err) => {
                if (err) {
                  console.log(err);
                  message.error({
                    content: err + " file upload failed.",
                    icon: <RiCloseCircleLine className="remix-icon" />,
                  });
                }
              });
            }
          }
        }}
      >
        <p className="ant-upload-drag-icon">
          <RiUploadCloud2Line className="remix-icon" />
        </p>

        <p className="ant-upload-text">
          Click or drag file to this area to upload
        </p>

        <p className="ant-upload-hint">
          doc, pdf, txt, csv and not more than 100 MB
        </p>
      </Dragger>
      <ProtectedAppPage />
      <p level={5} style={{ textAlign: "center" }}>
        Or
      </p>
      <Search
        placeholder="Enter URL"
        errorActiveShadow
        enterButton="Train"
        onSearch={isValidUrl}
        onPressEnter={isValidUrl}
        disabled={!selectedProjectId}
      />
    </div>
  );
}

export default UploadFile;
