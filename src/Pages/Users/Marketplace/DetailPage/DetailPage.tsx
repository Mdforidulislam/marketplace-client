import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Descriptions,
  DescriptionsProps,
  Form,
  Rate,
  Spin,
  Tooltip,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import { useParams } from "react-router-dom";
import { fetchData } from "../../../../Redux/Features/Data/dataSlice";
import { useAppDispatch, useAppSelector } from "../../../../Redux/hooks/hooks";
import { AiOutlineLike } from "react-icons/ai";
import { addOrUpdateReview } from "../../../../Redux/Features/DetailPage/Review";
import axios from "axios";
import { fetchPostDetails } from "../../../../Redux/Features/DetailPage/DetailPageSlice";

const DetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((state) => state.data);
  const { loading: reviewsLoading, error: reviewsError } = useAppSelector(
    (state) => state.reviews
  );
  // loading: detailsLoading, error: detailsError
  const { postData, userData } = useAppSelector((state) => state.detailPage);
  // console.log("Post Data: ", postData);
  // console.log("User Data: ", userData);

  const [likeLoading, setLikeLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);

  const userId = localStorage.getItem("userId") || null;
  const item = items.find((item) => item._id === id);
  console.log(item);

  // This useEffect is to handle like
  useEffect(() => {
    if (!item) return;
    const userLikeData = item.likes.find(
      (like: { user_Id: string }) => like.user_Id === userId
    );
    // console.log("userLikeData: ", userLikeData);
    if (userLikeData) {
      setIsLiked(userLikeData.isLiked);
      setIsDisliked(!userLikeData.isLiked);
    } else {
      setIsLiked(false);
      setIsDisliked(false);
    }
  }, [id, userId, item]);

  // Handle Like/Unlike Action
  const handleLike = async () => {
    setLikeLoading(true);

    try {
      const newLikeState = !isLiked;
      const res = await axios.put("https://server.megaproxy.us/api/v1/like-post", {
        post: {
          postId: id,
          user_Id: userId,
          isLiked: newLikeState.toString(),
        },
      });

      const userLikeData = res.data.data.data.likes.find(
        (user: { user_Id: string }) => user.user_Id === userId
      );
      // console.log("on clicking like: ", userLikeData);
      if (userLikeData) {
        setIsLiked(userLikeData.isLiked);
        setIsDisliked(!userLikeData.isLiked);
      }
    } catch (error) {
      console.error("Failed to like/unlike the post:", error);
    } finally {
      setLikeLoading(false);
    }
  };

  const postId = id!;
  useEffect(() => {
    dispatch(fetchData());
    dispatch(fetchPostDetails(postId));
  }, [dispatch, postId]);

  if (loading || reviewsLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen w-full">
        <Spin size="large" />
      </div>
    )
  }

  if (!item) {
    return <div>Item not found</div>;
  }

  if (error) {
    return <Alert message={error} type="error" />;
  }

  if (reviewsError) {
    return <Alert message={reviewsError} type="error" />;
  }

  const onFinish = async (values: { rating: number; description: string }) => {
    const { rating, description } = values;

    const review = {
      post: {
        postId: id!,
        userId: userId!,
        user_Name: userData?.user_Name || "",
        rating,
        description,
      },
    };

    console.log("Form submitted with values: ", review);
    try {
      const result = await dispatch(addOrUpdateReview(review)).unwrap();
      console.log("Review added/updated successfully: ", result);
    } catch (error) {
      console.error("Failed to add/update review: ", error);
    }
  };

  const descriptionItems: DescriptionsProps["items"] = [
    {
      label: "Provider",
      children: userData?.user_Name,
    },
    {
      label: "Phone",
      children: userData?.user_PhoneNumber,
    },
    {
      label: "Address",
      children: userData?.user_Address,
    },
    {
      label: "Facebook",
      children: (
        <a
          href={userData?.user_Facebook}
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
          href={userData?.user_Telegram}
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
          href={`https://wa.me/${userData?.user_WhatsApp}`}
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
      children: postData?.likesCount,
    },
  ];

  return (
    <div className="max-w-[1240px] mx-auto px-1 pt-16">
      <div className="flex flex-col md:flex-row md:gap-10 md:p-4 p-1 mb-6">
        <div className="flex-1 max-h-96 max-w-96 overflow-hidden">
          <img
            src={postData?.image}
            alt={postData?.productName}
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
          <h1 className="text-4xl font-bold mb-2">{postData?.productName}</h1>
          <p className="text-base text-gray-700">{postData?.description}</p>
          <div className="flex justify-center items-center gap-2 mt-4">
            {likeLoading ? (
              <Spin size="small" />
            ) : isLiked ? (
              <Tooltip title="Unlike">
                <Button
                  className="text-xl font-bold"
                  type="primary"
                  shape="circle"
                  icon={<AiOutlineLike />}
                  onClick={handleLike} // Toggle like state
                />
              </Tooltip>
            ) : isDisliked ? (
              <Tooltip title="Like">
                <Button
                  className="text-xl font-bold"
                  type="default"
                  shape="circle"
                  icon={<AiOutlineLike />}
                  onClick={handleLike} // Toggle like state
                />
              </Tooltip>
            ) : (
              <Tooltip title="Like">
                <Button
                  className="text-xl font-bold"
                  type="default"
                  shape="circle"
                  icon={<AiOutlineLike />}
                  onClick={handleLike} // Toggle like state
                />
              </Tooltip>
            )}
          </div>
        </div>
      </div>

      <div className="pr-1 mb-6">
        <h1 className="text-2xl font-bold text-black/70 my-6">
          Service provider information :
        </h1>
        <Descriptions
          className="tableData tracking-wide"
          bordered
          items={descriptionItems}
        />
      </div>

      <div className="pr-1 mb-20">
        <h1 className="text-2xl font-bold text-black/70 my-6">Reviews :</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {item?.reviews.map((review, index) => (
            <div key={index} className="p-4 border rounded-md">
              <div className="font-semibold text-base mb-1">
                {review.userName}
              </div>
              <Form.Item className="font-bold text-base" label="Rate">
                <Rate className="pointer-events-none" value={review?.rating} />
              </Form.Item>
              <div className="font-medium text-black/60 text-base -mt-7">
                {review.description}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pr-1 mb-20 max-w-96">
        <h1 className="text-2xl font-bold text-black/70 my-6 pl-1">
          Add a Review :
        </h1>
        <Form
          layout="vertical"
          onFinish={onFinish}
          className="space-y-4 border font-medium text-black/60 text-base rounded-md py-4 md:px-4 px-1"
        >
          <Form.Item
            className="font-medium text-black/60 text-base"
            label="Rating"
            name="rating"
            rules={[{ required: true, message: "Please choose stars" }]}
          >
            <Rate />
          </Form.Item>

          <Form.Item
            label="Review Description"
            name="description"
            className="font-medium text-black/60 text-lg"
            rules={[{ required: true, message: "Please enter a review" }]}
          >
            <TextArea rows={4} placeholder="Enter your review here" />
          </Form.Item>

          <Form.Item>
            <Button loading={reviewsLoading} type="primary" htmlType="submit">
              Submit Review
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default DetailPage;
