# Server
This folder holds all the business logic for the API of a mock ecommerce site. You shouldn't need to work in this folder unless you would like to add new features to the API.

## Getting Started
To get started, you will need to install the dependencies and run the server. To do this, run the following commands in the terminal:

```bash
pnpm install 
pnpm run dev
```

This API uses DrizzleORM to interface with a SQLite database. An existing schema is provided in the `/database/schema.ts` file. To sync this schema with the database, run the following command in the terminal:

```bash
pnpm run db:push
```

To explore your database, we can use Drizzle Studio by running the following command in the terminal:

```bash
pnpm run db:studio 
```
This will launch Drizzle Studio on host `0.0.0.0`.

## Bonus Challenge
If you're feeling ambitious, modify the API and database schema to allow users to leave reviews on items. You will need to add a new table to the database schema, add new endpoints to the API, and modify the `Item` model to include a new field for reviews. Accomodate these reviews in your UI as you see fit.


