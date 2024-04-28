import { useEffect, useMemo } from "react";
import { RouterProvider, createBrowserRouter, Outlet, useNavigate } from "react-router-dom";
import { Provider, useDispatch, useSelector } from "react-redux";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

import "./app.scss";
import { RootState, store } from "./state/store";
import { themeSettings } from "./theme";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { setLogin } from "./state/authSlice";
import { User } from "./types/authTypes";

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

            const userApiResponse = await fetch(userUrl, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });

            if (userApiResponse.status !== 200) {
                console.log("No user found.");
                navigate("/login");
            } else {
                const user: User = await userApiResponse.json();
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