const TABLE_NAME = 'tasks';
const knex = require('../knex');

const checkDone = (taskId, isDone) => knex(TABLE_NAME)
  .where('taskId', taskId)
  .update({ doneAt: isDone ? new Date() : null });

module.exports = {
  findDeadlined: () => knex(TABLE_NAME).select()
    .where('deadline', '<', new Date())
    .where('deadline', '>', new Date())
  ,
  async findOneById(taskId) {
    const [task] = await knex(TABLE_NAME).select().where('taskId', taskId);
    return task;
  },
  async addTask(description, listId) {
    return knex(TABLE_NAME).insert({ description, createdAt: new Date(), listId });
  },
  async getAllTasksForList(listId) {
    return knex(TABLE_NAME).select().where('listId', listId).orderBy('doneAt');
  },
  async deleteOne(taskId) {
    return knex(TABLE_NAME)
      .where('taskId', taskId)
      .delete(taskId);
  },
  check: (taskId) => checkDone(taskId, true),
  uncheck: (taskId) => checkDone(taskId, false),
  deleteListTasks(listId) {
    return knex('tasks').select().where('listId', listId).delete();
  },
  async taskMoveUp(targetId, targetToChange) {
    const [targetIdData] = await knex(TABLE_NAME).select().where('taskId', targetId);
    const [targetToChangeData] = await knex(TABLE_NAME).select().where('taskId', targetToChange);
    await knex(TABLE_NAME)
      .where('taskId', targetId)
      .update(
        { createdAt: targetToChangeData.createdAt, description: targetToChangeData.description },
      );
    return knex(TABLE_NAME)
      .where('taskId', targetToChange)
      .update({ createdAt: targetIdData.createdAt, description: targetIdData.description });
  },
};
