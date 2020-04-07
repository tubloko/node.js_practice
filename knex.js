const knex = require('knex');
const config = require('config');

module.exports = knex({
  client: 'mysql',
  connection: {
    host: '127.0.0.1',
    database: 'a19',
    ... config.get('db'),
  }
});
