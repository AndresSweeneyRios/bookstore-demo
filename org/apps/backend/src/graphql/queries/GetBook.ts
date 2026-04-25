import { extendType, intArg } from "nexus"

export const GetBook = extendType({
  type: "Query",
  definition(t) {
    t.field('book', {
      type: 'Book',
      description: "Returns the currently authenticated user",

      args: {
        id: intArg()
      },

      async resolve (_root, args, context) {
        return context.prisma.book.findUnique({
          where: {
            id: args.id!
          }
        })
      },
    })
  },
})
