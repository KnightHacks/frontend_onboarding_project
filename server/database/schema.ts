import { integer, text, sqliteTable } from "drizzle-orm/sqlite-core";
import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";

export const users = sqliteTable("users", {
  userId: integer("UserID").primaryKey(),
  username: text("Username").notNull(),
  email: text("Email").notNull(),
  password: text("Password").notNull(),
});

export const carts = sqliteTable("carts", {
  cardId: integer("CartID").primaryKey(),
  userId: integer("UserID").notNull(),
});

export const items = sqliteTable("items", {
  itemId: integer("ItemID").primaryKey(),
  itemName: text("ItemName").notNull(),
  description: text("Description").notNull(),
  price: integer("Price").notNull(),
  stockQuantity: integer("StockQuantity").notNull(),
});

export const cartItems = sqliteTable("cart_items", {
  cardItemId: integer("CartItemID").primaryKey(),
  cardId: integer("CartID").notNull(),
  itemId: integer("ItemID").notNull(),
  quantity: integer("Quantity").notNull(),
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
    fields: [cartItems.cardId],
    references: [carts.cardId],
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
