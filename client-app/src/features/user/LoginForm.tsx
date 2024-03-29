import { FORM_ERROR } from 'final-form';
import React from 'react';
import { Form as FinalForm, Field } from 'react-final-form';
import { Button, Form, Header } from 'semantic-ui-react';
import ErrorMessage from '../../app/common/form/ErrorMessage';
import TextInput from '../../app/common/form/TextInput';
import { IUserFormValues } from '../../app/models/user';
import { useStore } from '../../app/stores/store';

// requirement fields for validation in form.
const required = (value: any) => (value ? undefined : 'Required');

const LoginForm = () => {
  const { userStore } = useStore();
  const { login } = userStore;
  return (
    <FinalForm
      onSubmit={(values: IUserFormValues) =>
        login(values).catch((error) => ({
          [FORM_ERROR]: error,
        }))
      }
      render={({
        handleSubmit,
        submitting,
        submitError,
        invalid,
        pristine,
        dirtySinceLastSubmit,
      }) => (
        <Form onSubmit={handleSubmit} error autoComplete='off'>
          <Header
            as='h2'
            content='Login'
            textAlign='center'
            style={{ color: 'white' }}
          />
          <Field
            name='email'
            component={TextInput}
            placeholder='Email'
            validate={required}
          />
          <Field
            validate={required}
            name='password'
            component={TextInput}
            placeholder='Password'
            type='password'
          />
          {submitError && !dirtySinceLastSubmit && (
            <ErrorMessage
              error={submitError}
              text='invalid email or password'
            />
          )}
          <Button
            disabled={(invalid && !dirtySinceLastSubmit) || pristine}
            loading={submitting}
            color='teal'
            content='Login'
            fluid
            className='loginButton'
          />
        </Form>
      )}
    />
  );
};

export default LoginForm;
