import { PlusOutlined } from "@ant-design/icons";
import { Button, Select, Form, Space, Upload, Input, Spin } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";
import axios from "axios";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";
import { useAppDispatch, useAppSelector } from "../../../Redux/hooks/hooks";
import { useNavigate } from "react-router-dom";
import { addPost } from "../../../Redux/Features/addPost/addPostSlice";
import toast from "react-hot-toast";

const { Option } = Select;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

const AddPost = () => {
  const [tabs, setTabs] = useState<{ id: number; name: string }[]>([]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [form] = Form.useForm();
  const { userId } = useAppSelector((state) => state.auth);
  const { loading, success } = useAppSelector((state) => state.addPost);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("User ID:", userId);
  }, [userId]);

  useEffect(() => {
    const fetchTabs = async () => {
      try {
        const response = await fetch("/tabs.json");
        const data = await response.json();
        setTabs(data);
      } catch (error) {
        console.error("Error fetching tabs:", error);
      }
    };
    fetchTabs();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen w-full flex justify-center items-center">
        <Spin size="large" />
      </div>
    );
  }

  const handleCustomRequest: UploadProps["customRequest"] = async ({
    file,
    onSuccess,
    onError,
  }) => {
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

      form.setFieldsValue({ image: imgURL });

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
    }
  };

  const handleRemove = () => {
    form.setFieldsValue({ image: null });
    setFileList([]);
  };

  interface FormValues {
    productName: string;
    description: string;
    category: string;
    image: string;
  }
  const onFinish = async (values: FormValues) => {
    const postData = {
      post: {
        author_id: userId || "",
        ...values,
      },
    };
    console.log("postData: ", postData);

    await dispatch(addPost(postData));
    if (success) {
      toast.success("Successfully Posted!");
      navigate("/user");
    } else {
      toast.error("Something went wrong!");
    }
  };

  const handleReset = () => {
    form.resetFields();
    setFileList([]);
  };

  return (
    <div className="max-w-maxWidth mx-auto">
      <h1 className="my-10 text-4xl md:text-6xl text-center font-bold">
        Post Product
      </h1>
      <Form
        form={form}
        name="validate_other"
        {...formItemLayout}
        onFinish={onFinish}
        initialValues={{
          "input-number": 3,
          "checkbox-group": ["A", "B"],
          rate: 3.5,
          "color-picker": null,
        }}
        className="max-w-[800px] flex flex-col items-center md:min-w-[800px]"
      >
        {/* Product Name */}
        <Form.Item
          className="w-full flex justify-center"
          name="productName"
          rules={[
            { required: true, message: "Please input your product name!" },
          ]}
        >
          <Input
            className="md:min-w-[500px] min-w-72"
            placeholder="Product Name"
          />
        </Form.Item>

        {/* Product Description */}
        <Form.Item
          className="w-full flex justify-center"
          name="description"
          rules={[{ required: true, message: "Please Provide Description" }]}
        >
          <TextArea
            className="md:min-w-[500px] min-w-72"
            placeholder="Description"
            rows={4}
          />
        </Form.Item>

        {/* Category Selection */}
        <Form.Item
          className="w-full flex justify-center"
          name="category"
          hasFeedback
          rules={[{ required: true, message: "Please select your category!" }]}
        >
          <Select
            className="md:min-w-[500px] min-w-72"
            placeholder="Please select a category"
          >
            {tabs.map((tab) => (
              <Option key={tab.id} value={tab.name}>
                {tab.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          className="w-full flex justify-center"
          name="image"
          rules={[{ required: true, message: "Please Select Product Image" }]}
        >
          <Upload
            className="md:min-w-[500px] min-w-72"
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

        <Form.Item className="w-full flex justify-start md:min-w-[500px] max-w-72">
          <Space>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
            <Button htmlType="button" onClick={handleReset}>
              Reset
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddPost;
