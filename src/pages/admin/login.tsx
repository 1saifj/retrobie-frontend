import React, {useEffect, useState} from 'react';
import './login.scoped.css';
import {Button, Column, Columns} from 'bloomer';
import jwtDecode from 'jwt-decode';
import {notify} from '../../helpers/views';
import Layout from '../../components/Layout';
import {extractErrorMessage} from '../../helpers';
import TextField from '../../components/input/TextField';
import {Form, Formik} from 'formik';
import {FormParent} from '../accounts/register';
import {useDispatch} from 'react-redux';
import {loginUserAction} from '../../state/actions';
import {useAuth} from '../../network';
import {LoginResponseType, PromiseThunk} from '../../types';
import {AxiosResponse} from 'axios';

const AdminLogin = props => {
  const api = useAuth();
  const dispatch = useDispatch<PromiseThunk<AxiosResponse<LoginResponseType>>>();

  const setUserLoggedIn = payload => dispatch(loginUserAction(payload));

  async function attemptLogin(values) {
    const {login, password} = values;

    const {data, ...rest} = await dispatch(api.accounts.login({
      login,
      password,
    }));

    if (data) {
      if (data.accessToken && data.refreshToken) {
        const decoded = jwtDecode(data.accessToken);

        if (decoded.role === 'ROLE_ADMIN') {
          setUserLoggedIn(data);
          props.history.push('/company/admin/dashboard');
        } else {
          notify('error', 'Invalid account type.');
        }
      } else {
        console.log('2FA enabled.');
      }
    } else {
      const message = extractErrorMessage(rest);
      notify('error', message);
    }
  }

  return (
    <Layout withoutNav={true}>
      <FormParent>
        <Formik
          initialValues={{
            login: 'bradstar@vivaldi.com',
            password: 'O4l7xfPggLXp4LmnoIudR',
          }}
          onSubmit={attemptLogin}
        >
          {({isSubmitting}) => (
            <Form style={{padding: '0 24px'}}>
              <header>
                <h2>Login as an administrator</h2>
              </header>

              <Columns>
                <Column isSize={{desktop: 1}}>
                  <TextField
                    type="email"
                    label="Email Address"
                    name="login"
                    placeholder={'eg. you@secure.com'}
                  />
                </Column>
                <Column isSize={{desktop: 1}}>
                  <TextField
                    type="password"
                    label="Password"
                    name="password"
                    placeholder={'●●●●●●●●●●●●'}
                  />
                </Column>
              </Columns>

              <Button
                isColor="primary"
                isLoading={isSubmitting}
                type="submit"
                style={{width: '250px'}}
              >
                Login
              </Button>
            </Form>
          )}
        </Formik>
      </FormParent>
    </Layout>
  );
};

AdminLogin.propTypes = {};

export default AdminLogin;

/*
const FluidInput = props => {

    const {error, style, label, id, name, type, onChange} = props;

    const [focused, setFocused] = useState(false);
    const [value, setValue] = useState('');
    const [inputStyle, setInputStyle] = useState('');

    function focusField() {
        setFocused(!focused);
    }

    function handleChange(value) {
        setValue(value);
    }

    useEffect(() => {
        let inputClass = "fluid-input";
        if (focused) {
            inputClass += " fluid-input--focus";
        } else if (value != "" || props.value != undefined) {
            inputClass += " fluid-input--open";
        }

        setInputStyle(inputClass);
    }, []);


    return (
        <div className={inputStyle} style={style}>
            <Field className="fluid-input-holder">

                <Label style={{zIndex: 1}} className="fluid-input-label">{label}</Label>
                <Control>
                    <Input
                        className={`fluid-input-input ${inputStyle} ${error ? 'has-error' : ''}`}
                        style={{width: '100%'}}
                        onFocus={focusField}
                        onBlur={focusField}
                        onChange={onChange || handleChange}
                        autoComplete="off"
                        id={id}
                        name={name}
                        type={type}
                    />
                </Control>

            </Field>
        </div>
    );
};

FluidInput.propTypes = {
    name: PropTypes.string,
    id: PropTypes.string,
    type: PropTypes.string,
    style: PropTypes.object,
    label: PropTypes.string,
    error: PropTypes.object
};
*/
