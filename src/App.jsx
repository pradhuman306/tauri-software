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
import Calculater from "./Calculater";
import Entry from "./Entry";
import Navbar from "./Navbar";
import '@shopify/polaris/build/esm/styles.css';
import enTranslations from '@shopify/polaris/locales/en.json';
import {AppProvider, Page, LegacyCard, Button} from '@shopify/polaris';
const App = () => {


  
  const navigate = useNavigate();
    appWindow.onCloseRequested(async (event) => {
      // if (!confirmed) {
      // event.preventDefault();
      // }else{
        localStorage.clear();
        // navigate("/login");
      // }
    })
  
  return (
    <React.Fragment>
        <AppProvider i18n={enTranslations}>
      <Navbar/>
      <Outlet />
      </AppProvider>
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
            <Entry />
          </PrivateRoute>
        ),
      },
      {
        path: "calculater",
        element: (
          <PrivateRoute>
            <Calculater />
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