import React, {useEffect, useState} from 'react';
import Layout from '../../../components/Layout';
import {Lock, Truck, Users} from 'react-feather';
import Loading from '../../../components/loading';
import {Tab, TabLink, TabList, Tabs} from 'bloomer';
import {useDispatch, useSelector} from 'react-redux';
import useApi from '../../../network/useApi';
import {UserDetails, UserOrders} from './components';
import {useAuth} from '../../../network';
import {UserState} from '../../../state/reducers/userReducers';


const tabs = [
  {
    icon: Lock,
    name: "Your account",
    component: UserDetails,
  },
  {
    name: "Your orders",
    icon: Truck,
    component: UserOrders
  },
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
  const api = useAuth();

  const [userInfo, setUserInfo] = useState(null);
  const [accountTabs, setAccountTabs] = useState(tabs);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(api.accounts.me())
      .then(({data}) => {
      setUserInfo(data);
    });
  }, []);

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
      <Layout>
        <div style={{maxWidth: '800px', margin: '120px auto'}}>
          <div>
            <Users style={{display: 'inline', marginRight: 8}}/>
            <h2 style={{display: 'inline'}}>
              {userInfo?.firstName}&nbsp;
              {userInfo?.lastName}
            </h2>
          </div>
          <Tabs style={{marginBottom: 0}}>
            <TabList>
              {
                accountTabs.map(({icon: Icon, isActive, name}, index)=> {
                  return (
                    <>
                      <Tab
                        isActive={index === activeTabIndex}
                        onClick={() => setAccountTabActive(index)}>
                        <TabLink>
                          <Icon width={18} style={{marginRight: 8}}/>
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
