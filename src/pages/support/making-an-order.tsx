import React from 'react';
import Layout from '../../components/Layout';
import styled from 'styled-components';

function MakingAnOrder() {
  return (
    <Layout style={{margin: '128px auto', maxWidth: 800}}>
      <MakingAnOrderContent>
        <header>
          <h1>How to make an order on Retrobie</h1>
          <p>Making an order is a simple 5-step process</p>
        </header>
      </MakingAnOrderContent>
    </Layout>
  );
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
