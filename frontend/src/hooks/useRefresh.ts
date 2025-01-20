import axios from "@/utils/axios";
import { useAuthContext } from "@/utils/store";

export default function useRefresh() {
  const { setAuth } = useAuthContext();

  const refresh = async () => {
    try {
      const response = await axios.get("/api/v1/auth/refresh_token", {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      setAuth({
        id: response.data.id,
        name: response.data.name,
        email: response.data.email,
        type: response.data.type,
      });

      return response.data;
    } catch (e) {
      setAuth(null);
      throw 403;
    }
  };

  return refresh;
}

