import { useMutation } from '@apollo/client';
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import gql from 'graphql-tag';
import nProgress from 'nprogress';
import { useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/dist/client/router';
import SickButton from './styles/SickButton';
import { useCart } from '../lib/cartState';
import { CURRENT_USER_QUERY } from './User';

const CheckoutFormStyles = styled.form`
  box-shadow: 0 1px 2px 2px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 5px;
  padding: 1rem;
  display: grid;
  grid-gap: 1rem;
`;

const ErrorStyles = styled.p`
  font-size: 12px;
  color: var(--red);
`;

const CREATE_ORDER_MUTATION = gql`
  mutation CREATE_ORDER_MUTATION($token: String!) {
    checkout(token: $token) {
      id
      charge
      total
      items {
        id
        name
      }
    }
  }
`;

const stripeLib = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);

function CheckoutForm() {
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const { closeCart } = useCart();
  const router = useRouter();

  const stripe = useStripe();
  const elements = useElements();
  const [
    checkout,
    { loading: graphqlLoading, error: graphqlError },
  ] = useMutation(CREATE_ORDER_MUTATION);

  async function handleSubmit(e) {
    // 1. Stop form from submitting and turbn the loader on
    e.preventDefault();
    setLoading(true);
    setError(null);
    console.log('We need to do some work');
    // 2. Start the page transition
    nProgress.start();
    // 3. Create the payment method via Stripe (token comes back here)
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });
    console.log(paymentMethod);
    // 4. Handle any errors from Stripe
    if (error) {
      setError(error);
      nProgress.done();
      return;
    }
    // 5. Send the token from step 3 to our backend via a custom mutation
    const order = await checkout({
      variables: { token: paymentMethod.id },
      refetchQueries: [{ query: CURRENT_USER_QUERY }],
    });
    console.log('Order added', order);
    // 6. Change the page to view the order
    router.push(`/order/${order.data.checkout.id}`);
    // 7. Close the chart
    closeCart();
    // 8. Turn the loader off
    setLoading(false);
    nProgress.done();
  }

  // TODO: add loading spinner. See https://remixicon.com/

  return (
    <CheckoutFormStyles onSubmit={handleSubmit}>
      {error && <ErrorStyles>{error.message}</ErrorStyles>}
      {graphqlError && <ErrorStyles>{graphqlError.message}</ErrorStyles>}
      <CardElement />
      <SickButton disabled={loading || graphqlLoading}>
        Check out now
      </SickButton>
    </CheckoutFormStyles>
  );
}

function Checkout() {
  return (
    <Elements stripe={stripeLib}>
      <CheckoutForm />
    </Elements>
  );
}

export { Checkout };
