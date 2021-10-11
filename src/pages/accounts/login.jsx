import React, {useState} from 'react';
import Layout from '../../components/Layout';
import {Button, Checkbox} from 'bloomer';
import styled from 'styled-components';
import LoginVector from '../../assets/images/vectors/login.svg';
import {Link} from 'react-router-dom';
import {Form, Formik} from 'formik';
import TextField from '../../components/input/TextField';
import * as Yup from 'yup';
import {useDispatch} from 'react-redux';
import {loginUserAction} from '../../state/actions';
import {extractErrorMessage} from '../../helpers';
import {notify} from '../../helpers/views';
import {useApi} from '../../network';
import posthog from 'posthog-js';
import responseHelper from '../../helpers/ResponseHelper';

const FormParent = styled.div`
  display: grid;
  justify-items: center;
  
  form {
    width: 100%;
    padding: 48px 24px;
    max-width: 600px;
  }
`;

const UserLoginSchema = Yup.object().shape({
    login: Yup.string()
        .email("Please enter a valid email address")
        .required("This field is required"),
    password: Yup.string()
        .required("This field is required")
        .min(8, "Too short")
        .max(64, "Too long")
})

export default function LoginUser(props) {
  const api = useApi();

  const [staySignedIn, setStaySignedIn] = useState(true);

  const dispatch = useDispatch();

  const setUserLoggedIn = (payload) => dispatch(loginUserAction(payload));

  return (
    <>
      <Layout hideNav
              TopRightComponent={() => (
                <Link to={'/accounts/register'}>
                  <Button>
                    Create a New Account
                  </Button>
                </Link>
              )}
      >
        <FormParent>
          <Formik
            initialValues={{
              login: '',
              password: '',
            }}
            onSubmit={async (values, {setSubmitting, setFieldError, setErrors}) => {
              setSubmitting(true);
              try {
                const {data} = await dispatch(api.accounts.login(values));
                setSubmitting(false);

                if (data.accessToken && data.refreshToken) {
                  // This user doesn't have MFA enabled
                  setUserLoggedIn(data);
                  await posthog.identify(data.email);
                  if (props.callback && typeof props.callback === 'function') {
                    props.callback(null, data);
                  } else {
                    props.history.push('/');
                  }
                } else {
                  //todo: two factor authentication
                }

              } catch (e) {
                setSubmitting(false);
                const message = extractErrorMessage(e);
                notify('error', message);

                const errors = responseHelper.getFormErrorsFromResponse({e, setFieldError});
                setErrors(errors);

                if (props.callback && typeof props.callback === 'function') {
                  props.callback(e, null);
                }
              }
            }}
            validationSchema={UserLoginSchema}
          >
            {({isSubmitting, values}) => (
              <Form>
                <div>
                  <img src={LoginVector} alt={'login vector'} />
                  <h2>
                    Sign in.
                  </h2>
                  <h4 style={{color: 'var(--color-description)', fontWeight: 400}}>
                    Login to your account
                  </h4>
                </div>

                <div style={{marginBottom: 24}}>
                  <TextField placeholder={'eg. jackierobinson@gmail.com'}
                             label={'Email address'}
                             name={'login'}
                             type={'email'}
                  />
                </div>
                <div>
                  <TextField
                    type={'password'}
                    placeholder={`●●●●●●●●●●●●`}
                    name={'password'}
                    label={'Password'}
                  />
                </div>
                <div style={{marginTop: 8}}>

                  <Checkbox
                    checked={staySignedIn}
                    onChange={(e) => {
                      setStaySignedIn(e.target.checked);
                    }}
                  >
                    <label>Keep me signed in</label>
                  </Checkbox>
                </div>
                <div style={{marginTop: 16, textAlign: 'center'}}>
                  <Button
                    isColor={'primary'}
                    type={'submit'}
                    disabled={isSubmitting || !Object.values(values).length}
                    isLoading={isSubmitting}
                    style={{minWidth: 250}}>
                    Sign in
                  </Button>
                  <p>
                    Forgot your password? &nbsp;
                    <a href={'/accounts/forgot-password'}>
                      Reset it
                    </a>
                  </p>
                </div>
              </Form>
            )}
          </Formik>
        </FormParent>
      </Layout>
    </>
  );
}
