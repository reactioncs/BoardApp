import { useMemo } from "react";
import { RouterProvider, createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import { Provider, useSelector } from "react-redux";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

import "./app.scss";
import { RootState, store } from "./state/store";
import { themeSettings } from "./theme";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";

function Theme({ children }: { children: JSX.Element }) {
    const mode = useSelector((state: RootState) => state.auth.mode)
    const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    );
}

function ProtectedRoute({ children }: { children: JSX.Element }) {
    const user = useSelector((state: RootState) => state.auth.user)

    if (user === null)
        return <Navigate to="/login" />;

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