import React, { useEffect } from "react";
import { Button, Form, Input } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../../Redux/hooks/hooks";
import { clearError, loginUser } from "../../Redux/Features/User/authSlice";
import { Link, useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated, userRole } = useAppSelector(
    (state) => state.auth
  );

  useEffect(() => {
    console.log("isAuthenticated:", isAuthenticated, "userRole:", userRole);
  }, [isAuthenticated, userRole, navigate]);

  const onFinish = async (values: { user_Email: string; user_Password: string }) => {
    dispatch(clearError()); 
    const result = await dispatch(loginUser(values));

    if (loginUser.fulfilled.match(result)) {
      const { userRole } = result.payload;
      if (userRole === "user") {
        navigate("/user");
      } else if (userRole === "admin") {
        navigate("/admin");
      }
    }
  };

  return (
    <div className="flex justify-center items-center w-full h-screen p-4 bg-gray-100">
      <Form
        onFinish={onFinish}
        name="login-form"
        style={{
          width: "100%",
          maxWidth: 400,
          backgroundColor: "white",
          padding: "1.5rem",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>Login</h2>

        {error && <div className="text-red-500 mb-3">{error}</div>}

        <Form.Item
          name="user_Email"
          rules={[
            {
              type: "email",
              required: true,
              message: "Valid email is required",
            },
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="Email *" />
        </Form.Item>

        <Form.Item
          name="user_Password"
          rules={[{ required: true, message: "Password is required" }]}
        >
          <Input
            prefix={<LockOutlined />}
            type="password"
            placeholder="Password *"
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            style={{ width: "100%" }}
            loading={loading}
          >
            Login
          </Button>
        </Form.Item>
        <p>
          Don't have an account?
          <Link to="/singup">
            <span className="text-green-600 ml-2">Sign Up</span>
          </Link>
        </p>
      </Form>
    </div>
  );
};

export default Login;
