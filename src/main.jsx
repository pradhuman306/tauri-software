import React from "react";
import ReactDOM from "react-dom/client";
import { appRouter } from "./App";
import "./styles.css";
import { RouterProvider } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
 // <React>
    <RouterProvider router={appRouter} />
 // </React>
);
