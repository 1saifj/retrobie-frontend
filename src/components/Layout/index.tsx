import React, {CSSProperties, useEffect, useState} from 'react';
import styled from 'styled-components';
import Header from '../header/header';
import Footer from '../footer/footer';
import {Delete, Notification} from 'bloomer';
import {Transition} from 'react-transition-group';
import {ErrorIconDark} from '../../constants/icons';
import {RootStateOrAny, useSelector} from 'react-redux';
import {UserState} from '../../state/reducers/userReducers';
import {Link} from 'react-router-dom';

const Layout = function(params: {
  withoutNav?: boolean,
  topRightButton?: boolean | Function,
  children,
  style?: Partial<CSSProperties>,
  internal?: boolean,
  footer?: boolean;
}, ...props) {


  const warning = sessionStorage.getItem('hide-unverified-email-warning');

  const [hideWarning, setWarningHidden] = useState(Boolean(warning));

  const currentTheme = useSelector((state: RootStateOrAny) => state.meta.theme);
  const user: UserState = useSelector((state: RootStateOrAny) => state.user);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const defaultStyle = {
    transition: `opacity 250ms ease-in-out`,
    opacity: 0,
    background: currentTheme === 'dark' ?
      'var(--color-background--dark)' :
      'var(--color-background--light)',
  };

  const transitionStyles = {
    entering: {opacity: 0},
    entered: {opacity: 1},
    exiting: {opacity: 0},
    exited: {opacity: 0},
  };

  function hideUnverifiedEmailWarning() {
    setWarningHidden(true);
    sessionStorage.setItem('hide-unverified-email-warning', String(true));
  }

  return (
    <>
      <Transition
        in={mounted}
        timeout={100}>
        {
          state => (
            <div
              style={{...defaultStyle, ...transitionStyles[state]}}>
              <div
                className='layout--root'>
                <div>
                  {
                    user.isLoggedIn && !user.isVerified && (
                      <Notification
                        style={{display: Boolean(hideWarning) ? 'none' : 'block'}}
                        isColor={'warning'}>
                        <Delete onClick={() => hideUnverifiedEmailWarning()} />
                        <div style={{display: 'flex'}}>
                          <img src={ErrorIconDark}
                               style={{width: '24px', margin: '0 12px', display: 'inline'}}
                               alt="error icon" />
                          <p>
                            Psst. You haven't verified your email yet.
                            Some functionality will be limited until you do.
                          </p>
                          <p>
                            To confirm your email address, visit{' '}
                            <Link to={'/accounts/verify?sendCode=true'}>
                              this link
                            </Link>
                          </p>
                        </div>
                      </Notification>
                    )
                  }

                  <Header
                    withoutNav={params.withoutNav}
                    topRightButton={params.topRightButton} />
                  <LayoutParent
                    className='layout--parent' {...props}
                    style={{...(params.style)}}>
                    {params.children}
                  </LayoutParent>
                  {
                    !!params.footer && (
                      <div style={{marginTop: 48}}>
                        <Footer internal={params.internal} />
                      </div>
                    )
                  }

                </div>
              </div>
            </div>
          )
        }
      </Transition>

    </>
  );

};

const LayoutParent = styled.div`
  margin-top: 48px;
`;

export default Layout;
