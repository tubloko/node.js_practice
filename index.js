const Koa = require('koa');
const render = require('koa-ejs');
const path = require('path');
const bodyParser = require('koa-bodyparser');
const session = require('koa-session');
const routes = require('./routes');
const securityManager = require('./managers/securityManager');

const app = new Koa();
app.use(session({ signed: false }, app));

app.use(require('koa-static')('public'));

render(app, {
  root: path.join(__dirname, 'view'),
  viewExt: 'html',
  cache: false,
  debug: false,
});

app
  .use(bodyParser())
  .use(async (ctx, next) => {
    ctx.state.sessionName = ctx.session.name || '';
    ctx.state.sessionUserId = ctx.session.userId || '';
    const { msg, publicKey } = ctx.query;
    ctx.state.msg = securityManager.isMessageValid(msg, publicKey) ? msg : '';
    ctx.state.title = 'Please change me!';
    await next();
  })
  .use(routes);
app.listen(8080);
