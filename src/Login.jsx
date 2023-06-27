import { React, useState } from "react";
import { useNavigate } from "react-router-dom";
import flaglogo from './assets/logo-flat.svg'
import logo from './assets/logo.svg'

export default function Login() {
  const [err, setErr] = useState("");
  const navigate = useNavigate();

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
      <main>
        <div className="login-page">
          <div className="login-wrapper">
            <div className="login-contant">
              <div className="logo-login">
                <img src={flaglogo} alt="logo" />
              </div>
              <div className="login-form">
                <h2 className="login-heading">Welcome to Bhole</h2>
                <p className="sub-tittle">Please enter your details for login.</p>

                <form className="login-form" onSubmit={handleSubmit}>
                  <div className="login">
                    <div>
                      <label htmlFor="usernane">Username</label>
                      <input placeholder="Enter your username" type="text" name="username" />
                    </div>
                    <div className="password-block">
                      <label htmlFor="password">Password</label>
                      <input
                        placeholder="Enter your password"
                        type="password"
                        name="password"
                      />
                    </div>
                    <div>
                      <button className="signin-btn" type="submit">Login</button>
                    </div>
                  </div>
                  {err != "" ? <span className="error">{err}</span> : ""}
                </form>
              </div>
              <div className="copyright">
                <p className="small-tittle">© 2023 Bhole Software | All right reserved</p>
              </div>
            </div>
            <div className="login-logo">
              <img src={logo} alt="logo" />
              <p className="small-tittle">Built <span>❤</span> By Nextige Soft Solution</p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
