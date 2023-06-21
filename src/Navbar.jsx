import { React, useState, useEffect } from "react";
import { Link, useNavigate,useLocation } from "react-router-dom";
import logo from './assets/logo.svg'

export default function Navbar() {
  const location = useLocation();
  console.log(location.pathname);
  const getusername = localStorage.getItem("username");
  const getPassword = localStorage.getItem("password");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (!getusername && !getPassword) {
      setIsLoggedIn(false);
    } else {
      setIsLoggedIn(true);
    }
  }, [getusername, getPassword]);

  const handleClick = () => {
    setIsLoggedIn(false);
    localStorage.clear();
    navigate("/login");
  };
  return (
    <header>
    <div className="container">
      <div className="header-wrapper">
        <div className="sub-header">
          <div className="logo">
              <img src={logo} alt="logo"/>
          </div>
        {isLoggedIn ? 
          <div className="login-btn">
            <button onClick={()=>handleClick}>Logout</button>
          </div>
        : ''}
        </div>
        {isLoggedIn ? 
        <div className="main-header">
          <div className="header-menus">
            <ul> 
              <li>
            <Link to="/customer" className={location.pathname === '/customer'? 'active':''}>Customer</Link>
              </li>
              {/* <li>
            <Link to="/cash" className={location.pathname === '/cash'? 'active':''}>Cash</Link>
              </li> */}
              <li>
            <Link to="/set" className={location.pathname === '/set'? 'active':''}>Set</Link>
              </li>
              <li>
            <Link to="/report" className={location.pathname === '/report'? 'active':''}>Report</Link>
              </li>
              <li>
            <Link to="/entry" className={location.pathname === '/entry'? 'active':''}>Entry/edit</Link>
              </li>
              {/* <li className="check-sub"> */}
                {/* <a className={location.pathname === '/customer-list' || location.pathname === '/calculater'? 'active':''}>Check</a> */}
                {/* <ul className="sub-menu">  */}
                  {/* <li>
            <Link to="/customer-list" className={location.pathname === '/customer-list'? 'active':''}>Customers</Link>
                  </li> */}
                  <li>
            <Link to="/calculater" className={location.pathname === '/calculater'? 'active':''}>Calculater</Link>
                  </li>
                {/* </ul> */}
              {/* </li> */}
              <li>
            <Link to="/delete" className={location.pathname === '/delete'? 'active':''}>Delete</Link>
              </li>
            </ul>
          </div>
        </div>
        : ''}
      </div>
    </div>
  </header>
  );
}
