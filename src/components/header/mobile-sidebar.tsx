import {Button, Container, Section} from 'bloomer';
import AnimatedLogo from '../logo/AnimatedLogo';
import {Archive, Smartphone, X} from 'react-feather';
import React from 'react';
import {UserState} from '../../state/reducers/userReducers';
import {RootStateOrAny, useDispatch, useSelector} from 'react-redux';
import {Link} from 'react-router-dom';
import {useAuth} from '../../hooks';
import {NormalCart} from '../../constants/icons';
import {toggleSidebarAction} from '../../state/actions';

export default function MobileSidebar(props){

  const api = useAuth();
  const dispatch = useDispatch();
  const user: UserState = useSelector((state: RootStateOrAny)=> state.user)

  const openOrCloseCart = (open)=> dispatch(toggleSidebarAction({open}))

  const logOutUser = () =>
    api.accounts.logOut({
      accessToken: user.tokens.accessToken,
      refreshToken: user.tokens.refreshToken,
      // @ts-ignore
    }).then(()=> window.location.href = "/");

  return (
    <div style={{minWidth: 320, maxWidth: 340}}>
      <div style={{
        display: 'flex',
        marginTop: 24,
        marginRight: 24,
        marginLeft: 24,
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <Button 
            onClick={()=> {
              props.onClose()
              openOrCloseCart(true)
            }}
            isColor={'ghost'}>
            <img
              alt={'cart'}
              style={{width: 24}} src={NormalCart}/>
          </Button>
        </div>
        <div className={'navbar-close'} onClick={props.onClose}>
          <X/>
        </div>
      </div>
      <Section>
        <Container>
          <AnimatedLogo plain color={'#444'}/>
          <div>
            <h4>Categories</h4>
            <div>
              <ul style={{listStyle: 'none', padding: 0}}>
                <li style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px"
                }}>
                  <a href={`/category/mens-shoes`}>
                    Men's Shoes
                  </a>
                </li>
                <li style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px"
                }}>
                  <a href={`/category/womens-shoes`}>
                    Women's Shoes
                  </a>
                </li>
                <li style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px"
                }}>

                  <a href={`/category/kids-shoes`}>
                    Kids' Shoes
                  </a>
                </li>
                <li style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px"
                }}>
                  <a href={'/category/affordable-shoes'}>
                    Affordable
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div>
            <hr/>
          </div>
          <div>
            {
              user.isLoggedIn ? (
                <ul style={{listStyle: 'none', padding: 0}}>
                  <div>
                    <h4>Your stuff</h4>
                  </div>
                  <li style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px"
                  }}>
                    <Smartphone style={{stroke: "#444", width: 16, height: 16}}/>
                    <a href={'/accounts/me'}>
                      Your account
                    </a>
                  </li>
                  <li style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px"
                  }}>
                    <Archive style={{stroke: "#444", width: 16, height: 16}}/>
                    <a href={'/accounts/me/orders'}>
                      Your orders
                    </a>
                  </li>
                  <li>
                    <Button
                      isColor={'ghost'}
                      onClick={()=> logOutUser()}
                    >
                      Log out
                    </Button>
                  </li>
                </ul>
              ): (
                <div>
                  <p>Don't have an account? Join us for exclusive deals, offers and perks!</p>
                  <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <Link to={'/accounts/register'}>
                      <Button isColor={'primary'}>
                        Join us
                      </Button>
                    </Link>
                    <Link to={'/accounts/login'}>
                      <Button>
                        Log in
                      </Button>
                    </Link>
                  </div>
                </div>
              )
            }
          </div>
        </Container>
      </Section>

    </div>
  )
}