import { createAction, createReducer } from "redux-act";

export const setSite: any = createAction("site - set");

export interface ISite {
  name: string;
  description: string;
  status: "pending_setup" | "active";
  logoLocation: string;
}

const defaultState: ISite = {
  name: "",
  description: "",
  status: "pending_setup",
  logoLocation: "",
};

export const siteReducer = createReducer({
  [setSite]: (state: any, payload: ISite) => {
    return {
      ...state,
      site: payload,
    };
  },
}, defaultState);