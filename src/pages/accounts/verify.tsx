import React, {useEffect, useState} from 'react';
import Layout from '../../components/Layout';
import {Form, Formik} from 'formik';
import styled from 'styled-components';
import {Button, Column, Columns, Input} from 'bloomer';
import {notify} from '../../helpers/views';
import {extractErrorMessage} from '../../helpers';
import VerifiedIcon from '../../assets/images/icons/verified.svg';
import jwtDecode from 'jwt-decode';
import * as Yup from 'yup';
import InputMask from 'react-input-mask';
import {useApi} from '../../network';
import {RootStateOrAny, useDispatch, useSelector} from 'react-redux';
import {UserState} from '../../state/reducers/userReducers';
import {EmptyState} from '../../components';
import {HelpIcon, TickDark} from '../../constants/icons';
import {Link} from 'react-router-dom';
import {loginUserAction} from '../../state/actions';
import {LoginResponseType} from '../../types';
import qs from 'qs'
import ConfirmSendVerifyCodeModal from './modals/ConfirmSendVerifyCodeModal';

const FormParent = styled.div`
  display: flex;
  justify-content: center;
  padding: 0 48px;
  min-height: 400px;
  align-items: center;
  max-width: 800px;
  margin: 0 auto;

  form {
    width: 100%;
    max-width: 800px;
  }
  
  .footer {
    width: min-content;
    button {
      min-width: 300px;
    }
  }
`;


const VerifyAccountCodeSchema = Yup.object().shape({
    code: Yup.string()
        .required("This field is required")
        .min(6, "Too short")
        .max(6, "Too long")
        .matches(/^[0-9]*$/, "Invalid code.")
});

function setFormSubmitted(submitted) {
    localStorage.setItem("submitted_v_code", String(submitted));
}

/**
 * Once registered a user is brought to this page. The registration response contains
 * an access token and refresh token, effectively allowing us to log in the user.
 *
 * This route extracts the user's email from the token and requests for a TOTP code
 *
 * @constructor
 */
export default function VerifyAccount(props) {
  const api = useApi();
  const dispatch = useDispatch();
  const countdownTime = 60;

  const [timeRemaining, setTimeRemaining] = useState(0);

  const user: UserState = useSelector((state: RootStateOrAny) => state.user);

  const [isRequestingTOTP, setIsRequestingTOTP] = useState(false);
  const [isConfirmModalEmailOpen, setIsConfirmModalEmailOpen] = useState(false);

  const accessToken = user?.tokens?.accessToken
  const decodedAccessToken = accessToken ? jwtDecode(accessToken): undefined;

  // Track whether this form has been submitted or not.
  // If it's been submitted, there's a 60-second countdown timer
  // before a user can try again.
  const submitted = Boolean(localStorage.getItem('submitted_v_code'));

  useEffect(() => {
    // If the timer is at 0, allow the user to re-request a code
    if (timeRemaining === 0) setFormSubmitted(false);

    // If the form has been submitted, start the countdown timer
    if (submitted) {
      const timer = timeRemaining > 0 && setInterval(() => setTimeRemaining(timeRemaining - 1), 1000);
      return () => clearInterval(timer);
    }

    return undefined;
  });

  const searchQuery = props.history.location.search;

  useEffect(()=> {
    if (searchQuery){
      const sendCodeOnMount = qs.parse(searchQuery?.slice(1));
      if (Boolean(sendCodeOnMount?.sendCode)){
        setIsConfirmModalEmailOpen(true)
      }
    }
  }, [
    searchQuery
  ])

  if (!user?.isLoggedIn){
    return (
      <Layout>
        <EmptyState
          icon={HelpIcon}
          title={"A bit lost, aren't you?"}
          message={"You need to be logged in to access this page."}
        />
      </Layout>
    )
  }

  if (user.isVerified || decodedAccessToken.isVerified){
    return (
      <Layout>
        <EmptyState
          centerAlign={true}
          icon={TickDark}
          title={"You're already verified."}
          message={"No need to take this action again."}
          prompt={()=> (
            <Link to={'/'}>
              <Button
                style={{width: '100%'}}
                isColor={'primary'}>
                Go to home page
              </Button>
            </Link>
          )}
        />
      </Layout>
    )
  }

  function startTimer() {
    setTimeRemaining(countdownTime);
  }

  async function sendResetCode(){
    setIsRequestingTOTP(true);
    // Only request for a new code if a
    // token exits locally
    if (decodedAccessToken) {
      try {
        // @ts-ignore
        const {data} = await dispatch(
          api.accounts.requestTOTP({
            email: decodedAccessToken.email,
            purpose: 'verify-account',
            clientStrategy: 'email',
          }),
        );
        notify('success', data.message);
      } catch (e) {
        const message = extractErrorMessage(e);
        notify('error', message);
      }

      setIsRequestingTOTP(false);
      // Restart the countdown timer.
      setFormSubmitted(true);
      startTimer();
    }
  }

  const setUserLoggedIn = (payload: LoginResponseType) => dispatch(loginUserAction(payload));

  return (
    <>
      <Layout
        internal
        withoutNav={true}>
        <FormParent>
          <Formik
            initialValues={{
              code: '',
            }}
            validate={async values => {
              const errors = {};

              try {
                await VerifyAccountCodeSchema.validate(values);
              } catch (e) {
                errors[e.path] = e.message;
                return errors;
              }

              return errors;
            }}
            onSubmit={async (values, {setSubmitting}) => {
              setSubmitting(true);
              try {
                // Submit the user's code together with their email address.
                // {status: "", message: ""}
                // @ts-ignore
                const {data} = await dispatch(
                  api.accounts.verify({
                    code: String(values.code),
                    email: decodedAccessToken.email,
                  }),
                );
                setFormSubmitted(true);
                notify('success', data.message);
                setSubmitting(false);
                startTimer();
                setUserLoggedIn(data);
                props.history.push('/');
              } catch (e) {
                setSubmitting(false);
                const message = extractErrorMessage(e);
                notify('error', message);
              }
            }}>
            {({isSubmitting, setFieldValue, errors}) => (
              <Form>
                <div>
                  <div>
                    <img style={{width: 48}} src={VerifiedIcon} alt={'verification icon'} />
                  </div>
                  <h2>Verify your account</h2>
                  <h4 style={{color: 'var(--color-description)', fontWeight: 400}}>
                    {/*// todo: provide way to correct email?*/}
                    A 6-digit code has been sent to &nbsp;
                    <strong>
                      {decodedAccessToken?.email || 'your email address'}
                    </strong>.
                    Copy-paste or enter it here to proceed.
                  </h4>
                </div>
                <div>
                  <Columns>
                    <Column isSize={{desktop: 'full'}}>
                      <InputMask mask="999-999"
                                 onChange={(e) => {
                                   const value = e.target.value;
                                   if (value)
                                     setFieldValue('code', value.replace('-', ''));
                                 }}
                      >
                        {
                          (inputProps) => (
                            <Input
                              placeholder={'eg. 225-663'} {...inputProps}
                              name={'code'}
                              label={'Your 6-digit code'}
                              type="text" />
                          )
                        }
                      </InputMask>
                      {
                        errors.code && (
                          <div className={'error'} style={{marginTop: 4, marginLeft: 8}}>
                            <small style={{color: 'var(--color-error)', fontWeight: 'bold'}}>
                              {errors.code}
                            </small>
                          </div>
                        )
                      }
                    </Column>
                  </Columns>
                </div>
                <div className={'footer'}>
                  <div style={{marginTop: '24px', display: 'flex', gap: 24}}>
                    <Button
                      isColor={'primary'}
                      type={'submit'}
                      disabled={isRequestingTOTP}
                      isLoading={isSubmitting}
                      style={{minWidth: 250}}>
                      Confirm code
                    </Button>
                    <Button
                      isColor={'secondary'}
                      isLoading={isRequestingTOTP}
                      onClick={async () => sendResetCode()}
                      disabled={timeRemaining !== 0 && submitted}
                      style={{minWidth: 250}}
                    >
                      {
                        submitted && timeRemaining !== 0 ?
                          `Retry in ${timeRemaining}s`
                          : 'Resend code'
                      }
                    </Button>
                  </div>
                </div>
              </Form>
            )}

          </Formik>
        </FormParent>
        <ConfirmSendVerifyCodeModal
          email={decodedAccessToken.email}
          isActive={isConfirmModalEmailOpen}
          onClose={() => setIsConfirmModalEmailOpen(false)}
          onConfirm={() => {
            sendResetCode()
            setIsConfirmModalEmailOpen(false);
          }}
        />
      </Layout>
    </>
  );
}
