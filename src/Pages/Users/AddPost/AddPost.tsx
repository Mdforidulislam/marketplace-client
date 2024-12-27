import { CheckOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Select,
  Form,
  Space,
  Upload,
  Input,
  Spin,
  Tooltip,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";
import axios from "axios";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";
import { useAppDispatch, useAppSelector } from "../../../Redux/hooks/hooks";
import { useNavigate } from "react-router-dom";
import { addPost } from "../../../Redux/Features/addPost/addPostSlice";
import toast from "react-hot-toast";
import { RxCross2 } from "react-icons/rx";
import {
  addCategory,
  fetchCategories,
} from "../../../Redux/Features/Tabs/TabsSlice";

const { Option } = Select;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

const AddPost = () => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [form] = Form.useForm();
  const userId = localStorage.getItem("userId") || null;
  const { loading } = useAppSelector((state) => state.addPost);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { categories } = useAppSelector((state) => state.category);
  const [tabs, setTabs] = useState<{ id: number; name: string }[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [hasCategoryError, setHasCategoryError] = useState(false);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (categories?.length > 0 && tabs.length === 0) {
      const formattedTabs = categories.map((category, index) => ({
        id: index + 1,
        name: category.name,
      }));
      setTabs(formattedTabs);
    }
  }, [categories, tabs]);

  const handleAddCategory = () => {
    setIsAddingCategory(true);
  };

  const handleSaveCategory = () => {
    if (newCategory.trim()) {
      dispatch(addCategory(newCategory))
        .unwrap()
        .then(() => {
          setTabs((prevTabs) => [
            ...prevTabs,
            { id: prevTabs.length + 1, name: newCategory },
          ]);
          toast.success("Category added successfully!");
          setNewCategory("");
          setIsAddingCategory(false);
          setHasCategoryError(false); // Reset error state
        })
        .catch((error) => {
          console.error("Failed to add category:", error);
          toast.error(error || "Failed to add category!");
          setHasCategoryError(true);
        });
    } else {
      toast.error("Category cannot be empty!");
      setHasCategoryError(true);
    }
  };

  const handleCancelAddCategory = () => {
    // setNewCategory("");
    setIsAddingCategory(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen w-full">
        <Spin size="large" />
      </div>
    );
  }

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
    } finally {
      setUploadingImage(false);
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
    if (isAddingCategory && hasCategoryError) {
      setIsAddingCategory(false);
      toast.error(
        "Category already exists!\nPlease select a category from the dropdown menu.",
        { duration: 6000 }
      );
      return;
    }

    const postData = {
      post: {
        author_id: userId!,
        ...values,
      },
    };

    const response = await dispatch(addPost(postData));
    if (response.meta.requestStatus === "fulfilled") {
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
    <div className="max-w-[1240px] mx-auto">
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
        <Form.Item
          className="w-full flex justify-center"
          name="image"
          rules={[{ required: true, message: "Please Select Product Image" }]}
        >
          <Upload
            className="md:min-w-[400px] min-w-72"
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

        {/* Product Name */}
        <Form.Item
          className="w-full flex justify-center"
          name="productName"
          rules={[
            { required: true, message: "Please input your product name!" },
          ]}
        >
          <Input
            className="md:min-w-[400px] min-w-72"
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
            className="md:min-w-[400px] min-w-72"
            placeholder="Description"
            rows={4}
          />
        </Form.Item>

        {/* Category Selection */}
        <div className="md:min-w-[400px] min-w-72 flex justify-between gap-2">
          {isAddingCategory ? (
            <div className="w-full flex items-center justify-between gap-2 mb-6">
              <Form.Item
                className="w-full flex justify-start mb-0"
                rules={[
                  { required: true, message: "Please input a category!" },
                ]}
              >
                <Input
                  className="md:min-w-[300px]"
                  placeholder="New Category"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                />
              </Form.Item>
              <div className="flex justify-between items-start gap-2">
                <Tooltip title="save">
                  <Button
                    type="dashed"
                    shape="circle"
                    icon={<CheckOutlined />}
                    onClick={handleSaveCategory}
                  />
                </Tooltip>
                <Tooltip title="Cancel">
                  <Button
                    type="dashed"
                    shape="circle"
                    icon={<RxCross2 className="text-xl" />}
                    onClick={handleCancelAddCategory}
                  />
                </Tooltip>
              </div>
            </div>
          ) : (
            <>
              <Form.Item
                className="w-full flex justify-center"
                name="category"
                hasFeedback
                rules={[
                  { required: true, message: "Please select a category!" },
                ]}
              >
                <Select
                  className="md:min-w-[200px]"
                  placeholder="Select a category"
                >
                  {tabs.map((tab) => (
                    <Option
                      onClick={handleAddCategory}
                      key={tab.id}
                      value={tab.name}
                    >
                      {tab.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Button
                className="w-full"
                type="default"
                icon={<PlusOutlined />}
                onClick={handleAddCategory}
              >
                Add Category
              </Button>
            </>
          )}
        </div>

        <Form.Item className="w-full flex justify-start md:min-w-[400px] max-w-72">
          <Space>
            <Button
              type="primary"
              htmlType="submit"
              disabled={uploadingImage || loading}
            >
              {uploadingImage ? <Spin size="small" /> : "Submit"}
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
