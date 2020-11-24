import React, {Component} from 'react';
import {connect} from 'react-redux';
import InternalLayout from '../../../components/internal/layout';

class SingleMiscComponent extends Component {


    render() {
        return (
            <InternalLayout>

            </InternalLayout>
        );
    }
}

function mapStateToProps(state) {
    return {};
}

export default connect(
    mapStateToProps,
)(SingleMiscComponent);
