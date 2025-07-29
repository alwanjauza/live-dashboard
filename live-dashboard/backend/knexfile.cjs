module.exports = {
  development: {
    client: "better-sqlite3",
    connection: {
      filename: "./dev.sqlite3",
    },
    useNullAsDefault: true,
    migrations: {
      directory: "./db/migrations",
    },
  },
};
