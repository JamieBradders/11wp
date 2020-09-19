require("dotenv").config();

const { GraphQLClient, gql } = require("graphql-request");
const { Headers } = require("cross-fetch");

const endpoint = process.env.WPGRAPHQL_API_URL;
const token = process.env.MIX_WP_REFRESH_TOKEN;

// Workaround against issue with graphql request
// https://github.com/prisma-labs/graphql-request/issues/206
global.Headers = global.Headers || Headers;

async function init() {
  const options = {
    headers: {},
  };

  if (token) {
    options.headers.authorization = `Bearer ${token}`;
  }

  return new GraphQLClient(endpoint, options);
}
/**
 * Fetch Collection
 * Retrieves a collection, based on the graphql query
 * to be used for Pages, Posts etc
 * @param {Object} options
 */

async function fetchCollection({ query, collection, variables }) {
  const client = await init();

  const q = gql`
    ${query}
  `;

  const res = await client.request(q, variables);

  if (res.errors) {
    throw new Error(
      `Unable to retrieve collection '${collection}. Response as follows:`,
      JSON.stringify(res.errors)
    );
  }

  return res[collection];
}

// When a collection is fetched it needs to be paginated
// @NOTE we must document the count parameter and how this returns the first x
// results where 'x' is the count property.
//
// We also need to note that the following has to be included within the
// query
//
// - - - - - - - - - - - - - - - - - -
//
//  pageInfo {
//   endCursor
//   hasNextPage
//  }
//
// - - - - - - - - - - - - - - - - - -

async function paginateCollection({
  query,
  collection,
  variables,
  count = 12,
}) {
  // Get the data
  const items = await fetchCollection({ query, collection, variables });

  if (items.edges.length > 0) {
    const allItems = [];

    let pageNumber = 0;

    items.edges.forEach((item) => allItems.push(item));

    if (items.pageInfo.hasNextPage) {
      pageNumber++;

      return fetchCollection({
        query,
        collection,
        variables: {
          ...variables,
          first: count,
          after: items.pageInfo.endCursor,
        },
      });
    }

    return allItems;
  }
}

/**
 * Fetch Item
 * Retrieves an item, based on the graphql query
 * to be used for Page, Post etc
 * @param {Object} options
 */

async function fetchItem({ query, item, variables }) {
  const client = await init();

  const q = gql`
    ${query}
  `;

  const res = await client.request(q, variables);

  if (res.errors) {
    throw new Error(
      `Unable to retrieve item '${item}. Response as follows:`,
      JSON.stringify(res.errors)
    );
  }

  return res[item];
}

module.exports = {
  paginateCollection,
  fetchCollection,
  fetchItem,
};
