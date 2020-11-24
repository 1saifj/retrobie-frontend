import React, {Component} from 'react';
import Layout from '../../components/Layout';
import Howdy from '../../assets/images/marketing/how-it-works.png';
import styled from 'styled-components';

class MakingAnOrder extends Component {
  render() {
    return (
      <Layout style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
        <MakingAnOrderContent>
          <header>
            <h1>How to make an order on Retrobie</h1>
            <p>Making an order is a simple 5-step process</p>
          </header>
          <img src={Howdy} alt={'how it works'} />
        </MakingAnOrderContent>
      </Layout>
    );
  }
}

export default MakingAnOrder;

const MakingAnOrderContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  img {
    max-width: 1024px;
  }
`;
