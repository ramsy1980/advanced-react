import RequestResetPassword from '../../components/RequestResetPassword';
import ResetPassword from '../../components/ResetPassword';

export default function ResetPasswordPage({ query }) {
  if (!query?.token) {
    return (
      <div>
        <p>Please provide a valid token</p>
        <RequestResetPassword />
      </div>
    );
  }

  return (
    <div>
      <p>Reset password {query.token}</p>
      <ResetPassword token={query.token} />
    </div>
  );
}
