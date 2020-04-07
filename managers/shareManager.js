const knex = require('../knex');

const TABLE_NAME = 'sharedLists';

module.exports = {
  addSharedList: ({ userId, listId }) => knex(TABLE_NAME).insert({ userId, listId }),
  unshareList: ({ userId, listId }) => knex(TABLE_NAME).where({ userId, listId }).del(),
  async findUserIdsByListId(listId) {
    const sharedLists = await knex(TABLE_NAME).select().where('listId', listId);
    return sharedLists.map(({ userId }) => userId);
  },
  async getSharedListIds(userId) {
    const sharedLists = await knex(TABLE_NAME).where({ userId });
    return sharedLists.map(({ listId }) => listId);
  },
};
