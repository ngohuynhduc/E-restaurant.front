class BaseService {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async request(endpoint, method = "GET", body = null, headers = {}) {
    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, options);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  get(endpoint, headers = {}) {
    return this.request(endpoint, "GET", null, headers);
  }

  post(endpoint, data, headers = {}) {
    return this.request(endpoint, "POST", data, headers);
  }

  put(endpoint, data, headers = {}) {
    return this.request(endpoint, "PUT", data, headers);
  }

  delete(endpoint, headers = {}) {
    return this.request(endpoint, "DELETE", null, headers);
  }
}

export default new Service(process.env.NEXT_PUBLIC_API_URL);
