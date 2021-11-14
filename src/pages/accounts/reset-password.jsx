import React, {useState} from 'react';
import Layout from '../../components/Layout';
import {Form, Formik} from 'formik';
import {Button, Field, Input} from 'bloomer';
import TextField from '../../components/input/TextField';
import styled from 'styled-components';
import * as Yup from 'yup';
import {notify} from '../../helpers/views';
import {extractErrorMessage} from '../../helpers';
import InputMask from 'react-input-mask';
import {logoutUserAction} from '../../state/actions';
import {useDispatch} from 'react-redux';
import {useApi} from '../../network';

const FormParent = styled.div`
  display: flex;
  justify-content: center;

  form {
    width: 100%;
    max-width: 600px;
    padding: 48px 24px;
  }
  
  .footer {
    button {
      max-width: 300px;
      width: 100%;
    }
  }
`;

function equalTo(ref, msg) {
    return Yup.mixed().test({
        name: 'equalTo',
        exclusive: false,
        message: msg || '${path} must be the same as ${reference}',
        params: {
            reference: ref.path,
        },
        test: function(value) {
            return value === this.resolve(ref);
        },
    });
}
Yup.addMethod(Yup.string, 'equalTo', equalTo);


const ResetPasswordSchema = Yup.object().shape({
    resetCode: Yup.string()
        .required("This field is required")
        .length(6, "Invalid code"),
    newPassword: Yup.string()
        .required("This field is required")
        .min(8, "Your password should be at least 8 characters long.")
        .max(64, "Too long")
        .matches(/.*[0-9].*/, "Please include at least one number")
        .matches(/.*[A-Z].*/, "Please include at least one uppercase letter")
    ,
    newPasswordConfirmation: Yup.string()
        .required("This field is required")
        .equalTo(Yup.ref('newPassword'), 'Passwords must match')

});

export default function ResetPassword ({history}) {

    const [formErrors, setFormErrors] = useState([])

    const api = useApi();
    const dispatch = useDispatch();
    const logOut = () => {
        dispatch(logoutUserAction())
    };

    const getErrors = ()=> {
        if (formErrors.length) {
            const errors = {};
            formErrors.forEach(err=> {
                errors[err.field] = err.messages
            })
            return errors;
        }

    }

    return (
      <>
          <Layout>
              <FormParent
                style={{marginTop: 48}}>
                  <Formik
                    initialValues={{}}
                    validate={async values => {
                        // errors from the server, if any
                        let errors = getErrors();

                        // If we get errors from the server
                        if (errors) {
                            // Go through the keys {field: error_message}
                            Object.keys(values).forEach(field => {
                                try {
                                    // Validate the field value
                                    const isValid = Yup.reach(ResetPasswordSchema, field).validateSync(values[field]);
                                    // If it's valid, remove any error
                                    if (isValid) {
                                        errors[field] = undefined;
                                        // Don't forget to reset the state
                                        setFormErrors(errors);
                                    }

                                } catch (e) {
                                    // The messages should be synced between frontend
                                    // and backend to prevent a disruption in the UI flow
                                    errors[field] = e.message;
                                }
                            });
                            return errors;
                        }

                        errors = {};

                        try {
                            await ResetPasswordSchema.validate(values);
                        } catch (e) {
                            errors[e.path] = e.message;
                            return errors;
                        }

                    }}

                    onSubmit={async (values, {setSubmitting, setFieldError}) => {
                        setSubmitting(true);

                        const email = sessionStorage.getItem('password_reset_email');
                        if (email) {
                            try {
                                const {data} = await dispatch(
                                  api.accounts.resetPassword({
                                      email,
                                      resetCode: values.resetCode,
                                      newPassword: values.newPassword,
                                  }),
                                );
                                notify('success', data.message);

                                logOut();

                                navigate('/accounts/login');
                            } catch (e) {
                                const message = extractErrorMessage(e);

                                if (e.response && e.response.data.errors) {
                                    notify('error', message);
                                    const responseErrors = e.response.data.errors;
                                    const errors = [];
                                    responseErrors.forEach(error => {
                                        setFieldError(error.path, error['messages'].join('\n'));
                                        errors.push({field: error.path, messages: error['messages'].join('\n')});
                                    });
                                    setFormErrors(errors);
                                } else {
                                    notify('error', message);
                                }

                            }
                        } else {
                            // If key is missing for whatever reason,
                            // push user to the forgot-password page
                          navigate('/accounts/forgot-password');
                        }
                    }}
                  >
                      {({isSubmitting, setFieldValue, errors}) => (
                        <Form style={{maxWidth: 600}}>
                            <Field>
                                <h2>
                                    Create a new password
                                </h2>
                                <h4 style={{fontWeight: 400, color: 'var(--color-description)'}}>
                                    Enter the code you received in your email and your new password.
                                </h4>
                            </Field>
                            <Field>
                                <InputMask maskChar={''} mask="999-999"
                                           onChange={(e) => {
                                               const value = e.target.value;
                                               if (value)
                                                   setFieldValue('resetCode', value.replace('-', ''));
                                           }}
                                >
                                    {
                                        (inputProps) => (
                                          <Input
                                            placeholder={'eg. 225-663'} {...inputProps}
                                            name={'resetCode'}
                                            label={'Your 6-digit code'}
                                            type="text" />
                                        )
                                    }
                                </InputMask>
                                {
                                    errors.resetCode && (
                                      <div className={'error'} style={{marginTop: 4, marginLeft: 8}}>
                                          <small style={{color: 'var(--color-error)', fontWeight: 'bold'}}>
                                              {errors.resetCode}
                                          </small>
                                      </div>
                                    )
                                }


                            </Field>
                            <Field>
                                <TextField label={'Your new password'}
                                           placeholder={'●●●●●●●●●●●●'}
                                           name={'newPassword'}
                                           type={'password'} />
                            </Field>
                            <Field>
                                <TextField label={'Confirm your new password'}
                                           placeholder={'●●●●●●●●●●●●'}
                                           name={'newPasswordConfirmation'}
                                           type={'password'} />

                            </Field>
                            <div>
                                <Button isColor={'primary'}
                                        type={'submit'}
                                        isLoading={isSubmitting}>
                                    Create a new password
                                </Button>
                            </div>
                        </Form>
                      )}
                  </Formik>
              </FormParent>
          </Layout>
      </>
    );
}
