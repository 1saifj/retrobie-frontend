import React, {Component} from 'react';
import {connect} from 'react-redux';
import {axis} from '../../../network';
import {Button, Input, Modal} from 'bloomer';
import {notify} from '../../../helpers/views';

class MiscAdminFunctions extends Component {
  state = {
    modal: {
      google: false,
    },
    select: [
      {
        label: 'Delete',
        value: 'URL_DELETED',
      },
      {
        label: 'Update',
        value: 'URL_UPDATED',
      },
    ],
    submit: {
      access_token: '',
      url: '',
      action: '',
    },
  };

  showHideModal(name, show) {
    this.setState({
      ...this.state,
      modal: {
        [name]: show === undefined ? true : show,
      },
    });
  }

  submitForm() {
    axis
      .post('/auth/google/index', {...this.state.submit})
      .then(response => {
        console.log(response);
        notify('success', 'Success');
      })
      .catch(err => {
        notify('error', 'Error');
        console.log(err);
      });
  }

  getGoogleToken() {
    let token = localStorage.get('google-index-token');
    if (!token) {
      axis
        .get('/auth/authorize/google')
        .then(response => {
          localStorage.set('google-index-token', response.data);
        })
        .catch(err => {
          console.error(err);
        });
    } else {
      let accessToken = JSON.parse(token);
      this.setState({
        ...this.state,
        submit: {
          ...this.state.submit,
          access_token: accessToken.access_token,
        },
      });
    }
  }

  render() {
    return (
      <>
        <h1>Google</h1>
        <Button isColor="primary" onClick={() => this.showHideModal('google')}>
          Reindex or delete
        </Button>
        <Modal
          show={this.state.modal.google}
          onHide={() => this.showHideModal('google', false)}
          onEnter={() => this.getGoogleToken()}
        >
          <Modal.Title>Modify a submitted URL</Modal.Title>
          <Modal.Body>
            <label>The URL to change</label>
            <Input
              placeholder={'URL'}
              onChange={value => {
                this.setState({
                  ...this.state,
                  submit: {
                    ...this.state.submit,
                    url: value,
                  },
                });
              }}
              value={this.state.submit.url}
            />
            {/*<SelectPicker searchable={false}*/}
            {/*              onChange={(value) => {*/}
            {/*                  this.setState({*/}
            {/*                      ...this.state,*/}
            {/*                      submit: {*/}
            {/*                          ...this.state.submit,*/}
            {/*                          action: value*/}
            {/*                      }*/}
            {/*                  })*/}
            {/*              }}*/}
            {/*              value={this.state.submit.action}*/}
            {/*              data={this.state.select}/>*/}
          </Modal.Body>
          <Modal.Footer>
            <Button isColor="primary" onClick={() => this.submitForm()}>
              Confirm
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(MiscAdminFunctions);
