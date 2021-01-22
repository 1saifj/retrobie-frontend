import React, {useState} from 'react';
import Layout from '../../../components/Layout';
import {Lock, Users} from 'react-feather';
import Loading from '../../../components/loading';
import {Tab, TabLink, TabList, Tabs} from 'bloomer';
import {UserDetails} from './components';
import {useAuth} from '../../../network';
import useSWR from 'swr/esm/use-swr';
import {env} from '../../../config';
import {Tooltip} from 'react-tippy';


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
  const api = useAuth();

  const userInfoFetcher = (...args)=> api.accounts.me().then(({data}) => data).catch(err => err);
  const {data: userInfo} = useSWR('me', userInfoFetcher)

  const [accountTabs, setAccountTabs] = useState(tabs);
  const [activeTabIndex, setActiveTabIndex] = useState(0);

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
          <div style={{display: 'flex', gap: 12, alignItems: 'center'}}>
            <Tooltip
              theme={'light'}
              position={'right'}
              arrow={true}
              title={'Systematically generated from your name'}
            >
              <img
                style={{borderRadius: 4}}
                alt={'avatar'}
                src={env.getApiBaseUrl() + userInfo.avatar.thumbnailUrl}/>
            </Tooltip>
            <div>
              <Users style={{display: 'inline', marginRight: 8}}/>
              <h2 style={{display: 'inline'}}>
                {userInfo?.firstName}&nbsp;
                {userInfo?.lastName}
              </h2>
            </div>
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
