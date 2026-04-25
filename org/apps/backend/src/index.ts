import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware as apolloMiddleware } from '@as-integrations/express4';
import { schema } from './graphql';
import { Context, prisma } from './prisma';
import cors from 'cors';
import { env } from './env';
import cookieParser from 'cookie-parser'
import * as middleware from "./middleware"
import { router } from './router';
import { FRONTEND_ORIGIN } from './constants';

const init = async () => {
  const apolloServer = new ApolloServer<Context>({ schema });

  const app = express();

  app.use(cors({
    origin: FRONTEND_ORIGIN,
    credentials: true,
  }))

  app.use(cookieParser())
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(middleware.authenticateMiddleware)
  
  app.use('/api', router)
  
  await apolloServer.start();

  // TODO: implement error handling
  app.use(
    '/graphql',
    apolloMiddleware(apolloServer, {
      async context({ req }) {
        const { userId, userRoles } = req

        const context: Context = {
          prisma,
          userId,
          userRoles,
        }

        return context
      }
    })
  )

  app.use(middleware.errorMiddleware)

  const port = parseInt(env.EXPRESS_PORT!);
  const hostname = env.EXPRESS_HOSTNAME!;

  if (isNaN(port)) {
    throw new Error("EXPRESS_PORT is NaN")
  }

  const server = app.listen(port, hostname, () => {
    console.log(`Listening at http://localhost:${port}`);
  });

  server.on('error', console.error);
}

init().catch(console.error)
