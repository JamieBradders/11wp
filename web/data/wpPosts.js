const { paginateCollection } = require("../helpers");

module.exports = async () => {
  const query = `
    query getPosts($first: Int, $after: String) {
      posts(first: $first, after: $after) {
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
          }
        }
      }
    }
  `;

  const variables = { first: 12, after: null };

  try {
    return await paginateCollection({
      query,
      collection: "posts",
      variables,
    });
  } catch (err) {
    console.log("There was an error:", err);
  }
};
