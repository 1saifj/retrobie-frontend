import React from 'react';
import styled from 'styled-components';
import Sidebar from '../../../pages/admin/sidebar';
import AuthenticatedMenu from '../../nav/AuthenticatedMenu';
import {Box as LayoutBox} from 'bloomer';
import {Anchor, Box, Flag, Home, Archive,  Truck, Package} from 'react-feather';


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
                name: 'Product Types',
                icon: <Archive color={"#fff"} />,
                route: '/company/admin/dashboard/product-types',
            },
            {
                name: 'Products',
                icon: <Package color={"#fff"} />,
                route: '/company/admin/dashboard/products',
            },
            {
                name: 'Categories',
                icon: <Flag color={'#fff'}/>,
                route: '/company/admin/dashboard/categories'
            },
            {
              name: 'Deliveries',
              icon: <Truck color={"#fff"}/>,
              route: '/company/admin/dashboard/deliveries'
            },
            {
                name: 'Brands',
                icon: <Box color={"#fff"}/>,
                route: '/company/admin/dashboard/brands'
            },
            {
                name: 'Misc',
                icon: <Anchor color={"#fff"}/>,
                route: '/company/admin/dashboard/misc',
            }

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
