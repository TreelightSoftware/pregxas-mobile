import { makeCall } from "./client";

export class UserAPI {
  /**
   * Attempts to login a user
   * @param username 
   * @param password 
   */
  public loginUser(email: string, password: string): Promise<any> {
    return makeCall("post", "users/login", {email, password});
  }
}