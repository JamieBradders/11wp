<template>
  <div v-if="loading">
    <Spinner></Spinner>
  </div>

  <div v-else-if="!loading && Object.keys(post).length > 0">
    <main>
      <h1>{{ post.title }}</h1>
      <h2>{{ post.acfPost.leadingText }}</h2>

      <div v-html="post.content"></div>
    </main>
  </div>

  <div v-else-if="!loading && showMessage">
    <Login />
  </div>
</template>

<script>
// As per https://github.com/wp-graphql/wp-graphql-jwt-authentication/issues/58
// We will pass the auth token to the url in wordpress and retrieve via js
import { GraphQLClient, request, gql } from "graphql-request";
import Spinner from "../components/Spinner";

export default {
  data() {
    return {
      showMessage: false,
      loading: true,
      post: {},
    };
  },

  async mounted() {
    this.getPost();
  },

  methods: {
    async getPost() {
      const queryString = new URLSearchParams(window.location.search);
      const id = queryString.get("id");
      const token = queryString.get("token");

      const endpoint = `http://gatsby-woocommerce.local/graphql`;
      const query = gql`
        query getPost($id: ID!) {
          post(id: $id, idType: DATABASE_ID) {
            title
            slug
            content
            acfPost {
              leadingText
            }
          }
        }
      `;

      const client = new GraphQLClient(endpoint, {
        headers: {
          authorization: `Bearer ${process.env.MIX_WP_REFRESH_TOKEN}`,
        },
      });

      try {
        const res = await client.request(query, { id });

        if (res.post) {
          this.post = res.post;
          this.loading = false;
        } else {
          this.loading = false;
          this.showMessage = true;
        }
      } catch (err) {
        console.error("There was a problem creating preview", err);
      }
    },
  },

  components: {
    Spinner,
  },
};
</script>
