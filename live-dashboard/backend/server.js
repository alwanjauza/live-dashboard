import Fastify from "fastify";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Knex from "knex";
import knexConfig from "./knexfile.cjs";
import cors from "@fastify/cors";

const JWT_SECRET = "1f9276ac3d82c39bb82e06020a9b5eaf";

const db = Knex(knexConfig.development);

async function seedDefaultUser() {
  const user = await db("users").where({ username: "alwan" }).first();
  if (!user) {
    console.log("Default user 'alwan' not found, creating one...");
    const passwordHash = bcrypt.hashSync("password123", 10);
    await db("users").insert({
      username: "alwan",
      password_hash: passwordHash,
    });
    console.log("Default user created.");
  }
}

const fastify = Fastify({ logger: true });
fastify.register(cors, {
  origin: "http://localhost:3001",
  methods: ["GET", "POST", "OPTIONS"],
});
fastify.register(import("@fastify/websocket"));

fastify.post("/login", async (request, reply) => {
  const { username, password } = request.body;

  const user = await db("users").where({ username }).first();
  if (!user) {
    return reply.status(401).send({ message: "Username atau password salah" });
  }

  const isPasswordValid = bcrypt.compareSync(password, user.password_hash);
  if (!isPasswordValid) {
    return reply.status(401).send({ message: "Username atau password salah" });
  }

  const token = jwt.sign(
    { userId: user.id, username: user.username },
    JWT_SECRET,
    { expiresIn: "1h" }
  );
  reply.send({ token });
});

fastify.register(async function (fastify) {
  fastify.get("/ws", { websocket: true }, (socket, req) => {
    try {
      const token = req.query.token;
      if (!token) throw new Error("Token tidak ditemukan");
      const decoded = jwt.verify(token, JWT_SECRET);

      fastify.log.info(`Client connected: user '${decoded.username}'`);
      socket.send(
        JSON.stringify({
          type: "connection",
          message: `Welcome ${decoded.username}!`,
        })
      );

      socket.on("close", () => {
        fastify.log.info(`Client '${decoded.username}' disconnected!`);
      });
    } catch (error) {
      fastify.log.warn(`Koneksi ditolak: ${error.message}`);
      socket.close(1008, "Invalid authentication token");
    }
  });
});

function generateMockData() {
  const now = new Date();
  const timeLabel = `${String(now.getHours()).padStart(2, "0")}:${String(
    now.getMinutes()
  ).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
  return {
    cpu: { time: timeLabel, usage: (Math.random() * 100).toFixed(2) },
    log: {
      id: now.getTime(),
      message:
        Math.random() > 0.5
          ? `User #${Math.floor(Math.random() * 1000)} logged in`
          : `New order received`,
    },
  };
}
function broadcastData() {
  if (fastify.websocketServer.clients.size === 0) return;
  const data = generateMockData();
  const jsonData = JSON.stringify(data);
  for (const client of fastify.websocketServer.clients) {
    if (client.readyState === 1) {
      client.send(jsonData);
    }
  }
}

const start = async () => {
  try {
    await seedDefaultUser();
    await fastify.listen({ port: 8081, host: "0.0.0.0" });
    setInterval(broadcastData, 2000);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
