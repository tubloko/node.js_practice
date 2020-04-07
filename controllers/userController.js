const qs = require('qs');
const fs = require('fs');
const asyncBusboy = require('async-busboy');
const usersManager = require('../managers/usersManager');
const securityManager = require('../managers/securityManager');
const usersEsManager = require('../managers/usersEsManager');

module.exports = {
  async suggestUserName(ctx) {
    const { name } = ctx.query;
    const names = await usersEsManager.getSuggestedNames(name);
    ctx.body = { status: 'ok', names };
  },
  async logout(ctx) {
    ctx.session = {};
    ctx.redirect('/login');
  },
  async loginPage(ctx) {
    await ctx.render('loginPage', { name: ctx.query.name || '', title: 'Login/Register' });
  },
  async login(ctx) {
    const { name, password } = ctx.request.body;
    if (!password) {
      ctx.redirect('/');
      return;
    }
    const { userId } = await usersManager.findOne(name, password);
    ctx.session.userId = userId;
    ctx.session.name = name;
    ctx.redirect('/');
  },
  async register(ctx) {
    const { name, password } = ctx.request.body;
    let msg = '';
    try {
      ctx.session.userId = await usersManager.addUser(name, password);
    } catch (e) {
      console.log(e);
      msg = 'Duplicate name';
      const queryString = qs.stringify({
        msg,
        publicKey: securityManager.makePublicKey(msg),
        name,
      });
      ctx.redirect(`/login?${queryString}`);
      return;
    }
    ctx.session.name = name;
    ctx.redirect('/');
  },
  async viewProfile(ctx) {
    const { userId } = ctx.session;
    const hash = securityManager.makeTelegaPublicKey(userId);
    const key = `${userId}|${hash}`;
    await ctx.render('viewProfile', { title: 'Profile', key });
  },
  async saveAvatar(ctx) {
    const { userId } = ctx.session;
    const { files: [file] } = await asyncBusboy(ctx.req);
    file.pipe(fs.createWriteStream(`public/avatar/avatar-${userId}.jpg`));
    ctx.redirect('/profile');
  },
};
