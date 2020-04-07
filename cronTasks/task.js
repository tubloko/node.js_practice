const tasksManager = require('../managers/tasksManager');

async function main() {
  await tasksManager.uncheck(17);
}

main()
  .catch(console.error)
  .finally(() => process.exit());
