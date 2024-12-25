import  { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Descriptions,
  DescriptionsProps,
  Form,
  Input,
  Rate,
  Spin,
  Tooltip,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import { useParams } from "react-router-dom";
import { fetchData } from "../../../../Redux/Features/Data/dataSlice";
import { useAppDispatch, useAppSelector } from "../../../../Redux/hooks/hooks";
import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai";

const DetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((state) => state.data);

  const [isLiked, setIsLiked] = useState(false); // State for like button
  const [isDisliked, setIsDisliked] = useState(false); // State for dislike button

  useEffect(() => {
    dispatch(fetchData());
  }, [dispatch]);

  const item = items.find((item) => item.id === Number(id));

  if (loading) {
    return <div className="min-h-screen w-full flex justify-center items-center"><Spin size="large" /></div>;
  }

  if (!item) {
    return <div>Item not found</div>;
  }

  if (error) return <Alert message={error} type="error" showIcon />;

  const handleLike = async () => {
    if (isLiked) {
      setIsLiked(false);
      try {
        await fetch(`/api/unlike/${id}`, { method: "POST" });
      } catch (error) {
        console.error("Failed to remove like:", error);
      }
    } else {
      setIsLiked(true); 
      setIsDisliked(false);
      try {
        await fetch(`/api/like/${id}`, { method: "POST" });
      } catch (error) {
        console.error("Failed to like the item:", error);
      }
    }
  };

  const handleDislike = async () => {
    if (isDisliked) {
      setIsDisliked(false); 
      try {
        await fetch(`/api/undislike/${id}`, { method: "POST" }); 
      } catch (error) {
        console.error("Failed to remove dislike:", error);
      }
    } else {
      setIsDisliked(true); 
      setIsLiked(false); 
      try {
        await fetch(`/api/dislike/${id}`, { method: "POST" });
      } catch (error) {
        console.error("Failed to dislike the item:", error);
      }
    }
  };

  const onFinish = (values: unknown) => {
    console.log("Form submitted with values: ", values);
  };

  const descriptionItems: DescriptionsProps["items"] = [
    {
      label: "Uploader",
      children: item.uploaderName,
    },
    {
      label: "Phone",
      children: item.phone,
    },
    {
      label: "Address",
      children: item.address,
    },
    {
      label: "Facebook",
      children: (
        <a
          href={item.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 w-1/4"
        >
          Link
        </a>
      ),
    },
    {
      label: "Telegram",
      children: (
        <a
          href={item.telegram}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 w-1/4"
        >
          Link
        </a>
      ),
    },
    {
      label: "WhatsApp",
      children: (
        <a
          href={`https://wa.me/${item.whatsApp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 w-1/4"
        >
          Link
        </a>
      ),
    },
    {
      label: "Likes",
      children: item.like,
    },
    {
      label: "Unlikes",
      children: item.unlike,
    },
  ];

  return (
    <div className="max-w-maxWidth mx-auto px-1 pt-10">
      <div className="flex flex-col md:flex-row md:p-4 p-1 mb-6">
        <div className="flex-1 max-h-96 max-w-96 overflow-hidden">
          <img
            src={item.image}
            alt={item.productName}
            className="w-full h-full object-contain"
          />
        </div>

        <div className="flex-1 flex flex-col gap-2 justify-center items-start md:mt-0 mt-6">
          <Button
            className="pointer-events-none font-medium"
            color="primary"
            variant="filled"
          >
            {item.category}
          </Button>
          <h1 className="text-4xl font-bold mb-2">{item.productName}</h1>
          <p className="text-base text-gray-700">{item.description}</p>
          <div className="flex justify-center items-center gap-2 mt-4">
            <Tooltip title="Like">
              <Button
                className="text-xl font-bold"
                type={isLiked ? "primary" : "default"} 
                shape="circle"
                icon={<AiOutlineLike />}
                onClick={handleLike}
              />
            </Tooltip>
            <Tooltip title="Dislike">
              <Button
                className="text-xl font-bold"
                type={isDisliked ? "primary" : "default"}
                shape="circle"
                icon={<AiOutlineDislike />}
                onClick={handleDislike}
              />
            </Tooltip>
          </div>
        </div>
      </div>

      <div className="pr-1 mb-6">
        <h1 className="text-2xl font-bold text-black/70 my-6">
          Service provider information :
        </h1>
        <Descriptions bordered items={descriptionItems} />
      </div>

      <div className="pr-1 mb-20">
        <h1 className="text-2xl font-bold text-black/70 my-6">Reviews :</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {item?.reviews.map((review, index) => (
            <div key={index} className="p-4 border rounded-md">
              <div className="font-semibold mb-1">{review.userName}</div>
              <Form.Item label="Rate">
                <Rate className="pointer-events-none" value={review?.rating} />
              </Form.Item>
              <div className="-mt-7">{review.description}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="pr-1 mb-20 max-w-96">
        <h1 className="text-2xl font-bold text-black/70 my-6 pl-1">Add a Review :</h1>
        <Form
          layout="vertical"
          onFinish={onFinish}
          className="space-y-4 border font-medium rounded-md py-4 md:px-4 px-1"
        >
          <Form.Item
            label="Rating"
            name="rating"
            rules={[{ required: true, message: "Please choose stars" }]}
          >
            <Rate />
          </Form.Item>
          <Form.Item
            label="Your Name"
            name="userName"
            rules={[{ required: true, message: "Please enter your name" }]}
          >
            <Input placeholder="Enter your name" />
          </Form.Item>

          <Form.Item
            label="Review Description"
            name="description"
            rules={[{ required: true, message: "Please enter a review" }]}
          >
            <TextArea rows={4} placeholder="Enter your review here" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit Review
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default DetailPage;
