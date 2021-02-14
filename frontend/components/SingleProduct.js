import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import Head from 'next/head';
import styled from 'styled-components';
import AddToCart from './AddToCart';
import DisplayError from './ErrorMessage';

export const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    Product(where: { id: $id }) {
      name
      price
      description
      id
      photo {
        altText
        image {
          publicUrlTransformed
        }
      }
    }
  }
`;

const ProductStyles = styled.div`
  display: grid;
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
  max-width: var(--maxWidth);
  justify-content: center;
  align-items: top;
  gap: 2rem;
  img {
    width: 100%;
    object-fit: contain;
  }
  .details {
    display: flex;
    flex-direction: column;
    button {
      height: 25px;
      margin-top: auto;
    }
  }
`;

export default function SingleProduct({ id }) {
  const { data, error, loading } = useQuery(SINGLE_ITEM_QUERY, {
    variables: { id },
  });
  if (loading) return <p>Loading ...</p>;
  if (error) return <DisplayError error={error} />;

  const { Product } = data;

  return (
    <ProductStyles>
      <Head>
        <title>Sick Fits | {Product.name} </title>
      </Head>
      <img
        src={Product.photo.image.publicUrlTransformed}
        alt={Product.photo.altText}
      />
      <div className="details">
        <h1>{Product.name}</h1>
        <p>{Product.description}</p>
        <AddToCart productId={id} />
      </div>
    </ProductStyles>
  );
}
