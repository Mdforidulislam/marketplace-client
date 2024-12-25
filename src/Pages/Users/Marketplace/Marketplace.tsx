import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../Redux/hooks/hooks";
import { fetchData } from "../../../Redux/Features/Data/dataSlice";
import { Alert, Card, Empty, Spin } from "antd";
import Meta from "antd/es/card/Meta";
import { Link } from "react-router-dom";

const Marketplace = () => {
  const dispatch = useAppDispatch();
  const { selectedTab } = useAppSelector((state) => state.tab);
  const { items, loading, error } = useAppSelector((state) => state.data);
  console.log(items ,'check the item data');
  console.log(selectedTab);

  useEffect(() => {
    dispatch(fetchData());
  }, [dispatch]);

  if (loading) {
    return <div className="min-h-screen w-full flex justify-center items-center"><Spin size="large" /></div>;
  }

  if (error) return <Alert message={error} type="error" showIcon />;
  const filteredItems =
    selectedTab && selectedTab !== "All"
      ? items.filter((item) => item.category === selectedTab)
      : items;

  console.log(filteredItems);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-20">
      {filteredItems.length > 0 ? (
        filteredItems.map((item) => (
          <Card
            key={item.id}
            className="border border-blue-400/20"
            hoverable
            cover={
              <img
                className="max-h-[300px] object-cover"
                alt={item?.image}
                src={item?.image}
              />
            }
          >
            <div className="flex flex-col gap-4 justify-between items-start">
              <Link
                to={`details/${item?.id}`}
                className="flex justify-center gap-2 items-center mx-auto shadow-lg text-blue-600 text-lg bg-blue-50 backdrop-blur-md lg:font-semibold isolation-auto border-blue-50 before:absolute before:w-full before:transition-all before:duration-600 before:hover:w-full before:-left-full before:hover:left-0 before:rounded-full before:bg-blue-500 hover:text-gray-50 before:-z-10 before:aspect-square before:hover:scale-150 before:hover:duration-600 relative z-10 px-4 py-2 overflow-hidden border-2 rounded-full group"
              >
                View Details
                <svg
                  className="w-8 h-8 justify-end group-hover:rotate-90 group-hover:bg-gray-50 text-blue-600 ease-linear duration-300 rounded-full border border-blue-600 group-hover:border-none p-2 rotate-45"
                  viewBox="0 0 16 19"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7 18C7 18.5523 7.44772 19 8 19C8.55228 19 9 18.5523 9 18H7ZM8.70711 0.292893C8.31658 -0.0976311 7.68342 -0.0976311 7.29289 0.292893L0.928932 6.65685C0.538408 7.04738 0.538408 7.68054 0.928932 8.07107C1.31946 8.46159 1.95262 8.46159 2.34315 8.07107L8 2.41421L13.6569 8.07107C14.0474 8.46159 14.6805 8.46159 15.0711 8.07107C15.4616 7.68054 15.4616 7.04738 15.0711 6.65685L8.70711 0.292893ZM9 18L9 1H7L7 18H9Z"
                    className="fill-blue-800 group-hover:fill-blue-800"
                  ></path>
                </svg>
              </Link>
              <Meta
                className="h-auto md:h-20 "
                title={item?.productName}
                description={item?.description}
              />
              <div className="flex flex-col w-full md:flex-row justify-start items-start md:justify-between mt-4 gap-4">
                <span className="flex justify-center items-center gap-1">
                  <Meta className="font-bold" description="Likes:" />{" "}
                  <Meta className="font-bold" description={item?.like} />
                </span>
                <span className="flex justify-center items-center gap-1">
                  <Meta className="font-bold" description="Unlikes:" />{" "}
                  <Meta className="font-bold" description={item?.unlike} />
                </span>
              </div>
            </div>
          </Card>
        ))
      ) : (
        <Empty description="No items available" className="col-span-full" />
      )}
    </div>
  );
};

export default Marketplace;
