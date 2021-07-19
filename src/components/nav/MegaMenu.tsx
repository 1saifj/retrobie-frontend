import React, {CSSProperties, useEffect, useState} from 'react';
import './megamenu.scoped.css';
import { Link, useHistory } from 'react-router-dom';
import {getMenuItemLinks, newItems, menuItemsToMap} from './Items';
import CartIcon from '../../assets/images/icons/cart.svg';
import Drawer from 'rc-drawer';
import { Button, Container, Section } from 'bloomer';
import Cart from '../cart';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../../hooks';
import RetroImage from '../image';
import {ChevronDown, User} from 'react-feather';
import Tooltip from '../tooltip';
import { UserState } from '../../state/reducers/userReducers';
import useSWR from 'swr/esm/use-swr';
import { toggleSidebarAction } from '../../state/actions';
import {CategoryType, PromiseThunk} from '../../types';
import AvatarComponent from '../avatar';

type NavbarItemType = {
  to: string
  title: string,
  links: {
    title: string;
    items: {to: string, title: string}[];
    to: string
  }[],
  featured?,
  style?: CSSProperties
}

const MegaMenu = () => {
  const api = useAuth();
  const history = useHistory();
  const isDrawerOpen = useSelector((state: RootStateOrAny) => state.meta.isSidebarOpen);
  const userState: UserState = useSelector((state: RootStateOrAny) => state.user);
  const dispatch = useDispatch<PromiseThunk<any>>();

  const allBrandsFetcher = () => api.brands.getAll().then(({data}) => data);
  const allCategoriesFetcher = () => api.category.getAll().then(({data}) => data);
  const {data: allBrands} = useSWR('/brands/all', allBrandsFetcher);
  const {data: allCategories} = useSWR<CategoryType[]>('/categories', allCategoriesFetcher);
  const [menuList, setMenuList] = useState<NavbarItemType[]>([]);

  const logout = () => {
    if (userState.isLoggedIn) {
      dispatch(
        api.accounts.logOut({
          accessToken: userState.tokens?.accessToken,
          refreshToken: userState.tokens.refreshToken
        }),
      ).then(() => {
        history.push('/')
      });
    }
  };

  const cartCount = useSelector((state: RootStateOrAny) => state.cart.count);
  const theme = useSelector((state: RootStateOrAny) => state.meta.theme);

  useEffect(() => {
    const newList = [...menuList];

    if (allBrands) {
      const brandMenuItemsMap = menuItemsToMap(allBrands, 'name');
      // setting the array index like this is a bit hacky, but it works
      // better than pushing, which pushes 'brands' and 'categories' every
      // time the server is queried
      newList[0] =({
        title: 'Brands',
        featured: false,
        to: '/brands',
        links: getMenuItemLinks(brandMenuItemsMap, {
          url: 'brands',
          withTitle: true,
        }),
        style: {
          minWidth: 600,
          padding: '12px',
          rowGap: 8
        }
      });
      setMenuList(newList);
    }

    if (allCategories){
      const categoryItemMenuMap = menuItemsToMap(allCategories, 'name');
      newList[1] =({
        to: '/categories',
        title: 'Categories',
        featured: false,
        style: undefined,
        links: getMenuItemLinks(categoryItemMenuMap, {
          url: 'category',
          withTitle: false,
        })
      })
      setMenuList(newList)
    }

  }, [
    allCategories,
    allBrands,
  ]);

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
              placement={'bottom'}
              inertia={true}
              content={(
                <ul style={{display: 'flex', listStyle: 'none', gap: 12, padding: 0}}>

                  {
                    newItems.map((item, index) => (
                      <div className="submenu-flex" key={String(index)}>
                        <li className="promo-container">
                          <Link tabIndex={0}
                                role="menuitem"
                                className="promo-imglink"
                                to={item.to}
                                title={item.title}>
                            <RetroImage
                              style={{minWidth: 200, height: 'auto'}}
                              alt={item.title}
                              src={item.image}
                            />
                          </Link>
                        </li>
                      </div>
                    ))
                  }
                </ul>
              )}>
              <Link
                className="nav-toplink "
                to="#" title="New">
                New
              </Link>
            </Tooltip>
          </li>

          {
            menuList.map((item, index) => (
              item &&
              <NavbarItem
                to={item.to}
                key={String(index)}
                title={item.title}
                links={item.links}
                style={item.style}
                featured={item.featured}
              />
            ))
          }
          <li className="default">

            <Link className="nav-toplink " tabIndex={0} to="/company/blog" title="Blog">
              Blog
            </Link>

          </li>
          <li className="default">
            <Button
              isColor={'ghost'}
              className="nav-toplink"
              onClick={() => openOrCloseSidebar(true)}
              tabIndex={0}
              title="Sale">
              <div style={{
                marginBottom: '4px', display: 'inherit',
              }}
                   className="has-badge-rounded"
                   data-badge={cartCount}>
                <img style={{width: '24px'}} className={'cart'} src={CartIcon} alt={'cart'} />
              </div>
            </Button>
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
                    <div>
                      <Cart
                        size={'L'}
                        title={true}
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
                <Tooltip
                  // options
                  theme={'light'}
                  interactive={true}
                  trigger={'click'}
                  arrow={true}
                  placement={'bottom'}
                  content={
                    <div>
                      <div>
                        <h4 style={{margin: "8px 0"}}>Your account</h4>
                      </div>
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
                    </div>
                  }
                >
                  <div className={'hover-pointer'}>
                    <User size={24}/>
                  </div>
                </Tooltip>
                </>
              ) :
              (
                <>
                  <Tooltip
                    // options
                    theme={'light'}
                    interactive={true}
                    arrow={true}
                    placement={'bottom'}
                    trigger={'click'}
                    content={
                      <div>
                        <ul style={{
                          padding: '4px',
                          listStyle: 'none',
                          textAlign: 'left',
                          margin: 0,
                        }}>
                          <li style={{padding: '0 8px'}}>
                            <Link to={'/accounts/me'}>
                              Your account
                            </Link>
                          </li>
                          <li style={{padding: '0 8px'}}>
                            <Link to={'/accounts/me/orders'}>
                              Your orders
                            </Link>
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
                    <div>
                      <AvatarComponent
                        size={"S"}
                        name={`${userState.firstName}`}
                        src={userState.avatar}
                      >
                        <ChevronDown width={18} />
                      </AvatarComponent>
                    </div>
                  </Tooltip>

                </>
              )
          }
        </div>
      </nav>

    </>
  );
};

const NavbarItem = ({title, links, featured, style, to}: NavbarItemType) => {
  return (
    <li className="default">

      <Tooltip
        interactive={true}
        theme={'light'}
        placement={'bottom'}
        arrow={true}
        inertia={true}
        content={(
          <ul style={{
            display: 'flex',
            flexWrap: 'wrap',
            padding: '0 12px',
            listStyle: 'none',
            ...style,
          }}>

            {
              links &&
              links.map(link => (
                <div className={'link--parent'} key={link.title}>
                  {
                    link.title && (
                      <li style={{
                        fontWeight: 'bold',
                        margin: '0 0 0.625rem',
                        borderBottom: '1px solid #d8d8d8',
                        paddingBottom: 8,
                      }}>
                        <h5>
                          {link.title}
                        </h5>
                      </li>
                    )
                  }

                  {
                    link.items?.map(item => (
                      <li key={item.title}>
                        <Link
                          to={item.to}
                          title={item.title}>
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
                  <Link
                    tabIndex={0}
                    role="menuitem"
                    className="promo-imglink" to={featured.link}
                    title={`${title} promo`}>
                    <img tabIndex={-1} alt={`Shop ${title}`} src={featured.image} width="340" height="580" />
                  </Link>
                </li>

              </div>
            }
          </ul>
        )}>
        <Link
          className="nav-toplink "
          tabIndex={0}
          to={to} title={title}>
          {title}
        </Link>
      </Tooltip>
    </li>
  );
};

export default MegaMenu;
