import { getServerSession } from "next-auth";
import { BaseService } from "./baseService";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export class ReservationsService {
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

  async reservationsConfirm(body) {
    const headers = await this.buildAuthHeader();
    const response = await BaseService.post("/reservations/confirm", body, headers);
    return response;
  }

  async reservationsHold(body) {
    const headers = await this.buildAuthHeader();
    const response = await BaseService.post("/reservations/hold", body, headers);
    return response;
  }

  async checkAvailability(params) {
    const headers = await this.buildAuthHeader();
    const response = await BaseService.get(`/reservations/check-availability?${params}`, headers);
    return response;
  }
}
