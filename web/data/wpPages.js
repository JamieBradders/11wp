const { paginateCollection } = require("../helpers");

module.exports = async () => {
  const query = `
    query getPages($first: Int, $after: String) {
      pages(first: $first, after: $after) {
        pageInfo {
          endCursor
          hasNextPage
        }
        edges {
          node {
            id
            title
            slug
            content
            parent {
              node {
                id
                slug
                ... on Page {
                  id
                  title
                }
              }
            }
          }
        }
      }
    }
  `;

  const variables = { first: 12, after: null };

  try {
    return await paginateCollection({
      query,
      collection: "pages",
      variables,
    });
  } catch (err) {
    console.log("There was an error:", err);
  }
};
