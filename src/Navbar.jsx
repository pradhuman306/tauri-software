import { React, useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { TopBar, ActionList, Frame, List } from '@shopify/polaris';
import { EnterMajor } from '@shopify/polaris-icons';
import { BaseDirectory, readTextFile, writeTextFile } from "@tauri-apps/api/fs";

export default function Navbar() {
  const location = useLocation();
  const logoImg = '../src/assets/logo-flat.svg';
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
    let contentItems = [];
    if (customers.length) {
      let tmp = customers.filter((item) => item.name.toLowerCase().includes(value.toLowerCase()));
      setSearchValue(value);
      if (tmp.length) {
        tmp.map((item) => {
          contentItems.push({
            content: item.name, onAction: () => {
              navigate(`/calculater/${item.customer_id}`);
              handleSearchResultsDismiss();
            }
          });
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
        setcustomers(mycust);
      } catch (error) {
         console.log(error);
      }
      // entries
    };
    getdataFromFile();
  }, []);

  const logo = {
    width: 80,
    topBarSource: logoImg,
    url: '/',
    accessibilityLabel: 'Bhole',
  };
  const userMenuMarkup = (
    <>
    <TopBar.UserMenu
      actions={[
        {
          items: [{ content: 'Logout', icon: EnterMajor, onAction: () => handleClick() }],
        },
      ]}
      name="Bhole"
      detail="Admin"
      initials="B"
      open={isUserMenuOpen}
      onToggle={toggleIsUserMenuOpen}
    />
        </>
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
      placeholder="Customer... "
      showFocusBorder
    />
  );

  const secondaryMenuMarkup = (
    <List className="mainLink">
     <List.Item>
        <TopBar.Menu
          activatorContent={
            <Link
              to="/customer"
              className={location.pathname==='/customer'?'active':""}
            >
              Customer
            </Link>
          }
        />
        </List.Item>
         <List.Item>
      <TopBar.Menu
          activatorContent={
        <Link
          to="/set"
          className={location.pathname==='/set'?'active':""}
        >
          Set
        </Link>}
        />
   </List.Item>
   <List.Item>
        <TopBar.Menu
          activatorContent={
            <Link
              to="/report"
              className={location.pathname==='/report'?'active':""}
            >
              Report
            </Link>
          }
        />
      </List.Item>
         <List.Item>
      <TopBar.Menu
          activatorContent={
        <Link
          to="/entry"
          className={location.pathname==='/entry'?'active':""}
        >
          Entry/Edit
        </Link>}/>
        </List.Item>
        <List.Item>
        <TopBar.Menu
          activatorContent={
            <Link
              to="/calculater/:cid"
              className={location.pathname==='/calculater/:cid' || location.pathname.includes('calculater')?'active':""}
            >
              Calculator
            </Link>
          }
        />
         </List.Item>
  </List>
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
  }, [getusername, getPassword, isLoggedIn]);

  const handleClick = () => {
    console.log('logout');
    setIsLoggedIn(false);
    localStorage.clear();
    navigate("/login");
  };
  return (

    <div style={{ height: '56px' }}>
      <Frame topBar={topBarMarkup} logo={logo} />
    
    </div>
  );
}
