import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { Col, Divider, Button, message } from "antd";
import { deleteUser } from "../../../redux/auth/authActions";

export default function DeleteAccount() {
  const dividerClass = "hp-border-color-black-40 hp-border-color-dark-80";
  const localUser = localStorage.getItem("userData");
  const data = JSON.parse(localUser);
  const dispatch = useDispatch();
  const history = useHistory();
  const deleteAccount = async () => {
    const response = await dispatch(deleteUser({ id: data.user?.id }));
    if (response) {
      message.success("User deleted Successfully !");
      history.push("/pages/authentication/login");
    }
  };
  return (
    <div className="hp-profile-security">
      <h2>Delete Account</h2>
      <p className="hp-p1-body hp-mb-0">
        Are you sure you want to delete this account?
      </p>
      <Col className="hp-mt-md-24">
        <Button
          className="hp-mt-8"
          type="primary"
          onClick={deleteAccount}
          danger
        >
          Delete account
        </Button>
      </Col>
      <Divider className={dividerClass} />
    </div>
  );
}
