const DatabaseCleaner = require('database-cleaner');
const { Client } = require('pg');

module.exports = function(app, done) {
  const connectionString = app.get('postgres');
  const client = new Client({
    connectionString
  });

  client.connect();
  const databaseCleaner = new DatabaseCleaner('postgresql');
  databaseCleaner.clean(client, () => {
    client.end();
    done();
  });
};