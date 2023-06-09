import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const navigate = useNavigate();
  const getusername = localStorage.getItem("username");
  const getPassword = localStorage.getItem("password");

  useEffect(() => {
    if (!getusername && !getPassword) {
      navigate("/login");
    }
  }, [getusername, getPassword, navigate]);

  return children;
}
