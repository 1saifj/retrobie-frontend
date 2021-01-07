import React from 'react';
import Layout from '../components/Layout';
import Loading from '../components/loading';
import SEOHeader from '../components/SEOHeader';

class Blog extends React.Component {
  componentDidMount() {
    if (process.env.NODE_ENV === 'production') window.location.replace('https://blog.retrobie.com');
    else window.location.replace('http://localhost:8000');
  }

  render() {
    return (
      <Layout>
        <SEOHeader
          title={'Retrobie blog'}
          description={
            'Discover the latest trends, newest sneakers available in Nairobi and where to buy them.'
          }
        />
        <Loading />
      </Layout>
    );
  }
}

export default Blog;
