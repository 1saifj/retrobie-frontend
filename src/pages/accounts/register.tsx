import React, {useState} from 'react';
import Layout from '../../components/Layout';
import {Button, Column, Columns} from 'bloomer';
import styled from 'styled-components';
import RegisterVector from '../../assets/images/vectors/register.svg';
import {Form, Formik} from 'formik';
import TextField from '../../components/input/TextField';
import {extractErrorMessage} from '../../helpers';
import {notify} from '../../helpers/views';
import {Eye} from '../../constants/icons';
import * as Yup from 'yup';
import {Link} from 'react-router-dom';
import {loginUserAction} from '../../state/actions';
import {useDispatch} from 'react-redux';
import {useAuth} from '../../network';

const MESSAGES ={
    REQUIRED: "This field is required.",
    TOO_SHORT: "This field is too short.",
    TOO_LONG: "This field is too long."
}

const RegisterValidationSchema = Yup.object().shape({
  firstName: Yup.string()
    .required(MESSAGES.REQUIRED)
    .min(2, MESSAGES.TOO_SHORT)
    .max(64, MESSAGES.TOO_LONG),
  lastName: Yup.string()
    .required(MESSAGES.REQUIRED)
    .min(2, MESSAGES.TOO_SHORT)
    .max(64, MESSAGES.TOO_LONG),
  email: Yup.string()
    .required(MESSAGES.REQUIRED)
    .email('Please provide a valid email'),
  phoneNumber: Yup.string()
    .required(MESSAGES.REQUIRED)
    .matches(/^0(7(?:(?:[129][0-9])|(?:0[0-8])|(4[0-1]))[0-9]{6})$/, 'Please provide a valid phone number.'),
  password: Yup.string().required(MESSAGES.REQUIRED)
    .min(8, 'Your password should be at least 8 characters long')
    .max(128, MESSAGES.TOO_LONG)
    .matches(/.*[0-9].*/, 'Please include at least one number')
    .matches(/.*[A-Z].*/, 'Please include at least one uppercase letter'),

});

export const FormParent = styled.div`
  display: flex;
  justify-content: center;

  form {
    width: 100%;
    max-width: 800px;
  }
  
  .footer {
    button {
      max-width: 300px;
      width: 100%;
    }
  }
`;

const RegisterUser = (props) => {

    const api = useAuth();

    const [, setFormErrors] = useState([])

    const [passwordShown, setPasswordShown] = useState(false);

    const dispatch = useDispatch();

    const setUserLoggedIn = payload => dispatch(loginUserAction(payload));

    // function getErrors(): {[key: string]: string} {
    //     if (formErrors.length) {
    //         const errors = {};
    //         formErrors.forEach(err=> {
    //             errors[err.field] = err.messages
    //         })
    //         return errors;
    //     }
    //
    //     return undefined;
    // }

    return (
      <>
          <div>
              <Layout
                withoutNav={true}
                topRightButton={() => {
                    return (
                      <>
                          <Link to={'/accounts/login'}>
                              <Button>
                                  Sign in Instead
                              </Button>
                          </Link>
                      </>
                    );
                }}
              >
                  <FormParent>
                      <Formik
                        initialValues={{
                            firstName: '',
                            lastName: '',
                            password: '',
                            phoneNumber: '',
                            email: ''
                        }}
                        // validate={async values => {
                        //   // errors from the server, if any
                        //   let errors = getErrors();
                        //
                        //   // If we get errors from the server
                        //   if (errors) {
                        //     // Go through the keys {field: error_message}
                        //     Object.keys(values).forEach(field => {
                        //       try {
                        //         // Validate the field value
                        //         const isValid = Yup.reach(RegisterValidationSchema, field).validateSync(values[field]);
                        //         // If it's valid, remove any error
                        //         if (isValid) {
                        //           errors[field] = undefined;
                        //           // Don't forget to reset the state
                        //           // @ts-ignore
                        //           // setFormErrors(errors);
                        //         }
                        //
                        //       } catch (e) {
                        //         // The messages should be synced between frontend
                        //         // and backend to prevent a disruption in the UI flow
                        //         errors[field] = e.message;
                        //       }
                        //     });
                        //     return errors;
                        //   } else {
                        //     errors = {};
                        //
                        //     try {
                        //       await RegisterValidationSchema.validate(values);
                        //       return undefined;
                        //     } catch (e) {
                        //       errors[e.path] = e.message;
                        //       return errors;
                        //     }
                        //   }
                        //
                        // }}
                        validationSchema={RegisterValidationSchema}
                        onSubmit={async (values, {setSubmitting, setFieldError}) => {
                            setSubmitting(true);
                            try {
                                // {message: "", accessToken: "", refreshToken: ""}
                                // @ts-ignore
                                const {data} = await dispatch(api.accounts.register(values));
                                notify('success', data.message);
                                setUserLoggedIn(data);
                                setSubmitting(false);
                                // // The user is effectively logged in at this point.
                                // // We redirect them to the 'verify your account' page
                                // // But if they navigate away, they will still be able to
                                // // Access certain sections of the app.
                                props.history.push('/accounts/verify');

                            } catch (e) {
                                if (e.response && e.response.data.errors) {
                                    notify('error', e.response.data.message);
                                    const responseErrors = e.response.data.errors;
                                    const errors = [];
                                    responseErrors.forEach(error => {
                                        setFieldError(error.path, error['messages'].join('\n'));
                                        errors.push({field: error.path, messages: error['messages'].join('\n')});
                                    });
                                    setFormErrors(errors);
                                } else {
                                    const message = extractErrorMessage(e);
                                    notify('error', message);
                                }
                                setSubmitting(false);
                            }
                        }}
                      >
                          {({isSubmitting, }) => (
                            <Form style={{padding: '0 24px'}}>
                                <div style={{marginBottom: 36}}>
                                    <div>
                                        <img src={RegisterVector} alt={'login icon'} />
                                    </div>
                                    <h2>
                                        Sign up.
                                    </h2>
                                    <h4 style={{color: 'var(--color-description)', fontWeight: 400}}>
                                        Create a new account to enjoy the variety of
                                        deals and products we have in store for you.
                                    </h4>
                                </div>
                                <Columns>
                                    <Column isSize={{desktop: '1/2'}}>
                                        <TextField
                                          placeholder={'eg. Jack'}
                                          name="firstName"
                                          type={'text'}
                                          label={'First name'}
                                        />
                                    </Column>
                                    <Column isSize={{desktop: '1/2'}}>
                                        <TextField
                                          placeholder={'eg. Daniel'}
                                          label={'Last name'}
                                          type={'text'}
                                          name={'lastName'}
                                        />
                                    </Column>
                                </Columns>
                                <Columns>
                                    <Column isSize={{desktop: '1/2'}}>
                                        <TextField
                                          placeholder={'mail@gmail.com'}
                                          label={'Email address'}
                                          type={'text'}
                                          name={'email'}
                                        />
                                    </Column>
                                    <Column isSize={{desktop: '1/2'}}>
                                        <TextField
                                          placeholder={'eg. +254 728 566 986'}
                                          label={'Phone number'}
                                          type={'phone'}
                                          name={'phoneNumber'}
                                        />
                                    </Column>
                                </Columns>
                                <Columns>
                                    <Column isSize={{desktop: '1/2'}}>
                                        <TextField
                                          type={passwordShown ? 'text' : 'password'}
                                          label={'Password'}
                                          icon={Eye}
                                          buttonAction={(isButtonActive) => {
                                              setPasswordShown(isButtonActive);
                                          }}
                                          placeholder={'●●●●●●●●●●●●'}
                                          name={'password'}
                                        />
                                    </Column>
                                </Columns>
                                <div>
                                    <small style={{display: 'inline'}}>
                                        By signing up, you agree to the&nbsp;

                                        <a href={'/company/terms-of-service'} style={{fontSize: 'unset'}}>
                                            terms and conditions
                                        </a>
                                    </small>
                                </div>
                                <div style={{textAlign: 'center'}} className={'footer'}>

                                    <div style={{marginTop: '24px'}}>
                                        <Button
                                          isColor={'primary'}
                                          type={'submit'}
                                          disabled={isSubmitting}
                                          isLoading={isSubmitting}
                                          style={{minWidth: 300}}>
                                            Create account
                                        </Button>
                                    </div>


                                    {/*<div style={{marginTop: 8}}>*/}
                                    {/*    <Button>*/}
                                    {/*        <img src={GoogleLogoVector}*/}
                                    {/*             alt={'google logo'}*/}
                                    {/*             style={{width: 24, marginRight: 12}} />*/}
                                    {/*        Sign up with Google*/}
                                    {/*    </Button>*/}
                                    {/*</div>*/}

                                    {/*<div style={{marginTop: 8}}>*/}
                                    {/*    <Button>*/}
                                    {/*        <img src={FacebookLogoVector}*/}
                                    {/*             alt={'facebook logo'}*/}
                                    {/*             style={{width: 22, marginRight: 8}} />*/}
                                    {/*        Sign up with Facebook*/}
                                    {/*    </Button>*/}
                                    {/*</div>*/}
                                    <div style={{textAlign: 'center'}}>
                                        <p>
                                            Forgot your password? &nbsp;
                                            <a href={'/accounts/forgot-password'}>
                                                Reset it.
                                            </a>
                                        </p>
                                    </div>
                                </div>
                            </Form>
                          )}
                      </Formik>
                  </FormParent>
              </Layout>
          </div>
      </>
    );
};

export default RegisterUser;