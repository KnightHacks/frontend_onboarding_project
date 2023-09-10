import fastify from "fastify";
import { drizzle, BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { eq, and } from "drizzle-orm";
import Database from "better-sqlite3";
import { User, users } from "../database/schema";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
import cors from "@fastify/cors";
import * as schema from "../database/schema";

config();

const server = fastify();
server.register(cors);
const sqlite = new Database("./database/database.db");
const db: BetterSQLite3Database = drizzle(sqlite);

server.get("/ping", async (req, res) => {
  return "pong\n";
});

server.get("/users", async (req, res) => {
  return await db.select().from(users);
});

server.delete<{
  Params: {
    id: string;
  };
}>("/users/:id", async (req, res) => {
  const { id } = req.params;
  await db.delete(users);
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
    { username: user.username, id: user.id },
    process.env.ACCESS_TOKEN_SECRET!,
    {
      expiresIn: "10m",
    }
  );

  let newRefreshToken = jwt.sign(
    { username: user.username, id: user.id },
    process.env.REFRESH_TOKEN_SECRET!,
    {
      expiresIn: "7d",
    }
  );

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
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
      { username: (user as User).username, id: (user as User).id },
      process.env.ACCESS_TOKEN_SECRET!,
      {
        expiresIn: "10m",
      }
    );
    accessToken = newAccessToken;
  });

  return { accessToken };
});

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
