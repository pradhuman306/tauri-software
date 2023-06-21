import { React, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

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
      <Navbar />
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="login">
          <h1>Login</h1>
          <div>
            <label htmlFor="usernane">Username</label>
            <input placeholder="Enter Username" type="text" name="username" />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              placeholder="Enter Password"
              type="password"
              name="password"
            />
          </div>
          <div>
            <button type="submit">Login</button>
          </div>
        </div>
        {err != "" ? <span className="error">{err}</span> : ""}
      </form>
    </>
  );
}
