import { integer, text, sqliteTable } from "drizzle-orm/sqlite-core";
import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  username: text("username").notNull(),
  password: text("password").notNull(),
  age: integer("age").notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  items: many(items),
}));

export const items = sqliteTable("items", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  price: integer("price").notNull(),
  description: text("description"),
  image: text("image").notNull(),
  userId: integer("user_id"),
});

export const itemsRelations = relations(items, ({ one }) => ({
  user: one(users, {
    fields: [items.userId],
    references: [users.id],
  }),
}));

export type User = InferSelectModel<typeof users>;
export type UserInsert = InferInsertModel<typeof users>;
export type Item = InferSelectModel<typeof items>;
export type ItemInsert = InferInsertModel<typeof items>;
