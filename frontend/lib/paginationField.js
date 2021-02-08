import { PAGINATION_QUERY } from '../components/Pagination';

export default function paginationField() {
  return {
    keyArgs: false, // tells Apollo we will handle everything
    read(existing = [], { args, cache }) {
      const { skip, first } = args;

      // Read the number of items on the page from the cache
      const data = cache.readQuery({ query: PAGINATION_QUERY });
      const count = data?._allProductsMeta?.count;
      const page = skip / first + 1;
      const pages = Math.ceil(count / first);

      // Check if we have existing items
      const items = existing.slice(skip, skip + first).filter((i) => i);
      // IF there are items
      // AND there aren't enough items to satisfy how many we requested
      // AND we are on the last page
      // THEN just send it
      if (items.length && items.length !== first && page === pages) {
        return items;
      }
      if (items.length !== first) {
        // We don't have any items and must go to the network to fetch them
        return false;
      }

      // If there are items, just return them from the cache and we don't need to go to the network
      if (items.length) {
        console.log(
          `There are ${items.length} in the cache! Sending them to Apollo.`
        );
        return items;
      }

      return false; // fallback to network

      // First thing it does it asks the read function for those items
      // We can either do one of two things
      // First thing we can do is return the items because they are alrady in the cache
      // The other thing we can do is to return false from here which results in a network request
    },
    merge(existing, incoming, { args }) {
      const { skip, first } = args;
      // This runs when the Apollo client comes back from the network with our products
      console.log(`Merging items from the network ${incoming.length}`);
      const merged = existing ? existing.slice(0) : [];

      for (let i = skip; i < skip + incoming.length; i += 1) {
        merged[i] = incoming[i - skip];
      }

      return merged;
    },
  };
}
