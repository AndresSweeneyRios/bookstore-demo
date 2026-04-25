import { objectType } from "nexus"

export const Book = objectType({
  name: 'Book',
  definition(t) {
    t.int('id')
    t.string('title')
    t.string('author')
    t.string('description')
    t.int('yearPublished')
    t.string('uri')
  }
})
