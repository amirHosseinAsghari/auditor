import { useMutation } from "react-query";
import { useDispatch } from "react-redux";
import { loginUser } from "./login";
import { setAuth } from "@/store/authSlice";

export const useLogin = () => {
  const dispatch = useDispatch();

  return useMutation(
    async (credentials: { username: string; password: string }) => {
      const data = await loginUser(credentials);
      return data;
    },
    {
      onSuccess: (data) => {
        localStorage.setItem("token", data.token);
        localStorage.setItem("avatar", data.avatar);
        localStorage.setItem("role", data.role);

        dispatch(
          setAuth({
            role: data.role,
            token: data.token,
            avatar: data.avatar,
          })
        );
      },
      onError: (error) => {
        console.error("Login error:", error);
      },
    }
  );
};
