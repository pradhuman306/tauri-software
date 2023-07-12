import { React, useState } from "react";
import { useNavigate } from "react-router-dom";
import flaglogo from "./assets/logo-flat.svg";
import logo from "./assets/logo.svg";
import enTranslations from "@shopify/polaris/locales/en.json";
import {
  AppProvider,
  Button,
  Form,
  Frame,
  Grid,
  Page,
  Text,
  TextField,
  Thumbnail,
  Toast,
} from "@shopify/polaris";

export default function Login() {
  const [err, setErr] = useState("");
  const navigate = useNavigate();
  const toggleErrorActive = useCallback(() => setErr(''), []);
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const username = data.get("username");
    const password = data.get("password");
    if (username === "px" && password === "12345") {
      localStorage.setItem("username", "px");
      localStorage.setItem("password", "12345");
      navigate("/");
      setErr("");
    } else {
      setErr("Invalid credentials");
    }
  };

  return (
    <>
      <AppProvider i18n={enTranslations}>
        <Page fullWidth>
          <Grid>
            <Grid.Cell columnSpan={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
              <div className="login-wrapper">
                <div className="logo-login">
                  {/* <img src={flaglogo} alt="logo" /> */}
                  <Thumbnail
      source={flaglogo}
      alt="Black choker necklace"
    />
                </div>
                <div className="login-form-wrapper">
                  <div className="login-form">
                    <Text alignment="center" variant="headingLg" as="h3">
                      Welcome back to here!
                    </Text>
                    <Text alignment="center">Enter your detail for login</Text>
                    <Form onSubmit={handleSubmit}>
                      <div className="row">
                        <div className="col">
                          <TextField
                            label="Username"
                            type="text"
                            name="username"
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col">
                          <TextField
                            label="Password"
                            type="password"
                            name="password"
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col">
                          <Button primary>Login</Button>
                        </div>
                      </div>
                    </Form>
                  </div>
                  <div className="copyright">
                    <Text>
                      © 2023 Bhole Software | All right reserved
                    </Text>
                  </div>
                </div>
                <div className="login-footer">
                  <Text>
                    Built <span>❤</span> By Nextige Soft Solution
                  </Text>
                </div>
              </div>
            </Grid.Cell>
          </Grid>
          <Frame>
        {err?<Toast content={errorMessage} error onDismiss={toggleErrorActive}  duration={2000} />:""}
        </Frame>
        </Page>
      </AppProvider>
    </>
  );
}
