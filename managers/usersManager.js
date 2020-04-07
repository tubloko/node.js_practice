const knex = require('../knex');
const { md5 } = require('./securityManager');

const TABLE_NAME = 'users';
module.exports = {
  async addUser(name, password) {
    const [userId] = await knex(TABLE_NAME).insert({ name, password: md5(password) });
    return userId;
  },
  saveChatId(userId, chatId) {
    return knex(TABLE_NAME).update({ chatId }).where({ userId });
  },
  findAll: () => knex(TABLE_NAME).select(),
  async findOne(name, password) {
    const queryBuilder = knex(TABLE_NAME).select().where('name', name);
    if (password) queryBuilder.where('password', md5(password));
    const [user] = await queryBuilder;
    return user;
  },
  findMany: (userIds) => knex(TABLE_NAME).select().where('userId', userIds),
};
