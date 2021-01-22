import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import AnimatedLogo from '../../components/logo/AnimatedLogo';
import {useHistory} from 'react-router';
import {ChevronDown} from 'react-feather';

const Sidebar = props => {
  const {items: sidebarItems} = props;
  const history = useHistory();
  const [currentActive, setCurrentActive] = useState(0);
  const [sidebarRoutes, setSidebarRoutes] = useState(sidebarItems);

  useEffect(() => {
    const active = localStorage.getItem('sidebar_active');
    if (active !== undefined) {
      setCurrentActive(Number(active));
      changeActiveItem(null, Number(active));
    }
  }, []);

  function clearOtherSidebarItems(index) {
    let clonedItems = [...sidebarRoutes];
    clonedItems = clonedItems.map((item, itemIndex) => {
      if (index !== itemIndex) item.isActive = false;
      return item;
    });
    return clonedItems;
  }

  function changeActiveItem(item, index) {
    if (item) history.push(item.route);

    const clearedItems = clearOtherSidebarItems(index);
    clearedItems[index].isActive = !clearedItems[index].isActive;
    setSidebarRoutes(clearedItems);
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
              <AnimatedLogo plain />
              <ChevronDown color="#fff" style={{width: 24, marginTop: 0}} />
            </div>
          </SidebarItem>

          <ul>
            {sidebarRoutes &&
              sidebarRoutes.map((item, index) => {
                return (
                  <SidebarItem
                    isActive={item.isActive}
                    key={item.name}
                    onClick={() => {
                      changeActiveItem(item, index);
                    }}
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

const SidebarItem = styled.li<{isActive?:boolean}>`
  padding: 4px 12px;
  margin: 4px 8px;
  border-radius: 4px;
  list-style: none;
  display: flex;
  background: ${p => (p.isActive ? 'var(--color-primary-light)' : 'var(--color-primary)')};
  transition: all 0.25s ease-in-out;
  color: #fff6d1;

  &:hover {
    cursor: pointer;
    background: var(--color-primary-dark);
  }

  svg {
    margin-right: 16px;
    margin-top: 10px;
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
