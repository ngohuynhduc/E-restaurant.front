import { getServerSession } from "next-auth";
import { BaseService } from "./baseService";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export class AdminServices {
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

  async createCategory(body) {
    const headers = await this.buildAuthHeader();
    const response = await BaseService.post("/admin/categories", body, headers);
    return response;
  }

  async deleteCategory(id) {
    const headers = await this.buildAuthHeader();
    const response = await BaseService.delete(`/admin/categories/${id}`, headers);
    return response;
  }

  async updateCategory(id, body) {
    const headers = await this.buildAuthHeader();
    const response = await BaseService.put(`/admin/categories/${id}`, body, headers);
    return response;
  }

  async getListRestaurant(params) {
    const headers = await this.buildAuthHeader();
    const response = await BaseService.get(`/admin/restaurants?${params}`, headers);
    return response;
  }

  async updateStatusRestaurant(id, body) {
    const headers = await this.buildAuthHeader();
    const response = await BaseService.patch(`/admin/restaurants/${id}`, body, headers);
    return response;
  }

  async getListRestaurantByOwner(id) {
    const headers = await this.buildAuthHeader();
    const response = await BaseService.get(`/admin/restaurant/owner/${id}`, headers);
    return response;
  }

  async getListReservationsByRestaurant(id, params) {
    const headers = await this.buildAuthHeader();
    const response = await BaseService.get(
      `/admin/restaurant/reservations/${id}?${params}`,
      headers
    );
    return response;
  }

  async updateStatusReservation(id, body) {
    const headers = await this.buildAuthHeader();
    const response = await BaseService.patch(`/admin/reservation/${id}`, body, headers);
    return response;
  }
}
