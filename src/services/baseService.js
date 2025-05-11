import { ErrorsStatus } from "@/app/shared/errorsStatus";

export class BaseService {
  static baseURL = process.env.NEXT_PUBLIC_API_URL;

  static async request(endpoint, method = "GET", body = null, headers = {}) {
    const options = {
      method,
      headers,
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, options);
      const data = await response.json();
      console.log("🚀 ~ BaseService ~ request ~ data:", `${this.baseURL}${endpoint}`, data);
      if (!response.ok) {
        if (data?.status === ErrorsStatus.Unauthorized && data?.message === "Token expired") {
          throw new Error(data?.message);
        }
        throw new Error(data.status || "Something went wrong");
      }
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  static get(endpoint, headers = {}) {
    return this.request(endpoint, "GET", null, headers);
  }

  static post(endpoint, data, headers = {}) {
    return this.request(endpoint, "POST", data, headers);
  }

  static put(endpoint, data, headers = {}) {
    return this.request(endpoint, "PUT", data, headers);
  }

  static patch(endpoint, data, headers = {}) {
    return this.request(endpoint, "PATCH", data, headers);
  }

  static delete(endpoint, headers = {}) {
    return this.request(endpoint, "DELETE", null, headers);
  }
}
