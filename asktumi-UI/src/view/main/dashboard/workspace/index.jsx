import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Upload, Row, Col, Button } from "antd";
import ProtectedAppPage from "../../../pages/Protected";

function Workspace() {
  const user = useSelector((state) => state.auth?.user);

  return (
    <div>
      <h3>
        Welcome {user?.firstName} {user?.lastName}
      </h3>
      <h5>Dashboard</h5>
      <Row align="middle" justify="center" gutter={[2]} className="hp-mt-10">
        <Col span={6} align="middle">
          <Button>Create Chatbot</Button>
        </Col>

        <Col span={6} align="middle">
          <Button>Manage Chatbot Projects</Button>
        </Col>
        <Col span={6} align="middle">
          <Button>Buy Tokens</Button>
        </Col>
        <Col span={6} align="middle">
          <Button>Upgrade Subscription Plan</Button>
        </Col>
      </Row>
      <ProtectedAppPage />
    </div>
  );
}

export default Workspace;
