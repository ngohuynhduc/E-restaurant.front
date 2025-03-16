import { cookies } from "next/headers"

export const getSession = async () => {
  const cookiesStore = await cookies();
  const token = cookiesStore.get('accessToken')?.value ?? null;
  return { token };
}
