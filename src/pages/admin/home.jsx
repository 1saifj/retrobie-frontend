import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';

class AdminHome extends Component {
  render() {
    return (
      <div
        style={{display: 'flex', marginTop: '48px', flexDirection: 'column', alignItems: 'center'}}
      >
        <h1>Home sweet home</h1>
        <div style={{minHeight: '45vh'}}>
          <Link to={'products'}>
            <p>Products</p>
          </Link>
          <Link to={'orders'}>
            <p>Orders</p>
          </Link>
          <Link to={'misc'}>
            <p>Misc</p>
          </Link>
          <Link to={'brands'}>
            <p>Brands</p>
          </Link>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(AdminHome);
