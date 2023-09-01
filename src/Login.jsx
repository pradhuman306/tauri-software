import { React, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import flaglogo from './assets/logo-flat.svg'
import logo from './assets/logo.svg'
import { AppProvider, Button, Form, Frame, Text, TextField, Toast } from "@shopify/polaris";
import enTranslations from "@shopify/polaris/locales/en.json";

export default function Login() {
  const [err, setErr] = useState("");
  const navigate = useNavigate();
  const [userData, setUserData] = useState({username:"",password:""});
  const handleChange = (val,param) =>{
    let newUserData = {...userData};
    newUserData[param] = val;
    setUserData(newUserData);
  }
  const toggleErrorActive = useCallback(() => setErr(''), []);




  const handleSubmit = (event) => {
    event.preventDefault();
    if (userData.username === "bhole" && userData.password === "12345") {
      localStorage.setItem("username", "bhole");
      localStorage.setItem("password", "12345");
      navigate("/");
      setErr("");
    } else {
      setErr("Invalid credentials!");
    }
  };

  return (
    <>
    <AppProvider i18n={enTranslations}>
      <main>
        <div className="login-wrapper">
          <div></div>
          <div className="login-top">
            <figure>
              <img src={flaglogo} alt="logo" />
            </figure>
          </div>
          <div className="login-mid">
            <div className="login-mid-up card">
              <div className="login-mid-heading">
              <Text variant="headingLg" as="h3">Welcome back to here!</Text>
              <Text>Please enter details for login</Text>
              </div>
              <Form className="login-Form" onSubmit={handleSubmit}>
                <div className="login-form-wrapper">
                  <div className="form-group">
                    <TextField
                  label="Username"
                  name="username"
                  type="text"
                  value={userData.username}  onChange={(value)=>handleChange(value,'username')}
                />
                  </div>
                  <div className="form-group">
                     <TextField
                  label="Password"
                  name="password"
                  type="password"
                  onChange={(value)=>handleChange(value,'password')}
                        value={userData.password} 
                />
                  </div>
                  <div className="form-group">
                    <Button submit primary fullWidth>Login</Button>
                  </div>
                </div>
           
              </Form>
            </div>
            <div className="login-mid-down">
            <p>© 2023 Bhole  |  All rights reserved.</p>
          </div>
          </div>
          <div className="login-down">
            <p>Crafted with <span>❤️</span> by Nextige Soft Solution</p>
          </div>
        </div>
      </main>
      <Frame>
        {err?<Toast content={err} error onDismiss={toggleErrorActive}  duration={2000} />:""}
        </Frame>
      </AppProvider>
    </>
  );
}
