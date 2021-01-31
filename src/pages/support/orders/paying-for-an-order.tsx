import React, {Component} from 'react';
import Layout from '../../../components/Layout';
import {CenterPageContent} from '../index';
import Payment from '../../../assets/images/icons/online-payment.webp';

class PayingForAnOrder extends Component {
    render() {
        return (
            <Layout>
                <CenterPageContent>
                    <div>
                        <img style={{width: "45px"}} src={Payment} alt={"Dollar in cart"}/>
                        <h1>Paying for an Order</h1>
                        <p>
                            Currently, we only accept M-pesa payments.
                        </p>
                        <p>
                            You can either pay for an order at the checkout or
                            once your goods are delivered.
                        </p>
                    </div>
                </CenterPageContent>
            </Layout>
        );
    }
}

export default PayingForAnOrder;
