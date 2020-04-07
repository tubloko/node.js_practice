const _ = require('lodash');
const client = require('../managers/elasticSearchManager');
const usersManager = require('../managers/usersManager');

async function main() {
  const users = await usersManager.findAll();
  const body = users.map((user) => ([
    { index: { _index: 'names', _id: user.userId } },
    { name: user.name },
  ]));
  const { body: bulkResponse } = await client.bulk({
    refresh: true,
    body: _.flatten(body),
  });
  if (bulkResponse.errors) {
    console.log(JSON.stringify(bulkResponse, undefined, 2));
    process.exit(1);
  }
}

main()
  // eslint-disable-next-line no-console
  .catch(console.error)
  .finally(() => {
    process.exit();
  });
