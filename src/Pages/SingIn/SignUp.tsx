import React, { useState } from "react";
import {
  Button,
  Form,
  Input,
  Spin,
  Upload,
  UploadFile,
  UploadProps,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  FacebookOutlined,
  SkypeOutlined,
  LockOutlined,
  PlusOutlined,
  WhatsAppOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import {
  registerUser,
  setError,
  setLoading,
} from "../../Redux/Features/User/RegisterSlice";
import { AppDispatch } from "../../Redux/app/store";
import { FaTelegramPlane } from "react-icons/fa";
import { HiOutlineLocationMarker } from "react-icons/hi";

const validateMessages = {
  required: "${label} is required!",
  types: {
    email: "${label} is not a valid email!",
    number: "${label} is not a valid number!",
  },
};

const SignUp: React.FC = () => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [form] = Form.useForm();
  const [customLoading, customSetLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const handleCustomRequest: UploadProps["customRequest"] = async ({
    file,
    onSuccess,
    onError,
  }) => {
    setUploadingImage(true);
    const uploadData = new FormData();
    uploadData.append("image", file as Blob);

    try {
      const response = await axios.post(
        "https://api.imgbb.com/1/upload",
        uploadData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          params: {
            key: "e63830251586e4c27e94823af65ea6ca",
          },
        }
      );

      const imgURL = response.data.data.url;
      form.setFieldsValue({ user_Image: imgURL });

      setFileList([
        {
          uid: "1",
          name: "image.png",
          status: "done",
          url: imgURL,
        },
      ]);
      onSuccess?.("Upload successful!");
    } catch (error) {
      console.error("Error uploading image:", error);
      onError?.(error as Error);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemove = () => {
    form.setFieldsValue({ user_Image: null });
    setFileList([]);
  };

  interface FormValues {
    user_Name: string;
    user_Address: string;
    user_Email: string;
    user_Password: string;
    user_PhoneNumber: string;
    user_Facebook: string;
    user_Skype?: string;
    user_Telegram?: string;
    user_Image: string | null;
  }

  const onFinish = async (values: FormValues) => {
    dispatch(setLoading(true));
    customSetLoading(true);
    console.log(values);

    try {
      await dispatch(registerUser(values)).unwrap();
      navigate("/login");
    } catch (error) {
      dispatch(setError("Registration failed. Please try again later."));
      console.error("Registration error:", error);
    } finally {
      customSetLoading(false);
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="flex justify-center items-center w-full min-h-screen p-4 bg-gray-100">
      <Form
        form={form}
        name="signin-form"
        onFinish={onFinish}
        style={{
          width: "100%",
          maxWidth: 450,
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        }}
        validateMessages={validateMessages}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "1.5rem",
            fontSize: "1.5rem",
            fontWeight: "bold",
            color: "#333",
          }}
        >
          Sign Up
        </h2>

        <Form.Item
          name="user_Name"
          rules={[{ required: true, message: "Username is required" }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Username *" />
        </Form.Item>

        <Form.Item
          name="user_Address"
          rules={[{ required: true, message: "User address is required" }]}
        >
          <Input
            prefix={<HiOutlineLocationMarker />}
            placeholder="Your Address *"
          />
        </Form.Item>

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
          rules={[
            {
              required: true,
              message: "Strong password is required",
            },
            {
              min: 8,
              message: "Password must be at least 8 characters long",
            },
          ]}
        >
          <Input
            prefix={<LockOutlined />}
            type="password"
            placeholder="Password is Required *"
          />
        </Form.Item>

        <Form.Item
          name="user_PhoneNumber"
          rules={[{ required: true, message: "Phone number is required" }]}
        >
          <Input prefix={<PhoneOutlined />} placeholder="Phone Number *" />
        </Form.Item>
        <Form.Item
          name="user_WhatsApp"
          rules={[{ required: true, message: "WhatsApp number is required" }]}
        >
          <Input prefix={<WhatsAppOutlined />} placeholder="WhatsApp Number*" />
        </Form.Item>

        <Form.Item
          name="user_Facebook"
          rules={[
            { required: true, message: "Facebook profile url is required" },
          ]}
        >
          <Input
            prefix={<FacebookOutlined />}
            placeholder="Facebook profile url*"
          />
        </Form.Item>

        <Form.Item name="user_Skype">
          <Input prefix={<SkypeOutlined />} placeholder="Skype profile url *" />
        </Form.Item>

        <Form.Item name="user_Telegram">
          <Input
            prefix={<FaTelegramPlane />}
            placeholder="Telegram Profile url *"
          />
        </Form.Item>

        <Form.Item
          className="w-full flex justify-center"
          name="user_Image"
          rules={[{ required: true, message: "Please Select Profile Image" }]}
        >
          <Upload
            className="md:min-w-96 min-w-72"
            customRequest={handleCustomRequest}
            listType="picture-card"
            fileList={fileList}
            onRemove={handleRemove}
          >
            {fileList.length === 0 && (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            )}
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            disabled={uploadingImage || customLoading}
          >
            {uploadingImage ? <Spin size="small" /> : "Submit"}
          </Button>
        </Form.Item>

        <p>
          Already have an account?
          <Link to="/login">
            <span className="text-green-600 ml-2">Sign in</span>
          </Link>
        </p>
      </Form>
    </div>
  );
};

export default SignUp;
