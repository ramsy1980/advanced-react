/* eslint-disable jsx-a11y/img-redundant-alt */
import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import Link from 'next/link';
import styled from 'styled-components';
import Head from 'next/head';
import DisplayError from '../components/ErrorMessage';
import formatMoney from '../lib/formatMoney';
import OrderItemStyles from '../components/styles/OrderItemStyles';

const USER_ORDERS_QUERY = gql`
  query MY_ORDERS_QUERY {
    allOrders {
      id
      createdAt
      total
      charge
      items {
        id
        name
        description
        price
        quantity
        photo {
          altText
          image {
            publicUrlTransformed
          }
        }
      }
    }
  }
`;

const OrderUl = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  grid-gap: 4rem;
`;

function countOrderItems(order) {
  return order.items.reduce((tally, item) => tally + item.quantity, 0);
}

export default function OrderPage() {
  const { data, error, loading } = useQuery(USER_ORDERS_QUERY);
  if (loading) return <p>Loading ...</p>;
  if (error) return <DisplayError error={error} />;
  const { allOrders } = data;
  return (
    <div>
      <Head>
        <title>Sick Fits | Your Orders ({allOrders.length})</title>
      </Head>
      <DisplayError error={error} />
      <h1>My Orders ({allOrders.length})</h1>
      <OrderUl>
        {allOrders.map((order) => (
          <OrderItemStyles>
            <Link href={`/order/${order.id}`}>
              <a>
                <time dateTime={order.createdAt}>
                  <small>{order.createdAt}</small>
                </time>
                <div className="order-meta">
                  <p>{countOrderItems(order)} Items</p>
                  <p>
                    {order.items.length} Product
                    {order.items.length === 1 ? '' : 's'}
                  </p>
                  <p>{formatMoney(order.total)}</p>
                </div>
                <div className="images">
                  {order.items.map((item) => (
                    <img
                      key={`image-${item.id}`}
                      src={item.photo?.image?.publicUrlTransformed}
                      alt={item.photo?.altText}
                    />
                  ))}
                </div>
              </a>
            </Link>
          </OrderItemStyles>
        ))}
      </OrderUl>
    </div>
  );
}
