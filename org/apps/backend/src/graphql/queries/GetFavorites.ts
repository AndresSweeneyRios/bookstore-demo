import { extendType } from "nexus"
import { ROLE_USER } from "../../constants"

export const GetFavorites = extendType({
  type: "Query",
  definition(t) {
    t.list.field('favorites', {
      type: 'Favorite',
      description: "Returns a list of books marked as favorite by the currently authenticated user",
      
      async resolve (_root, _args, context, info) {
        if (context.userId === null || !context.userRoles.includes(ROLE_USER)) {
          throw new Error("Not authenticated")
        }

        return context.prisma.favorite.findMany({
          where: {
            userId: context.userId
          },

          include: {
            book: true
          }
        })
      }
    })
  },
})
