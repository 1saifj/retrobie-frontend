import React from 'react';
import Layout from './Layout';
import {EmptyState} from './index';
import SEOHeader from './SEOHeader';
import {ErrorIcon404Dark} from '../constants/icons';

function NotFound(props) {
  return (
    <Layout>
      <SEOHeader
        description={`Oops. We couldn't find that page`}
        path={'/not-found'}
        title={'404 Error. Not Found'} />
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
        message={props.message || "We couldn't find what you're looking for."}/>
    </Layout>
  );
}

export default NotFound;
