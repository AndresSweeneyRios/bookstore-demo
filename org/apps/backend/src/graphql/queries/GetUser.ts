import { extendType } from "nexus"
import { ROLE_USER } from "../../constants"

export const GetUser = extendType({
  type: "Query",
  definition(t) {
    t.field('me', {
      type: 'User',
      description: "Returns the currently authenticated user",

      async resolve (_root, _args, context, info) {
        if (context.userId === null || !context.userRoles.includes(ROLE_USER)) {
          throw new Error("Not authenticated")
        }

        return context.prisma.user.findUnique({
          where: {
            id: context.userId
          }
        })
      },
    })
  },
})
