import { makeSchema } from 'nexus'
import path from 'path'
import { env } from '../env'
import * as Scalars from "./scalars"
import * as Objects from "./objects"
import * as Queries from "./queries"

export const schema = makeSchema({
  types: [Scalars, Objects, Queries],
  outputs: env.NODE_ENV === "production" ? false : {
    schema: path.join(process.cwd(), 'src/graphql/schema.graphql'),
    typegen: path.join(process.cwd(), 'src/graphql/nexus-typegen.d.ts'),
  },
  contextType: {
    module: path.join(process.cwd(), 'src/prisma/index.ts'),
    export: 'Context',
  },
})
