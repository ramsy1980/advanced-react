import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import Form from './styles/Form';
import useForm from '../lib/useForm';
import DisplayError from './ErrorMessage';

const RESET_PASSWORD_MUTATION = gql`
  mutation RESET_PASSWORD_MUTATION(
    $email: String!
    $token: String!
    $password: String!
  ) {
    redeemUserPasswordResetToken(
      email: $email
      token: $token
      password: $password
    ) {
      code
      message
    }
  }
`;

export default function ResetPassword({ token }) {
  // TODO: replace this with a message component
  const { inputs, handleChange, resetForm } = useForm({
    email: '',
    password: '',
    token,
  });

  const [resetPassword, { error, loading, data }] = useMutation(
    RESET_PASSWORD_MUTATION,
    {
      variables: inputs,
    }
  );

  async function handleSubmit(e) {
    e.preventDefault();
    await resetPassword().catch(console.error);
    resetForm();
  }

  const resetError = data?.redeemUserPasswordResetToken?.code
    ? data?.redeemUserPasswordResetToken
    : null;

  return (
    <Form method="POST" onSubmit={handleSubmit}>
      <h2>Request Your Password</h2>
      <DisplayError error={error || resetError} />
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
        <label htmlFor="password">
          Password
          <input
            type="password"
            name="password"
            placeholder="Your New Password"
            autoComplete="new-password"
            value={inputs.password}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Reset Password</button>
      </fieldset>
    </Form>
  );
}
