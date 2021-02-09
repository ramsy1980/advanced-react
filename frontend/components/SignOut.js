import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import { CURRENT_USER_QUERY } from './User';

const SIGNOUT_MUTATION = gql`
  mutation SIGNOUT_MUTATION {
    endSession
  }
`;

export function SignOut({ children }) {
  const [signOut, { loading }] = useMutation(SIGNOUT_MUTATION, {
    refetchQueries: [{ query: CURRENT_USER_QUERY }],
  });

  return (
    <button
      type="button"
      disabled={loading}
      onClick={async () => {
        if (window.confirm('Are you sure you want to sign out?')) {
          await signOut().catch((err) => alert(err.message));
        }
      }}
    >
      Sign Out
    </button>
  );
}
