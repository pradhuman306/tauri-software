import React, { createContext, useCallback, useState } from "react";
import { Outlet, createBrowserRouter, useNavigate } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import Login from "./Login";
import Home from "./Home";
import { appWindow } from "@tauri-apps/api/window";
import Report from "./Report";
import Customer from "./Customer";
import Set from "./Set";
import Calculater from "./Calculater";
import Entry from "./Entry";
import Navbar from "./Navbar";
import '@shopify/polaris/build/esm/styles.css';
import enTranslations from '@shopify/polaris/locales/en.json';
import {AppProvider,Toast, Page, LegacyCard, Button, Frame} from '@shopify/polaris';
import Settings from "./Settings";
import Cashbook from "./Cashbook";
import ReportByCustomer from "./ReportByCustomer";

export const MyContext = createContext();
const App = () => {
 
const [message,setMessage]=useState("");
const [errorMessage,setErrorMessage]=useState("");
const toggleActive = useCallback(() => setMessage(''), []);
const toggleErrorActive = useCallback(() => setErrorMessage(''), []);
  const navigate = useNavigate();
    appWindow.onCloseRequested(async (event) => {
        localStorage.clear();
       
    })
  
  return (
    <React.Fragment>
        <AppProvider i18n={enTranslations}>
    
    <MyContext.Provider value={{ message, setMessage, setErrorMessage }}>
      <Navbar/>
      <Outlet />
      <Frame>
        {message?<Toast content={message} error={false} onDismiss={toggleActive}  duration={2000} />:""}
        {errorMessage?<Toast content={errorMessage} error onDismiss={toggleErrorActive}  duration={2000} />:""}
        </Frame>
    </MyContext.Provider>
        
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
        path: "reportbycustomer",
        element: (
          <PrivateRoute>
            <ReportByCustomer />
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
        path: "calculater/:cid",
        element: (
          <PrivateRoute>
            <Calculater />
          </PrivateRoute>
        ),
      },
      {
        path: "cashbook",
        element: (
          <PrivateRoute>
            <Cashbook />
          </PrivateRoute>
        ),
      },
      {
        path: "settings",
        element: (
          <PrivateRoute>
            <Settings />
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