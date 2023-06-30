import { React, useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "./assets/logo-flat.svg";
import search from "./assets/search.svg";
import {TopBar, ActionList, Icon, Frame, Text, Button,Navigation } from '@shopify/polaris';
import {ArrowLeftMinor, QuestionMarkMajor} from '@shopify/polaris-icons';
import { BaseDirectory, readTextFile, writeTextFile } from "@tauri-apps/api/fs";


export default function Navbar() {

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSecondaryMenuOpen, setIsSecondaryMenuOpen] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  var [entries, setentries] = useState([]);
  const [customers, setcustomers] = useState([]);
  const [contentItems, setcontentItems] = useState([]);


  const toggleIsUserMenuOpen = useCallback(
    () => setIsUserMenuOpen((isUserMenuOpen) => !isUserMenuOpen),
    [],
  );

  const toggleIsSecondaryMenuOpen = useCallback(
    () => setIsSecondaryMenuOpen((isSecondaryMenuOpen) => !isSecondaryMenuOpen),
    [],
  );

  const handleSearchResultsDismiss = useCallback(() => {
    setIsSearchActive(false);
    setSearchValue('');
  }, []);



  const handleSearchChange = (value) => {
    console.log(customers);
    let contentItems = [];
 if(customers.length){
  let tmp = customers.filter((item)=>item.name.toLowerCase().includes(value.toLowerCase()));
  setSearchValue(value);
  if(tmp.length){
    tmp.map((item)=>{
      contentItems.push({content:item.name});
    })
  }
  setIsSearchActive(value.length > 0);
  setcontentItems(contentItems);
 }
  };

  const handleNavigationToggle = useCallback(() => {
    console.log('toggle navigation visibility');
  }, []);


  useEffect(() => {
    const getdataFromFile = async () => {
      try {
        const myfiledata = await readTextFile("customers.json", {
          dir: BaseDirectory.Resource,
        });
        const mycust = JSON.parse(myfiledata);
        console.log(mycust);
        setcustomers(mycust);
      } catch (error) {
        await writeTextFile(
          { path: "customers.json", contents: JSON.stringify(customers) },
          { dir: BaseDirectory.Resource }
        );
        console.log(error);
      }
      // entries
   
    };
    getdataFromFile();
  }, []);








  const logo = {
    width: 124,
    topBarSource: "./assets/logo-flat.svg",
    url: '#',
    accessibilityLabel: 'Bhole',
  };


  
  const userMenuMarkup = (
    <TopBar.UserMenu
      actions={[
        {
          items: [{content: 'Settings', icon: ArrowLeftMinor, onAction:()=>alert('test') }],
        },
        {
          items: [{content: 'Logout', onAction:()=>alert('test2') }],
        },
      ]}
      name="Bhole"
      detail="Admin"
      initials="B"
      open={isUserMenuOpen}
      onToggle={toggleIsUserMenuOpen}
    />
  );

  const searchResultsMarkup = (
    <ActionList
      items={contentItems}
    />
  );

  const searchFieldMarkup = (
    <TopBar.SearchField
      onChange={handleSearchChange}
      value={searchValue}
      placeholder="Search"
      showFocusBorder
    />
  );

  const secondaryMenuMarkup = (
    <>
    
    <TopBar.Menu
      activatorContent={
        <Link
                      to="/entry"
                    
                    >
                      Customer
                    </Link>
      }
    />
    <TopBar.Menu
    activatorContent={
      <Link
      to="/report"
     
    >
      Report
    </Link>
    }
  />
  </>
  );

  const topBarMarkup = (
    <TopBar
      showNavigationToggle
      userMenu={userMenuMarkup}
      secondaryMenu={secondaryMenuMarkup}
      searchResultsVisible={isSearchActive}
      searchField={searchFieldMarkup}
      searchResults={searchResultsMarkup}
      onSearchResultsDismiss={handleSearchResultsDismiss}
      onNavigationToggle={handleNavigationToggle}
    />
  );







  const location = useLocation();
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
  }, [getusername, getPassword,isLoggedIn]);

  const handleClick = () => {
    console.log('logout');
    setIsLoggedIn(false);
    localStorage.clear();
    navigate("/login");
  };
  return (
    <div style={{height: '50px'}}>
    <Frame topBar={topBarMarkup} logo={logo} />
  </div>
    // <header>
    //   <div className="container">
    //     <div className="header-wrapper">
  
    
    //       {isLoggedIn ? (
    //         <div className="main-header">
    //           <div className="header-menus">
    //           <div className="header-left">
    //         <div className="logo">
    //           <img src={logo} alt="logo" />
    //         </div>
    //           <div className="search-wrap">
    //             <input type="search" name="search" placeholder="search..."/>
    //           </div>
    //         </div>
    //             <div className="header-right">
    //             <ul>
    //               <li>
    //                 <Link
    //                   to="/customer"
    //                   className={
    //                     location.pathname === "/customer" ? "active" : ""
    //                   }
    //                 >
    //                   Customer
    //                 </Link>
    //               </li>
    //               {/* <li>
    //         <Link to="/cash" className={location.pathname === '/cash'? 'active':''}>Cash</Link>
    //           </li> */}
    //               <li>
    //                 <Link
    //                   to="/set"
    //                   className={location.pathname === "/set" ? "active" : ""}
    //                 >
    //                   Set
    //                 </Link>
    //               </li>
    //               <li>
    //                 <Link
    //                   to="/report"
    //                   className={
    //                     location.pathname === "/report" ? "active" : ""
    //                   }
    //                 >
    //                   Report
    //                 </Link>
    //               </li>
    //               <li>
    //                 <Link
    //                   to="/entry"
    //                   className={location.pathname === "/entry" ? "active" : ""}
    //                 >
    //                   Entry/edit
    //                 </Link>
    //               </li>
    //               {/* <li className="check-sub"> */}
    //               {/* <a className={location.pathname === '/customer-list' || location.pathname === '/calculater'? 'active':''}>Check</a> */}
    //               {/* <ul className="sub-menu">  */}
    //               {/* <li>
    //         <Link to="/customer-list" className={location.pathname === '/customer-list'? 'active':''}>Customers</Link>
    //               </li> */}
    //               <li>
    //                 <Link
    //                   to="/calculater"
    //                   className={
    //                     location.pathname === "/calculater" ? "active" : ""
    //                   }
    //                 >
    //                   Calculater
    //                 </Link>
    //               </li>
    //               {/* </ul> */}
    //               {/* </li> */}

    //             </ul>
    //             {isLoggedIn ? (
    //           <div className="login-btn">
    //             <button onClick={(e) => handleClick()}>Logout</button>
    //           </div>
    //         ) : (
    //           ""
    //         )}
    //             </div>
    //           </div>
    //         </div>
    //       ) : (
    //         ""
    //       )}
    //     </div>
    //   </div>
    // </header>
  );
}
