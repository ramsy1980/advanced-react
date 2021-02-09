import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import { useState } from 'react';
import Form from './styles/Form';
import useForm from '../lib/useForm';
import DisplayError from './ErrorMessage';

const REQUEST_RESET_PASSWORD_MUTATION = gql`
  mutation REQUEST_RESET_PASSWORD_MUTATION($email: String!) {
    sendUserPasswordResetLink(email: $email) {
      code
      message
    }
  }
`;

export default function RequestResetPassword() {
  // TODO: replace this with a message component
  const { inputs, handleChange, resetForm } = useForm({
    email: '',
    name: '',
    password: '',
  });

  const [requestResetPassword, { error, loading }] = useMutation(
    REQUEST_RESET_PASSWORD_MUTATION,
    {
      variables: inputs,
    }
  );

  const [message, setMessage] = useState(error);

  async function handleSubmit(e) {
    e.preventDefault();
    await requestResetPassword().catch(console.error);
    setMessage(
      new Error(
        `A link to reset your password has been sent to ${inputs.email}`
      )
    );
    resetForm();
  }

  return (
    <Form method="POST" onSubmit={handleSubmit}>
      <h2>Request a Password Reset</h2>
      <DisplayError error={error || message} />
      <fieldset disabled={loading} aria-disabled={loading}>
        <label htmlFor="email">
          Email
          <input
            type="email"
            name="email"
            placeholder="Your Email Address"
            autoComplete="email"
            value={inputs.email}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Request Reset Password</button>
      </fieldset>
    </Form>
  );
}
