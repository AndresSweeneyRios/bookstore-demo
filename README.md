# Book Store

## Features
- Browse books anonymously
- Register an account to add books to your favorites
- Search by author and title
- Add new books in the admin dashboard
- View book details (title, author, description, year published)

## Tech Stack
- Nx
- Express
- esbuild
- Jest
- PostgreSQL
- Apollo (GraphQL server)
- Nexus (GraphQL server schema)
- Prisma (ORM, migrations)
- Zod (form validation)
- React
- Vite
- Docker

## Notes
Features not yet implemented:
- E2E testing with Playwright
- OAuth (currently basic auth only)
- File server based on `mayth/go-simple-upload-server` to push books with basic auth, sandboxed to compose virtual network
- Admin UI to push book `.pdf`/`.epub` files when creating a book
- React based eBook reader (website only displays basic book details)
- Pagination/infinite scrolling for books
- Database-accelerated cursor-based fuzzy search (I ended up using basic partial search)
- More unit testing (only JWT util and auth service have tests, JWT being pretty exhaustive and hopefully exemplary)
- Prettier & ESLint config
- CI testing & validation

## Prerequisites
- `node` 22+
- `npm` ^11.6.2 (or possibly earlier, try updating if install fails)
  - Some `npm` versions ^10 have a bug with native modules [#4828](https://github.com/npm/cli/issues/4828)
- Tested only on Windows, native modules may need to be rebuilt

## Setup
**!! Run these commands from `/org`**

Start by copying `/org/.env.example` to `/org/.env` and updating fields appropriately. Please note special symbols in secrets may be parsed incorrectly and result in postgres failing. If that happens, try another password.

Then install and run all build targets:
```
npm i
npx nx run-many --target=build --all
```
Sometimes the Nx graph hangs, you may need to run it again.

Run tests:
```
npx nx test backend
```

Now spin up docker:
```
docker-compose up
```

Deploy migrations:
```
cd apps/backend
npx prisma migrate deploy
```

Navigate to `http://localhost:4200/` and register. Note email verification is not implemented, as it would depend on a third party service.

Register your user as an admin:
```
npx nx set-admin backend -- youremail@example.com
```
**NOTE: You must log out and log in again to reset your access/refresh tokens. User roles are stateless.**

You may now navigate to `/admin` at any time to create books, or upload the default books:
```
npx nx set-default-books backend
```

Inspect database state:
```
npx nx prisma-studio backend
```

## Development
Start postgres:
```
docker compose up postgres
```

Start the backend dev server:
```
npx nx dev backend
```

Start the frontend dev server:
```
npx nx dev frontend
```

## Migrations
Prisma has no mechanism to provide custom migrations, as such it will try to DROP certain columns responsible for generating search text. Always use `--create-only` and inspect the output.

To create migrations, update `apps/backend/schema.prisma`, then run:
```
cd apps/backend
npx prisma migrate dev --create only
# inspect the migration...
npx prisma migrate deploy
```

You may reset the database, including all data, and reapply migrations with:
```
cd apps/backend
npx prisma migrate reset
```

These commands are interactive and as such cannot be made into Nx targets (as far as I know).
