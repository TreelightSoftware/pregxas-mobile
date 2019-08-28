import { combineReducers } from "redux";

import { userReducer } from "./userReducer";
import { siteReducer } from "./siteReducer";

const reducers = combineReducers({
  userState: userReducer,
  siteState: siteReducer,
} as any);

export default reducers;