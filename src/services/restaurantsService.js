import { getServerSession } from "next-auth";
import { BaseService } from "./baseService";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export class RestaurantService {
  async buildAuthHeader() {
    const session = await getServerSession(authOptions);
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.accessToken}`,
    };
  }

  async buildHeader() {
    return {
      "Content-Type": "application/json",
    };
  }

  async getCategories() {
    const headers = await this.buildHeader();
    const response = await BaseService.get("/restaurant/categories", headers);
    return response;
  }

  async getNewestRestaurant() {
    const headers = await this.buildHeader();
    const response = await BaseService.get("/restaurant/newest", headers);
    return response;
  }

  async getRestaurantById(id, isAdmin = false) {
    const headers = await this.buildHeader();
    const response = await BaseService.get(
      `/restaurant/${id}${isAdmin ? `?isAdmin=${isAdmin}` : ""}`,
      headers
    );
    return response;
  }

  async getListRestaurant(params) {
    const headers = await this.buildHeader();
    const response = await BaseService.get(`/restaurant/restaurants?${params}`, headers);
    return response;
  }

  async getReviewsByRestaurantId(id) {
    const headers = await this.buildHeader();
    const response = await BaseService.get(`/restaurant/reviews/${id}`, headers);
    return response;
  }
}
