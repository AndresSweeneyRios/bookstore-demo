import { objectType } from 'nexus'

export const Favorite = objectType({
  name: 'Favorite',
  definition(t) {
    t.int('id')
    t.int('userId')
    t.int('bookId')

    t.field('book', {
      type: 'Book',
    })
  }
})
