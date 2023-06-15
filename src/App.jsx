import React from "react";
import { Outlet, createBrowserRouter, useNavigate } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import Login from "./Login";
import Home from "./Home";
import { appWindow } from "@tauri-apps/api/window";
import { confirm } from '@tauri-apps/api/dialog';
import Report from "./Report";
import Customer from "./Customer";
import Set from "./Set";
import CustomerList from "./CustomerList";
const App = () => {


  
  const navigate = useNavigate();
    appWindow.onCloseRequested(async (event) => {
      const confirmed = await confirm('Are you sure?');
      if (!confirmed) {
      event.preventDefault();
      }else{
        localStorage.clear();
        navigate("/login");
      }
    })
  
  return (
    <React.Fragment>
      <Outlet />
    </React.Fragment>
  );
};

export default App;

export const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: (
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        ),
      },
      {
        path: "report",
        element: (
          <PrivateRoute>
            <Report />
           </PrivateRoute>
        ),
      },
      {
        path: "customer",
        element: (
          <PrivateRoute>
            <Customer />
          </PrivateRoute>
        ),
      },
      {
        path: "customer-list",
        element:(
          <PrivateRoute>
            <CustomerList />
          </PrivateRoute>
        ),
      },
      {
        path: "set",
        element: (
          <PrivateRoute>
            <Set />
          </PrivateRoute>
        ),
      },
      {
        path: "entry",
        element: (
          <PrivateRoute>
            {/* <Set /> */}
          </PrivateRoute>
        ),
      },
      {
        path: "calculater",
        element: (
          <PrivateRoute>
            {/* <Set /> */}
          </PrivateRoute>
        ),
      },
      {
        path: "cash",
        element: (
          <PrivateRoute>
            {/* <Set /> */}
          </PrivateRoute>
        ),
      },
      {
        path: "user",
        element: (
          <PrivateRoute>
            {/* <User /> */}
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "login",
    element: <Login />,
  }
]);