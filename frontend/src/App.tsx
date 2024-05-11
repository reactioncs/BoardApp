import { lazy, useEffect, useMemo } from "react";
import { RouterProvider, createBrowserRouter, Outlet, useNavigate } from "react-router-dom";
import { Provider, useDispatch, useSelector } from "react-redux";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import axios from "axios";

import "./app.scss";
import { RootState, store } from "./state/store";
import { themeSettings } from "./theme";
import { setLogin } from "./state/authSlice";
import { User } from "./types/authTypes";
const HomePage = lazy(() => import("./pages/HomePage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));

function Theme({ children }: { children: JSX.Element }) {
    const mode = useSelector((state: RootState) => state.preference.mode)
    const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    );
}

function ProtectedRoute({ children }: { children: JSX.Element }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const getUser = async () => {
            const userUrl = `${import.meta.env.VITE_API_URL}/api/user/`;

            const response = await axios.get(userUrl, {
                timeout: 60000,
                withCredentials: true,
                xsrfCookieName: 'csrftoken',
                xsrfHeaderName: 'X-CSRFToken',
                withXSRFToken: true,
                headers: {
                    Accept: "application/json",
                },
                validateStatus: status => status < 500,
            });

            if (response.status !== 200) {
                console.log("No user found.");
                navigate("/login");
            } else {
                const user: User = await response.data;
                console.log(`Welcome ${user.username}.`);
                dispatch(setLogin({ user }));
            }
        };

        getUser();
    }, []);

    return children;
}

function RoutedApp() {
    const router = createBrowserRouter([
        {
            path: "/",
            element: (
                <ProtectedRoute>
                    <Outlet />
                </ProtectedRoute>
            ),
            children: [
                {
                    path: "",
                    element: <HomePage />,
                },
            ]
        },
        {
            path: "/login",
            element: <LoginPage />,
        },
    ]);

    return (
        <div className="app">
            <Theme>
                <RouterProvider router={router} />
            </Theme>
        </div>
    );
}

function App() {
    return (
        <div className="app">
            <Provider store={store}>
                <RoutedApp />
            </Provider>
        </div>
    );
}

export default App;