import React from 'react';
import styled from 'styled-components';
import Sidebar from '../../../pages/admin/sidebar';
import AuthenticatedMenu from '../../nav/AuthenticatedMenu';
import {Box as LayoutBox} from 'bloomer';
import {Anchor, BarChart2, Box, Home, Settings, Truck, Users} from 'react-feather';
import {ReactComponent as SidebarShoe} from '../../../assets/images/icons/shoe.svg';


class InternalLayout extends React.Component {

    constructor(props) {
        super(props);
        this.props = props;
    }

    render() {
        const sidebarItems = [
            {
                name: 'Dashboard',
                icon: <Home color={"#fff"}/>,
                route: '/company/admin/dashboard',
            },
            {
                name: 'Orders',
                icon: <Truck color={"#fff"}/>,
                route: '/company/admin/dashboard/orders',
            },
            {
                name: 'Analytics',
                icon: <BarChart2 color={"#fff"}/>,
                route: '/company/admin/dashboard/analytics',
            },
            {
                name: 'Products',
                icon: <SidebarShoe fill={"#fff"} style={{width: '24px', marginTop: 0}}/>,
                route: '/company/admin/dashboard/products',
            },
            {
                name: 'Brands',
                icon: <Box color={"#fff"}/>,
                route: '/company/admin/dashboard/brands'
            },
            {
                name: 'Users',
                icon: <Users color={"#fff"}/>,
                route: '/company/admin/dashboard/brands'
            },
            {
                name: 'Misc',
                icon: <Anchor color={"#fff"}/>,
                route: '/company/admin/dashboard/misc',
            },
            {
                name: 'Settings',
                icon: <Settings color={"#fff"}/>,
                route: '/company/admin/dashboard/settings',
            },

        ];
        return (
            <div className='layout--root'>

                <div style={{display: 'flex', background: 'var(--color-primary)'}}>
                    <Sidebar items={sidebarItems}/>

                    <div style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
                        <AuthenticatedMenu/>

                        <LayoutParent {...this.props} style={{...this.props.style}}>
                            <div style={{width: '100%'}}>
                                <LayoutBox style={{width: '100%', minHeight: '80vh'}}>
                                    {this.props.children}
                                </LayoutBox>
                            </div>
                        </LayoutParent>
                    </div>
                </div>
            </div>
        );
    }
}

const LayoutParent = styled.div`
  padding: 32px;
  background: #eeeeee;
  height: 100%;
`;

export default InternalLayout;
