import React, {useEffect} from 'react';
import Layout from '../../components/Layout';
import SEOHeader from '../../components/SEOHeader';
import {CenterPageContent} from '../support';
import {SupportParent} from './shipping-policy';
import posthog from 'posthog-js';

const PrivacyAndCookiePolicy = () => {

  useEffect(() => {
    posthog.capture('viewed privacy & cookie policy page');
  }, []);

  return (
    <Layout>
      <CenterPageContent>
        <SupportParent>
          <SEOHeader
            path={'/privacy/cookie-policy'}
            title={'Cookie Policy for Retrobie'}
            description={'Discover how we store and process your data.'}
          />
          <div>
            <h1>Privacy & Cookie Policy</h1>

            <p>
              As is common practice with almost all professional websites this site uses cookies, which
              are tiny files that are downloaded to your computer, to improve your experience.
            </p>

            <p>
              This page
              describes what information we gather, how we use it and why we sometimes need to store
              these cookies. We will also share how you can prevent these cookies from being stored
              however this may downgrade or 'break' certain elements of the sites functionality.
            </p>

            <p>For more general information on cookies see the Wikipedia article on HTTP Cookies.</p>

            <h3>
              <strong>How we use cookies</strong>
            </h3>

            <p>
              We use cookies for a variety of reasons detailed below. Unfortunately in most cases there
              are no industry standard options for disabling cookies without completely disabling the
              functionality and features they add to this site. It is recommended that you leave on all
              cookies if you are not sure whether you need them or not in case they are used to provide
              a service that you use.
            </p>

            <h4>
              Disabling cookies
            </h4>

            <p>
              You can prevent the setting of cookies by adjusting the settings on your browser (see your
              browser Help for how to do this). Be aware that disabling cookies will affect the
              functionality of this and many other websites that you visit. Disabling cookies will
              usually result in also disabling certain functionality and features of the this site.
              Therefore it is recommended that you do not disable cookies.
            </p>

            <h3>
              <strong>The cookies we set</strong>
            </h3>

            <ul>
              <li>
                <p>
                  <strong>
                    Email newsletters related cookies
                  </strong>
                </p>
                <p>
                  This site offers newsletter or email subscription services and cookies may be used to
                  remember if you are already registered and whether to show certain notifications which
                  might only be valid to subscribed/unsubscribed users.
                </p>
              </li>

              <li>
                <p>
                  <strong>
                    Forms related cookies
                  </strong>
                </p>
                <p>
                  When you submit data to through a form such as those found on contact pages or comment
                  forms cookies may be set to remember your user details for future correspondence.
                </p>
              </li>

              <li>
                <p>
                  <strong>
                    Site preferences cookies
                  </strong>
                </p>
                <p>
                  In order to provide you with a great experience on this site we provide the
                  functionality to set your preferences for how this site runs when you use it. In order
                  to remember your preferences we need to set cookies so that this information can be
                  called whenever you interact with a page is affected by your preferences.
                </p>
              </li>
            </ul>

            <h3>
              Third Party Cookies
            </h3>

            <p>
              In some special cases we also use cookies provided by trusted third parties. The following
              section details which third party cookies you might encounter through this site.
            </p>

            <ul>
              <li>
                <p>
                  This site uses Google Analytics which is one of the most widespread and trusted
                  analytics solution on the web for helping us to understand how you use the site and
                  ways that we can improve your experience. These cookies may track things such as how
                  long you spend on the site and the pages that you visit so we can continue to produce
                  engaging content.
                </p>
                <p>
                  For more information on Google Analytics cookies, see the official Google Analytics
                  page.
                </p>
              </li>

              <li>
                <p>
                  Third party analytics are used to track and measure usage of this site so that we can
                  continue to produce engaging content. These cookies may track things such as how long
                  you spend on the site or pages you visit which helps us to understand how we can
                  improve the site for you.
                </p>
              </li>

              <li>
                <p>
                  From time to time we test new features and make subtle changes to the way that the
                  site is delivered. When we are still testing new features these cookies may be used to
                  ensure that you receive a consistent experience whilst on the site whilst ensuring we
                  understand which optimisations our users appreciate the most.
                </p>
              </li>

              {/*<li>*/}
              {/*  <p>*/}
              {/*    The Google AdSense service we use to serve advertising uses a DoubleClick cookie to*/}
              {/*    serve more relevant ads across the web and limit the number of times that a given ad*/}
              {/*    is shown to you.*/}
              {/*  </p>*/}
              {/*  <p>*/}
              {/*    For more information on Google AdSense see the official Google AdSense privacy FAQ.*/}
              {/*  </p>*/}
              {/*</li>*/}

              {/*<li>*/}
              {/*  <p>*/}
              {/*    Several partners advertise on our behalf and affiliate tracking cookies simply allow*/}
              {/*    us to see if our customers have come to the site through one of our partner sites so*/}
              {/*    that we can credit them appropriately and where applicable allow our affiliate*/}
              {/*    partners to provide any bonus that they may provide you for making a purchase.*/}
              {/*  </p>*/}
              {/*</li>*/}

              <li>
                <p>
                  We also use social media buttons and/or plugins on this site that allow you to connect
                  with your social network in various ways. For these to work the following social media
                  sites including; the social networks whose features you have integrated with your
                  site, will set cookies through our site which may be used to enhance your profile on
                  their site or contribute to the data they hold for various purposes outlined in their
                  respective privacy policies.
                </p>
              </li>
            </ul>

            <h2>
              <strong>More Information</strong>
            </h2>

            <p>
              Hopefully that has clarified things for you and as was previously mentioned if there is
              something that you aren't sure whether you need or not it's usually safer to leave cookies
              enabled in case it does interact with one of the features you use on our site.
            </p>

            <p>
              However if you are still looking for more information then you can contact us through one
              of our preferred contact methods:
            </p>

            <ul>
              <li>Email: customer.support@retrobie.com</li>
            </ul>
          </div>
        </SupportParent>
      </CenterPageContent>

    </Layout>
  );
};

export default PrivacyAndCookiePolicy;
