import fastify from "fastify";
import { drizzle, BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { eq, and, exists } from "drizzle-orm";
import Database from "better-sqlite3";
import { Item, User, cartItems, carts, items, users } from "../database/schema";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
import cors from "@fastify/cors";

config();

const server = fastify();
server.register(cors);
const sqlite = new Database("./database/database.db");
const db: BetterSQLite3Database = drizzle(sqlite);

server.get("/ping", async (req, res) => {
  return "pong\n";
});

server.get("/me", async (req, res) => {
  const { authorization } = req.headers;
  if (!authorization) return res.status(401).send({ error: "No token" });

  const accessToken = authorization.split(" ")[1];
  if (!accessToken) return res.status(401).send({ error: "No token" });

  const user = await jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET!);
  const userId = (user as User).userId;

  let [me] = await db.select().from(users).where(eq(users.userId, userId));
  return me;
});

server.get("/users", async (req, res) => {
  return await db.select().from(users);
});

server.get<{
  Params: {
    id: string;
  };
}>("/users/:id", async (req, res) => {
  const { id } = req.params;
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.userId, parseInt(id)));
  return user;
});

server.post<{
  Body: User;
}>("/users", async (req, res) => {
  const newUser = req.body;
  const [existingUser] = await db
    .select()
    .from(users)
    .where(eq(users.username, newUser.username));
  if (existingUser)
    return res.status(409).send({ error: "User already exists" });
  await db.insert(users).values(newUser);
  return newUser;
});

server.put<{
  Params: {
    id: string;
  };
  Body: User;
}>("/users/:id", async (req, res) => {
  const { id } = req.params;
  const newUser = req.body;
  await db
    .update(users)
    .set(newUser)
    .where(eq(users.userId, parseInt(id)));
  return newUser;
});

server.delete<{
  Params: {
    id: string;
  };
}>("/users/:id", async (req, res) => {
  const { id } = req.params;
  await db.delete(users).where(eq(users.userId, parseInt(id)));
});

server.post<{
  Body: {
    username: string;
    password: string;
  };
}>("/login", async (req, res) => {
  const { username, password } = req.body;

  const [user] = await db
    .select()
    .from(users)
    .where(and(eq(users.username, username), eq(users.password, password)));

  if (!user) return res.status(401).send({ error: "Invalid credentials" });

  let newAccessToken = jwt.sign(
    { username: user.username, id: user.userId },
    process.env.ACCESS_TOKEN_SECRET!,
    {
      expiresIn: "10m",
    }
  );

  let newRefreshToken = jwt.sign(
    { username: user.username, id: user.userId },
    process.env.REFRESH_TOKEN_SECRET!,
    {
      expiresIn: "7d",
    }
  );

  return { accessToken: newAccessToken, refreshToken: newRefreshToken, user };
});

server.post("/refresh", async (req, res) => {
  const { authorization } = req.headers;
  if (!authorization) return res.status(401).send({ error: "No token" });

  const refreshToken = authorization.split(" ")[1];
  if (!refreshToken) return res.status(401).send({ error: "No token" });

  let accessToken;
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!, (err, user) => {
    if (err) return res.status(403).send({ error: "Invalid token" });

    let newAccessToken = jwt.sign(
      { username: (user as User).username, id: (user as User).userId },
      process.env.ACCESS_TOKEN_SECRET!,
      {
        expiresIn: "10m",
      }
    );
    accessToken = newAccessToken;
  });

  return { accessToken };
});

server.get("/items", async (req, res) => {
  return await db.select().from(items);
});

server.get<{
  Params: {
    id: string;
  };
}>("/items/:id", async (req, res) => {
  const { id } = req.params;
  const [item] = await db
    .select()
    .from(items)
    .where(eq(items.itemId, parseInt(id)));
  return item;
});

server.post<{
  Body: Item;
}>("/items", async (req, res) => {
  const newItem = req.body;
  await db.insert(items).values(newItem);
  return newItem;
});

server.put<{
  Params: {
    id: string;
  };
  Body: Item;
}>("/items/:id", async (req, res) => {
  const { id } = req.params;
  const newItem = req.body;
  await db
    .update(items)
    .set(newItem)
    .where(eq(items.itemId, parseInt(id)));
  return newItem;
});

server.delete<{
  Params: {
    id: string;
  };
}>("/items/:id", async (req, res) => {
  const { id } = req.params;
  await db.delete(items).where(eq(items.itemId, parseInt(id)));
  return { success: true };
});

server.get<{
  Params: {
    userId: string;
  };
}>("/users/:userId/cart", async (req, res) => {
  const { userId } = req.params;
  const userCartItems = await db
    .select()
    .from(cartItems)
    .where(
      and(
        eq(cartItems.cartId, carts.cartId),
        eq(carts.userId, parseInt(userId))
      )
    )
    .leftJoin(items, eq(cartItems.itemId, items.itemId))
    .leftJoin(carts, eq(cartItems.cartId, carts.cartId));
  return userCartItems;
});

server.post<{
  Params: {
    userId: string;
  };
  Body: {
    itemId: string;
    quantity: number;
  };
}>("/users/:userId/cart", async (req, res) => {
  const { userId } = req.params;
  const { itemId, quantity } = req.body;
  const [cart] = await db
    .select()
    .from(carts)
    .where(eq(carts.userId, parseInt(userId)));
  if (!cart) {
    await db.insert(carts).values({
      userId: parseInt(userId),
    });
  }
  const [item] = await db
    .select()
    .from(items)
    .where(eq(items.itemId, parseInt(itemId)));
  if (!item) {
    throw new Error("Item not found");
  }
  const [existingCartItem] = await db
    .select()
    .from(cartItems)
    .where(
      and(
        eq(cartItems.cartId, cart.cartId),
        eq(cartItems.itemId, parseInt(itemId))
      )
    );
  if (existingCartItem) {
    await db
      .update(cartItems)
      .set({
        quantity: existingCartItem.quantity + quantity,
      })
      .where(eq(cartItems.cartItemId, existingCartItem.cartItemId));
  } else {
    await db.insert(cartItems).values({
      cartId: cart.cartId,
      itemId: parseInt(itemId),
      quantity: quantity,
    });
  }
  return { success: true };
});

server.put<{
  Params: {
    userId: string;
    cartItemId: string;
  };
  Body: {
    quantity: number;
  };
}>("/users/:userId/cart/:cartItemId", async (req, res) => {
  const { userId, cartItemId } = req.params;
  const { quantity } = req.body;
  const [cartItem] = await db
    .select()
    .from(cartItems)
    .leftJoin(
      carts,
      and(
        eq(carts.cartId, cartItems.cartId),
        eq(carts.userId, parseInt(userId))
      )
    );
  if (!cartItem) {
    return res.status(404).send({ error: "Cart item not found" });
  }
  await db
    .update(cartItems)
    .set({
      quantity: quantity,
    })
    .where(eq(cartItems.cartId, parseInt(cartItemId)));
  return { success: true };
});

server.delete<{
  Params: {
    userId: string;
    cartItemId: string;
  };
}>("/users/:userId/cart/:cartItemId", async (req, res) => {
  const { userId, cartItemId } = req.params;
  const [cartItem] = await db
    .select()
    .from(cartItems)
    .leftJoin(
      carts,
      and(
        eq(carts.cartId, cartItems.cartId),
        eq(carts.userId, parseInt(userId))
      )
    )
    .where(eq(cartItems.cartItemId, parseInt(cartItemId)));
  if (!cartItem) {
    return res.status(404).send({ error: "Cart item not found" });
  }
  await db
    .delete(cartItems)
    .where(eq(cartItems.cartItemId, parseInt(cartItemId)));
  return { success: true };
});
server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
