import React from 'react';
import Layout from '../components/Layout';
import EmptyState from '../components/empty/EmptyState';
import SEOHeader from '../components/SEOHeader';

class NotFound extends React.Component {

  render() {
    return (
      <Layout>
          <SEOHeader title={'404 Error. Not Found'}/>
          <EmptyState title="Whoa! Looks like you're lost..." message="We couldn't find what you're looking for."/>
      </Layout>
    )
  }
}

export default NotFound;
