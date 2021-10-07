import React, {ReactElement, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Logo from '../../components/logo/Logo';
import {useHistory, useLocation, useParams} from 'react-router';
import {ChevronDown} from 'react-feather';

type RouteItem = {
  name: string;
  route: string;
  icon: ReactElement
  isActive: boolean;
}

const Sidebar = props => {
  const {items: sidebarItems} = props;
  const history = useHistory();
  const [currentActive, setCurrentActive] = useState(0);
  const [sidebarRoutes, setSidebarRoutes] = useState<RouteItem[]>(sidebarItems);

  useEffect(() => {
    setActiveItem()
  }, [currentActive]);

  function changeActiveItem(item) {
    if (item) {
      history.push(item.route);
      setActiveItem();
    }
  }

  function setActiveItem(){
    // first split the url using the string 'dashboard'
    const locationWithoutDashboard = history.location.pathname.split('dashboard');
    // and drop the first part of the array
    locationWithoutDashboard.shift();
    // then pick the only remaining item in the array
    // and split it using the forward slash.
    // the resulting array will contain an empty string and the name of the route eg. brands, categories, etc.
    const activeSidebarItem = locationWithoutDashboard[0].split("/")[1]
    // if there is no name, we're probably dealing with the dashboard
    if (!activeSidebarItem){
      setCurrentActive(0);
    }else {
      const activeSidebarIndex = sidebarRoutes.findIndex(item => item.name.toLowerCase() === activeSidebarItem.toLowerCase());
      setCurrentActive(activeSidebarIndex);
    }
  }

  return (
    <>
      <SidebarParent>
        <div style={{position: 'fixed', background: 'inherit'}}>
          <SidebarItem style={{margin: '8px 8px', background: 'var(--color-primary-dark)'}}>
            <div
              style={{
                width: '100%',
                padding: '4px 0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Logo />
              <ChevronDown color="#fff" style={{width: 24, marginTop: 0}} />
            </div>
          </SidebarItem>

          <ul style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            height: "80vh"
          }}>
            {sidebarRoutes &&
              sidebarRoutes.map((item, index) => {
                return (
                  <SidebarItem
                    isActive={currentActive === index}
                    key={item.name}
                    onClick={() => changeActiveItem(item)}
                  >
                    {item.icon}
                    <p>{item.name}</p>
                  </SidebarItem>
                );
              })}
          </ul>
        </div>
        <div />
      </SidebarParent>
    </>
  );
};

Sidebar.propTypes = {
  items: PropTypes.array.isRequired,
};

const SidebarParent = styled.div`
  max-width: 280px;
  background: var(--color-primary);
  & > div {
    min-width: 200px;
    height: 100vh;
    width: 280px;
  }

  ul {
    padding: 0 12px;
  }

  p {
    color: #eeeeee;
  }
`;

const SidebarItem = styled.li<{isActive?: boolean}>`
  padding: 4px 12px;
  margin: 4px 8px;
  border-radius: 4px;
  list-style: none;
  display: flex;
  background: ${p => (p.isActive ? 'var(--color-primary-light)' : 'var(--color-primary)')};
  transition: all 0.25s ease-in-out;
  color: #fff6d1;
  align-items: center;

  &:hover {
    cursor: pointer;
    background: var(--color-primary-dark);
  }

  svg {
    margin-right: 16px;
    width: 20px;
    transition: stroke 0.25s ease-in-out;
    animation: ${p => (p.isActive ? 'col 1.5s linear 1' : 'none')};
    animation-fill-mode: forwards;
  }

  @keyframes col {
    25%,
    100% {
      stroke: #ffffff;
    }
  }
`;

export default Sidebar;
