import { integer, text, sqliteTable } from "drizzle-orm/sqlite-core";
import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";

export const users = sqliteTable("users", {
  userId: integer("userId").primaryKey(),
  firstName: text("firstName").notNull(),
  lastName: text("lastName").notNull(),
  username: text("userName").notNull(),
  password: text("password").notNull(),
  isAdmin: integer("isAdmin").notNull(),
});

export const carts = sqliteTable("carts", {
  cartId: integer("cardId").primaryKey(),
  userId: integer("userId").references(() => users.userId),
});

export const items = sqliteTable("items", {
  itemId: integer("itemId").primaryKey(),
  itemName: text("itemName").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  stockQuantity: integer("stockQuantity").notNull(),
});

export const cartItems = sqliteTable("cart_items", {
  cartItemId: integer("cartItemId").primaryKey(),
  cartId: integer("cartId").notNull(),
  itemId: integer("itemId").notNull(),
  quantity: integer("quantity").notNull(),
});

export const usersRelations = relations(users, ({ one }) => ({
  cart: one(carts, {
    fields: [users.userId],
    references: [carts.userId],
  }),
}));

export const cartsRelations = relations(carts, ({ one, many }) => ({
  user: one(users, {
    fields: [carts.userId],
    references: [users.userId],
  }),
}));

export const cartItemsRelations = relations(cartItems, ({ one, many }) => ({
  cart: one(carts, {
    fields: [cartItems.cartId],
    references: [carts.cartId],
  }),
  item: one(items, {
    fields: [cartItems.itemId],
    references: [items.itemId],
  }),
}));

export type User = InferSelectModel<typeof users>;
export type UserInsert = InferInsertModel<typeof users>;
export type Cart = InferSelectModel<typeof carts>;
export type CartInsert = InferInsertModel<typeof carts>;
export type Item = InferSelectModel<typeof items>;
export type ItemInsert = InferInsertModel<typeof items>;
export type CartItem = InferSelectModel<typeof cartItems>;
export type CartItemInsert = InferInsertModel<typeof cartItems>;
