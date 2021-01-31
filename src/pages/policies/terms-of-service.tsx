import React from 'react';
import styled from 'styled-components';
import Layout from '../../components/Layout';
import SEOHeader from '../../components/SEOHeader';
import {CenterPageContent} from '../support';
import {SupportParent} from './shipping-policy';
import {Link} from 'react-router-dom';

const Tos = () => {
  return (
    <>
      <Layout>
        <CenterPageContent>
          <SupportParent>
            <SEOHeader
              title={'Retrobie | Privacy Policy'}
              description={'Retrobie Privacy Policy'}
            />
            <div>
              <h2>
                Terms of Service
              </h2>
              <p>Last updated:&nbsp;28/01/2021</p>
              <div>
                <h3>
                  Introduction
                </h3>
              </div>
              <p>
                Welcome to&nbsp;the <b>Retrobie Company</b> ("<b>we</b>”, “<b>our</b>”, “<b>us</b>
                ”) privacy policy.
              </p>

              <p>
                These Terms of Service (“
                <b>Terms</b>”, “<b>Terms of Service</b>”) govern your use of our web pages located
                at <a href={'https://retrobie.com'}>https://retrobie.com</a> (the "<b>Site</b>") operated by Retrobie
                LTD
              </p>

              <p>
                Our Privacy Policy also governs your use of our Service and explains how we collect,
                safeguard and disclose information that results from your use of our web pages.
              </p>

              <p>
                Your agreement with us includes these Terms and our Privacy Policy&nbsp;(“
                <b>Agreements</b>
                ”). You acknowledge that you have read and understood Agreements, and agree to be
                bound of them.
              </p>

              <p>
                If you do not agree with (or cannot comply with) Agreements, then you may not use
                the Service, but please let us know by emailing at <a
                href={'mailto:customer.support@retrobie.com'}>customer.support@retrobie.com</a> so
                we can try to find a solution. These Terms apply to all visitors, users and others
                who wish to access or use Service.
              </p>

              <p>
                Thank you for being responsible.
              </p>

              {/*<ol start={2}>*/}
              {/*  <li>*/}
              {/*    <h2>*/}
              {/*      <b>Communications</b>*/}
              {/*    </h2>*/}
              {/*  </li>*/}
              {/*</ol>*/}
              {/*<p>*/}
              {/*  By creating an Account on our Service, you agree to subscribe to newsletters,*/}
              {/*  marketing or promotional materials and other information we may send. However, you*/}
              {/*  may opt out of receiving any, or all, of these communications from us by following*/}
              {/*  the unsubscribe link or by emailing at.*/}
              {/*</p>*/}

              <div>
                <h4>
                  Personal Information
                </h4>

                <p>
                  When you visit the Site, we automatically collect certain information about your device,
                  including information about your web browser, IP address, and some of the cookies that
                  are installed on your device.
                  Additionally, as you browse the Site, we collect information about the individual web pages
                  or products that you view, what websites or search terms referred you to the Site, and
                  information about how you interact with the Site.
                  We refer to this automatically-collected information as "<b>Device Information</b>."
                </p>

                <p>
                  We collect Device Information using the following technologies:
                </p>

                <ul>
                  <li>
                    "Cookies” are data files that are placed on your device or computer and often include an anonymous
                    unique identifier. For more information about cookies, and how to disable cookies, visit
                    http://www.allaboutcookies.org.
                  </li>
                  <li>
                    “Log files” track actions occurring on the Site, and collect data including your IP address, browser
                    type, Internet service provider, referring/exit pages, and date/time stamps.
                  </li>
                  <li>
                    “Web beacons,” “tags,” and “pixels” are electronic files used to record information about how you
                    browse the Site.
                  </li>
                </ul>
                {/*[[INSERT DESCRIPTIONS OF OTHER TYPES OF TRACKING TECHNOLOGIES USED]]*/}

                <p>
                  Additionally when you make a purchase or attempt to make a purchase through the Site,
                  we collect certain information from you, including your name, billing address, shipping address,
                  payment information (including credit card numbers), email address, and phone number.
                  We refer to this information as “<b>Order Information</b>.”
                </p>

                {/*[[INSERT ANY OTHER INFORMATION YOU COLLECT:  OFFLINE DATA, PURCHASED MARKETING DATA/LISTS]]*/}

                <p>
                  When we talk about “Personal Information” in this Privacy Policy, we are talking both about
                  Device Information and Order Information.
                </p>
              </div>

              <div>
                <h4>
                  Purchases
                </h4>
              </div>
              <p>
                If you wish to purchase any product or service made available through our Service
                (“<b>Purchase</b>”), you may be asked to supply certain information relevant to your Purchase
                including, without limitation, your credit card number, the expiration date of your
                credit card, your billing address, your phone number and your shipping information.
              </p>

              <p>
                You represent and warrant that: (i) you have the legal right to use any credit
                card(s) or other payment method(s) in connection with any Purchase; and that (ii)
                the information you supply to us is true, correct and complete.
              </p>

              <p>
                We may employ the use of third party services for the purpose of facilitating
                payment and the completion of Purchases. By submitting your information, you grant
                us the right to provide the information to these third parties&nbsp;subject to our
                Privacy Policy.
              </p>

              <p>
                We reserve the right to refuse or cancel your order at any time for reasons
                including but not limited to: product or service availability, errors in the
                description or price of the product or service, error in your order or other
                reasons.
              </p>

              <p>
                We reserve the right to refuse or cancel your order if fraud or an unauthorized or
                illegal transaction is suspected.{' '}
              </p>

              <div>
                <h4>
                  Contests, Sweepstakes and Promotions
                </h4>
              </div>
              <p>
                Any contests, sweepstakes or other promotions (collectively, “
                <b>Promotions</b>

                ”) made available through Service may be governed by rules that are separate from
                these Terms of Service. If you participate in any Promotions, please review the
                applicable rules&nbsp;as well as our Privacy Policy. If the rules for a Promotion
                conflict with these Terms of Service, Promotion rules will apply.
              </p>

              {/*<div>*/}
              {/*  <h2>*/}
              {/*    Fee Changes*/}
              {/*  </h2>*/}
              {/*</div>*/}
              {/*<p>*/}
              {/*  Retrobie, in its sole discretion and at any time, may modify Subscription fees for the*/}
              {/*  Subscriptions. Any Subscription fee change will become effective at the end of the*/}
              {/*  then-current Billing Cycle.*/}
              {/*</p>*/}

              {/*<p>*/}
              {/*  Retrobie&nbsp;will provide you with a reasonable prior notice of any change in*/}
              {/*  Subscription fees to give you an opportunity to terminate your Subscription before*/}
              {/*  such change becomes effective.*/}
              {/*</p>*/}

              {/*<p>*/}
              {/*  Your continued use of Service after Subscription fee change comes into effect*/}
              {/*  constitutes your agreement to pay the modified Subscription fee amount.*/}
              {/*</p>*/}

              <div>
                <h4>
                  Refunds
                </h4>
              </div>
              <p>
                We issue refunds for Contracts within seven (7) days of the original purchase of the
                Contract. For more information, please refer to our{' '}
                <Link to={'/support/policies/refund-policy'}>
                  refund policy
                </Link>
              </p>

              <div>
                <h4>
                  Content
                </h4>
              </div>
              <p>
                Content found on or through this Service are the property of&nbsp;Retrobie&nbsp;or
                used with permission. You may not distribute, modify, transmit, reuse, download,
                repost, copy, or use said Content, whether in whole or in part, for commercial
                purposes or for personal gain, without express advance written permission from us.
              </p>

              <div>
                <h4>
                  Prohibited Uses
                </h4>
              </div>
              <p>
                You may use Service only for lawful purposes and in accordance with Terms. You agree
                not to use Service:
              </p>

              <ol>
                <ol type="a">
                  <li>
                    <p>
                      In any way that violates any applicable national or international law or
                      regulation.
                    </p>
                  </li>
                </ol>
              </ol>
              <p/>
              <ol>
                <ol type="a" start={2}>
                  <li>
                    <p>
                      For the purpose of exploiting, harming, or attempting to exploit or harm minors in
                      any way by exposing them to inappropriate content or otherwise.
                    </p>
                  </li>
                </ol>
              </ol>
              <p/>
              <ol>
                <ol type="a" start={3}>
                  <li>
                    <p>
                      To transmit, or procure the sending of, any advertising or promotional material,
                      including any “junk mail”, “chain letter,” “spam,” or any other similar
                      solicitation.
                    </p>
                  </li>
                </ol>
              </ol>
              <p/>
              <ol>
                <ol type="a" start={4}>
                  <li>
                    <p>
                      To impersonate or attempt to impersonate the Company, a Company employee, another
                      user, or any other person or entity.
                    </p>
                  </li>
                </ol>
              </ol>
              <p/>
              <ol>
                <ol type="a" start={5}>
                  <li>
                    <p>
                      In any way that infringes upon the rights of others, or in any way is illegal,
                      threatening, fraudulent, or harmful, or in connection with any unlawful, illegal,
                      fraudulent, or harmful purpose or activity.
                    </p>
                  </li>
                </ol>
              </ol>
              <p/>
              <ol>
                <ol type="a" start={6}>
                  <li>
                    <p>
                      To engage in any other conduct that restricts or inhibits anyone’s use or
                      enjoyment of Service, or which, as determined by us, may harm or offend Company or
                      users of Service or expose them to liability.
                    </p>
                  </li>
                </ol>
              </ol>
              <p>Additionally, you agree not to:</p>

              <ol>
                <ol type="a">
                  <li>
                    <p>
                      Use Service in any manner that could disable, overburden, damage, or impair
                      Service or interfere with any other party’s use of Service, including their
                      ability to engage in real time activities through Service.
                    </p>
                  </li>
                </ol>
              </ol>
              <p/>
              <ol>
                <ol type="a" start={2}>
                  <li>
                    <p>
                      Use any robot, spider, or other automatic device, process, or means to access
                      Service for any purpose, including monitoring or copying any of the material on
                      Service.
                    </p>
                  </li>
                </ol>
              </ol>
              <p/>
              <ol>
                <ol type="a" start={3}>
                  <li>
                    <p>
                      Use any manual process to monitor or copy any of the material on Service or for
                      any other unauthorized purpose without our prior written consent.
                    </p>
                  </li>
                </ol>
              </ol>
              <p/>
              <ol>
                <ol type="a" start={4}>
                  <li>
                    <p>
                      Use any device, software, or routine that interferes with the proper working of
                      Service.
                    </p>
                  </li>
                </ol>
              </ol>
              <p/>
              <ol>
                <ol type="a" start={5}>
                  <li>
                    <p>
                      Introduce any viruses, trojan horses, worms, logic bombs, or other material which
                      is malicious or technologically harmful.
                    </p>
                  </li>
                </ol>
              </ol>
              <p/>
              <ol>
                <ol type="a" start={6}>
                  <li>
                    <p>
                      Attempt to gain unauthorized access to, interfere with, damage, or disrupt any
                      parts of Service, the server on which Service is stored, or any server, computer,
                      or database connected to Service.
                    </p>
                  </li>
                </ol>
              </ol>
              <p/>
              <ol>
                <ol type="a" start={7}>
                  <li>
                    <p>
                      Attack Service via a denial-of-service attack or a distributed denial-of-service
                      attack.
                    </p>
                  </li>
                </ol>
              </ol>
              <p/>
              <ol>
                <ol type="a" start={8}>
                  <li>
                    <p>Take any action that may damage or falsify Company rating.</p>
                  </li>
                </ol>
              </ol>
              <ol>
                <ol type="a" start={9}>
                  <li>
                    <p>Otherwise attempt to interfere with the proper working of Service.</p>
                  </li>
                </ol>
              </ol>
              <h4>Analytics</h4>
              <p>
                We may use third-party Service Providers to monitor and analyze the use of our Service.
              </p>
              <p/>
              <h4>Google Analytics</h4>
              <p>
                Google Analytics is a web analytics service offered by Google that tracks and reports
                website traffic. Google uses the data collected to track and monitor the use of our
                Service. This data is shared with other Google services. Google may use the collected
                data to contextualise and personalise the ads of its own advertising network.
              </p>
              <p>
                For more information on the privacy practices of Google, please visit the Google Privacy
                Terms web page: &nbsp;
                <a href="https://policies.google.com/privacy?hl=en">
                  https://policies.google.com/privacy?hl=en
                </a>
              </p>
              <p>
                We also encourage you to review the Google's policy for safeguarding your data: &nbsp;
                <a href="https://support.google.com/analytics/answer/6004245">
                  https://support.google.com/analytics/answer/6004245
                </a>
              </p>
              <p/>
              {/*<p>Firebase</p>*/}
              {/*<p>Firebase is analytics service provided by Google Inc.</p>*/}
              {/*<p />*/}
              {/*<p>*/}
              {/*  You may opt-out of certain Firebase features through your mobile device settings, such*/}
              {/*  as your device advertising settings or by following the instructions provided by Google*/}
              {/*  in their Privacy Policy:*/}
              {/*  <a href="https://policies.google.com/privacy?hl=en">*/}
              {/*    https://policies.google.com/privacy?hl=en*/}
              {/*  </a>*/}
              {/*</p>*/}
              {/*<p>*/}
              {/*  For more information on what type of information Firebase collects, please visit the*/}
              {/*  Google Privacy Terms web page:*/}
              {/*  <a href="https://policies.google.com/privacy?hl=en">*/}
              {/*    https://policies.google.com/privacy?hl=en*/}
              {/*  </a>*/}
              {/*</p>*/}

              {/*<h4>Mixpanel</h4>*/}

              {/*<p>Mixpanel is provided by Mixpanel Inc.</p>*/}
              {/*<p />*/}
              {/*<p>*/}
              {/*  You can prevent Mixpanel from using your information for analytics purposes by*/}
              {/*  opting-out. To opt-out of Mixpanel service, please visit this page:*/}
              {/*  <a href="https://mixpanel.com/optout/">https://mixpanel.com/optout/</a>*/}
              {/*</p>*/}
              {/*<p>*/}
              {/*  For more information on what type of information Mixpanel collects, please visit the*/}
              {/*  Terms of Use page of Mixpanel:{' '}*/}
              {/*  <a href="https://mixpanel.com/terms/">https://mixpanel.com/terms</a>*/}
              {/*</p>*/}

              <h4>Use by minors not allowed.</h4>
              <p>
                Service is intended only for access and use by individuals at least eighteen (18) years
                old. By accessing or using any of Company, you warrant and represent that you are at
                least eighteen (18) years of age and with the full authority, right, and capacity to
                enter into this agreement and abide by all of the terms and conditions of Terms. If you
                are not at least eighteen (18) years old, you are prohibited from both the access and
                usage of Service.
              </p>
              <p>
                When you create an account with us, you guarantee that you are above the age of 18, and
                that the information you provide us is accurate, complete, and current at all times.
                Inaccurate, incomplete, or obsolete information may result in the immediate termination
                of your account on Service.
              </p>
              <p>
                You are responsible for maintaining the confidentiality of your account and password,
                including but not limited to the restriction of access to your computer and/or account.
                You agree to accept responsibility for any and all activities or actions that occur
                under your account and/or password, whether your password is with our Service or a
                third-party service. You must notify us immediately upon becoming aware of any breach of
                security or unauthorized use of your account.
              </p>

              <p>
                You may not use as a username the name of another person or entity or that is not
                lawfully available for use, a name or trademark that is subject to any rights of another
                person or entity other than you, without appropriate authorization. You may not use as a
                username any name that is offensive, vulgar or obscene.
              </p>

              <p>
                We reserve the right to refuse service, terminate accounts, remove or edit content, or
                cancel orders in our sole discretion.
              </p>

              <h4>Intellectual Property</h4>
              <p>
                Service and its original content (excluding Content provided by users), features and
                functionality are and will remain the exclusive property of&nbsp;Retrobie&nbsp;and its
                licensors. Service is protected by copyright, trademark, and other laws of&nbsp;foreign
                countries. Our trademarks and trade dress may not be used in connection with any product
                or service without the prior written consent of&nbsp;Retrobie.
              </p>

              <h4>Error Reporting and Feedback</h4>
              <p>
                You may provide us&nbsp;either directly at feedback@retrobie.com or via third
                party sites and tools&nbsp;with information and feedback concerning errors, suggestions
                for improvements, ideas, problems, complaints, and other matters related to our Service
                (“Feedback ”).
              </p>

              <p>
                You acknowledge and agree that:
                <ol type={'i'}>
                  <li>
                    you shall not retain, acquire or
                    assert any intellectual property right or other right, title or interest in or to the
                    Feedback;
                  </li>
                  <li>
                    Company may have development ideas similar to the Feedback;
                  </li>
                  <li>
                    Feedback does not contain confidential information or proprietary information from you
                    or any third party; and
                  </li>
                  <li>
                    Company is not under any obligation of confidentiality with
                    respect to the Feedback. In the event the transfer of the ownership to the Feedback is
                    not possible due to applicable mandatory laws, you grant Company and its affiliates an
                    exclusive, transferable, irrevocable, free-of-charge, sub-licensable, unlimited and
                    perpetual right to use (including copy, modify, create derivative works, publish,
                    distribute and commercialize) Feedback in any manner and for any purpose.
                  </li>
                </ol>
              </p>

              <p>
                The third party sites and tools mentioned above include the following:
              </p>

              <h4>
                Sentry
              </h4>
              <p>
                Sentry is open-source error tracking solution provided by Functional Software Inc.
                More information is available here: <a href={'https://sentry.io/privacy/'}>
                https://sentry.io/privacy/
              </a>
              </p>

              {/*<p>*/}
              {/*  <b>Firebase Crashlytics</b>*/}

              {/*</p>*/}
              {/*<p>*/}
              {/*  Firebase Crashlytics is bug reporting service provided by Google Inc.*/}
              {/*</p>*/}
              {/*<p />*/}
              {/*<p>*/}
              {/*  You may opt-out of certain Firebase features through your mobile device settings, such*/}
              {/*  as your device advertising settings or by following the instructions provided by*/}
              {/*  Google in their Privacy Policy: https://policies.google.com/privacy?hl=en*/}
              {/*</p>*/}
              {/*<p>*/}
              {/*  For more information on what type of information Firebase collects, please visit the*/}
              {/*  Google Privacy Terms web page: https://policies.google.com/privacy?hl=en{' '}*/}
              {/*</p>*/}
              <h4>
                <b>Links To Other Web Sites</b>
              </h4>
              <p>
                Our Service may contain links to third party web sites or services that are not owned or
                controlled by&nbsp;Retrobie
              </p>
              <p>
                Retrobie&nbsp;has no control over, and assumes no responsibility for the content,
                privacy policies, or practices of any third party web sites or services. We do not
                warrant the offerings of any of these entities/individuals or their websites.
              </p>

              <p>
                YOU ACKNOWLEDGE AND AGREE THAT <b>RETROBIE</b> SHALL NOT BE RESPONSIBLE OR LIABLE,
                DIRECTLY OR INDIRECTLY, FOR ANY
                DAMAGE OR LOSS CAUSED OR ALLEGED TO BE CAUSED BY OR IN CONNECTION WITH USE OF OR
                RELIANCE ON ANY SUCH CONTENT, GOODS OR SERVICES AVAILABLE ON OR THROUGH ANY SUCH THIRD
                PARTY WEB SITES OR SERVICES.
              </p>

              <p>
                WE STRONGLY ADVISE YOU TO READ THE TERMS OF SERVICE AND PRIVACY POLICIES OF ANY THIRD
                PARTY WEB SITES OR SERVICES THAT YOU VISIT.
              </p>
              <h4>Disclaimer Of Warranty</h4>
              <p>
                THESE SERVICES ARE PROVIDED BY COMPANY ON AN “AS IS” AND “AS AVAILABLE” BASIS. COMPANY
                MAKES NO REPRESENTATIONS OR WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, AS TO THE
                OPERATION OF THEIR SERVICES, OR THE INFORMATION, CONTENT OR MATERIALS INCLUDED THEREIN.
                YOU EXPRESSLY AGREE THAT YOUR USE OF THESE SERVICES, THEIR CONTENT, AND ANY SERVICES OR
                ITEMS OBTAINED FROM US IS AT YOUR SOLE RISK.
              </p>

              <p>
                NEITHER COMPANY NOR ANY PERSON ASSOCIATED WITH COMPANY MAKES ANY WARRANTY OR
                REPRESENTATION WITH RESPECT TO THE COMPLETENESS, SECURITY, RELIABILITY, QUALITY,
                ACCURACY, OR AVAILABILITY OF THE SERVICES. WITHOUT LIMITING THE FOREGOING, NEITHER
                COMPANY NOR ANYONE ASSOCIATED WITH COMPANY REPRESENTS OR WARRANTS THAT THE SERVICES,
                THEIR CONTENT, OR ANY SERVICES OR ITEMS OBTAINED THROUGH THE SERVICES WILL BE ACCURATE,
                RELIABLE, ERROR-FREE, OR UNINTERRUPTED, THAT DEFECTS WILL BE CORRECTED, THAT THE
                SERVICES OR THE SERVER THAT MAKES IT AVAILABLE ARE FREE OF VIRUSES OR OTHER HARMFUL
                COMPONENTS OR THAT THE SERVICES OR ANY SERVICES OR ITEMS OBTAINED THROUGH THE SERVICES
                WILL OTHERWISE MEET YOUR NEEDS OR EXPECTATIONS.
              </p>
              <p>
                COMPANY HEREBY DISCLAIMS ALL WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED,
                STATUTORY, OR OTHERWISE, INCLUDING BUT NOT LIMITED TO ANY WARRANTIES OF MERCHANTABILITY,
                NON-INFRINGEMENT, AND FITNESS FOR PARTICULAR PURPOSE.
              </p>
              <p>
                THE FOREGOING DOES NOT AFFECT ANY WARRANTIES WHICH CANNOT BE EXCLUDED OR LIMITED UNDER
                APPLICABLE LAW.
              </p>

              <h4>Limitation Of Liability</h4>
              <p>
                EXCEPT AS PROHIBITED BY LAW, YOU WILL HOLD US AND OUR OFFICERS, DIRECTORS, EMPLOYEES,
                AND AGENTS HARMLESS FOR ANY INDIRECT, PUNITIVE, SPECIAL, INCIDENTAL, OR CONSEQUENTIAL
                DAMAGE, HOWEVER IT ARISES (INCLUDING ATTORNEYS' FEES AND ALL RELATED COSTS AND EXPENSES
                OF LITIGATION AND ARBITRATION, OR AT TRIAL OR ON APPEAL, IF ANY, WHETHER OR NOT
                LITIGATION OR ARBITRATION IS INSTITUTED), WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE,
                OR OTHER TORTIOUS ACTION, OR ARISING OUT OF OR IN CONNECTION WITH THIS AGREEMENT,
                INCLUDING WITHOUT LIMITATION ANY CLAIM FOR PERSONAL INJURY OR PROPERTY DAMAGE, ARISING
                FROM THIS AGREEMENT AND ANY VIOLATION BY YOU OF ANY FEDERAL, STATE, OR LOCAL LAWS,
                STATUTES, RULES, OR REGULATIONS, EVEN IF COMPANY HAS BEEN PREVIOUSLY ADVISED OF THE
                POSSIBILITY OF SUCH DAMAGE. EXCEPT AS PROHIBITED BY LAW, IF THERE IS LIABILITY FOUND ON
                THE PART OF COMPANY, IT WILL BE LIMITED TO THE AMOUNT PAID FOR THE PRODUCTS AND/OR
                SERVICES, AND UNDER NO CIRCUMSTANCES WILL THERE BE CONSEQUENTIAL OR PUNITIVE DAMAGES.
                SOME STATES DO NOT ALLOW THE EXCLUSION OR LIMITATION OF PUNITIVE, INCIDENTAL OR
                CONSEQUENTIAL DAMAGES, SO THE PRIOR LIMITATION OR EXCLUSION MAY NOT APPLY TO YOU.
              </p>

              <h4>Termination</h4>
              <p>
                We may terminate or suspend your account and bar access to Service immediately, without
                prior notice or liability, under our sole discretion, for any reason whatsoever and
                without limitation, including but not limited to a breach of Terms.
              </p>

              <p>If you wish to terminate your account, you may simply discontinue using Service.</p>

              <p>
                All provisions of Terms which by their nature should survive termination shall survive
                termination, including, without limitation, ownership provisions, warranty disclaimers,
                indemnity and limitations of liability.
              </p>

              <h4>Governing Law</h4>
              <p>
                These Terms shall be governed and construed in accordance with the laws
                of&nbsp;Kenya&nbsp;without regard to its conflict of law provisions.
              </p>

              <p>
                Our failure to enforce any right or provision of these Terms will not be considered a
                waiver of those rights. If any provision of these Terms is held to be invalid or
                unenforceable by a court, the remaining provisions of these Terms will remain in effect.
                These Terms constitute the entire agreement between us regarding our Service and
                supersede and replace any prior agreements we might have had between us regarding
                Service.
              </p>

              <h4>Changes To Service</h4>
              <p>
                We reserve the right to withdraw or amend our Service, and any service or material we
                provide via Service, in our sole discretion without notice. We will not be liable if for
                any reason all or any part of Service is unavailable at any time or for any period. From
                time to time, we may restrict access to some parts of Service, or the entire Service, to
                users, including registered users.
              </p>

              <h4>Amendments To Terms</h4>

              <p>
                We may amend Terms at any time by posting the amended terms on this site. It is your
                responsibility to review these Terms periodically.
              </p>

              <p>
                Your continued use of the Platform following the posting of revised Terms means that you
                accept and agree to the changes. You are expected to check this page frequently so you
                are aware of any changes, as they are binding on you.
              </p>

              <p>
                By continuing to access or use our Service after any revisions become effective, you
                agree to be bound by the revised terms. If you do not agree to the new terms, you are no
                longer authorized to use Service.
              </p>

              <h4>
                <b>Waiver And Severability</b>
              </h4>
              <p>
                No waiver by Company of any term or condition set forth in Terms shall be deemed a
                further or continuing waiver of such term or condition or a waiver of any other term or
                condition, and any failure of Company to assert a right or provision under Terms shall
                not constitute a waiver of such right or provision.
              </p>
              <p>
                If any provision of Terms is held by a court or other tribunal of competent jurisdiction
                to be invalid, illegal or unenforceable for any reason, such provision shall be
                eliminated or limited to the minimum extent such that the remaining provisions of Terms
                will continue in full force and effect.
              </p>
              <h4>
                <b>Acknowledgement</b>
              </h4>
              <p>
                BY USING SERVICE OR OTHER SERVICES PROVIDED BY US, YOU ACKNOWLEDGE THAT YOU HAVE READ
                THESE TERMS OF SERVICE AND AGREE TO BE BOUND BY THEM.
              </p>

              <p>
                <b>Contact</b>
              </p>
              <p>Please send your feedback, comments, requests for technical support:</p>
              <p>By email: customer.support@retrobie.com.</p>
            </div>
          </SupportParent>
        </CenterPageContent>

      </Layout>
    </>
  );
};

const TosParent = styled.div`
  padding: 24px 48px;
  p,
  li {
    color: #444;
  }
`;

export default Tos;
