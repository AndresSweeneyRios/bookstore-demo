import "./main.css"
import React from 'react'
import { createBrowserRouter, RouterProvider, RouteObject } from 'react-router-dom'
import * as ReactDOM from 'react-dom/client'
import { Modal } from "./components/Modal"
import { AuthProvider, useAuth } from "./hooks/useAuth"
import { ModalProvider } from "./hooks/useModal"
import { LoadingProvider } from "./hooks/useLoading"
import { Loading } from "./components/Loading"
import { UserProvider } from "./hooks/useUser"
import { ApolloProvider } from "@apollo/client/react"
import { apolloClient } from "./graphql"
import { SearchProvider } from "./hooks/useSearch"
import Book from "./pages/Book"
import BookLayout from "./layouts/Book"
import { FavoritesProvider } from "./hooks/useFavorites"
import DefaultLayout from "./layouts/Default"
import Home from "./pages/Home"

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const Admin = React.lazy(() => import('./pages/Admin'))
const AdminProvider = React.lazy(() => import('./hooks/useAdmin'))

const routes: RouteObject[] = [];

routes.push({
  path: "/",
  element: (
    <DefaultLayout>
      <Home/>
    </DefaultLayout>
  )
})

routes.push({
  path: "/book/:id",
  element: (
    <BookLayout>
      <Book />
    </BookLayout>
  )
})

routes.push({
  path: "/admin",
  element: (
    <AdminProvider>
      <Admin />
    </AdminProvider>
  )
})

const router = createBrowserRouter(routes)

const providers = [
  LoadingProvider,
  ModalProvider,
  AuthProvider,
  UserProvider,
  SearchProvider,
  FavoritesProvider,
]

const Providers: React.FC<React.PropsWithChildren> = ({ children }) => {
  return providers.reduceRight((acc, Provider) => {
    return <Provider>{acc}</Provider>
  }, children)
}

const App: React.FC = () => {
  const auth = useAuth()

  return auth.ready && <>
    <h1 style={{ display: "none" }}>Book Store</h1>
    <RouterProvider router={router} future={{
      v7_startTransition: true,
    }} />
    <Modal />
    <Loading />
  </>
}

root.render(
  <React.StrictMode>
    <ApolloProvider client={apolloClient}>
      <Providers>
        <App />
      </Providers>
    </ApolloProvider>
  </React.StrictMode>
);
