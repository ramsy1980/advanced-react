import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import styled from 'styled-components';

const REMOVE_FROM_CART_MUTATION = gql`
  mutation REMOVE_FROM_CART_MUTATION($id: ID!) {
    deleteCartItem(id: $id) {
      id
    }
  }
`;

const BigButton = styled.button`
  font-size: 3rem;
  background: none;
  border: 0;
  &:hover {
    color: var(--red);
    cursor: pointer;
  }
  margin-right: 2rem;
`;

function update(cache, payload) {
  cache.evict(cache.identify(payload.data.deleteCartItem));
}

export default function RemoveFromCart({ id }) {
  const [deleteCartItem, { loading }] = useMutation(REMOVE_FROM_CART_MUTATION, {
    variables: { id },
    update,
    // When the optimistic response comes back, it seems to re-fetch every single query on the page, leaving `data` from queries undefined (and loading and error undefined as well), causing the layout to break.
//  // The error itself comes from next.js, and it does seem that the item is evicted from the cache before that happens...
    // optimisticResponse: {
    //   deleteCartItem: {
    //     __typename: 'CartItem',
    //     id,
    //   },
    // },
  });

  return (
    <BigButton
      onClick={async () => {
        await deleteCartItem();
      }}
      type="button"
      title="Remove this item from Cart"
      disabled={loading}
    >
      &times;
    </BigButton>
  );
}
