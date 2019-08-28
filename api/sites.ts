import { makeCall } from "./client";

export class SiteAPI {

  /**
   * Gets the site info. The apiSecret may be passed into the options if desired
   * @param options 
   */
  public getSiteInfo(options?: any): Promise<any> {
    return makeCall("get", "admin/site", {}, options);
  }

  /**
   * Sets up a site the first time. All fields are required.
   * @param firstName 
   * @param lastName 
   * @param email 
   * @param username 
   * @param password 
   * @param siteName 
   * @param siteDescription 
   * @param secretKey 
   */
  public setupSite(firstName: string, lastName: string, email: string, username: string, password: string, siteName: string, siteDescription: string, secretKey: string): Promise<any> {
    const data = {
      firstName,
      lastName,
      email,
      username,
      password,
      name: siteName,
      description: siteDescription
    };
    const options = {
      apiSecret: secretKey
    };
    return makeCall("post", "admin/site", data, options);
  }
}