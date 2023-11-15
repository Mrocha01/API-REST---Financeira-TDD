module.exports = {
    test: {
        client: 'pg',
        connection: {
          host : '127.0.0.1',
          port : 5432,
          user : 'postgres',
          password : 'root1234',
          database : 'barriga'
        },
        migrations: {
            directory: "src/migrations"
        }
    }
};