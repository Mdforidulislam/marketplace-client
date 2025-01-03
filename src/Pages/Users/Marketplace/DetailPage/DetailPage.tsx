import { useEffect, useState } from "react";
import {
  Alert,
  Avatar,
  Badge,
  Button,
  ConfigProvider,
  Form,
  Rate,
  Space,
  Spin,
  Tooltip,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import { Link, useParams } from "react-router-dom";
import { fetchData } from "../../../../Redux/Features/Data/dataSlice";
import { useAppDispatch, useAppSelector } from "../../../../Redux/hooks/hooks";
import { AiOutlineLike } from "react-icons/ai";
import { addOrUpdateReview } from "../../../../Redux/Features/DetailPage/Review";
import axios from "axios";
import { fetchPostDetails } from "../../../../Redux/Features/DetailPage/DetailPageSlice";
import { refreshAccessToken } from "../../../../Redux/Features/User/authSlice";
import { IoCheckmarkDoneCircleSharp } from "react-icons/io5";
import { BiDollar } from "react-icons/bi";
import { MailOutlined } from "@ant-design/icons";
import { createStyles } from "antd-style";
const apiBaseUrl = import.meta.env.VITE_LOCAL_BASE_URLL;
const useStyle = createStyles(({ prefixCls, css }) => ({
  linearGradientButton: css`
    &.${prefixCls}-btn-primary:not([disabled]):not(
        .${prefixCls}-btn-dangerous
      ) {
      > span {
        position: relative;
      }

      &::before {
        content: "";
        background: linear-gradient(135deg, #6253e1, #04befe);
        position: absolute;
        inset: -1px;
        opacity: 1;
        transition: all 0.3s;
        border-radius: inherit;
      }

      &:hover::before {
        opacity: 0;
      }
    }
  `,
}));

const DetailPage = () => {
  const { styles } = useStyle();
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const userId = localStorage.getItem("userId") || null;
  const { items, loading, error } = useAppSelector((state) => state.data);
  const { loading: reviewsLoading, error: reviewsError } = useAppSelector(
    (state) => state.reviews
  );
  const { postData, userData } = useAppSelector((state) => state.detailPage);
  const [likeLoading, setLikeLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  console.log("postData", postData);

  const item = items.find((item) => item._id === id);
  console.log("item", item?.likes);

  useEffect(() => {
    dispatch(refreshAccessToken());
  }, [dispatch]);

  useEffect(() => {
    if (!item) return;
    const userLikeData = item.likes.find(
      (like: { user_Id: string }) => like.user_Id === userId
    );

    if (userLikeData) {
      setIsLiked(userLikeData.isLiked);
    } else {
      setIsLiked(false);
    }
  }, [id, userId, item]);

  const handleLike = async () => {
    setLikeLoading(true);

    try {
      const newLikeState = !isLiked;
      await axios.put(`${apiBaseUrl}/like-post`, {
        post: {
          postId: id,
          user_Id: userId,
          isLiked: newLikeState.toString(),
        },
      });

      setIsLiked(newLikeState);
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
    );
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
      dispatch(fetchData());
    } catch (error) {
      console.error("Failed to add/update review: ", error);
    }
  };

  return (
    <div className="max-w-[1240px] mx-auto px-1 pt-16">
      <div className="flex flex-col md:flex-row md:gap-10 md:p-4 p-1 mb-6">
        <div className="flex-1 max-h-96 max-w-96 overflow-hidden bg-[#F5F5F5]">
          <img
            src={postData?.image}
            alt={postData?.productName}
            className="w-full h-full object-contain"
          />
        </div>

        <div className="flex-1 flex flex-col gap-3 justify-center items-start md:mt-0 mt-6">
          <div className="flex items-center justify-center gap-2">
            <Badge
              size="default"
              count={
                userData?.user_varified ? (
                  <IoCheckmarkDoneCircleSharp style={{ color: "#5CBA5C" }} />
                ) : null
              }
            >
              <Avatar shape="circle" src={userData?.user_Image} size="large" />
            </Badge>
            <Button
              className={`${
                userData?.user_varified
                  ? "text-[#5CBA5C] bg-[#E1F1E1]"
                  : "text-[#319bed] bg-[#E6F4FF]"
              } font-medium border-none pointer-events-none`}
              variant="filled"
            >
              {userData?.user_varified ? "Verified" : "Not Verified"}
            </Button>
          </div>
          <Button
            className="pointer-events-none font-medium"
            color="primary"
            variant="filled"
          >
            {item.category}
          </Button>
          <h1 className="text-4xl font-bold">{postData?.productName}</h1>
          <div className="flex justify-center items-center gap-2">
            <div className="text-base font-bold">Price: </div>
            <div className="text-green-600 font-bold text-base flex justify-center items-center">
              {postData?.productPrice ? postData?.productPrice : 0} <BiDollar />
            </div>
          </div>
          <p className="text-base text-gray-700">{postData?.description}</p>
          <div className="flex justify-center items-center gap-4">
            <ConfigProvider
              button={{
                className: styles.linearGradientButton,
              }}
            >
              <Link to={`/contact/${id}`} className="w-full">
                <Space>
                  <Button type="primary" size="large" icon={<MailOutlined />}>
                    Contact
                  </Button>
                </Space>
              </Link>
            </ConfigProvider>
            {likeLoading ? (
              <Spin size="small" />
            ) : isLiked ? (
              <Tooltip title="Unlike">
                <Button
                  className="text-xl font-bold"
                  type="primary"
                  shape="circle"
                  icon={<AiOutlineLike />}
                  onClick={handleLike}
                />
              </Tooltip>
            ) : (
              <Tooltip title="Like">
                <Button
                  className="text-xl font-bold"
                  type="default"
                  shape="circle"
                  icon={<AiOutlineLike />}
                  onClick={handleLike}
                />
              </Tooltip>
            )}
            <Badge
              className="site-badge-count-109"
              count={postData?.likesCount ? postData?.likesCount : 0}
              style={{ backgroundColor: "#52c41a" }}
            />
          </div>
        </div>
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
