import React, {useState} from 'react';
import styled from 'styled-components';
import {Form, Formik} from 'formik';
import {TextField} from '../../../../components/input';
import {Button, Column, Columns} from 'bloomer';
import defaultHelpers, {extractErrorMessage} from '../../../../helpers';
import {useAuth, useNotify} from '../../../../hooks';
import * as Yup from 'yup';
import {useDispatch} from 'react-redux';

const DetailsParent = styled.div`
  margin-left: 1em;
  & > div {
    display: flex;
    align-items: center;
    
    svg {
      width: 20px;
      height: 20px;
    }
    
    p {
      margin-left: 8px;
    }
  }
`

const UpdateProfileValidationSchema = Yup.object().shape({
  email: Yup.string().required(),
  phoneNumber: Yup.string().required(),
  firstName: Yup.string().required(),
  lastName: Yup.string().required(),
  username: Yup.string().required(),
  oldPassword: Yup.string()
    .when('newPassword', function(value){
      if (value) return this.required("This field is required")
        .min(8, 'This field should be at least 8 characters long.')
    }
  ),
  newPassword: Yup.string()
    .optional()
    .min(8, 'This field should be at least 8 characters long.'),
})


export default function ({data}){

  const notify = useNotify();
  const api = useAuth();
  const dispatch = useDispatch();

  const [userInfo] = useState({
    email: data.email,
    phoneNumber: `0${data.phoneNumber}`,
    firstName: data.firstName,
    lastName: data.lastName,
    username: data.username,
    oldPassword: '',
    newPassword: ''
  });

  return (
    <>

      <Formik
        initialValues={{
          email: userInfo.email,
          username: userInfo.username,
          phoneNumber: userInfo.phoneNumber,
          firstName: userInfo.firstName,
          lastName: userInfo.lastName,
          oldPassword: '',
          newPassword: ''
        }}
        validationSchema={UpdateProfileValidationSchema}
        onSubmit={async (values, {setSubmitting}) => {
          const diff = defaultHelpers.objectDiff(userInfo, values);
          const diffKeys = Object.keys(diff);
          if (diffKeys.length) {
            // if the only field that changed is 'oldPassword'
            // don't send the request
            // oldPassword and newPassword must be provided together
            if (diffKeys.length === 1 && diffKeys[0] === 'oldPassword'){
              notify.info('Please provide a new password');
            }else {
              if (diff.email) {
                notify.info('Please note that you will have to verify you new email address.', {
                  position: "top-right"
                })
              }

              try {
                await dispatch(api.accounts.update(diff));
                notify.success("Account details changed successfully.")
              }catch (e){
                const message = extractErrorMessage(e);
                notify.error(message);
              }

            }
          } else {
            notify.info('Nothing changed');
          }
          setSubmitting(false);
        }}>
        {({isSubmitting}) => (
          <Form>
            <DetailsParent>
              <div>
                <h2>Basic Information</h2>
              </div>
              <Columns>
                <Column>
                  <TextField
                    type={'email'}
                    label={'Email address'}
                    name={'email'}
                    placeholder={'moonman@spacex.com'}/>
                </Column>
                <Column>
                  <TextField
                    type={'text'}
                    label={'Username'}
                    disabled
                    name={'username'}
                    placeholder={'Moonman'}/>
                </Column>
              </Columns>
              <Columns>

                <Column>
                  <TextField
                    type={'text'}
                    label={'First name'}
                    name={'firstName'}
                    placeholder={'Jackob'}/>
                </Column>
                <Column>
                  <TextField
                    type={'text'}
                    label={'Last name'}
                    name={'lastName'}
                    placeholder={'Isekai'}/>
                </Column>
              </Columns>
              <Columns>
                <Column>
                  <TextField
                    type={'phone'}
                    prefix={'+254'}
                    label={'Phone number '}
                    name={'phoneNumber'}
                    placeholder={'+254-788-963-887'}/>
                </Column>
              </Columns>
              <Columns>
                <Column>
                  <TextField
                    type={'password'}
                    label={'Old password'}
                    name={'oldPassword'}
                    placeholder={'●●●●●●●●●●●●●●●●●●●●'}/>
                </Column>
                <Column>
                  <TextField
                    type={'password'}
                    label={'New password'}
                    name={'newPassword'}
                    placeholder={'●●●●●●●●●●●●●●●●●●●●'}/>

                </Column>
              </Columns>
              <Columns>
                <Column>
                  <Button
                    type={'submit'}
                    style={{width: '100%'}}
                    isLoading={isSubmitting}
                    isColor={'primary'}>
                    Update
                  </Button>
                </Column>
              </Columns>
            </DetailsParent>
          </Form>
        )}
      </Formik>
    </>
  );
}

