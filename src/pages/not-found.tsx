import React from 'react';
import Layout from '../components/Layout';
import {EmptyState} from '../components';
import SEOHeader from '../components/SEOHeader';
import {ErrorIcon404Dark} from '../constants/icons';

function NotFound() {
  return (
    <Layout>
      <SEOHeader title={'404 Error. Not Found'}/>
      <EmptyState
        style={{minHeight: '90vh', display: 'flex', alignItems: 'center'}}
        icon={()=> (
          <div style={{maxWidth: 400, margin: "0 auto", textAlign: 'left'}}>
            <img
              width={65}
              alt={'error'}
              src={ErrorIcon404Dark}/>
          </div>
        )}
        title="Whoa! Looks like you're lost..."
        message="We couldn't find what you're looking for."/>
    </Layout>
  );
}

export default NotFound;
