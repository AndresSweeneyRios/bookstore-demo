import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client"
import { BACKEND_URL } from "../constants"

export const apolloClient = new ApolloClient({
  link: new HttpLink({
    uri: `${BACKEND_URL}/graphql`,
    credentials: 'include',
  }),
  cache: new InMemoryCache(),
})
