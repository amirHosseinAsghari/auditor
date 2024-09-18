import {useMutation} from "react-query";
import {useDispatch} from "react-redux";
import {loginUser} from "./login";
import {clearAuth, setAuth} from "@/store/authSlice";
import {logout} from "./logout";
import {isAuthenticated} from "./isAuthenticated";
import {useNavigate} from "react-router-dom";

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
                localStorage.setItem("role", data.role);

                dispatch(
                    setAuth({
                        role: data.role,
                        token: data.token,
                        isAuthenticated: data.isAuthenticated,
                    })
                );
            },
            onError: (error) => {
                console.error("Login error:", error);
            },
        }
    );
};

export const useLogout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    return useMutation(
        async () => {
            const data = await logout();
            return data;
        },
        {
            onSuccess: () => {
                localStorage.removeItem("token");
                localStorage.removeItem("role");

                dispatch(clearAuth());
                navigate("/login");
            },
            onError: (error) => {
                console.error("Logout error:", error);
            },
        }
    );
};

export const useIsAuthenticated = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    return useMutation(async () => {
            const data = await isAuthenticated();
            return data;
        },
        {
            onSuccess: (data) => {
                dispatch(
                    setAuth({
                        role: data.role,
                        token: data.token,
                        isAuthenticated: data.isAuthenticated,
                    })
                )},
            onError: (error) => {
                localStorage.removeItem("token");
                localStorage.removeItem("role");
                console.log("error: ", error);
                dispatch(clearAuth());
                navigate("/login");
            }
        });
};
