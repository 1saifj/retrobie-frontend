import React, {Component} from 'react';
import Layout from '../../components/Layout';
import {CenterPageContent} from './support';
import Payment from '../../assets/images/icons/online-payment.webp';

class PayingForAnOrder extends Component {
    render() {
        return (
            <Layout>
                <CenterPageContent style={{minHeight: "450px"}}>
                    <img style={{width: "80px"}} src={Payment} alt={"Dollar in cart"}/>
                    <h1>Paying for an Order</h1>
                    <p>
                        Currently, you can only pay for an order <b>once it is delivered</b>,
                        and the delivery has been confirmed by both parties.
                    </p>
                    <p>
                        Currently-accepted payment methods are <b>Cash</b> and <b>Mpesa</b>.
                    </p>
                </CenterPageContent>
            </Layout>
        );
    }
}

export default PayingForAnOrder;
