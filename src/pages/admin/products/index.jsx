import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Button} from 'bloomer';

class AdminProductHome extends Component {
  render() {
    return (
      <div
        style={{display: 'flex', marginTop: '48px', flexDirection: 'column', alignItems: 'center'}}
      >
        <div>
          <div style={{marginTop: '24px'}}>
            <Button
              onClick={() => this.props.history.push('/company/admin/dashboard/products/create')}
            >
              Add new product
            </Button>
          </div>
          <div style={{marginTop: '24px'}}>
            <Button
              onClick={() => this.props.history.push('/company/admin/dashboard/products/all')}
            >
              View all products
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(AdminProductHome);
