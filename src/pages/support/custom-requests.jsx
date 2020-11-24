import React, {Component} from 'react';
import Layout from '../../components/Layout';
import {SupportParent} from './delivery';
import SEOHeader from '../../components/SEOHeader';
import {Container} from 'bloomer';

class CustomRequests extends Component {
    render() {
        return (
            <Layout>
                <SEOHeader title={'Making a Custom Request'}
                           description={"Are you looking for sneakers in Nairobi and have a particular pair of sneakers in mind? We'll do our best to track them down for you. "}
                />
                <div>
                    <SupportParent>
                        <Container>
                            <h1>Custom Requests</h1>
                            <p>
                                If you have a request for specific shoes, our agents and suppliers will try
                                to facilitate the same. However, you have to be a <b>trusted customer</b> before
                                being afforded this privilege.
                            </p>
                            <p>
                                To become a trusted customer, you need to have:
                                <ul>
                                    <li>Completed at least five orders on the platform.</li>
                                    <li>Have made no suspicious returns claims in the past.</li>
                                    <li>Have no history of abruptly cancelling orders.</li>
                                </ul>
                            </p>
                            <p>
                                Other benefits of being a trusted customer include:
                                <ul>
                                    <li><b>Free delivery</b> anywhere in Nairobi.</li>
                                    <li>A heads-up when exclusive products are launched.</li>
                                </ul>
                            </p>
                        </Container>
                    </SupportParent>
                </div>
            </Layout>
        );
    }
}

export default CustomRequests;
