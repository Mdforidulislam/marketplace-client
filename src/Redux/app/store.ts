import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../Features/User/authSlice";
import dataReducer from "../Features/Data/dataSlice";
import tabReducer from "../Features/Tabs/SelectedtabSlice";
import registerReducer from "../Features/User/RegisterSlice";
import addPostReducer from "../Features/addPost/addPostSlice";
import reviewReducer from "../Features/DetailPage/Review";
import detailPageReducer from "../Features/DetailPage/DetailPageSlice";
import categoryReducer from "../Features/Tabs/TabsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    data: dataReducer,
    tab: tabReducer,
    register: registerReducer,
    addPost: addPostReducer,
    reviews: reviewReducer,
    detailPage: detailPageReducer,
    category: categoryReducer,
  },
  middleware: (getdefaultMiddleware) => getdefaultMiddleware(),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
