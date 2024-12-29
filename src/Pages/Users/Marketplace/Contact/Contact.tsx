import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../Redux/hooks/hooks";
import { useEffect, useState } from "react";
import { fetchPostDetails } from "../../../../Redux/Features/DetailPage/DetailPageSlice";
import { RootState } from "../../../../Redux/app/store";
import { Button, Form, Input } from "antd";
import { MdOutlineSubtitles } from "react-icons/md";
import TextArea from "antd/es/input/TextArea";

const Contact = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const { userData } = useAppSelector((state) => state.detailPage);
  const { userEmail } = useAppSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(false);

  const postId = id!;

  useEffect(() => {
    dispatch(fetchPostDetails(postId));
  }, [dispatch, postId]);

  const onFinish = async (values: {
    subject: string;
    message: string;
    userEmail: string;
    userDataEmail: string;
  }) => {
    const mail = {
      ...values,
      from: userEmail, 
      to: userData?.user_Email, 
    };

    console.log("mail object:", mail);
    setLoading(true);

    try {
      // Simulating an API call or processing logic
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Message sent successfully");
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
        <h2 className="font-bold text-2xl" style={{ textAlign: "center", marginBottom: "1.5rem" }}>
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
          name="message"
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
