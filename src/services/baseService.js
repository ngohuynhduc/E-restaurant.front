export class BaseService {
  static baseURL = process.env.NEXT_PUBLIC_API_URL;

  static async request(endpoint, method = "GET", body = null, headers = {}) {
    const options = {
      method,
      headers,
    };
    console.log("🚀 ~ BaseService ~ request ~ options:", options);

    if (body) {
      options.body = JSON.stringify(body);
    }

    try {
      console.log("🚀 ~ BaseService ~ request ~ data:", endpoint);
      const response = await fetch(`${this.baseURL}${endpoint}`, options);
      console.log("🚀 ~ BaseService ~ request ~ response:", response);
      const data = await response.json();
      if (!response.ok) {
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

  static delete(endpoint, headers = {}) {
    return this.request(endpoint, "DELETE", null, headers);
  }
}
