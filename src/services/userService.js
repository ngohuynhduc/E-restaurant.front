import { getServerSession } from "next-auth";
import { BaseService } from "./baseService";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export class UserService {
  async buildAuthHeader() {
    const session = await getServerSession(authOptions);
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.accessToken}`,
    };
  }

  async getUserInfo() {
    const headers = await this.buildAuthHeader();
    const response = await BaseService.get("/user-info", headers);
    return response;
  }

  async updateUserInfo(body) {
    const headers = await this.buildAuthHeader();
    const response = await BaseService.put("/user-info", body, headers);
    return response;
  }

  async getCanReview(restaurantId) {
    const headers = await this.buildAuthHeader();
    const response = await BaseService.get(`/can-review?restaurantId=${restaurantId}`, headers);
    return response;
  }

  async writeReview(body) {
    const headers = await this.buildAuthHeader();
    const response = await BaseService.post("/review", body, headers);
    return response;
  }
}
