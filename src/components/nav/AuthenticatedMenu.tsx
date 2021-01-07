import React from 'react';
import styled from "styled-components";
import Avatar from 'react-avatar';
import 'react-tippy/dist/tippy.css'
import { withTooltip } from "react-tippy";
import { LogOut, User } from "react-feather";
import { deleteAllCookies } from "../../helpers";
import { notify } from "../../helpers/views";

const AuthenticatedMenu = props => {
  return (
    <>
      <MenuParent>
        <div>
          <h4 style={{ color: '#fff' }}>Dashboard</h4>
        </div>
        <div>
          {/* @ts-ignore */}
          <HeaderWithTooltip />
        </div>
      </MenuParent>
    </>
  );
};

AuthenticatedMenu.propTypes = {};

const Header = () => (
  <Avatar round={true} email={"bradstarart@gmail.com"} unstyled={true} />
);

const DropdownParent = styled.div`
  ul {
    padding: 0;
  }
  
  li {
    list-style: none;
    text-align: left;
    display: flex;
    transition: all 0.25s ease-in-out;
    
    &:hover {
      opacity: 0.8;
      cursor:pointer;
    }
  }
  
  a, p, button {
    font-size: 14px;
    text-decoration: none;
  }
  
  svg {
    width: 18px;
    margin-right: 12px;
  }
  
  button {
    background: transparent;
    border: none;
    padding: 0;
    
    &:hover {
      cursor:pointer;
    }

  }
`;

const HeaderWithTooltip = withTooltip(Header, {
  title: 'Welcome to React with tooltip',
  trigger: 'click',
  interactive: true,
  arrow: true,
  theme: 'light',
  html: (
    <DropdownParent>
      <div style={{ borderBottom: '1px solid rgba(0,0,0,0.25)' }}>
        <p style={{ fontWeight: 'bold', fontSize: '14px' }}>bradstarart@gmail.com</p>
      </div>
      <ul>
        <li>
          <User />
          <button>Profile</button>
        </li>
        <li onClick={() => {
          notify('loading', 'Please wait...');
          localStorage.removeItem('admin_token')
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
          deleteAllCookies()
          window.location.href = "/company/admin/login";
        }}>
          <LogOut />
          <button>Log out</button>
        </li>
      </ul>
    </DropdownParent>
  )
});


const MenuParent = styled.div`
    padding: 10px 24px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: var(--color-primary);
    position: sticky;
    top: 0;
    z-index: 2;
    box-shadow: 0px 8px 15px -15px var(--color-accent-dark);
    
    h4 {
        color: rgb(255, 255, 255);
        padding: 0;
        margin: 13px 0;
        font-size: 24px;
    }
    
    .sb-avatar {
      width: 42px;
      
      img {
        border-radius: 50%;
        
        &:hover {
          cursor:pointer;
        }
      }
    }
`;

export default AuthenticatedMenu;
