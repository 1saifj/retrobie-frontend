import React, {useEffect} from 'react';
import Layout from '../components/Layout';
import Loading from '../components/loading';
import SEOHeader from '../components/SEOHeader';

function Blog() {

  useEffect(()=> {
    // if (process.env.NODE_ENV === 'production') window.location.replace('https://blog.retrobie.com');
    // else window.location.replace('http://localhost:8000');
  }, [])

  return (
    <Layout>
      <SEOHeader
        path={'/company/blog'}
        title={'Retrobie blog'}
        description={
          'Discover the latest trends, newest sneakers available in Nairobi and where to buy them.'
        }
      />
      <Loading/>
    </Layout>
  );
}

export default Blog;
