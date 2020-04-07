const knex = require('../knex');
const tasksManager = require('./tasksManager');

const TABLE_NAME = 'lists';
module.exports = {
  async addList(name, userId) {
    const [listId] = await knex(TABLE_NAME).insert({ userId, name });
    return listId;
  },
  findMany: (listIds) => knex(TABLE_NAME).where('listId', listIds).select(),
  async findOne(listId) {
    const [list] = await knex(TABLE_NAME).where('listId', listId).select();
    return list;
  },
  /**
   * @param listId
   * @return {number}
   */
  async deleteList(listId) {
    await tasksManager.deleteListTasks(listId);
    return knex(TABLE_NAME)
      .where('listId', listId)
      .delete();
  },
  async getAllLists() {
    return knex(TABLE_NAME).select();
  },
  async getUserLists(userId) {
    return knex(TABLE_NAME).where({ userId }).select();
  },
};
