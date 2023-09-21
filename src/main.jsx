import React from "react";
import ReactDOM from "react-dom/client";
import { appRouter } from "./App";
import { RouterProvider } from "react-router-dom";
import './assets/fonts/fonts.css';

import { appWindow } from '@tauri-apps/api/window';
await appWindow.maximize();

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React>
  <RouterProvider router={appRouter} />
  // </React>
);
