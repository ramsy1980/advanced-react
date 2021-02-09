import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import { CURRENT_USER_QUERY } from './User';
// import { useCart } from '../lib/cartState';

const ADD_TO_CART_MUTATION = gql`
  mutation ADD_TO_CART_MUTATION($productId: ID!) {
    addToCart(productId: $productId) {
      id
    }
  }
`;

export default function AddToCart({ productId }) {
  const [addToCart, { loading }] = useMutation(ADD_TO_CART_MUTATION, {
    variables: {
      productId,
    },
    refetchQueries: [{ query: CURRENT_USER_QUERY }],
  });
  // const { openCart } = useCart();

  return (
    <button
      disabled={loading}
      type="button"
      onClick={async (e) => {
        e.preventDefault();
        await addToCart().catch((error) => alert(error.message));
        // openCart();
      }}
    >
      🛒 Add{loading && 'ing'} To Cart
    </button>
  );
}
