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
import {useAuth} from '../../network';
import {useDispatch} from 'react-redux';

const FormParent = styled.div`
  display: flex;
  justify-content: center;
  padding: 0 48px;
  min-height: 400px;
  align-items: center;

  form {
    width: 100%;
    max-width: 800px;
  }
  
  .footer {
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

export default function VerifyAccount() {
  const api = useAuth();
  const dispatch = useDispatch();

  const countdownTime = 60;
    /**
     * TODO: - What happens when the access token expires? Should the user still be allowed
     *       to request a new verification code? (Note, an access token is required since
     *       we decode it to get the user's email.)
     *       - How many times should a user be able to re-request a TOTP code?
     *
     * */

    const accessToken = localStorage.getItem('access_token');
    const decodedAccessToken = accessToken ? jwtDecode(accessToken): undefined;

    // Track whether this form has been submitted or not.
    // If it's been submitted, there's a 60-second countdown timer
    // before a user can try again.
    const submitted = Boolean(localStorage.getItem('submitted_v_code'));
    const [timeRemaining, setTimeRemaining] = useState(0);

    function startTimer() {
        setTimeRemaining(countdownTime);
    }

    useEffect(() => {
        // // If the access token is expired, delete both it and the refresh token
        // // from localStorage. This way, a user has to login in order to confirm their account.
        // if (Date.now() > decoded.exp) {
        //     localStorage.removeItem("access_token");
        //     localStorage.removeItem("refresh_token");
        // }

        // If the timer is at 0, allow the user to re-request a code
        if (timeRemaining === 0) setFormSubmitted(false);

        // If the form has been submitted, start the countdown timer
        if (submitted) {
            const timer = timeRemaining > 0 && setInterval(() => setTimeRemaining(timeRemaining - 1), 1000);
            return () => clearInterval(timer);
        }
    });

    return (
        <>
            <Layout withoutNav={true}>
                <FormParent>
                    <Formik initialValues={{}}
                            validate={async values => {
                                const errors = {};

                                try {
                                    await VerifyAccountCodeSchema.validate(values);
                                } catch (e) {
                                    errors[e.path] = e.message
                                    return errors;
                               }

                                return errors;
                            }}
                            onSubmit={async (values, {setSubmitting}) => {
                                setSubmitting(true);
                                try {
                                    // Submit the user's code together with their email address.
                                    // {status: "", message: ""}
                                   const {data} = await dispatch(
                                     api.accounts.verify({
                                       code: String(values.code),
                                       email: decodedAccessToken.email
                                     })
                                   );
                                    setFormSubmitted(true);
                                    notify('success', data.message);
                                    setSubmitting(false);
                                    startTimer();
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
                                        <img style={{width: 48}} src={VerifiedIcon} alt={'verification icon'}/>
                                    </div>
                                    <h2>Verify your account</h2>
                                    <h4 style={{color: 'var(--color-description)', fontWeight: 400}}>
                                        {/*// todo: provide way to correct email?*/}
                                        A 6-digit code has been sent to &nbsp;
                                        <strong>
                                            {decodedAccessToken?.email || "your email address"}
                                        </strong>.
                                        Copy-paste or enter it here to proceed.
                                    </h4>
                                </div>
                                <div>
                                    <Columns>
                                        <Column isSize={{desktop: '1/2'}}>
                                            <InputMask maskChar={""} mask="999-999"
                                                       onChange={(e)=> {
                                                           const value = e.target.value;
                                                           if (value)
                                                               setFieldValue('code', value.replace("-", ""));
                                                       }}
                                            >
                                                {
                                                    (inputProps) => (
                                                        <Input
                                                            placeholder={"eg. 225-663"} {...inputProps}
                                                            name={'code'}
                                                            label={'Your 6-digit code'}
                                                            type="text"/>
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
                                    <div style={{marginTop: '24px'}}>
                                        <Button isColor={'primary'}
                                                type={"submit"}
                                                isLoading={isSubmitting}
                                                style={{minWidth: 250}}>
                                            Confirm code
                                        </Button>
                                        <Button isColor={'secondary'}
                                                onClick={async () => {
                                                    // Only request for a new code if a
                                                    // token exits locally
                                                    if (decodedAccessToken) {
                                                        try {
                                                            const {data} = await api.accounts.requestPasswordReset({
                                                                email: decodedAccessToken.email,
                                                                clientStrategy: 'email'
                                                            });
                                                            notify('success', data.message)
                                                        } catch (e) {
                                                            const message = extractErrorMessage(e);
                                                            notify('error', message);
                                                        }

                                                        // Restart the countdown timer.
                                                        setFormSubmitted(true);
                                                        startTimer()
                                                    }
                                                }}
                                                disabled={timeRemaining !== 0 && submitted}
                                                style={{minWidth: 250}}
                                        >
                                            {
                                                submitted && timeRemaining !== 0 ? `Retry in ${timeRemaining}s`
                                                    : "Resend code"
                                            }
                                        </Button>
                                    </div>
                                </div>
                            </Form>
                        )}

                    </Formik>
                </FormParent>
            </Layout>
        </>
    );
}