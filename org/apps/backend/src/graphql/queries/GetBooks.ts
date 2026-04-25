import { extendType, stringArg } from "nexus"

const normalizeSearch = (input: string) => {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '')
}

export const GetBooks = extendType({
  type: "Query",
  definition(t) {
    t.list.field('books', {
      type: 'Book',
      description: "Returns the currently authenticated user",

      args: {
        search: stringArg()
      },

      async resolve (_root, args, context) {
        const result = await context.prisma.$queryRaw<{
          id: number
          title: string
          author: string
          description: string
          yearPublished: number
          uri: string
        }>`
          WITH params AS (
            SELECT ${normalizeSearch(args.search || "")} AS search
          )
          SELECT
            book.id, book.title, book.author, book.description, book."yearPublished", book.uri
          FROM "Book" book
          CROSS JOIN params params
          WHERE book.search_text ILIKE '%' || params.search || '%'
          ORDER BY book.id DESC;
        `

        return result as any
      }
    })
  },
})
