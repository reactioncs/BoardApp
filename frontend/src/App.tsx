import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Names from "./Names";
import "./app.scss";


function App() {
    const router = createBrowserRouter([
        {
            path: "",
            element: <Names />,
        },
    ]);

    return <RouterProvider router={router} />;
}

export default App;