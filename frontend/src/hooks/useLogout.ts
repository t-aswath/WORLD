import axios from "@/utils/axios";
import { useAuthContext } from "@/utils/store";

export default function useLogout() {
  const { setAuth } = useAuthContext();

  const logout = async () => {
    try {
      const response = await axios.get("/api/v1/auth/logout", {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      setAuth(null);

      return response.data;
    } catch (e) {
      setAuth(null);
      throw 403;
    }
  };

  return logout;
}

