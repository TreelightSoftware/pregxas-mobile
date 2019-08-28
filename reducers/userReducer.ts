import { createAction, createReducer } from "redux-act";

export const loginUser: any = createAction("login");
export const logoutUser: any = createAction("logout");

export interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  created: string;
  status: "pending" | "verified";
  username: string;
  updated:string;
  lastLogin: string;
  jwt: string; 
  platformRole: "member" | "admin";
}

/**
 * The expected payload after logging in
 */
export interface IUserLoginPayload {
  loggedIn: boolean;
  user: IUser | {};
}

const defaultState: IUserLoginPayload = {
  loggedIn: false, 
  user: {}
};

export const userReducer = createReducer({
  [loginUser]: (state: any, payload: IUserLoginPayload) => {
    return {
      ...state, 
      loggedIn: payload.loggedIn,
      user: payload.user,
    };
  },
  [logoutUser]: (state) => {
    return {
      ...state, 
      loggedIn: false,
      user: {},
    };
  },
}, defaultState);