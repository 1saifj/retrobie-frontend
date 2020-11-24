import React, {useEffect, useState} from 'react';
import './megamenu.scoped.css';
import {Link, useHistory} from 'react-router-dom';
import {menuItems, newItems, sortBrands} from './Items';
import cart from '../../assets/images/icons/cart.svg';
import Drawer from 'rc-drawer/';
import {Button, Container, Section} from 'bloomer';
import Cart from '../cart';
import {useDispatch, useSelector} from 'react-redux';
import {logoutUserAction, toggleSidebarAction} from '../../state/actions';
import {useAuth} from '../../network';
import RetroImage from '../image';
import {User} from 'react-feather';
import {Tooltip} from 'react-tippy';

const NavClose = ()=> (
  <div className="nav-toggle-close" tabIndex="0" role="button"
       aria-label="Close Sale submenu">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path
            d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"/>
      </svg>
  </div>
)

const MegaMenu = () => {
    const api = useAuth();
    const history = useHistory();
    const sidebarOpen = useSelector(state => state.meta.isSidebarOpen);
    const isUserLoggedIn = useSelector(state => state.user.isLoggedIn);
    const dispatch = useDispatch();
    const [menuList, setMenuList] = useState(menuItems);

    const logout = () => {
        dispatch(api.accounts.logOut());
        dispatch(logoutUserAction());
        history.push('/');
    }

    const cartCount = useSelector(state => state.cart.count);

    useEffect(() => {
        dispatch(api.brands.getAll())
          .then(({data}) => {
              const formattedBrands = sortBrands(data, true);
              setMenuList([...menuItems, formattedBrands ? formattedBrands : undefined]);
          }).catch(() => {
        });
    }, []);

    function openOrCloseSidebar(open) {
        dispatch(toggleSidebarAction({open}))
    }

    return (
      <div>
          <nav className="navbar">
              <ul className="menu hover-enabled">
                  <li className="default">

                      <a className="nav-toplink " href="#" title="New">
                          New
                      </a>
                      <ul className="submenu">

                          {
                              newItems.map((item, index) => (
                                <NewItem src={item} key={String(index)}/>
                              ))
                          }
                          <NavClose/>
                      </ul>
                  </li>
                  {
                      menuList.map((item, index) => (
                        item &&
                        <NavbarItem
                          key={String(index)}
                          title={item.title}
                          links={item.links}
                          featured={item.featured}/>
                      ))
                  }

                  <li className="default">

                      <a className="nav-toplink " tabIndex="0" href="#" title="Sale">
                          Sale </a>

                      <div className="tab-tooltip" tabIndex="0" role="button" aria-label="Toggle Sale submenu"
                           title="Toggle Sale submenu">
                          Toggle Sale submenu
                      </div>

                      <ul className="submenu">

                          <div className="submenu-flex">

                              <li className="promo-container">
                                  <div style={{display: 'flex', gap: 24}}>

                                      <Link tabIndex="0" role="menuitem" className="promo-imglink" to="/sale"
                                            title="Promo">
                                          <RetroImage
                                            alt="Promo"
                                            src={'https://ik.imagekit.io/t25/v2/landing/architecture-buildings-business-car-331990_Ht9UI78PA.webp?tr=w-250'}
                                          />
                                      </Link>
                                      <Link tabIndex="0" role="menuitem" className="promo-imglink" to="/sale"
                                            title="Promo">
                                          <RetroImage
                                            alt="Promo"
                                            src={'https://ik.imagekit.io/t25/v2/landing/architecture-buildings-business-car-331990_Ht9UI78PA.webp?tr=w-250'}
                                          />
                                      </Link>
                                      <Link tabIndex="0" role="menuitem" className="promo-imglink" to="/sale"
                                            title="Promo">
                                          <RetroImage
                                            alt="Promo"
                                            src={'https://ik.imagekit.io/t25/v2/landing/architecture-buildings-business-car-331990_Ht9UI78PA.webp?tr=w-250'}
                                          />
                                      </Link>
                                  </div>
                              </li>

                          </div>

                          <NavClose/>
                      </ul>
                  </li>
                  <li className="default">

                      <Link className="nav-toplink " tabIndex="0" to="/company/blog" title="Blog">
                          Blog
                      </Link>

                  </li>
                  <li className="default">
                      <a className="nav-toplink"
                         onClick={() => openOrCloseSidebar(true)}
                         tabIndex="0" href="#"
                         title="Sale">
                          <div style={{
                              marginBottom: '4px', display: 'inherit',
                          }}
                               className="has-badge-rounded"
                               data-badge={cartCount}>
                              <img style={{width: '24px'}} className={'cart'} src={cart} alt={'cart'}/>
                          </div>
                      </a>
                      <Drawer open={sidebarOpen}
                              duration={'.25s'}
                              placement={'left'}
                              handler={false}
                              onClose={() => openOrCloseSidebar(false)}>
                          <Section>
                              <Container>
                                  <h2>
                                      Your Cart
                                  </h2>
                                  <div>
                                      <Cart size={'L'} showAddButton={true} showRemoveButton={true}/>
                                  </div>

                              </Container>
                          </Section>
                      </Drawer>

                  </li>
              </ul>
              <div className={'cta'}>
                  {
                      !isUserLoggedIn ? (
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
                        window.location.pathname === '/accounts/me' ?
                          (
                            <Button style={{fontWeight: 500}}
                                    onClick={() => logout()}
                                    isColor={'secondary'}>
                                Log Out
                            </Button>
                          )
                          :
                          (
                           <>
                               <Tooltip
                                 // options
                                 title="Welcome to React"
                                 position="bottom"
                                 theme={'light'}
                                 interactive={true}
                                 html={
                                     <div>
                                         Your account
                                     </div>
                                 }
                               >
                                   <User/>
                               </Tooltip>

                           </>
                          )
                  }
              </div>
          </nav>

      </div>
    );
};

MegaMenu.propTypes = {};

const NavbarItem = ({title, links, featured}) => {
    return (
        <li className="default">

            <a className="nav-toplink " tabIndex="0" href="#" title={title}>
                {title}
            </a>

            <ul className="submenu">

                {
                    links &&
                    links.map(category => (
                        <div className="submenu-flex" key={category.title}>
                            <li className="submenu-title">
                                <Link tabIndex="0" to={category.to} title={category.title}>
                                    {category.title}
                                </Link>
                            </li>
                            {
                                category.items?.map(item => (
                                    <li className="sublink" key={item.title}>
                                        <Link tabIndex="0" to={item.to} title={item.title}>
                                            {item.title}
                                        </Link>
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
                            <Link tabIndex="0" role="menuitem" className="promo-imglink" to={featured.link}
                                  title={`${title} promo`}>
                                <img tabIndex="-1" alt={`Shop ${title}`} src={featured.image} width="340" height="580"/>
                            </Link>
                        </li>

                    </div>
                }

                <NavClose/>
            </ul>
        </li>
    );
};

const NewItem = (({src}) => {
    return (
        <div className="submenu-flex">
            <li className="promo-container">
                <Link tabIndex="0" role="menuitem" className="promo-imglink" to={src.to} title={src.title}>
                    <RetroImage alt={src.title}
                                src={src.image}
                                width="460"
                                height="290"/>
                </Link>
            </li>
        </div>
    )
});

export default MegaMenu;
