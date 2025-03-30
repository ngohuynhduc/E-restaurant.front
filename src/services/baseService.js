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
      const response = await fetch(`${this.baseURL}${endpoint}`, options);
      const data = await response.json();
      console.log("🚀 ~ BaseService ~ request ~ data:", data);
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
