import React from 'react';
import Layout from '../../components/Layout';
import styled from 'styled-components';
import {Button} from 'bloomer';
import ForgotPasswordVector from '../../assets/images/vectors/forgot-password.svg';
import {Form, Formik} from 'formik';
import * as Yup from 'yup';
import {extractErrorMessage} from '../../helpers';
import {notify} from '../../helpers/views';
import TextField from '../../components/input/TextField';
import {useApi} from '../../network';
import {useDispatch} from 'react-redux';

const FormParent = styled.div`
  display: flex;
  justify-content: center;

  form {
    width: 100%;
    max-width: 600px;
  }
`;

const ResetPasswordSchema = Yup.object().shape({
    email: Yup.string()
        .email("Please enter a valid email address")
        .required("This field is required")
});

export default function ForgotPassword(props) {

  const api = useApi();
  const dispatch = useDispatch();

    return (
        <>
            <div>
                <Layout
                  internal
                  withoutNav={true}>
                    <FormParent>
                        <Formik initialValues={{}}
                                validationSchema={ResetPasswordSchema}
                                onSubmit={async (values, {setSubmitting}) => {
                                    setSubmitting(true);
                                    try {
                                        const {data} = await dispatch(api.accounts.requestPasswordReset(values));
                                        setSubmitting(false);
                                        notify('info', data.message);

                                        sessionStorage.setItem('password_reset_email', values.email);
                                        props.history.push('/accounts/reset-password');
                                    } catch (e) {
                                        setSubmitting(false)
                                        const message = extractErrorMessage(e);
                                        notify('error', message);
                                    }
                                }}
                        >
                            {({isSubmitting})=> (
                                <Form>
                                    <div>
                                        <img src={ForgotPasswordVector} alt={'forgot password vector'}/>
                                        <h2>
                                            Reset your password.
                                        </h2>
                                        <h4 style={{fontWeight: 400, color: 'var(--color-description)'}}>
                                            A reset code will be sent to your email address.
                                        </h4>
                                    </div>
                                    <div>
                                        <TextField label={'Email address'}
                                                   placeholder={'jacinta@outlook.com'}
                                                   name={'email'}
                                                   type={'email'}/>
                                    </div>
                                    <div style={{marginTop: 24}}>
                                        <Button isColor={'primary'}
                                                isLoading={isSubmitting}
                                                type={'submit'}
                                        >
                                            Send reset code
                                        </Button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </FormParent>

                </Layout>
            </div>
        </>
    );
}
