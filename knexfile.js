// Update with your config settings.

module.exports = {
  test: {
    client: "pg",
    connection: {
      host : '127.0.0.1',
      user : 'lucas',
      password : '123456',
      database : 'sherwood_test'
    },
    migrations: {
      directory: __dirname + "/db/migrations",
    },
    seeds: {
      directory: __dirname + "/db/seeds",
    },
  },

  development: {
    client: "pg",
    connection: {
      host : '127.0.0.1',
      user : 'lucas',
      password : '123456',
      database : 'sherwood_dev'
    },
    migrations: {
      directory: __dirname + "/db/migrations",
    },
    seeds: {
      directory: __dirname + "/db/seeds",
    },
  },

  production: {
    client: "pg",
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    },
    migrations: {
      directory: __dirname + "/db/migrations",
    },
    seeds: {
      directory: __dirname + "/db/seeds",
    },
  },

};
