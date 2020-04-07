const moment = require('moment');
const _ = require('lodash');
const tasksManager = require('../managers/tasksManager');
const usersManager = require('../managers/usersManager');
const shareManager = require('../managers/shareManager');
const listsManager = require('../managers/listsManager');
const { makeListTasksUrl } = require('../managers/urlBuilder');

module.exports = {
  async addTask(ctx) {
    await tasksManager.addTask(ctx.request.body.task, ctx.request.query.listId);
    ctx.redirect(makeListTasksUrl(ctx.request.query.listId));
  },
  async addList(ctx) {
    const { userId } = ctx.session;
    const listId = await listsManager.addList(ctx.request.body.name, userId);
    ctx.redirect(makeListTasksUrl(listId));
  },
  async showAllLists(ctx) {
    const { userId } = ctx.session;
    if (!userId) {
      ctx.redirect('/login');
      return;
    }
    const [lists, listIds] = await Promise.all([
      listsManager.getUserLists(userId),
      shareManager.getSharedListIds(userId),
    ]);
    const sharedLists = await Promise.all(listIds.map(listsManager.findOne));
    await ctx.render('index', { lists, sharedLists, title: 'All Lists' });
  },
  async deleteTask(ctx) {
    await tasksManager.deleteOne(ctx.request.body.taskId);
    ctx.redirect(makeListTasksUrl(ctx.request.body.listId));
  },
  async deleteList(ctx) {
    await listsManager.deleteList(ctx.request.body.listId);
    ctx.redirect('/');
  },
  async checkTask(ctx) {
    const { taskId } = ctx.request.body;
    if (ctx.request.body.checked === 'true') {
      await tasksManager.check(taskId);
    } else {
      await tasksManager.uncheck(taskId);
    }
    const task = await tasksManager.findOneById(taskId);
    ctx.redirect(makeListTasksUrl(task.listId));
  },
  async moveUp(ctx) {
    const tasksArray = [];
    const tasks = await tasksManager.getAllTasksForList(ctx.request.body.listId);
    tasks.forEach((v) => (!v.done ? tasksArray.push(v.taskId) : v));
    if (tasksArray.indexOf(+ctx.request.body.targetId) === 0) {
      ctx.redirect(makeListTasksUrl(ctx.request.body.listId));
    } else {
      const target = +ctx.request.body.targetId;
      const targetToChange = tasksArray[+(tasksArray.indexOf(target)) - 1];
      await tasksManager.taskMoveUp(target, targetToChange);
      ctx.redirect(makeListTasksUrl(ctx.request.body.listId));
    }
  },
  async showListTasks(ctx) {
    const [users, list, userIds] = await Promise.all([
      usersManager.findAll(),
      listsManager.findOne(ctx.request.query.listId),
      shareManager.findUserIdsByListId(ctx.request.query.listId),
    ]);
    const loginedUsedId = ctx.session.userId;
    if (Number(loginedUsedId) !== list.userId && !userIds.includes(loginedUsedId)) {
      ctx.redirect('/');
      return;
    }
    const tasks = await tasksManager.getAllTasksForList(list.listId);
    const userIdToUser = _.keyBy(users, 'userId');
    await ctx.render('tasksList', {
      tasks,
      moment,
      list,
      title: list.name,
      users: users.filter(({ userId }) => userId !== loginedUsedId),
      userIds,
      userIdToUser,
    });
  },
  async shareList(ctx) {
    const { userName, listId } = ctx.request.body;
    const user = await usersManager.findOne(userName);
    const redirectUrl = `/tasks-list?listId=${listId}`;
    if (!user) {
      ctx.redirect(redirectUrl);
      return;
    }
    const { userId } = user;
    await shareManager.addSharedList({ userId, listId });
    ctx.redirect(redirectUrl);
  },
  async unshareList(ctx) {
    const { userId, listId } = ctx.request.body;
    await shareManager.unshareList({ userId, listId });
    ctx.redirect(`/tasks-list?listId=${listId}`);
  },
};
