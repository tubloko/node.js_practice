const crypto = require('crypto');

const md5 = (password) => crypto
  .createHash('md5')
  .update(password)
  .digest('base64');

const makePublicKey = (msg) => md5('MySuperSecretKey' + msg);

const isMessageValid = (msg, publicKey) => makePublicKey(msg) === publicKey;
const makeTelegaPublicKey = userId => md5(`someSecret&3124(${userId}`);

module.exports = { md5, makePublicKey, isMessageValid, makeTelegaPublicKey };
