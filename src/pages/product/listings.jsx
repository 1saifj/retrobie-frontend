import React, {Component} from 'react';
import {connect} from 'react-redux';
import Layout from '../../components/Layout';

class ProductListings extends Component {
    render() {
        return (
            <Layout>
                <p>Products</p>
            </Layout>
        );
    }
}

function mapStateToProps(state) {
    return {};
}

export default connect(
    mapStateToProps,
)(ProductListings);
