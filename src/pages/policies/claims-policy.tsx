import React from 'react';
import {Layout} from '../../components';
import {CenterPageContent} from '../support';
import {SupportParent} from './shipping-policy';
import {Link} from 'react-router-dom';
import SEOHeader from '../../components/SEOHeader';

export default function() {

  return (
    <Layout>
      <SEOHeader
        description={'You can make a claim on any sneakers or shoes we delivered to you if you aren\'t happy with them.'}
        title={'Claims policy'}
        path={'/policies/claims-policy'}/>
      <CenterPageContent>
        <SupportParent>
          <h2>
            Claims Policy
          </h2>
          <p>
            A claim is a dispute raised on an order because of
            damaged or defective goods received.
          </p>
          <p>
            Claims made on our platform are guided by the following terms:
          </p>
          <div>
            <h4>Terms and conditions</h4>
            <p>
              Every claim made against an order must be created alongside a reason
              stating why the claim was created. Any claims created without a stated
              reason are considered invalid and will not be processed.
            </p>
            <p>
              A claim must be created within 7 days of the product having been
              delivered.
              Once a claim is made, we will attempt to contact the customer on three
              (3) separate occasions within 48 hours of the claim having been created.
            </p>
            <p>
              If we are unable to contact the buyer, either via phone or email,
              the claim is marked as being 'idle' or 'customer unreachable'
              Claims marked with this status expire after 3 days,
              or after the initial 7-day grace period expires,
              whichever comes first.
              Once expired, such a claim cannot be re-opened.
            </p>
            <p>
              If the customer can be reached within 48 hours of having opened the claim,
              the claim shall be reviewed, and either accepted or rejected.
            </p>
            <p>
              If a claim is accepted, an exchange will be issued to the customer,
              in accordance with our{' '}
              <Link to={'/support/policies/'}>
                exchange policy
              </Link>, unless a refund is requested,
              in which case, a partial refund will be facilitated in accordance
              with our{' '}
              <Link to={'/support/policies/refund-policy'}>
                refund policy
              </Link>
            </p>
            <p>
              In order for a claim to be successfully processed,
              it has to be created with a reason deemed valid by Us. e.g.
            </p>
            <ol type={'i'}>
              <li>
                The customer received the wrong order
                <ol type={'a'}>
                  <li>
                    The product is the wrong size as compared to what was listed on the website
                  </li>
                  <li>
                    The product was the wrong colour as compared to what the customer expected
                  </li>
                </ol>
              </li>
              <li>
                The product is of unacceptable quality as compared to what the customer expected.
              </li>
            </ol>
            <p>
              Unacceptable reasons for filing a claim include:
            </p>
            <ol type={'i'}>
              <li>
                The customer changed their mind.
              </li>
              <li>
                No reason.
              </li>
            </ol>
            <p>
              The above list of acceptable and unacceptable reasons is not conclusive and
              may be updated periodically. Individual claims may also be processed on a
              case-by-case basis. It is solely up to the Retrobie representatives to
              decide what does and what doesn’t constitute a valid claim, including
              reasons not otherwise listed above.
            </p>
          </div>

        </SupportParent>
      </CenterPageContent>
    </Layout>
  );
};