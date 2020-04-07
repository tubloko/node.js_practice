const Router = require('koa-router');
const indexController = require('./controllers/indexController');
const userController = require('./controllers/userController');

const router = new Router();

router
  .get('/', indexController.showAllLists)
  .get('/api/suggest-user-name', userController.suggestUserName)
  .get('/profile', userController.viewProfile)
  .post('/save-avatar', userController.saveAvatar)
  .post('/register', userController.register)
  .post('/login', userController.login)
  .get('/login', userController.loginPage)
  .get('/logout', userController.logout)
  .post('/tasks-list', indexController.addTask)
  .post('/share-list', indexController.shareList)
  .post('/unshare-list', indexController.unshareList)
  .get('/tasks-list', indexController.showListTasks)
  .post('/add-list', indexController.addList)
  .post('/delete-task', indexController.deleteTask)
  .post('/delete-list', indexController.deleteList)
  .post('/check-task', indexController.checkTask)
  .post('/moveUp', indexController.moveUp)
;

module.exports = router.routes();
