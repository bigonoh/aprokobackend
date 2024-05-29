const crypto = require('crypto');

function generateOtp() {
  let code = '';
  const possible = '0123456789';

  for (let i = 0; i < 6; i++) code += possible.charAt(Math.floor(Math.random() * possible.length));

  return code;
}
function generateDateReference() {
  const d = new Date();
  const str =
    `${d.getFullYear() + `0${d.getMonth() + 1}`.slice(-2)}${`0${d.getDate()}`.slice(-2)}` +
    `${`0${d.getHours() + 1}`.slice(-2)}${`0${d.getMinutes()}`.slice(-2)}`;

  let code = '';
  const possible = 'ABCDEFGHIJ';

  for (let i = 0; i < 7; i++) code += possible.charAt(Math.floor(Math.random() * possible.length));

  return str + code;
}
function mod(n) {
  // always returns a string
  return (n < 10 ? '0' : '') + n;
}

function generateDateReference2() {
  // The Request ID should be a string in the unix format YYYYMMDDHHII consisting of today’s date + current hour and minute
  const today = new Date();
  const randomString = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  const result =
    today.getFullYear() +
    mod(today.getMonth() + 1) +
    mod(today.getDate()) +
    mod(today.getHours()) +
    mod(today.getMinutes()) +
    mod(today.getSeconds()) +
    randomString;
  return result;
}
function generateReference() {
  let code = '';
  const possible = '0123456789';

  for (let i = 0; i < 16; i++) code += possible.charAt(Math.floor(Math.random() * possible.length));

  return code;
}

function createUserAppToken() {
  let token = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < 30; i++) token += possible.charAt(Math.floor(Math.random() * possible.length));

  return token;
}

function generateUUID() {
  const uuid = crypto.randomUUID();
  return uuid;
}

module.exports = {
  generateOtp,
  generateDateReference,
  generateDateReference2,
  generateReference,
  createUserAppToken,
  generateUUID,
};
