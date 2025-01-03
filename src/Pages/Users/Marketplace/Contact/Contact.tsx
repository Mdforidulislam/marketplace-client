import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../Redux/hooks/hooks";
import { useEffect, useState } from "react";
import { fetchPostDetails } from "../../../../Redux/Features/DetailPage/DetailPageSlice";
import { RootState } from "../../../../Redux/app/store";
import { Button, Form, Input, message } from "antd";
import { MdOutlineSubtitles } from "react-icons/md";
import TextArea from "antd/es/input/TextArea";
import axios from "axios";

const Contact = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const { userData } = useAppSelector((state) => state.detailPage);
  const { userEmail } = useAppSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(false);
  const apiBaseUrl = import.meta.env.VITE_LOCAL_BASE_URLL;
  const postId = id!;
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(fetchPostDetails(postId));
  }, [dispatch, postId]);

  const onFinish = async (values: { subject: string; text: string }) => {
    const emailInfo = {
      send_email: userEmail,
      receive_email: userData?.user_Email,
      subject: values.subject,
      text: values.text,
    };

    setLoading(true);

    try {
      const response = await axios.post(`${apiBaseUrl}/send-email`, {
        emailInfo,
      });

      console.log("Email response:", response.data);
      if (response.status === 200) {
        message.success("Message sent successfully");
        navigate(`/details/${postId}`);
      } else {
        message.error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        padding: "2rem",
      }}
    >
      <Form
        onFinish={onFinish}
        name="contact-form"
        style={{
          width: "100%",
          backgroundColor: "white",
          padding: "1.5rem",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
        className="min-w-[300px] md:min-w-[450px] "
      >
        <h2
          className="font-bold text-2xl"
          style={{ textAlign: "center", marginBottom: "1.5rem" }}
        >
          Contact Form
        </h2>

        <Form.Item
          name="subject"
          rules={[
            {
              required: true,
              message: "Subject is required",
            },
          ]}
        >
          <Input prefix={<MdOutlineSubtitles />} placeholder="Subject" />
        </Form.Item>

        <Form.Item
          name="text"
          rules={[{ required: true, message: "Message is required" }]}
        >
          <TextArea placeholder="Your message..." rows={4} />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            style={{ width: "100%" }}
            loading={loading}
          >
            Contact
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Contact;
