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

const RegisterForm = () => {
  const { userStore } = useStore();
  const { register } = userStore;
  return (
    <FinalForm
      onSubmit={(values: IUserFormValues) =>
        register(values).catch((error) => ({
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
        <Form onSubmit={handleSubmit} error>
          <Header
            as='h2'
            content='Sign up'
            style={{ color: 'white' }}
            textAlign='center'
          />
          <Field
            name='username'
            component={TextInput}
            placeholder='Username'
            validate={required}
          />
          <Field
            name='displayName'
            component={TextInput}
            placeholder='Display Name'
            validate={required}
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
            <ErrorMessage error={submitError} text={'Registration failed'} />
          )}
          <Button
            disabled={(invalid && !dirtySinceLastSubmit) || pristine}
            loading={submitting}
            content='Register'
            color='teal'
            fluid
            className='registerButton'
          />
        </Form>
      )}
    />
  );
};

export default RegisterForm;
