import React, {useState} from 'react';
import Layout from '../../../components/Layout';
import {Lock, Users} from 'react-feather';
import Loading from '../../../components/loading';
import {Tab, TabLink, TabList, Tabs} from 'bloomer';
import {UserDetails} from './components';
import {useApi} from '../../../network';
import useSWR from 'swr/esm/use-swr';
import {Tooltip} from 'react-tippy';
import {RootStateOrAny, useSelector} from 'react-redux';
import {UserInfoType, UserState} from '../../../state/reducers/userReducers';
import {Avatar, EmptyState} from '../../../components';
import {DeadEyes2} from '../../../constants/icons';


const tabs = [
  {
    icon: Lock,
    name: "Your account",
    component: UserDetails,
  },
  // {
  //   name: "Your orders",
  //   icon: Truck,
  //   component: UserOrders
  // },
  // {
  //   name: "Favorites",
  //   icon: Star,
  //   component: UserFavorites
  //
  // },
  // {
  //   name: "Wishlist",
  //   icon: Box,
  //   component: UserWishList
  // },

]

export default function UserProfile() {
  const api = useApi();

  const user: UserState = useSelector((state: RootStateOrAny) => state.user);

  const userInfoFetcher = ()=> api.accounts.me().then(({data}) => data).catch(err => err);
  const {data: userInfo, error: userInfoError} = useSWR<UserInfoType>(user?.isLoggedIn ? '/accounts/me': null, userInfoFetcher)

  const [accountTabs, ] = useState(tabs);
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  if (userInfoError){
    return (
      <Layout>
        <EmptyState
          message={`Oops. That shouldn't have happened. We're working on it.`}
          title={'Well this is embarassing. An error occurred'} />
      </Layout>
    );
  }

  if (!user?.isLoggedIn){
    return (
      <Layout>
        <EmptyState
          icon={DeadEyes2}
          centerAlign={true}
          title={'How did you get here?'}
          message={'You have to be logged in to view this page.'}
        />
      </Layout>
    )
  }

  if (!userInfo) {
    return (
      <Loading/>
    )
  }

  function setAccountTabActive(index){
    setActiveTabIndex(index)
  }

  function renderActiveTab(index){
    const {component: Component} = tabs[index];
    return <Component data={userInfo}/>
  }

  return (
    <>
      <Layout internal>
        <div style={{maxWidth: '800px', margin: '120px auto'}}>
          <div style={{display: 'flex', gap: 12, alignItems: 'center'}}>
            <Tooltip
              theme={'light'}
              position={'right'}
              arrow={true}
              title={'Systematically generated from your name'}
            >

              <Avatar
                src={userInfo.avatar}
                name={`${userInfo.firstName} ${userInfo.lastName}`}
              />
            </Tooltip>
            <div>
              <Users style={{display: 'inline', marginRight: 8}} />
              <h2 style={{display: 'inline'}}>
                {userInfo?.firstName}&nbsp;
                {userInfo?.lastName}
              </h2>
            </div>
          </div>
          <Tabs style={{marginBottom: 0}}>
            <TabList>
              {
                accountTabs.map(({icon: Icon, name}, index) => {
                  return (
                    <>
                      <Tab
                        isActive={index === activeTabIndex}
                        onClick={() => setAccountTabActive(index)}>
                        <TabLink>
                          <Icon width={18} style={{marginRight: 8}} />
                          <span>{name}</span>
                        </TabLink>
                      </Tab>
                    </>
                  );
                })
              }
            </TabList>
          </Tabs>
          <div>
            <div>
              {
                renderActiveTab(activeTabIndex)
              }
            </div>
          </div>

        </div>
      </Layout>
    </>
  );
};
