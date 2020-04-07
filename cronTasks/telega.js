const TelegramBot = require('node-telegram-bot-api');
const _ = require('lodash');
const usersManager = require('../managers/usersManager');
const tasksManager = require('../managers/tasksManager');
const listsManager = require('../managers/listsManager');
const securityManager = require('../managers/securityManager');

// noinspection SpellCheckingInspection
const token = '1081802011:AAE_Vyuisx8w6sAMQNT4DjIva9B9_ZLIeoI';
const bot = new TelegramBot(token, { polling: true });

bot.on('message', async (msg) => {
  console.log(msg);
  const { from: { id }, text } = msg;
  const [userId, key] = text.split('|');
  if (!Number(userId) || !key) {
    bot.sendMessage(id, `userId is not a number or no key ${userId} ${key}`);
    return;
  }
  const hash = securityManager.makeTelegaPublicKey(userId);
  if (hash !== key) {
    bot.sendMessage(id, 'hash and key are not equal.');
    return;
  }
  bot.sendMessage(id, `Trying save chat id ${id} for user ${userId}`);
  await usersManager.saveChatId(userId, id);
  bot.sendMessage(id, 'Saved');
});

setInterval(async () => {
  const tasks = await tasksManager.findDeadlined();
  const listIds = tasks.map(({ listId }) => listId);
  const lists = await listsManager.findMany(listIds);
  const listIdToListMap = _.keyBy(lists, 'listId');
  const userIds = lists.map(({ userId }) => userId);
  const userIdToUserMap = _.keyBy(await usersManager.findMany(userIds), 'userId');
  // console.log(userIdToUserMap, listIdToListMap, tasks);
  tasks.forEach((task) => {
    const { chatId } = userIdToUserMap[listIdToListMap[task.listId].userId];
    bot.sendMessage(chatId, `${task.description} FAILED!`);
  });
}, 2000);
