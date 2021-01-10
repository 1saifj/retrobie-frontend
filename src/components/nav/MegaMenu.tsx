import React, { useEffect, useState } from 'react';
import './megamenu.scoped.css';
import { Link, useHistory } from 'react-router-dom';
import { getBrandLinks, menuItems, newItems, sortBrands } from './Items';
import CartIcon from '../../assets/images/icons/cart.svg';
import Drawer from 'rc-drawer';
import { Button, Container, Section } from 'bloomer';
import Cart from '../cart';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../../hooks';
import RetroImage from '../image';
import { ChevronDown } from 'react-feather';
import { Tooltip } from 'react-tippy';
import styled from 'styled-components';
import { UserState } from '../../state/reducers/userReducers';
import { env } from '../../config';
import useSWR from 'swr/esm/use-swr';
import { toggleSidebarAction } from '../../state/actions';
import { PromiseThunk } from '../../types';

const MegaMenu = () => {
  const api = useAuth();
  const history = useHistory();
  const isDrawerOpen = useSelector((state: RootStateOrAny) => state.meta.isSidebarOpen);
  const userState: UserState = useSelector((state: RootStateOrAny) => state.user);
  const dispatch = useDispatch<PromiseThunk<any>>();

  const allBrandsFetcher = () => api.brands.getAll().then(({data}) => data);
  const {data: allBrands} = useSWR('/brands/all', allBrandsFetcher);
  const [menuList, setMenuList] = useState(menuItems);

  const logout = () => {
    if (userState.isLoggedIn) {
      dispatch(api.accounts.logOut({
        accessToken: userState.tokens?.accessToken,
      }))
        .then(() => history.push('/'));
    }
  };

  const cartCount = useSelector((state: RootStateOrAny) => state.cart.count);
  const theme = useSelector((state: RootStateOrAny) => state.meta.theme);

  useEffect(() => {
    if (allBrands) {
      const sortedBrands = sortBrands(allBrands);
      const newList = [...menuList];
      newList[0].links = getBrandLinks(sortedBrands);
      setMenuList(newList);
    }

  }, [allBrands]);

  const openOrCloseSidebar = (open) => dispatch(toggleSidebarAction({open}));

  return (
    <>
      <nav className="navbar" style={{alignItems: 'center'}}>
        <ul className="menu hover-enabled">
          <li className="default">
            <Tooltip
              interactive={true}
              theme={'light'}
              arrow={true}
              inertia={true}
              position={'bottom'}
              html={(
                <ul style={{display: 'flex', listStyle: 'none', gap: 12, padding: 0}}>

                  {
                    newItems.map((item, index) => (
                      <div className="submenu-flex" key={String(index)}>
                        <li className="promo-container">
                          <a tabIndex={0}
                             role="menuitem"
                             className="promo-imglink" href={item.to}
                             title={item.title}>
                            <RetroImage
                              alt={item.title}
                              src={item.image}
                            />
                          </a>
                        </li>
                      </div>
                    ))
                  }
                </ul>
              )}>
              <a className="nav-toplink " href="#" title="New">
                New
              </a>
            </Tooltip>
          </li>

          {
            menuList.map((item, index) => (
              item &&
              <NavbarItem
                key={String(index)}
                title={item.title}
                links={item.links}
                style={item.style}
                featured={item.featured}/>
            ))
          }

          <li className="default">

            <Tooltip
              interactive={true}
              theme={'light'}
              arrow={true}
              inertia={true}
              position={'bottom'}
              html={(
                <ul className="submenu" style={{padding: 0}}>

                  <div style={{display: 'flex', gap: 12}}>

                    <li
                      style={{listStyle: 'none'}}
                      className="promo-container">
                      <a tabIndex={0} role="menuitem" className="promo-imglink" href="/sale"
                         title="Promo">
                        <RetroImage
                          alt="Promo"
                          src={'https://ik.imagekit.io/t25/v2/landing/architecture-buildings-business-car-331990_Ht9UI78PA.webp?tr=w-250'}
                        />
                      </a>
                    </li>
                    <li
                      style={{listStyle: 'none'}}
                      className="promo-container">
                      <a tabIndex={0} role="menuitem" className="promo-imglink" href="/sale"
                         title="Promo">
                        <RetroImage
                          alt="Promo"
                          src={'https://ik.imagekit.io/t25/v2/landing/architecture-buildings-business-car-331990_Ht9UI78PA.webp?tr=w-250'}
                        />
                      </a>
                    </li>
                    <li
                      style={{listStyle: 'none'}}
                      className="promo-container">
                      <a tabIndex={0} role="menuitem" className="promo-imglink" href="/sale"
                         title="Promo">
                        <RetroImage
                          alt="Promo"
                          src={'https://ik.imagekit.io/t25/v2/landing/architecture-buildings-business-car-331990_Ht9UI78PA.webp?tr=w-250'}
                        />
                      </a>
                    </li>

                  </div>

                </ul>
              )}>
              <a className="nav-toplink " tabIndex={0} href="#" title="Sale">
                Sale
              </a>

            </Tooltip>


          </li>
          <li className="default">

            <Link className="nav-toplink " tabIndex={0} to="/company/blog" title="Blog">
              Blog
            </Link>

          </li>
          <li className="default">
            <a className="nav-toplink"
               onClick={() => openOrCloseSidebar(true)}
               tabIndex={0} href="#"
               title="Sale">
              <div style={{
                marginBottom: '4px', display: 'inherit',
              }}
                   className="has-badge-rounded"
                   data-badge={cartCount}>
                <img style={{width: '24px'}} className={'cart'} src={CartIcon} alt={'cart'}/>
              </div>
            </a>
            <Drawer open={isDrawerOpen}
                    duration={'.25s'}
                    placement={'left'}
                    handler={false}
                    onClose={() => openOrCloseSidebar(false)}>
              <div style={{
                background: theme === 'light' ?
                  'var(--color-background--light)' :
                  'var(--color-background--dark)',
              }}>
                <Section>
                  <Container>
                    <h2>
                      Your Cart
                    </h2>
                    <div>
                      <Cart
                        size={'L'}
                        showAddButton={true}
                        showRemoveButton={true}
                        bordered={false}
                      />
                    </div>

                  </Container>
                </Section>
              </div>
            </Drawer>

          </li>
        </ul>
        <div className={'cta'}>
          {
            !userState?.isLoggedIn ? (
                <>
                  <div style={{display: 'flex', gap: 8}}>
                    <Link to={'/accounts/login'}>
                      <Button style={{fontWeight: 500}} isColor={'secondary'}>
                        Log in
                      </Button>
                    </Link>

                    <Link to={'/accounts/register'}>
                      <Button style={{fontWeight: 500}} isColor={'primary'}>
                        Create a New Account
                      </Button>
                    </Link>
                  </div>
                </>
              ) :
              (
                <>
                  <Tooltip
                    // options
                    title="Welcome to React"
                    position="bottom"
                    theme={'light'}
                    interactive={true}
                    arrow={true}
                    trigger={'click'}
                    html={
                      <div>
                        <ul style={{
                          padding: '4px',
                          listStyle: 'none',
                          textAlign: 'left',
                          margin: 0,
                        }}>
                          <li style={{padding: '0 8px'}}>
                            <a href={'/accounts/me'}>
                              Your account
                            </a>
                          </li>
                          <li style={{padding: '0 8px'}}>
                            <a href={'/accounts/me/orders'}>
                              Your orders
                            </a>
                          </li>
                          <li style={{padding: '0 8px'}}>
                            <Button
                              isColor={'ghost'}
                              onClick={() => logout()}>
                              Log out
                            </Button>
                          </li>
                        </ul>
                      </div>
                    }
                  >
                    <AvatarComponent>
                      <ChevronDown width={18}/>

                      <div>
                        <img src={env.getApiBaseUrl() + userState.avatar.thumbnailUrl} alt={'avatar'}/>
                      </div>
                    </AvatarComponent>
                  </Tooltip>

                </>
              )
          }
        </div>
      </nav>

    </>
  );
};

MegaMenu.propTypes = {};

const AvatarComponent = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;

  img {
    border: 2px solid seagreen;
    padding: 2px;
    border-radius: 50%;
    max-width: 40px;
  }

  &:hover {
    cursor:pointer;
  }
`

const NavbarItem = ({title, links, featured, style}) => {
    return (
        <li className="default">

            <Tooltip
              interactive={true}
              theme={'light'}
              arrow={true}
              inertia={true}
              position={'bottom'}
              html={(
                <ul style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    padding: "0 12px",
                    listStyle: 'none',
                    ...style
                }}>

                    {
                        links &&
                        links.map(category => (
                          <div style={{
                              flex: '1 0 150px',
                              textAlign: 'left',
                              maxWidth: "100%",
                              margin: "0 0.5rem",
                          }} key={category.title}>
                              <li style={{
                                  fontWeight: "bold",
                                  margin: "0 0 0.625rem",
                                  borderBottom: "1px solid #d8d8d8",
                                  paddingBottom: 8
                              }}>
                                  <a
                                    tabIndex={0}
                                     href={category.to} title={category.title}>
                                      {category.title}
                                  </a>
                              </li>
                              {
                                  category.items?.map(item => (
                                    <li key={item.title}>
                                        <a tabIndex={0} href={item.to} title={item.title}>
                                            {item.title}
                                        </a>
                                    </li>
                                  ))
                              }
                          </div>
                        ))
                    }

                    {
                        featured &&
                        <div className="submenu-flex">

                            <li className="promo-container">
                                <a
                                  tabIndex={0}
                                  role="menuitem"
                                  className="promo-imglink" href={featured.link}
                                   title={`${title} promo`}>
                                    <img tabIndex={-1} alt={`Shop ${title}`} src={featured.image} width="340" height="580"/>
                                </a>
                            </li>

                        </div>
                    }
                </ul>
              )}>
                <a className="nav-toplink " tabIndex={0} href="#" title={title}>
                    {title}
                </a>
            </Tooltip>
        </li>
    );
};

export default MegaMenu;
