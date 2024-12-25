import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../Redux/hooks/hooks";
import { fetchData } from "../../../Redux/Features/Data/dataSlice";


const Home = () => {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((state) => state.data); 

  useEffect(() => {
    dispatch(fetchData());
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <div key={item.id} className="border p-4 rounded-lg shadow-md">
          <img
            src={item.image}
            alt="data"
            className="w-full h-48 object-cover rounded-t-lg"
          />
          <p className="text-xl font-semibold mt-2">{item.description}</p>
          <div className="flex justify-between mt-4">
            <span>Likes: {item.like}</span>
            <span>Unlikes: {item.unlike}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Home;
