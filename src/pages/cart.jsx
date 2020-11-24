import React from 'react';
import Layout from '../components/Layout';
import {connect} from 'react-redux';
import styled from 'styled-components';
import Cart from '../components/cart';
import EmptyState from '../components/empty/EmptyState';
import {EmptyCart} from '../constants/icons';
import {Button} from 'bloomer';

class CartPage extends React.Component {
    render() {
        return (
            <Layout>
                <CartItemParent>
                    <div style={{display: "flex", flexDirection: "column", width: "100%"}}>
                        {
                            this.props.state.cart.items && this.props.state.cart.items.length ?
                                <CartParent>
                                    <header style={{marginLeft: "12px"}}>
                                        <h2 style={{color: "#222"}}>Your Cart</h2>
                                    </header>

                                    <Cart history={this.props.history} size={'L'}
                                          bordered
                                          removeButton
                                    />
                                    <div style={{
                                        textAlign: "right",
                                        width: "max-content",
                                        marginLeft: "auto",
                                        display: "flex",
                                        flexDirection: "column",
                                        marginRight: "24px"
                                    }}>
                                        <div style={{display: "grid", marginLeft: "auto", marginTop: "8px"}}>
                                            <small style={{margin: "8px 0"}}>*Total not inclusive of delivery fee, if
                                                present</small>
                                            <Button isColor={'primary'}
                                                    onClick={() => this.props.history.push("/checkout")}
                                                    style={{width: "100%"}}>
                                                CHECK OUT
                                            </Button>
                                        </div>

                                    </div>
                                </CartParent>
                                :
                                <EmptyState
                                    title={'Your Cart is Empty'}
                                    icon={EmptyCart}
                                    message={'Do some shopping and check back later.'}
                                    prompt={() =>
                                        <Button type={'primary'} onClick={() => this.props.history.push("/")}
                                                style={{marginTop: '12px', width: '250px'}}>
                                            Start Shopping
                                        </Button>
                                    }
                                />
                        }
                    </div>
                </CartItemParent>
            </Layout>
        );
    }
}

export default connect(state => ({
    state
}), null)(CartPage);

const CartItemParent = styled.div`
  display: grid;
  width: 100%;
  justify-content: center;
  min-height: 65vh;
`;


const CartParent = styled.div`
    width: 800px;

    @media screen and (max-width: 768px) {
      width: 100%;    
    }
`;
